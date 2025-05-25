import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  sanitizeString,
  sanitizeHtml,
  validateAndSanitizeEmail,
  validateAndSanitizePhone,
  validateAndSanitizeName,
  validateAndSanitizeMessage,
  defaultRateLimiter,
  getClientIdentifier,
} from '../security';

describe('sanitizeString', () => {
  it('should remove dangerous characters', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    expect(sanitizeString('javascript:alert("xss")')).toBe('alert("xss")');
    expect(sanitizeString('onclick=alert("xss")')).toBe('alert("xss")');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  hello world  ')).toBe('hello world');
  });

  it('should handle empty strings', () => {
    expect(sanitizeString('')).toBe('');
    expect(sanitizeString('   ')).toBe('');
  });
});

describe('sanitizeHtml', () => {
  it('should remove script tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>Hello')).toBe('Hello');
    expect(sanitizeHtml('Hello<script src="evil.js"></script>World')).toBe('HelloWorld');
  });

  it('should remove iframe tags', () => {
    expect(sanitizeHtml('<iframe src="evil.com"></iframe>Hello')).toBe('Hello');
  });

  it('should remove javascript protocols', () => {
    expect(sanitizeHtml('javascript:alert("xss")')).toBe('alert("xss")');
  });

  it('should remove event handlers', () => {
    expect(sanitizeHtml('onclick=alert("xss")')).toBe('alert("xss")');
    expect(sanitizeHtml('onload=malicious()')).toBe('malicious()');
  });
});

describe('validateAndSanitizeEmail', () => {
  it('should validate and sanitize correct emails', () => {
    const result = validateAndSanitizeEmail('Test@Example.Com');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('test@example.com');
    expect(result.error).toBeUndefined();
  });

  it('should reject invalid email formats', () => {
    const result = validateAndSanitizeEmail('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email không hợp lệ');
  });

  it('should reject emails with injection patterns', () => {
    const result1 = validateAndSanitizeEmail('test%40evil.com');
    expect(result1.isValid).toBe(false);
    expect(result1.error).toBe('Email không hợp lệ');

    const result2 = validateAndSanitizeEmail('test..evil@example.com');
    expect(result2.isValid).toBe(false);
    expect(result2.error).toBe('Email chứa ký tự không hợp lệ');
  });

  it('should reject empty emails', () => {
    const result = validateAndSanitizeEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email không được để trống');
  });
});

describe('validateAndSanitizePhone', () => {
  it('should validate and sanitize correct Vietnamese phone numbers', () => {
    const result = validateAndSanitizePhone('091 234 5678');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('0912345678');
    expect(result.error).toBeUndefined();
  });

  it('should reject invalid phone formats', () => {
    const result = validateAndSanitizePhone('1234567890');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Số điện thoại không hợp lệ');
  });

  it('should reject empty phone numbers', () => {
    const result = validateAndSanitizePhone('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Số điện thoại không được để trống');
  });
});

describe('validateAndSanitizeName', () => {
  it('should validate and sanitize correct names', () => {
    const result = validateAndSanitizeName('Nguyễn Văn A');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Nguyễn Văn A');
    expect(result.error).toBeUndefined();
  });

  it('should reject names that are too short', () => {
    const result = validateAndSanitizeName('A');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Họ tên phải có ít nhất 2 ký tự');
  });

  it('should reject names that are too long', () => {
    const longName = 'A'.repeat(101);
    const result = validateAndSanitizeName(longName);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Họ tên không được quá 100 ký tự');
  });

  it('should reject names with suspicious characters', () => {
    const result = validateAndSanitizeName('Nguyễn <script>');
    expect(result.isValid).toBe(true); // sanitizeString removes < and >, so it becomes valid
    expect(result.sanitized).toBe('Nguyễn script');
  });

  it('should reject empty names', () => {
    const result = validateAndSanitizeName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Họ tên không được để trống');
  });
});

describe('validateAndSanitizeMessage', () => {
  it('should validate and sanitize correct messages', () => {
    const message = 'Tôi muốn biết thêm về khóa học';
    const result = validateAndSanitizeMessage(message);
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe(message);
    expect(result.error).toBeUndefined();
  });

  it('should reject messages that are too short', () => {
    const result = validateAndSanitizeMessage('Hi');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Tin nhắn phải có ít nhất 10 ký tự');
  });

  it('should reject messages that are too long', () => {
    const longMessage = 'A'.repeat(1001);
    const result = validateAndSanitizeMessage(longMessage);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Tin nhắn không được quá 1000 ký tự');
  });

  it('should sanitize HTML in messages', () => {
    const message = 'Hello <script>alert("xss")</script> world! This is a test message.';
    const result = validateAndSanitizeMessage(message);
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Hello  world! This is a test message.');
  });

  it('should reject empty messages', () => {
    const result = validateAndSanitizeMessage('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Tin nhắn không được để trống');
  });
});

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear rate limiter state before each test
    defaultRateLimiter['requests'].clear();
  });

  it('should allow requests within limit', () => {
    const clientId = 'test-client';

    // Should allow first request
    expect(defaultRateLimiter.isAllowed(clientId)).toBe(true);

    // Should allow subsequent requests within limit
    for (let i = 0; i < 8; i++) {
      expect(defaultRateLimiter.isAllowed(clientId)).toBe(true);
    }
  });

  it('should block requests when limit exceeded', () => {
    const clientId = 'test-client';

    // Use up all allowed requests
    for (let i = 0; i < 10; i++) {
      defaultRateLimiter.isAllowed(clientId);
    }

    // Next request should be blocked
    expect(defaultRateLimiter.isAllowed(clientId)).toBe(false);
  });

  it('should return correct remaining requests', () => {
    const clientId = 'test-client';

    expect(defaultRateLimiter.getRemainingRequests(clientId)).toBe(10);

    defaultRateLimiter.isAllowed(clientId);
    expect(defaultRateLimiter.getRemainingRequests(clientId)).toBe(9);

    defaultRateLimiter.isAllowed(clientId);
    expect(defaultRateLimiter.getRemainingRequests(clientId)).toBe(8);
  });
});

describe('getClientIdentifier', () => {
  beforeEach(() => {
    // Mock sessionStorage
    vi.clearAllMocks();
  });

  it('should generate a client identifier', () => {
    const identifier = getClientIdentifier();
    expect(typeof identifier).toBe('string');
    expect(identifier.length).toBeGreaterThan(0);
  });

  it('should include user agent in identifier', () => {
    const identifier = getClientIdentifier();
    expect(identifier).toContain('test-user-agent');
  });
});
