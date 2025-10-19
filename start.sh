#!/bin/bash

# Proxmox VM Platform - 실행 스크립트

echo "🚀 Proxmox VM Platform을 시작합니다..."
echo ""

# .env 파일 확인
if [ ! -f .env ]; then
    echo "❌ .env 파일이 없습니다!"
    echo "먼저 ./setup.sh를 실행하여 설정을 완료하세요."
    exit 1
fi

# node_modules 확인
if [ ! -d node_modules ]; then
    echo "❌ 백엔드 의존성이 설치되지 않았습니다!"
    echo "먼저 ./setup.sh를 실행하여 설정을 완료하세요."
    exit 1
fi

if [ ! -d client/node_modules ]; then
    echo "❌ 프론트엔드 의존성이 설치되지 않았습니다!"
    echo "먼저 ./setup.sh를 실행하여 설정을 완료하세요."
    exit 1
fi

echo "✅ 환경 설정 확인 완료"
echo ""
echo "📡 백엔드 서버: http://localhost:3000"
echo "🌐 프론트엔드: http://localhost:5173"
echo ""
echo "⚠️  두 개의 터미널에서 실행하세요:"
echo ""
echo "터미널 1:"
echo "  npm run dev"
echo ""
echo "터미널 2:"
echo "  npm run client"
echo ""
echo "또는 tmux를 사용하여 한 번에 실행:"
echo "  tmux new-session -d -s proxmox 'npm run dev'"
echo "  tmux split-window -h -t proxmox 'npm run client'"
echo "  tmux attach -t proxmox"
echo ""
