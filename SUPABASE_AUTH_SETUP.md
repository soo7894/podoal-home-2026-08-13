# 포도알 로그인 설정

프런트엔드와 `user_home_states` RLS 테이블은 구현되어 있습니다. 아래 Dashboard 설정을 마쳐야 이메일 인증 코드와 Google 로그인이 실제로 작동합니다.

## 1. URL 설정

Supabase Dashboard의 **Authentication → URL Configuration**에서 설정합니다.

- Site URL: `https://soo7894.github.io/podoal-home-2026-08-13/`
- Redirect URLs:
  - `https://soo7894.github.io/podoal-home-2026-08-13/`
  - 로컬 테스트 주소가 있다면 그 주소도 별도로 추가

## 2. 이메일을 6자리 인증 코드로 보내기

**Authentication → Email Templates → Magic Link**에서 템플릿을 변경합니다. `{{ .ConfirmationURL }}` 대신 `{{ .Token }}`을 사용해야 링크가 아니라 OTP 코드가 발송됩니다.

```html
<h2>포도알 로그인 인증 코드</h2>
<p>아래 6자리 코드를 포도알 화면에 입력해 주세요.</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>
```

공개 서비스 전에는 기본 메일 발송 설정의 제한과 스팸 수신 여부를 시험하고, 필요할 때만 무료 범위의 SMTP 제공자를 연결합니다.

## 3. Google 로그인 설정

1. Google Cloud Console에서 OAuth 동의 화면과 Web OAuth Client를 만듭니다.
2. Supabase Dashboard의 **Authentication → Providers → Google**에 Client ID와 Client Secret을 입력합니다.
3. Google OAuth Client의 Authorized redirect URI에는 Supabase Dashboard가 안내하는 callback URL을 그대로 등록합니다.
4. 개인정보 처리 안내 URL과 서비스 홈페이지 URL을 OAuth 동의 화면에 등록합니다.

Google Client Secret은 `main.js`나 GitHub 저장소에 절대 넣지 않습니다. Supabase Dashboard의 Provider 설정에만 입력합니다.

## 4. 확인할 테스트

- 네이버, 다음, Gmail 주소에 코드가 도착하는지
- 잘못된 코드와 만료된 코드의 안내 문구
- Google 로그인 후 원래 GitHub Pages 주소로 돌아오는지
- 첫 로그인 때 기존 로컬 기록이 유지되는지
- 다른 브라우저에서 같은 계정으로 로그인했을 때 기록이 나타나는지
- 사용자 A가 사용자 B의 `user_home_states` 행을 읽거나 수정할 수 없는지
- 로그아웃 후 이 기기의 로컬 기록이 남아 있음을 사용자가 이해하는지

## 5. 공개 전에 입력해야 할 정보

`privacy.html`의 `[운영자 이름 또는 서비스명]`과 `[문의 이메일]`을 실제 정보로 교체합니다. 현재 문서는 개발용 초안이며 법률 자문을 대신하지 않습니다.
