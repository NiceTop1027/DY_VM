#!/bin/bash

# Proxmox VM Platform - 전체 설정 스크립트

echo "🚀 Proxmox VM Platform 설치를 시작합니다..."
echo ""

# 1. 환경 변수 설정
echo "📝 1단계: 환경 변수 파일 생성 중..."
cat > .env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (보안을 위해 변경 권장)
JWT_SECRET=proxmox-vm-platform-secret-key-change-this-in-production

# Proxmox Configuration
PROXMOX_HOST=192.168.1.100
PROXMOX_PORT=8006
PROXMOX_USER=root@pam
PROXMOX_PASSWORD=your-proxmox-password
PROXMOX_NODE=pve

# Client URL
CLIENT_URL=http://localhost:5173
EOF
echo "✅ .env 파일 생성 완료"
echo ""

# 2. 백엔드 의존성 설치
echo "📦 2단계: 백엔드 의존성 설치 중..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ 백엔드 의존성 설치 완료"
else
    echo "❌ 백엔드 의존성 설치 실패"
    exit 1
fi
echo ""

# 3. 프론트엔드 의존성 설치
echo "📦 3단계: 프론트엔드 의존성 설치 중..."
cd client
npm install
if [ $? -eq 0 ]; then
    echo "✅ 프론트엔드 의존성 설치 완료"
else
    echo "❌ 프론트엔드 의존성 설치 실패"
    exit 1
fi
cd ..
echo ""

# 완료 메시지
echo "🎉 설치가 완료되었습니다!"
echo ""
echo "⚠️  중요: .env 파일을 편집하여 실제 Proxmox 서버 정보를 입력하세요!"
echo ""
echo "📝 설정해야 할 항목:"
echo "  - PROXMOX_HOST: Proxmox 서버 IP 또는 도메인"
echo "  - PROXMOX_USER: Proxmox 사용자 (예: root@pam)"
echo "  - PROXMOX_PASSWORD: Proxmox 비밀번호"
echo "  - PROXMOX_NODE: Proxmox 노드 이름 (기본값: pve)"
echo ""
echo "편집 명령어: nano .env 또는 code .env"
echo ""
echo "🚀 실행 방법:"
echo "  터미널 1: npm run dev        (백엔드 서버)"
echo "  터미널 2: npm run client     (프론트엔드)"
echo ""
echo "  또는 한 번에: ./start.sh"
echo ""
