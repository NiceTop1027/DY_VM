# Proxmox VM Platform 설치 가이드

이 문서는 Proxmox VM Platform을 처음부터 설정하는 상세한 가이드입니다.

## 1. Proxmox VE 설정

### Proxmox API 사용자 생성

1. Proxmox 웹 인터페이스에 로그인
2. **Datacenter > Permissions > Users** 이동
3. "Add" 버튼 클릭
4. 사용자 정보 입력:
   - User name: `vmplatform`
   - Realm: `pve` (Proxmox VE authentication server)
   - Password: 강력한 비밀번호 설정

### API 권한 설정

1. **Datacenter > Permissions** 이동
2. "Add > User Permission" 클릭
3. 설정:
   - Path: `/`
   - User: `vmplatform@pve`
   - Role: `PVEVMAdmin` (또는 필요한 권한만 선택)

### 필요한 최소 권한

VM 관리를 위해 필요한 권한:
- `VM.Allocate` - VM 생성
- `VM.Config.*` - VM 설정
- `VM.Console` - 콘솔 접근
- `VM.PowerMgmt` - 전원 관리
- `Datastore.AllocateSpace` - 디스크 할당

## 2. 서버 환경 설정

### Node.js 설치 (macOS)

```bash
# Homebrew를 사용한 설치
brew install node

# 버전 확인
node --version  # v18 이상이어야 함
npm --version
```

### Node.js 설치 (Ubuntu/Debian)

```bash
# NodeSource 저장소 추가
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 버전 확인
node --version
npm --version
```

## 3. 프로젝트 설정

### 저장소 준비

```bash
# 프로젝트 디렉토리로 이동
cd /Users/nicetop/Documents/SERVER_WEB

# Git 초기화 (선택사항)
git init
```

### 환경 변수 설정

1. `.env` 파일 생성:

```bash
cp .env.example .env
```

2. `.env` 파일 편집:

```env
# 서버 설정
PORT=3000
NODE_ENV=development

# JWT Secret - 반드시 변경!
# 랜덤 문자열 생성: openssl rand -base64 32
JWT_SECRET=your-generated-secret-key-here

# Proxmox 설정
PROXMOX_HOST=192.168.1.100        # Proxmox 서버 IP
PROXMOX_PORT=8006
PROXMOX_USER=vmplatform@pve       # 생성한 사용자
PROXMOX_PASSWORD=your-password    # 사용자 비밀번호
PROXMOX_NODE=pve                  # Proxmox 노드 이름

# 클라이언트 URL
CLIENT_URL=http://localhost:5173
```

### 의존성 설치

```bash
# 루트 디렉토리에서 백엔드 의존성 설치
npm install

# 프론트엔드 의존성 설치
cd client
npm install
cd ..
```

## 4. 개발 환경 실행

### 방법 1: 두 개의 터미널 사용 (권장)

**터미널 1 - 백엔드:**
```bash
npm run dev
```

**터미널 2 - 프론트엔드:**
```bash
npm run client
```

### 방법 2: tmux 사용

```bash
# tmux 세션 시작
tmux new -s vmplatform

# 백엔드 실행
npm run dev

# 새 패널 생성 (Ctrl+B, %)
# 프론트엔드 실행
npm run client

# 세션 종료: Ctrl+B, D
# 재접속: tmux attach -t vmplatform
```

## 5. 프로덕션 배포

### 프론트엔드 빌드

```bash
cd client
npm run build
cd ..
```

빌드된 파일은 `client/dist` 디렉토리에 생성됩니다.

### 백엔드에서 정적 파일 제공

`server/index.js`에 다음 코드 추가:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 제공 (프로덕션)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

### PM2로 프로세스 관리

```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start server/index.js --name vmplatform

# 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status
pm2 logs vmplatform
```

### Nginx 리버스 프록시 설정

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket 지원 (VNC용)
    location /api/vm/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

### SSL 인증서 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 확인
sudo certbot renew --dry-run
```

## 6. 데이터베이스 연동 (선택사항)

### MongoDB 설정

```bash
# MongoDB 설치
brew install mongodb-community  # macOS
# 또는
sudo apt-get install mongodb    # Ubuntu

# MongoDB 시작
brew services start mongodb-community  # macOS
# 또는
sudo systemctl start mongodb           # Ubuntu
```

### Mongoose 설치 및 설정

```bash
npm install mongoose
```

`server/models/User.js` 생성:

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  vms: [{ type: Number }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
```

## 7. 방화벽 설정

### Proxmox 서버

```bash
# 8006 포트 열기 (Proxmox API)
sudo ufw allow 8006/tcp

# VNC 포트 범위 열기
sudo ufw allow 5900:5999/tcp
```

### 애플리케이션 서버

```bash
# HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 개발 환경
sudo ufw allow 3000/tcp
sudo ufw allow 5173/tcp
```

## 8. 테스트

### 백엔드 API 테스트

```bash
# 헬스 체크
curl http://localhost:3000/api/health

# 회원가입
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 프론트엔드 접속

브라우저에서 `http://localhost:5173` 접속

## 9. 문제 해결

### Proxmox SSL 인증서 오류

개발 환경에서 자체 서명 인증서 사용 시 `server/config/proxmox.js`의 `rejectUnauthorized: false` 설정이 필요합니다.

프로덕션에서는 유효한 SSL 인증서를 사용하세요.

### CORS 오류

`.env`의 `CLIENT_URL`이 올바른지 확인하고, 프로덕션에서는 실제 도메인으로 변경하세요.

### VM 생성 실패

- Proxmox 사용자 권한 확인
- 스토리지 공간 확인
- 네트워크 설정 확인

## 10. 모니터링

### 로그 확인

```bash
# PM2 로그
pm2 logs vmplatform

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 성능 모니터링

```bash
# PM2 모니터링
pm2 monit

# 시스템 리소스
htop
```

## 다음 단계

- [ ] 실제 데이터베이스 연동
- [ ] 사용자 역할 및 권한 관리
- [ ] VM 템플릿 기능
- [ ] 리소스 할당량 제한
- [ ] 이메일 알림
- [ ] 백업 및 스냅샷 관리
- [ ] 사용량 통계 및 리포트

## 지원

문제가 발생하면 GitHub Issues에 문의하세요.
