import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from '../LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('LazyImage', () => {
  it('should render actual image', () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);

    const actualImage = screen.getByRole('img', { name: 'Test image' });
    expect(actualImage).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<LazyImage src="test.jpg" alt="Test image" placeholder="custom-placeholder.jpg" />);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'custom-placeholder.jpg');
  });

  it('should apply custom className', () => {
    render(<LazyImage src="test.jpg" alt="Test image" className="custom-class" />);

    const container = screen.getByRole('img', { name: 'Test image' }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should set up IntersectionObserver', () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), { threshold: 0.1 });
  });

  it('should render error state when image fails to load', async () => {
    render(<LazyImage src="invalid.jpg" alt="Test image" />);

    // Get the actual image element and trigger error
    const actualImage = screen.getByRole('img', { name: 'Test image' });

    // Simulate image load error
    actualImage.dispatchEvent(new Event('error'));

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Không thể tải ảnh')).toBeInTheDocument();
    });
  });

  it('should render alt text', () => {
    render(<LazyImage src="test.jpg" alt="Test image description" />);

    expect(screen.getByAltText('Test image description')).toBeInTheDocument();
  });
});
