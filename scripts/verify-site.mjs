import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'privacy.html', 'support.html', 'terms.html'];
const requiredFiles = [
  ...pages,
  'README.md',
  '.gitignore',
  'assets/styles.css',
  'assets/site.js',
  'assets/reference/app-icon.png',
  'assets/reference/web-favicon.png',
];

const requiredText = {
  'index.html': [
    '잠깐함',
    '서버 없음',
    '로그인 없음',
    '인터넷 권한 없음',
    'Android 먼저',
    '컴포넌트 예시',
    '컬러 팔레트',
    '24시간 45분',
    '알림/토스트',
  ],
  'privacy.html': [
    '개인정보처리방침',
    '수집하지 않습니다',
    '서버로 전송하지 않습니다',
    'INTERNET 권한을 사용하지 않습니다',
    'Android Photo Picker',
  ],
  'support.html': ['지원', 'GitHub', '구독 없음', '평생권'],
  'terms.html': ['이용 안내', 'pro_lifetime', '비소모성', '구독을 제공하지 않습니다'],
};

const approvedExternalLinks = ['https://github.com/pure91/tempbox-android-site'];
const externalAssetPattern = /\b(?:https?:)?\/\/|fonts\.googleapis|googletagmanager|google-analytics|cdn\./i;
const resourcePattern = /\b(?:src)=["']([^"']+)["']|\b<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
const localHrefPattern = /\bhref=["']([^"']+)["']/gi;
const forbiddenReferencePatterns = [
  [/docs\/reference-ui\//i, 'must not render reference PNGs directly'],
  [/pixel-reference-page|reference-artboard|reference-hotspots|reference-artboard-image/i, 'must not use screenshot artboard rendering'],
];

async function exists(relativePath) {
  await access(path.join(root, relativePath));
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isSkippableReference(value) {
  return value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:');
}

async function verifyLocalLinks(file, content) {
  for (const match of content.matchAll(localHrefPattern)) {
    const rawValue = match[1];
    if (isSkippableReference(rawValue)) {
      continue;
    }

    if (externalAssetPattern.test(rawValue)) {
      assert(
        approvedExternalLinks.some((link) => rawValue.startsWith(link)),
        `${file} references an unapproved external link: ${rawValue}`,
      );
      continue;
    }

    const withoutHash = rawValue.split('#')[0];
    if (!withoutHash) {
      continue;
    }

    await exists(withoutHash);
  }
}

async function verifyLocalAssets(file, content) {
  for (const match of content.matchAll(resourcePattern)) {
    const rawValue = match[1] ?? match[2];
    assert(!externalAssetPattern.test(rawValue), `${file} references an external network asset: ${rawValue}`);
    const withoutHash = rawValue.split('#')[0];
    if (withoutHash && !isSkippableReference(withoutHash)) {
      await exists(withoutHash);
    }
  }
}

for (const file of requiredFiles) {
  await exists(file);
}

for (const page of pages) {
  const content = await read(page);
  assert(content.includes('<html lang="ko">'), `${page} must declare Korean document language.`);
  assert(content.includes('assets/styles.css'), `${page} must use the local stylesheet.`);
  assert(content.includes('assets/site.js'), `${page} must use the local script.`);

  for (const [pattern, message] of forbiddenReferencePatterns) {
    assert(!pattern.test(content), `${page} ${message}.`);
  }

  await verifyLocalAssets(page, content);
  await verifyLocalLinks(page, content);

  for (const text of requiredText[page]) {
    assert(content.includes(text), `${page} is missing required text: ${text}`);
  }
}

const styles = await read('assets/styles.css');
assert(styles.includes(':root'), 'styles.css must define shared design tokens.');
assert(styles.includes('@media'), 'styles.css must include responsive rules.');
assert(styles.includes('.landing-shell'), 'styles.css must define the landing shell layout.');
assert(styles.includes('.phone-preview'), 'styles.css must define the composed mobile preview.');
assert(styles.includes('.mobile-menu-toggle'), 'styles.css must define responsive mobile navigation.');
assert(styles.includes('.liquid-glass'), 'styles.css must define reusable liquid glass surfaces.');
assert(styles.includes('.bubble-field'), 'styles.css must define the reference-like bubble field.');
assert(styles.includes('.component-board'), 'styles.css must define the mobile component board.');
assert(styles.includes('.palette-grid'), 'styles.css must define the color palette section.');
assert(styles.includes('.mobile-hero-illustration'), 'styles.css must define the mobile hero illustration.');
assert(styles.includes('.box-illustration'), 'styles.css must define the mobile glass box illustration.');
assert(styles.includes('.expiry-badge-row'), 'styles.css must define status badge rows.');
assert(styles.includes('backdrop-filter: blur(28px)'), 'styles.css must use stronger liquid-glass blur.');
assert(!externalAssetPattern.test(styles), 'styles.css must not reference external network assets.');
for (const [pattern, message] of forbiddenReferencePatterns) {
  assert(!pattern.test(styles), `styles.css ${message}.`);
}

const script = await read('assets/site.js');
assert(script.includes('data-current-year'), 'site.js must populate current year targets.');
assert(!externalAssetPattern.test(script), 'site.js must not reference external network assets.');

const assetFiles = await readdir(path.join(root, 'assets'), { recursive: true });
const unsupportedAsset = assetFiles.find((asset) => {
  const normalized = asset.replaceAll('\\', '/');
  if (!normalized.includes('.')) {
    return false;
  }
  return !/\.(css|js|png)$/i.test(normalized);
});
assert(!unsupportedAsset, `assets directory contains an unsupported file type: ${unsupportedAsset}`);

console.log(`Verified ${pages.length} pages and ${requiredFiles.length} required files.`);
