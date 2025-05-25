# Security Implementation

This document outlines the security measures implemented in the Gia Sư Hoàng Hà client application.

## 🔒 Security Features Implemented

### 1. Input Validation & Sanitization

**Location**: `src/utils/security.ts`

- **String Sanitization**: Removes dangerous characters like `<>`, `javascript:`, and event handlers
- **HTML Sanitization**: Removes script tags, iframe tags, and malicious content
- **Email Validation**: Validates email format and checks for injection patterns
- **Phone Validation**: Validates Vietnamese phone number format
- **Name Validation**: Checks length and suspicious characters
- **Message Validation**: Sanitizes HTML content and validates length

**Usage**: All form inputs in ContactPage and CourseRegistrationPage are validated and sanitized before submission.

### 2. Rate Limiting

**Location**: `src/utils/security.ts`

- **Client-side Rate Limiting**: Prevents spam submissions (10 requests per minute by default)
- **Session-based Tracking**: Uses browser session storage to track requests
- **User Feedback**: Shows remaining requests when limit is reached

**Usage**: Applied to contact form and course registration form submissions.

### 3. Environment Variables Management

**Files**:

- `.env.example` - Template for environment variables
- `src/vite-env.d.ts` - TypeScript definitions for environment variables

**Variables**:

- `VITE_API_BASE_URL` - API endpoint configuration
- `VITE_USE_MOCK_DATA` - Toggle between mock and real API
- `VITE_ENABLE_RATE_LIMITING` - Enable/disable rate limiting
- `VITE_MAX_REQUESTS_PER_MINUTE` - Rate limiting configuration

### 4. Security Headers

**Location**: `index.html`

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `referrer: strict-origin-when-cross-origin` - Controls referrer information

### 5. Secure Development Practices

- **TypeScript**: Provides type safety and reduces runtime errors
- **No Direct HTML Injection**: No use of `dangerouslySetInnerHTML` or `innerHTML`
- **Timeout Configuration**: API requests have 10-second timeout
- **Error Handling**: Proper error handling without exposing sensitive information

## 🚫 Security Measures NOT Implemented

The following security measures were evaluated but deemed unnecessary for this project's scope:

### Content Security Policy (CSP)

- **Reason**: Small landing page application with simple functionality
- **Risk Level**: Low - no dynamic content loading or third-party scripts

### HTTPS Enforcement

- **Reason**: Handled at deployment/server level, not client-side
- **Note**: Should be configured during production deployment

### Advanced Authentication

- **Reason**: No user authentication system in current scope
- **Note**: Only basic contact forms and course registration

## 📋 Security Checklist

- ✅ Input validation and sanitization
- ✅ Rate limiting for forms
- ✅ Environment variables management
- ✅ Basic security headers
- ✅ TypeScript for type safety
- ✅ Secure coding practices
- ✅ Error handling
- ✅ No XSS vulnerabilities
- ✅ No sensitive data exposure

## 🔧 Configuration

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure variables according to your environment
3. Ensure sensitive values are not committed to version control

### Rate Limiting Configuration

```typescript
// Default configuration
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

// Custom configuration
const customLimiter = new RateLimiter(5, 30000); // 5 requests per 30 seconds
```

### Validation Usage

```typescript
import { validateAndSanitizeEmail } from '../utils/security';

const emailValidation = validateAndSanitizeEmail(userInput);
if (emailValidation.isValid) {
  // Use emailValidation.sanitized
} else {
  // Show emailValidation.error
}
```

## 🚨 Security Considerations for Production

1. **Server-side Validation**: Always validate inputs on the server side as well
2. **HTTPS**: Ensure all communications use HTTPS in production
3. **API Security**: Implement proper authentication and authorization on the backend
4. **Regular Updates**: Keep dependencies updated for security patches
5. **Security Monitoring**: Implement logging and monitoring for security events

## 📞 Security Contact

For security-related issues or questions, please contact the development team.

---

_Last updated: January 2025_
