# Tempbox Android Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static GitHub Pages-ready site for the Android app `잠깐함` with landing, privacy, support, and terms pages.

**Architecture:** Use a no-build static site rooted at the repository root. A Node.js verification script checks required files, local links, privacy claims, and absence of external network assets before any completion claim.

**Tech Stack:** Static HTML, CSS, minimal vanilla JavaScript, Node.js verification script, GitHub Pages.

---

## File Structure

- Create: `package.json` for `npm test`.
- Create: `scripts/verify-site.mjs` for static verification.
- Create: `.gitignore` for OS/editor/runtime ignores.
- Create: `README.md` for repository purpose and GitHub Pages instructions.
- Create: `index.html` for the landing page.
- Create: `privacy.html` for the privacy policy.
- Create: `support.html` for support and FAQ.
- Create: `terms.html` for usage and purchase terms.
- Create: `assets/styles.css` for all visual styling.
- Create: `assets/site.js` for current-year and active-nav progressive enhancement.

### Task 1: Verification Harness

**Files:**
- Create: `package.json`
- Create: `scripts/verify-site.mjs`

- [ ] **Step 1: Write the failing verification script**

Create `package.json`:

```json
{
  "name": "tempbox-android-site",
  "version": "0.1.0",
  "private": true,
  "description": "Static landing, privacy, and support site for the Android app 잠깐함.",
  "type": "module",
  "scripts": {
    "test": "node scripts/verify-site.mjs"
  }
}
```

Create `scripts/verify-site.mjs`:

```javascript
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
];

const requiredText = {
  'index.html': ['잠깐함', '서버 없음', '로그인 없음', '인터넷 권한 없음', 'Android 먼저'],
  'privacy.html': ['개인정보처리방침', '수집하지 않습니다', '서버로 전송하지 않습니다', 'INTERNET 권한을 사용하지 않습니다', 'Android Photo Picker'],
  'support.html': ['지원', 'GitHub', '구독 없음', '평생권'],
  'terms.html': ['이용 안내', 'pro_lifetime', '비소모성', '구독을 제공하지 않습니다'],
};

const externalRefPattern = /\b(?:https?:)?\/\/|fonts\.googleapis|googletagmanager|analytics|cdn\./i;
const localHrefPattern = /\b(?:href|src)=["']([^"']+)["']/gi;

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

async function verifyLocalReferences(file, content) {
  for (const match of content.matchAll(localHrefPattern)) {
    const rawValue = match[1];
    if (isSkippableReference(rawValue)) {
      continue;
    }

    assert(!externalRefPattern.test(rawValue), `${file} references an external asset or URL: ${rawValue}`);

    const withoutHash = rawValue.split('#')[0];
    if (!withoutHash) {
      continue;
    }

    await exists(withoutHash);
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
  assert(!externalRefPattern.test(content), `${page} must not reference external network assets.`);
  await verifyLocalReferences(page, content);

  for (const text of requiredText[page]) {
    assert(content.includes(text), `${page} is missing required text: ${text}`);
  }
}

const styles = await read('assets/styles.css');
assert(styles.includes(':root'), 'styles.css must define shared design tokens.');
assert(styles.includes('@media'), 'styles.css must include responsive rules.');
assert(!externalRefPattern.test(styles), 'styles.css must not reference external network assets.');

const script = await read('assets/site.js');
assert(script.includes('data-current-year'), 'site.js must populate current year targets.');
assert(!externalRefPattern.test(script), 'site.js must not reference external network assets.');

const assetFiles = await readdir(path.join(root, 'assets'));
assert(assetFiles.includes('styles.css') && assetFiles.includes('site.js'), 'assets directory must contain only expected local site assets.');

console.log(`Verified ${pages.length} pages and ${requiredFiles.length} required files.`);
```

- [ ] **Step 2: Run verification to confirm it fails**

Run: `npm test`

Expected: `FAIL` because the required site files do not exist yet.

- [ ] **Step 3: Commit the verification harness**

```bash
git add package.json scripts/verify-site.mjs
git commit -m "test: add static site verification"
```

### Task 2: Static Site Content

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `index.html`
- Create: `privacy.html`
- Create: `support.html`
- Create: `terms.html`
- Create: `assets/styles.css`
- Create: `assets/site.js`

- [ ] **Step 1: Add site pages and assets**

Create the files listed above. All pages must use local `assets/styles.css` and `assets/site.js`, declare `<html lang="ko">`, include the same navigation, and avoid external network assets.

- [ ] **Step 2: Run verification to confirm it passes**

Run: `npm test`

Expected: `PASS` with `Verified 4 pages and 8 required files.`

- [ ] **Step 3: Commit the static site**

```bash
git add .gitignore README.md index.html privacy.html support.html terms.html assets/styles.css assets/site.js
git commit -m "feat: add static launch site"
```

### Task 3: Local Preview And Final Repository Check

**Files:**
- Verify: all files

- [ ] **Step 1: Start a local static server**

Run: `python -m http.server 4173`

Expected: server listens on `http://localhost:4173/`.

- [ ] **Step 2: Inspect the site in a browser**

Open:

- `http://localhost:4173/`
- `http://localhost:4173/privacy.html`
- `http://localhost:4173/support.html`
- `http://localhost:4173/terms.html`

Expected: all pages render without missing local assets, navigation works, desktop and mobile widths remain readable.

- [ ] **Step 3: Run final verification**

Run: `npm test`

Expected: `PASS` with `Verified 4 pages and 8 required files.`

- [ ] **Step 4: Check Git status and remote**

Run:

```bash
git status --short --branch
git remote -v
```

Expected: branch is `main`, remote is `https://github.com/pure91/tempbox-android-site.git`, and working tree has no unstaged changes except intentionally running server processes.

- [ ] **Step 5: Push when credentials allow**

Run: `git push -u origin main`

Expected: branch `main` is pushed to GitHub. If authentication fails, report the exact failure and leave the repository ready for the user to push.
