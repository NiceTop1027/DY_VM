# Railway 배포 가이드

Railway에 프론트엔드와 백엔드를 함께 배포하여 하나의 서비스로 운영할 수 있습니다.

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
NODE_ENV=production
JWT_SECRET=proxmox-vm-platform-secret-key-s13w00-2025
PROXMOX_HOST=proxmox.s13w00.kr
PROXMOX_PORT=8006
PROXMOX_USER=user@pam
PROXMOX_PASSWORD=828275wc
PROXMOX_NODE=pve
```

**참고**: PORT는 Railway가 자동으로 설정하므로 추가하지 않아도 됩니다.

### 5. 배포 URL 확인

Railway가 배포를 완료하면 다음과 같은 URL을 제공합니다:
```
https://proxmox-vm-platform-production.up.railway.app
```

### 6. 배포 완료!

이제 하나의 URL에서 프론트엔드와 백엔드가 모두 작동합니다:

- **웹 앱**: `https://YOUR-RAILWAY-URL.up.railway.app`
- **API**: `https://YOUR-RAILWAY-URL.up.railway.app/api/*`

프론트엔드는 같은 도메인의 API를 사용하므로 별도의 CORS 설정이나 URL 변경이 필요 없습니다.

## ✅ 배포 확인

1. Railway 대시보드에서 배포 로그 확인
2. 다음 메시지가 보이면 성공:
   ```
   🚀 Server running on port 3000
   📡 Proxmox Host: proxmox.s13w00.kr
   ```

3. 브라우저에서 테스트:
   - API: `https://YOUR-RAILWAY-URL.up.railway.app/api/health`
   - 웹 앱: `https://YOUR-RAILWAY-URL.up.railway.app`

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

## 🏗️ 배포 구조

이 프로젝트는 **단일 서비스 배포** 방식을 사용합니다:

1. Railway가 `npm install`과 `npm run build`를 실행하여 클라이언트를 빌드
2. Express 서버가 빌드된 정적 파일(`client/dist`)을 서빙
3. API 요청(`/api/*`)은 백엔드 라우트로 처리
4. 그 외 모든 요청은 React 앱(SPA)으로 전달

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
Railway 풀스택 앱 (https://xxx.railway.app)
    ├─ 프론트엔드 (React SPA)
    └─ 백엔드 API (Express)
         ↓
Proxmox 서버 (proxmox.s13w00.kr:8006)
```

이제 하나의 Railway 서비스에서 모든 것이 작동합니다! 🎉
