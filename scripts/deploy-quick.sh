#!/bin/bash

# Script deploy nhanh lên Vercel (bỏ qua tests và linting)
# Sử dụng: ./scripts/deploy-quick.sh [--production]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI chưa được cài đặt. Vui lòng cài đặt bằng: npm i -g vercel"
    exit 1
fi

log_info "⚡ Deploy nhanh lên Vercel..."

# Check for production flag
PRODUCTION_FLAG=""
if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
    PRODUCTION_FLAG="--prod"
    log_info "📦 Deploy lên PRODUCTION"
else
    log_info "🧪 Deploy lên PREVIEW"
fi

# Build and deploy
log_info "🔨 Build..."
npm run build

log_info "🚀 Deploy..."
if [ -n "$PRODUCTION_FLAG" ]; then
    vercel --prod --yes
else
    vercel --yes
fi

log_success "✅ Deploy thành công!" 