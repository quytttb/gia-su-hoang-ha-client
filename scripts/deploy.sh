#!/bin/bash

# Script để deploy lên Vercel
# Sử dụng: ./scripts/deploy.sh [--production]

set -e  # Dừng script nếu có lỗi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function để log với màu
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    log_error "Vercel CLI chưa được cài đặt. Vui lòng cài đặt bằng: npm i -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    log_error "Script này phải được chạy từ thư mục root của dự án"
    exit 1
fi

log_info "🚀 Bắt đầu quá trình deploy lên Vercel..."

# Check for production flag
PRODUCTION_FLAG=""
if [ "$1" = "--production" ] || [ "$1" = "-p" ]; then
    PRODUCTION_FLAG="--prod"
    log_info "📦 Deploy lên môi trường PRODUCTION"
else
    log_info "🧪 Deploy lên môi trường PREVIEW"
fi

# Step 1: Install dependencies (if needed)
log_info "📦 Kiểm tra dependencies..."
if [ ! -d "node_modules" ]; then
    log_info "Cài đặt dependencies..."
    npm install
else
    log_info "Dependencies đã được cài đặt"
fi

# Step 2: Run linting
log_info "🔍 Chạy ESLint..."
npm run lint

# Step 3: Run formatting check
log_info "💄 Kiểm tra code formatting..."
npm run format:check

# Step 4: Run tests (if available)
if npm run test:run &> /dev/null; then
    log_info "🧪 Chạy tests..."
    npm run test:run
else
    log_warning "Tests không có sẵn, bỏ qua..."
fi

# Step 5: Build the project
log_info "🔨 Build dự án..."
npm run build

# Step 6: Deploy to Vercel
log_info "🚀 Deploy lên Vercel..."
if [ -n "$PRODUCTION_FLAG" ]; then
    vercel --prod --yes
else
    vercel --yes
fi

# Step 7: Success message
log_success "✅ Deploy thành công!"

if [ -n "$PRODUCTION_FLAG" ]; then
    log_success "🌐 Ứng dụng đã được deploy lên production"
    log_info "📝 Kiểm tra tại: https://giasuhoangha.com"
else
    log_success "🌐 Ứng dụng đã được deploy lên preview"
    log_info "📝 URL preview sẽ được hiển thị ở trên"
fi

log_info "🎉 Hoàn thành!" 