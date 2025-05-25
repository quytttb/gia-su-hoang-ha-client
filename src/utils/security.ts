// Security utilities for input validation and sanitization

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

/**
 * Sanitize HTML content (basic sanitization)
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize email input
 */
export const validateAndSanitizeEmail = (
  email: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(email).toLowerCase();

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Email không được để trống' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Email không hợp lệ' };
  }

  // Check for common email injection patterns
  if (sanitized.includes('%') || sanitized.includes('..')) {
    return { isValid: false, sanitized, error: 'Email chứa ký tự không hợp lệ' };
  }

  return { isValid: true, sanitized };
};

/**
 * Validate and sanitize phone number (Vietnamese format)
 */
export const validateAndSanitizePhone = (
  phone: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(phone).replace(/\s+/g, ''); // Remove spaces

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Số điện thoại không được để trống' };
  }

  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Số điện thoại không hợp lệ' };
  }

  return { isValid: true, sanitized };
};

/**
 * Validate and sanitize name input
 */
export const validateAndSanitizeName = (
  name: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeString(name);

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Họ tên không được để trống' };
  }

  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Họ tên phải có ít nhất 2 ký tự' };
  }

  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'Họ tên không được quá 100 ký tự' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = /[<>{}[\]\\]/;
  if (suspiciousPatterns.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Họ tên chứa ký tự không hợp lệ' };
  }

  return { isValid: true, sanitized };
};

/**
 * Validate and sanitize message/text input
 */
export const validateAndSanitizeMessage = (
  message: string
): { isValid: boolean; sanitized: string; error?: string } => {
  const sanitized = sanitizeHtml(message);

  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Tin nhắn không được để trống' };
  }

  if (sanitized.length < 10) {
    return { isValid: false, sanitized, error: 'Tin nhắn phải có ít nhất 10 ký tự' };
  }

  if (sanitized.length > 1000) {
    return { isValid: false, sanitized, error: 'Tin nhắn không được quá 1000 ký tự' };
  }

  return { isValid: true, sanitized };
};

/**
 * Rate limiting utility (client-side basic implementation)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    // 10 requests per minute by default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);

    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Export a default rate limiter instance
export const defaultRateLimiter = new RateLimiter();

/**
 * Generate a simple client identifier for rate limiting
 */
export const getClientIdentifier = (): string => {
  // In a real app, you might use IP address or user session
  // For client-side, we'll use a combination of user agent and timestamp
  const userAgent = navigator.userAgent;
  const sessionId =
    sessionStorage.getItem('clientId') || Math.random().toString(36).substring(2, 15);

  if (!sessionStorage.getItem('clientId')) {
    sessionStorage.setItem('clientId', sessionId);
  }

  return `${userAgent.substring(0, 20)}-${sessionId}`;
};
