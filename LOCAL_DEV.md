# 로컬 개발 가이드

로컬 환경에서 프론트엔드와 백엔드를 개발하는 방법입니다.

## 🚀 로컬 개발 시작

### 1. 의존성 설치

```bash
# 루트 디렉토리에서
npm install

# 클라이언트 의존성 설치
cd client
npm install
cd ..
```

### 2. 환경 변수 설정

루트 디렉토리에 `.env` 파일 생성:

```env
NODE_ENV=development
JWT_SECRET=proxmox-vm-platform-secret-key-s13w00-2025
PROXMOX_HOST=proxmox.s13w00.kr
PROXMOX_PORT=8006
PROXMOX_USER=user@pam
PROXMOX_PASSWORD=828275wc
PROXMOX_NODE=pve
```

### 3. 개발 서버 실행

**터미널 1 - 백엔드 서버:**
```bash
npm run dev
```
→ http://localhost:3000 에서 실행

**터미널 2 - 프론트엔드 개발 서버:**
```bash
npm run client
```
→ http://localhost:5173 에서 실행

### 4. 브라우저에서 접속

http://localhost:5173 으로 접속하면 됩니다.

Vite 프록시가 `/api` 요청을 자동으로 `http://localhost:3000`으로 전달합니다.

## 🔧 개발 구조

```
개발 환경:
  브라우저 (localhost:5173)
      ↓
  Vite Dev Server (프록시)
      ↓
  Express Server (localhost:3000)
      ↓
  Proxmox Server

프로덕션 환경:
  브라우저
      ↓
  Express Server (정적 파일 + API)
      ↓
  Proxmox Server
```

## 📝 주요 파일

- **`server/index.js`**: Express 서버 (API + 정적 파일 서빙)
- **`client/vite.config.js`**: Vite 설정 (개발 프록시 포함)
- **`client/src/config/api.js`**: API 엔드포인트 설정
- **`package.json`**: 빌드 및 시작 스크립트

## 🛠️ 유용한 명령어

```bash
# 백엔드만 실행
npm run dev

# 프론트엔드만 실행
npm run client

# 프로덕션 빌드 테스트
npm run build
npm start
# → http://localhost:3000 에서 빌드된 앱 확인

# 클라이언트 빌드만
cd client && npm run build
```

## 🐛 문제 해결

### 405 에러 (Method Not Allowed)

- Vite 프록시 설정 확인: `client/vite.config.js`
- 백엔드 서버가 실행 중인지 확인: http://localhost:3000/api/health

### CORS 에러

- 개발 환경에서는 Vite 프록시를 사용하므로 CORS 문제가 없어야 합니다
- 프록시 설정이 올바른지 확인하세요

### 프론트엔드가 API를 찾지 못함

- 백엔드 서버가 포트 3000에서 실행 중인지 확인
- Vite 프록시 설정 확인
- 브라우저 개발자 도구의 네트워크 탭에서 요청 확인
