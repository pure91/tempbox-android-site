# 잠깐함 Android Site Design

## Goal

잠깐함 Android 앱 출시 준비에 필요한 공개 웹사이트를 만든다. 사이트는 랜딩페이지, 개인정보처리방침, 지원 안내, 구매/환불 관련 고지를 포함하며 GitHub Pages에서 정적 파일만으로 동작한다.

## Confirmed App Facts

- 앱 이름은 `잠깐함`이다.
- 앱은 Android 먼저 출시한다.
- 앱은 잠깐 필요한 사진, 메모, 번호를 갤러리, 연락처, 일반 메모장에 남기지 않고 앱 안에 임시 보관하는 로컬 우선 앱이다.
- 사용자가 정한 시간이 지나면 앱 내부의 임시 항목을 자동 정리한다.
- 서버, 로그인, 회원가입, AI, 광고, 분석 SDK, 원격 설정이 없다.
- 앱은 `INTERNET`, 위치, 연락처, 전체 파일 접근, SMS, 접근성 서비스 권한을 사용하지 않는다.
- 사진은 Android Photo Picker로 사용자가 선택한 항목만 접근한다.
- 데이터와 메타데이터는 앱 전용 내부 저장소에 로컬로 저장한다.
- v1은 JSON 기반 로컬 메타데이터를 사용하고 Room/SQLite를 사용하지 않는다.
- 만료 정리는 WorkManager로 수행한다.
- 유료 기능은 Play Billing의 `pro_lifetime` 비소모성 일회성 상품만 사용한다.
- 구독은 제공하지 않는다.

## Site Scope

The site is a small static website with these pages:

- `index.html`: product landing page with the app concept, privacy-first principles, feature summary, and Android-first launch status.
- `privacy.html`: privacy policy stating no collection, no transfer, no server processing, no third-party analytics or ads, no internet permission, local-only storage, and user-selected Photo Picker access.
- `support.html`: support page with practical FAQ, data deletion guidance, billing note, and link to the public GitHub repository as the current support channel.
- `terms.html`: concise terms and purchase notice for local app usage and one-time lifetime purchase.

The repository should also include:

- `README.md`: repository purpose, page list, local preview instructions, and GitHub Pages deployment note.
- `.gitignore`: minimal OS/editor ignores.
- `assets/`: local CSS and JavaScript files only.

## Content Principles

- Do not claim features that are not confirmed.
- Do not write legal advice language.
- Do not invent a support email address.
- Explain privacy in concrete app behavior: what is not collected, what remains on-device, and what the user can delete.
- Mention Play Billing only for the lifetime purchase. Do not imply subscription support.
- Keep Korean as the primary language.

## Visual Design

The visual direction is quiet, trustworthy, and utilitarian. The site should feel like a privacy-focused Android utility, not a marketing-heavy SaaS page.

Use:

- Mobile-first responsive layout.
- Plain static HTML, CSS, and minimal JavaScript.
- Clean typography with system fonts.
- A restrained palette with light background, dark text, green privacy accents, and one secondary warm accent.
- Compact sections, clear cards for repeated feature items, and readable policy text.
- No external fonts, CDN scripts, analytics, images, or tracking assets.

## Architecture

This is a no-build static site. HTML pages share a common header, footer, navigation pattern, and local stylesheet.

Files:

- `index.html` defines the landing page and calls out the app principles.
- `privacy.html` contains the privacy policy content for Play Console and app linking.
- `support.html` contains support and FAQ content.
- `terms.html` contains usage and purchase terms.
- `assets/styles.css` contains all styles.
- `assets/site.js` handles small progressive enhancements such as current year and active navigation, without network access.

## Testing And Verification

Because this is a static site, verification focuses on file correctness and browser rendering:

- Check all local links resolve.
- Check no external network assets are referenced.
- Check required pages exist.
- Check policy text includes the confirmed no-collection claims.
- Open the site locally and inspect desktop and mobile widths.

Automated verification can be a small Node.js script that reads the HTML files and asserts local links, required content, and absence of external scripts/styles.

## Deployment

The repository remote is `https://github.com/pure91/tempbox-android-site.git`.

The implementation should keep the site compatible with GitHub Pages from the repository root. After commit, the branch should be pushed to `origin/main` when credentials allow it.
