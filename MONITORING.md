# 📊 Monitoring & Analytics Guide

## 🎯 **Tổng quan**

Website Trung tâm Gia Sư Hoàng Hà được tích hợp hệ thống monitoring và analytics toàn diện để theo dõi hiệu suất, hành vi người dùng và tối ưu hóa trải nghiệm.

---

## 🔧 **Các công cụ được tích hợp**

### 1. **Google Analytics 4 (GA4)**
- **Measurement ID**: `G-0C25SX7IGJ`
- **Tracking**: Page views, user interactions, conversions
- **Enhanced Ecommerce**: Course views, registrations, purchases
- **Custom Events**: Course interactions, chatbot usage

### 2. **Sentry Error Tracking**
- **Real-time error monitoring**
- **Performance tracking**
- **User session replay**
- **Custom error boundaries**

### 3. **Core Web Vitals**
- **FCP (First Contentful Paint)**
- **LCP (Largest Contentful Paint)**
- **CLS (Cumulative Layout Shift)**
- **TTFB (Time to First Byte)**

### 4. **Advanced User Interaction Tracking**
- **Scroll depth tracking**
- **Time on page metrics**
- **Click heatmap data**
- **Form interaction analysis**
- **Search behavior tracking**

### 5. **Chatbot Analytics**
- **Conversation tracking**
- **User satisfaction metrics**
- **Popular topics analysis**
- **Conversion tracking**

---

## 📈 **Analytics Dashboard**

### **Admin Panel Integration**
- Truy cập: `/admin` → Tab "Analytics"
- **Real-time metrics** cập nhật mỗi 5 giây
- **Key Performance Indicators (KPIs)**:
  - Tổng người dùng
  - Lượt xem trang
  - Xem khóa học
  - Đăng ký thành công
  - Tương tác chatbot
  - Thời gian trung bình trên trang
  - Tỷ lệ thoát (Bounce rate)
  - Tỷ lệ chuyển đổi

### **Dashboard Features**
- **Top Pages Analysis**: Trang được xem nhiều nhất
- **Course Performance**: Khóa học phổ biến và tỷ lệ chuyển đổi
- **Real-time Activity**: Hoạt động người dùng trực tuyến
- **Visual Charts**: Biểu đồ trực quan dễ hiểu

---

## 🎯 **Enhanced Ecommerce Tracking**

### **Course Journey Tracking**
```typescript
// Course view tracking
trackCourseViewEcommerce({
  id: 'course-123',
  name: 'Toán lớp 10',
  price: 2500000,
  category: 'THPT'
});

// Add to cart (registration intent)
trackAddToCart({
  id: 'course-123',
  name: 'Toán lớp 10',
  price: 2500000,
  category: 'THPT'
});

// Begin checkout (registration form)
trackBeginCheckout({
  id: 'course-123',
  name: 'Toán lớp 10',
  price: 2500000,
  category: 'THPT'
});

// Purchase completion
trackPurchase({
  transaction_id: 'reg-456',
  value: 2500000,
  currency: 'VND',
  items: [courseItem]
});
```

### **Search & Discovery**
```typescript
// Search tracking
trackSearch('toán lớp 10', 5); // search term, results count

// Course list view
trackViewItemList('Khóa học THPT', courseItems);

// Promotion tracking
trackViewPromotion('summer-2024', 'Giảm giá mùa hè');
```

---

## 🤖 **Chatbot Analytics**

### **Conversation Tracking**
```typescript
// Chatbot interactions
trackChatbotOpen();
trackMessageSent('text');
trackQuickReplyClick('Xem khóa học');
trackCourseInquiry('course-123', 'Toán lớp 10');
trackContactRequest('phone');
trackFAQViewed('học phí');

// Session completion
trackChatbotSession({
  sessionId: 'chat-789',
  startTime: Date.now(),
  endTime: Date.now() + 300000,
  messageCount: 8,
  topicsDiscussed: ['học phí', 'lịch học'],
  conversionsGenerated: ['course_registration'],
  userSatisfaction: 4
});
```

### **Performance Metrics**
- **Response time tracking**
- **Popular topics identification**
- **Conversion attribution**
- **User satisfaction scoring**

---

## 📊 **User Interaction Analytics**

### **Engagement Metrics**
```typescript
// Scroll depth (25%, 50%, 75%, 90%, 100%)
trackScrollDepth();

// Time on page (10s, 30s, 60s, 120s, 300s)
trackTimeOnPage();

// Click heatmap
trackClickHeatmap();

// Form interactions
trackFormInteractions();
```

### **Behavioral Analysis**
- **Click coordinates** for heatmap generation
- **Form abandonment** tracking
- **Search behavior** patterns
- **Device and browser** information
- **Performance metrics** by user

---

## 🔍 **Performance Monitoring**

### **Core Web Vitals Thresholds**
- **FCP**: < 1.8s (Good), 1.8-3.0s (Needs Improvement), > 3.0s (Poor)
- **LCP**: < 2.5s (Good), 2.5-4.0s (Needs Improvement), > 4.0s (Poor)
- **CLS**: < 0.1 (Good), 0.1-0.25 (Needs Improvement), > 0.25 (Poor)
- **TTFB**: < 0.8s (Good), 0.8-1.8s (Needs Improvement), > 1.8s (Poor)

### **Performance Data Collection**
- **Automatic performance tracking** on page load
- **Core Web Vitals** sent to GA4 for analysis
- **Performance metrics** available in GA4 reports

---

## 📱 **Event Tracking Categories**

### **1. Engagement Events**
- `page_view`: Lượt xem trang
- `scroll_depth`: Độ sâu cuộn trang
- `time_on_page`: Thời gian trên trang
- `chatbot_open/close`: Mở/đóng chatbot

### **2. Course Events**
- `course_view`: Xem chi tiết khóa học
- `course_register`: Đăng ký khóa học
- `course_inquiry`: Hỏi về khóa học
- `course_share`: Chia sẻ khóa học

### **3. Interaction Events**
- `button_click`: Click nút
- `link_click`: Click liên kết
- `form_interaction`: Tương tác form
- `search_performed`: Thực hiện tìm kiếm

### **4. Conversion Events**
- `registration_complete`: Hoàn thành đăng ký
- `contact_form_submit`: Gửi form liên hệ
- `phone_call_click`: Click số điện thoại
- `chatbot_conversion`: Chuyển đổi từ chatbot

---

## 🛠 **Setup & Configuration**

### **Environment Variables**
```bash
# Vercel Environment Variables
VITE_GA_TRACKING_ID=G-0C25SX7IGJ
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### **Analytics Initialization**
```typescript
// src/utils/analytics.ts
export const initGA = () => {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  if (!trackingId) return;
  
  // GA4 initialization
  window.gtag('config', trackingId, {
    page_title: document.title,
    page_location: window.location.href,
  });
};
```

### **Component Integration**
```typescript
// src/App.tsx
import AnalyticsTracker from './components/shared/AnalyticsTracker';

function App() {
  return (
    <>
      <AnalyticsTracker />
      {/* App content */}
    </>
  );
}
```

---

## 📊 **Data Analysis & Insights**

### **GA4 Reports to Monitor**
1. **Realtime Report**: Người dùng đang online
2. **Acquisition Report**: Nguồn traffic
3. **Engagement Report**: Hành vi người dùng
4. **Monetization Report**: Course conversions
5. **Retention Report**: Người dùng quay lại

### **Custom Dimensions**
- **Course Category**: THPT, THCS, Tiểu học
- **User Type**: New, Returning
- **Device Type**: Desktop, Mobile, Tablet
- **Traffic Source**: Organic, Direct, Social

### **Key Metrics to Track**
- **Conversion Rate**: Tỷ lệ đăng ký/lượt xem
- **Average Session Duration**: Thời gian trung bình
- **Pages per Session**: Số trang/phiên
- **Bounce Rate**: Tỷ lệ thoát
- **Course Popularity**: Khóa học được quan tâm nhất

---

## 🚀 **Optimization Recommendations**

### **Performance Optimization**
- Monitor **Core Web Vitals** weekly
- Optimize images and assets based on **LCP** data
- Reduce **CLS** through proper image sizing
- Improve **TTFB** with caching strategies

### **User Experience**
- Analyze **scroll depth** to optimize content placement
- Use **click heatmap** data for UI improvements
- Monitor **form abandonment** to simplify processes
- Track **search queries** to improve content

### **Conversion Optimization**
- A/B test based on **analytics insights**
- Optimize **course pages** with highest traffic
- Improve **chatbot responses** for popular topics
- Enhance **registration flow** based on drop-off points

---

## 🔧 **Troubleshooting**

### **Common Issues**
1. **GA4 not tracking**: Check `VITE_GA_TRACKING_ID` environment variable
2. **Performance metrics not showing**: Verify `web-vitals` package installation
3. **Sentry errors not captured**: Confirm Sentry DSN configuration
4. **Chatbot analytics missing**: Ensure tracking functions are called

### **Debug Mode**
```typescript
// Enable debug mode in development
if (import.meta.env.DEV) {
  window.gtag('config', trackingId, {
    debug_mode: true,
  });
}
```

### **Testing Analytics**
1. Open **Browser DevTools** → **Network** tab
2. Look for requests to `google-analytics.com`
3. Check **GA4 Realtime** reports
4. Use **GA4 DebugView** for detailed event tracking

---

## 📞 **Support & Maintenance**

### **Regular Tasks**
- **Weekly**: Review Core Web Vitals performance
- **Monthly**: Analyze user behavior patterns
- **Quarterly**: Optimize based on conversion data
- **Annually**: Review and update tracking strategy

### **Contact Information**
- **Technical Support**: Liên hệ team development
- **Analytics Questions**: Tham khảo GA4 documentation
- **Performance Issues**: Monitor Sentry dashboard

---

**🎯 Mục tiêu cuối cùng**: Sử dụng data-driven insights để cải thiện trải nghiệm người dùng và tăng tỷ lệ chuyển đổi cho Trung tâm Gia Sư Hoàng Hà. 