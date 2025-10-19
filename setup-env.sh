#!/bin/bash

# Proxmox VM Platform - 환경 설정 스크립트

echo "🚀 Proxmox VM Platform 환경 설정을 시작합니다..."
echo ""

# .env 파일 생성
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

echo "✅ .env 파일이 생성되었습니다."
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
