import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  calculateDiscountedPrice,
  isDiscountValid,
  validateEmail,
  validatePhone,
  generateId,
} from '../helpers';

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000000)).toMatch(/1\.000\.000\s*₫/);
    expect(formatCurrency(500000)).toMatch(/500\.000\s*₫/);
    expect(formatCurrency(0)).toMatch(/0\s*₫/);
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(10000000)).toMatch(/10\.000\.000\s*₫/);
  });
});

describe('calculateDiscountedPrice', () => {
  it('should calculate discounted price correctly', () => {
    expect(calculateDiscountedPrice(1000000, 10)).toBe(900000);
    expect(calculateDiscountedPrice(500000, 20)).toBe(400000);
    expect(calculateDiscountedPrice(1000000, 0)).toBe(1000000);
  });

  it('should handle edge cases', () => {
    expect(calculateDiscountedPrice(1000000, 100)).toBe(0);
    expect(calculateDiscountedPrice(0, 10)).toBe(0);
  });
});

describe('isDiscountValid', () => {
  it('should return true for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    expect(isDiscountValid(futureDateString)).toBe(true);
  });

  it('should return false for past dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastDateString = pastDate.toISOString().split('T')[0];

    expect(isDiscountValid(pastDateString)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDiscountValid(undefined)).toBe(false);
  });
});

describe('validateEmail', () => {
  it('should validate correct email formats', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('test+tag@example.org')).toBe(true);
  });

  it('should reject invalid email formats', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('should validate correct Vietnamese phone numbers', () => {
    expect(validatePhone('0912345678')).toBe(true);
    expect(validatePhone('0987654321')).toBe(true);
    expect(validatePhone('0356789012')).toBe(true);
    expect(validatePhone('0789123456')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('1234567890')).toBe(false); // doesn't start with 0
    expect(validatePhone('0123456789')).toBe(false); // starts with 01 or 02
    expect(validatePhone('091234567')).toBe(false); // too short
    expect(validatePhone('09123456789')).toBe(false); // too long
    expect(validatePhone('abc1234567')).toBe(false); // contains letters
    expect(validatePhone('')).toBe(false);
  });
});

describe('generateId', () => {
  it('should generate a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs of expected length', () => {
    const id = generateId();
    expect(id.length).toBe(7); // Math.random().toString(36).substring(2, 9) gives 7 chars
  });
});
