# Deployment Guide - Vercel

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended for first time)

1. **Tạo tài khoản Vercel**

   - Truy cập [vercel.com](https://vercel.com)
   - Đăng ký bằng GitHub account

2. **Import Project**

   - Click "New Project"
   - Import từ GitHub repository này
   - Vercel sẽ tự động detect React app

3. **Configure Environment Variables**

   ```
   VITE_SITE_URL=https://your-domain.vercel.app
   VITE_SITE_NAME=Trung Tâm Gia Sư Hoàng Hà
   VITE_CONTACT_EMAIL=info@giasuhoangha.com
   VITE_CONTACT_PHONE=0123456789
   ```

4. **Deploy**
   - Click "Deploy"
   - Chờ build hoàn thành (~2-3 phút)

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Configuration

### Build Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

### Environment Variables

Cần setup các biến môi trường sau trong Vercel Dashboard:

```env
# Required
VITE_SITE_URL=https://giasuhoangha.com
VITE_SITE_NAME=Trung Tâm Gia Sư Hoàng Hà
VITE_CONTACT_EMAIL=info@giasuhoangha.com
VITE_CONTACT_PHONE=0123456789

# Optional
VITE_FACEBOOK_URL=https://facebook.com/giasuhoangha
VITE_ZALO_URL=https://zalo.me/giasuhoangha
VITE_ENABLE_ANALYTICS=true
```

## 🌐 Custom Domain

1. **Mua domain** (khuyến nghị: giasuhoangha.com)
2. **Add domain trong Vercel**:

   - Project Settings → Domains
   - Add domain
   - Configure DNS records

3. **DNS Configuration**:

   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

File `.github/workflows/deploy.yml` đã được setup với:

- ✅ Automated testing
- ✅ Code linting
- ✅ Format checking
- ✅ Build verification
- ✅ Preview deployments cho PRs
- ✅ Production deployment cho main branch

### Required Secrets

Cần thêm secrets sau vào GitHub repository:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**Cách lấy secrets**:

1. Vercel Token: Settings → Tokens → Create
2. Org ID & Project ID: Project Settings → General

## 📊 Monitoring

### Performance

- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Real User Monitoring

### Error Tracking

Khuyến nghị setup:

- Sentry for error tracking
- LogRocket for session replay

## 🔒 Security Headers

File `vercel.json` đã include:

- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Cache-Control for static assets

## 📈 SEO Optimization

- ✅ robots.txt configured
- ✅ sitemap.xml generated
- ✅ Meta tags optimized
- ✅ Open Graph tags
- ✅ Structured data

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**

   ```bash
   # Check locally first
   npm run build
   ```

2. **Environment variables not working**

   - Ensure variables start with `VITE_`
   - Check Vercel dashboard settings

3. **404 on page refresh**

   - Đã fix trong `vercel.json` với SPA routing

4. **Slow loading**
   - Check bundle size: `npm run build`
   - Verify code splitting is working

### Support

- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create issue in this repo
- Email: dev@giasuhoangha.com

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Custom domain setup
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] SEO verification
- [ ] Social media links updated
- [ ] Contact information verified
- [ ] Mobile responsiveness tested
