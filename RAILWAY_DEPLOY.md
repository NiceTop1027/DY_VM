# Railway 배포 가이드

Railway에 백엔드를 배포하여 로컬에서 백엔드 서버를 실행할 필요 없이 사용할 수 있습니다.

## 🚀 Railway 배포 단계

### 1. Railway 계정 생성

1. [Railway.app](https://railway.app) 접속
2. GitHub 계정으로 로그인

### 2. GitHub 저장소 생성

```bash
cd /Users/nicetop/Documents/SERVER_WEB

# Git 초기화
git init

# .gitignore 확인 (.env가 포함되어 있는지 확인)
cat .gitignore

# 파일 추가
git add .
git commit -m "Initial commit: Proxmox VM Platform"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/proxmox-vm-platform.git
git branch -M main
git push -u origin main
```

### 3. Railway에서 프로젝트 생성

1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. 방금 생성한 저장소 선택
4. Railway가 자동으로 감지하고 배포 시작

### 4. 환경 변수 설정

Railway 프로젝트 설정에서 다음 환경 변수를 추가:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=proxmox-vm-platform-secret-key-s13w00-2025
PROXMOX_HOST=proxmox.s13w00.kr
PROXMOX_PORT=8006
PROXMOX_USER=user@pam
PROXMOX_PASSWORD=828275wc
PROXMOX_NODE=pve
CLIENT_URL=http://localhost:5173
```

**중요**: 나중에 프론트엔드를 배포하면 `CLIENT_URL`을 실제 프론트엔드 URL로 변경하세요.

### 5. 배포 URL 확인

Railway가 배포를 완료하면 다음과 같은 URL을 제공합니다:
```
https://proxmox-vm-platform-production.up.railway.app
```

### 6. 프론트엔드 설정 업데이트

로컬 프론트엔드에서 Railway 백엔드를 사용하도록 설정:

`client/vite.config.js` 수정:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://YOUR-RAILWAY-URL.up.railway.app', // Railway URL로 변경
        changeOrigin: true
      }
    }
  },
  // ... 나머지 설정
})
```

또는 `client/src/context/AuthContext.jsx`와 `client/src/pages/Dashboard.jsx`에서 API 호출 시 전체 URL 사용:

```javascript
const API_URL = 'https://YOUR-RAILWAY-URL.up.railway.app'

// 예시
await axios.get(`${API_URL}/api/vm`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

## 🎯 간단한 방법: API URL 환경 변수 사용

더 나은 방법은 프론트엔드에도 환경 변수를 사용하는 것입니다.

`client/.env` 파일 생성:

```env
VITE_API_URL=https://YOUR-RAILWAY-URL.up.railway.app
```

그리고 코드에서:

```javascript
const API_URL = import.meta.env.VITE_API_URL || ''

axios.get(`${API_URL}/api/vm`, ...)
```

## ✅ 배포 확인

1. Railway 대시보드에서 배포 로그 확인
2. 다음 메시지가 보이면 성공:
   ```
   🚀 Server running on port 3000
   📡 Proxmox Host: proxmox.s13w00.kr
   ```

3. 브라우저에서 테스트:
   ```
   https://YOUR-RAILWAY-URL.up.railway.app/api/health
   ```

## 🔄 자동 배포

GitHub에 push하면 Railway가 자동으로 재배포합니다:

```bash
git add .
git commit -m "Update backend"
git push
```

## 💰 비용

- Railway는 **월 $5 크레딧**을 무료로 제공
- 소규모 프로젝트는 무료로 충분히 사용 가능
- 사용량이 많으면 유료 플랜 고려

## 🌐 프론트엔드도 배포하기 (선택사항)

프론트엔드도 배포하려면:

1. **Vercel** 또는 **Netlify** 사용 (무료)
2. `client` 폴더를 별도 저장소로 분리
3. 환경 변수에 Railway 백엔드 URL 설정

## 🔒 보안 주의사항

Railway 환경 변수에 설정한 후 `.env` 파일은 절대 GitHub에 push하지 마세요!

`.gitignore`에 다음이 포함되어 있는지 확인:
```
.env
.env.local
.env.production
```

## 📱 최종 구조

```
사용자 브라우저
    ↓
로컬 프론트엔드 (http://localhost:5173)
    ↓
Railway 백엔드 (https://xxx.railway.app)
    ↓
Proxmox 서버 (proxmox.s13w00.kr:8006)
```

이제 로컬에서 백엔드를 실행할 필요가 없습니다! 🎉
