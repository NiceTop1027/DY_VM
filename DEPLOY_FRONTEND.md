# 프론트엔드 Railway 배포 가이드

## 🚀 프론트엔드를 Railway에 배포하기

### 방법 1: 별도 저장소로 배포 (권장)

#### 1. 클라이언트 폴더를 별도 저장소로 만들기

```bash
cd /Users/nicetop/Documents/SERVER_WEB/client

# Git 초기화
git init

# 파일 추가
git add .
git commit -m "Initial commit: Frontend"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/NiceTop1027/DY_VM_CLIENT.git
git branch -M main
git push -u origin main
```

#### 2. Railway에서 새 프로젝트 생성

1. Railway 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. 방금 생성한 클라이언트 저장소 선택

#### 3. 환경 변수 설정

Railway 프로젝트 설정에서 **Variables** 추가:

```env
VITE_API_URL=https://dyvm-production.up.railway.app
```

#### 4. 배포 완료!

Railway가 자동으로 빌드하고 배포합니다.

프론트엔드 URL 예시:
```
https://dy-vm-client-production.up.railway.app
```

### 방법 2: Vercel 사용 (더 간단함, 무료)

Vercel이 프론트엔드 배포에 더 최적화되어 있습니다.

#### 1. Vercel 배포

```bash
cd /Users/nicetop/Documents/SERVER_WEB/client

# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add VITE_API_URL
# 값: https://dyvm-production.up.railway.app

# 프로덕션 배포
vercel --prod
```

#### 2. 완료!

Vercel이 URL을 제공합니다:
```
https://dy-vm.vercel.app
```

## 🔧 CORS 설정 업데이트

프론트엔드를 배포한 후, 백엔드의 CORS 설정을 업데이트해야 합니다.

Railway 백엔드 프로젝트의 환경 변수에서:

```env
CLIENT_URL=https://your-frontend-url.up.railway.app
```

또는 모든 도메인 허용:

```env
CLIENT_URL=*
```

## 📱 최종 구조

```
사용자 브라우저
    ↓
Railway 프론트엔드 (https://dy-vm-client.up.railway.app)
    ↓
Railway 백엔드 (https://dyvm-production.up.railway.app)
    ↓
Proxmox 서버 (proxmox.s13w00.kr:8006)
```

## ✨ 장점

- ✅ 완전히 클라우드 기반
- ✅ 로컬에서 아무것도 실행할 필요 없음
- ✅ 어디서든 접속 가능
- ✅ HTTPS 자동 제공
- ✅ 자동 배포 (Git push만 하면 됨)

## 💰 비용

- **Railway**: 월 $5 무료 크레딧 (프론트엔드 + 백엔드)
- **Vercel**: 무료 (프론트엔드만)

**추천**: 백엔드는 Railway, 프론트엔드는 Vercel 사용!
