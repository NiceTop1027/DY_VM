# 빠른 시작 가이드

## ✅ 환경 설정 완료!

`.env` 파일이 다음 정보로 설정되었습니다:
- **Proxmox 서버**: proxmox.s13w00.kr:8006
- **사용자**: user@pam
- **노드**: pve

## 🚀 실행 방법

### 방법 1: 두 개의 터미널 사용 (권장)

**터미널 1 - 백엔드 서버:**
```bash
npm run dev
```
→ http://localhost:3000 에서 실행됩니다.

**터미널 2 - 프론트엔드:**
```bash
npm run client
```
→ http://localhost:5173 에서 실행됩니다.

### 방법 2: tmux 사용 (한 화면에서)

```bash
# tmux 세션 시작
tmux new -s proxmox

# 백엔드 실행
npm run dev

# 새 패널 생성 (Ctrl+B, %)
# 프론트엔드 실행
npm run client

# 세션 종료: Ctrl+B, D
# 재접속: tmux attach -t proxmox
```

## 📱 접속하기

1. 브라우저에서 **http://localhost:5173** 접속
2. 회원가입 후 로그인
3. Proxmox에 있는 VM 목록 확인
4. VM 시작 → 접속하기!

## 🔧 문제 해결

### Proxmox 연결 오류
- Proxmox 서버가 실행 중인지 확인
- 네트워크 연결 확인
- 방화벽에서 8006 포트가 열려있는지 확인

### 포트 충돌
```bash
# 3000 포트 사용 중인 프로세스 확인
lsof -ti:3000 | xargs kill -9

# 5173 포트 사용 중인 프로세스 확인
lsof -ti:5173 | xargs kill -9
```

### 의존성 재설치
```bash
# 캐시 삭제 후 재설치
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 📝 다음 단계

1. Proxmox에 VM 생성 (관리자)
2. 웹에서 회원가입
3. VM 시작 및 접속 테스트

## 🎯 주요 기능

- ✅ 웹 브라우저에서 VM 목록 확인
- ✅ VM 시작/정지
- ✅ noVNC를 통한 웹 콘솔 접속
- ✅ 리소스 사용량 확인

---

**문제가 있으면 README.md를 참고하세요!**
