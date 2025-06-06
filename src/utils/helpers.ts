// Format currency to VND with Vietnamese number format (dots as thousand separators)
export const formatCurrency = (amount: number): string => {
  // Format number with dot as thousand separator
  const formattedNumber = new Intl.NumberFormat('de-DE').format(amount);
  return `${formattedNumber} đ/buổi`;
};

// Format date to Vietnamese format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

// Calculate discounted price
export const calculateDiscountedPrice = (price: number, discount?: number): number => {
  if (!discount) return price;
  return price - (price * discount) / 100;
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Check if a discount is still valid
export const isDiscountValid = (discountEndDate?: string): boolean => {
  if (!discountEndDate) return false;
  const now = new Date();
  const endDate = new Date(discountEndDate);
  return now <= endDate;
};

// Check if a discount is valid and has value
export const hasValidDiscount = (discount?: number, discountEndDate?: string): boolean => {
  return !!(discount && discount > 0 && isDiscountValid(discountEndDate));
};

// Format phone number with spaces
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format (Vietnamese)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};
