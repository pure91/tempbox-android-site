# 잠깐함 Android Site

`잠깐함` Android 앱 출시 준비를 위한 공개 정적 사이트입니다.

## Pages

- `index.html`: 앱 소개 랜딩페이지
- `privacy.html`: 개인정보처리방침
- `support.html`: 지원 및 FAQ
- `terms.html`: 이용 안내와 구매 고지

## App Privacy Position

잠깐함은 로컬 우선 앱입니다.

- 서버 없음
- 로그인 없음
- 회원가입 없음
- AI 없음
- 광고 없음
- 분석 SDK 없음
- 원격 설정 없음
- `INTERNET` 권한 없음
- 위치, 연락처, 전체 파일 접근, SMS, 접근성 서비스 권한 없음

## Local Preview

```bash
python -m http.server 4173
```

Open `http://localhost:4173/`.

## Verification

```bash
npm test
```

The verification script checks required pages, local links, required privacy text, and absence of external network assets.

## GitHub Pages

This site is designed to be served from the repository root on GitHub Pages.
