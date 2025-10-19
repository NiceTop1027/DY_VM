# Proxmox VM Platform

학교를 위한 웹 기반 가상 서버 접속 플랫폼입니다. Proxmox VE API를 활용하여 사용자들이 웹 브라우저에서 직접 미리 준비된 VM에 접속할 수 있습니다.

**개인 서버가 없는 학생들도 웹을 통해 Proxmox 서버의 VM을 활용할 수 있습니다.**

## 주요 기능

- 🔐 **사용자 인증**: JWT 기반 회원가입/로그인
- 🖥️ **VM 접속**: 미리 준비된 VM 목록 확인 및 시작/정지
- 💻 **웹 콘솔**: noVNC를 통한 브라우저 기반 VM 콘솔 접속
- 📊 **리소스 확인**: CPU, 메모리, 디스크 사용량 확인
- 🎨 **모던 UI**: React + TailwindCSS 기반의 반응형 디자인

## 기술 스택

### 백엔드
- Node.js + Express
- Proxmox VE API
- JWT 인증
- Axios (HTTP 클라이언트)

### 프론트엔드
- React 18
- Vite
- TailwindCSS
- React Router
- noVNC (VNC 클라이언트)
- Lucide React (아이콘)

## 설치 방법

### 사전 요구사항

- Node.js 18 이상
- Proxmox VE 서버 (접근 가능한 상태)
- npm 또는 yarn

### 1. 프로젝트 클론

```bash
cd /Users/nicetop/Documents/SERVER_WEB
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 설정을 입력하세요:

```bash
cp .env.example .env
```

`.env` 파일 내용:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (보안을 위해 반드시 변경하세요)
JWT_SECRET=your-super-secret-key-change-this

# Proxmox Configuration
PROXMOX_HOST=your-proxmox-server.com
PROXMOX_PORT=8006
PROXMOX_USER=root@pam
PROXMOX_PASSWORD=your-proxmox-password
PROXMOX_NODE=pve

# Client URL
CLIENT_URL=http://localhost:5173
```

### 3. 의존성 설치

#### 백엔드 설치
```bash
npm install
```

#### 프론트엔드 설치
```bash
cd client
npm install
cd ..
```

### 4. 실행

#### 개발 모드 (백엔드와 프론트엔드 동시 실행)

터미널 1 - 백엔드:
```bash
npm run dev
```

터미널 2 - 프론트엔드:
```bash
npm run client
```

#### 프로덕션 모드

```bash
# 프론트엔드 빌드
npm run build

# 서버 실행
npm start
```

## 사용 방법

### 1. 회원가입 및 로그인

1. 브라우저에서 `http://localhost:5173` 접속
2. "회원가입" 클릭하여 새 계정 생성
3. 로그인하여 대시보드 접속

### 2. 사용 가능한 VM 확인

1. 대시보드에서 Proxmox에 미리 준비된 VM 목록 확인
2. 각 VM의 상태(실행 중/정지됨)와 리소스 정보 확인

### 3. VM 시작 및 접속

- **시작**: 정지된 VM의 "시작하기" 버튼 클릭
- **접속**: 실행 중인 VM의 "접속하기" 버튼 클릭
- **정지**: 실행 중인 VM의 정지 아이콘(□) 클릭

### 4. VM 콘솔 사용

1. 실행 중인 VM의 "접속하기" 버튼 클릭
2. noVNC를 통해 브라우저에서 직접 VM 화면 확인
3. 키보드와 마우스로 VM 제어 가능
4. 리눅스, 윈도우 등 모든 OS 지원

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/verify` - 토큰 검증

### VM 관리
- `GET /api/vm` - VM 목록 조회
- `GET /api/vm/:vmid` - 특정 VM 조회
- `POST /api/vm/:vmid/start` - VM 시작
- `POST /api/vm/:vmid/stop` - VM 정지
- `POST /api/vm/:vmid/shutdown` - VM 종료
- `GET /api/vm/:vmid/vnc` - VNC 콘솔 정보

### Proxmox 정보
- `GET /api/proxmox/resources` - 노드 리소스 조회
- `GET /api/proxmox/storages` - 스토리지 목록 조회

## 프로젝트 구조

```
SERVER_WEB/
├── server/                 # 백엔드
│   ├── config/
│   │   └── proxmox.js     # Proxmox API 클라이언트
│   ├── middleware/
│   │   └── auth.js        # JWT 인증 미들웨어
│   ├── routes/
│   │   ├── auth.js        # 인증 라우트
│   │   ├── vm.js          # VM 관리 라우트
│   │   └── proxmox.js     # Proxmox 정보 라우트
│   └── index.js           # 서버 엔트리포인트
├── client/                # 프론트엔드
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   ├── context/       # React Context
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── lib/           # 유틸리티
│   │   └── App.jsx        # 앱 루트
│   └── package.json
├── .env.example           # 환경 변수 예시
├── package.json
└── README.md
```

## 보안 고려사항

⚠️ **중요**: 이 프로젝트는 교육/개발 목적으로 제작되었습니다. 프로덕션 환경에서 사용하기 전에 다음 사항을 반드시 고려하세요:

1. **데이터베이스 사용**: 현재 사용자 정보가 메모리에 저장됩니다. MongoDB, PostgreSQL 등의 실제 데이터베이스를 사용하세요.

2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS를 사용하세요.

3. **환경 변수 보호**: `.env` 파일을 Git에 커밋하지 마세요.

4. **JWT Secret**: 강력한 랜덤 문자열을 사용하세요.

5. **Proxmox 인증**: 전용 API 사용자를 생성하고 최소 권한만 부여하세요.

6. **입력 검증**: 모든 사용자 입력에 대한 검증을 강화하세요.

7. **Rate Limiting**: API 요청 제한을 구현하세요.

8. **CORS 설정**: 프로덕션 환경에 맞게 CORS 설정을 조정하세요.

## 문제 해결

### Proxmox 연결 실패
- Proxmox 서버 주소와 포트가 올바른지 확인
- 방화벽에서 8006 포트가 열려있는지 확인
- Proxmox 사용자 권한 확인

### VNC 콘솔 연결 실패
- VM이 실행 중인지 확인
- Proxmox에서 VNC가 활성화되어 있는지 확인
- 브라우저 콘솔에서 WebSocket 오류 확인

### 빌드 오류
```bash
# 캐시 삭제 후 재설치
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 라이선스

MIT License

## 기여

이슈와 풀 리퀘스트를 환영합니다!

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.
