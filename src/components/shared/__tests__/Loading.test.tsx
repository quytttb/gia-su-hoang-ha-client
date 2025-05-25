import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('should render default loading message', () => {
    render(<Loading />);

    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
  });

  it('should render custom message when provided', () => {
    render(<Loading message="Đang xử lý..." />);

    expect(screen.getByText('Đang xử lý...')).toBeInTheDocument();
  });

  it('should render loading spinner', () => {
    render(<Loading />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should have proper structure', () => {
    render(<Loading />);

    const container = screen.getByTestId('loading-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex', 'justify-center', 'items-center');
  });
});
