import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SectionHeading from '../SectionHeading';

describe('SectionHeading', () => {
  it('should render title correctly', () => {
    render(<SectionHeading title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(<SectionHeading title="Test Title" subtitle="Test Subtitle" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    render(<SectionHeading title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('should apply centered class when centered is true', () => {
    render(<SectionHeading title="Test Title" centered={true} />);

    const container = screen.getByText('Test Title').closest('div');
    expect(container).toHaveClass('text-center');
  });

  it('should not apply centered class when centered is false', () => {
    render(<SectionHeading title="Test Title" centered={false} />);

    const container = screen.getByText('Test Title').closest('div');
    expect(container).not.toHaveClass('text-center');
  });

  it('should apply centered class by default', () => {
    render(<SectionHeading title="Test Title" />);

    const container = screen.getByText('Test Title').closest('div');
    expect(container).toHaveClass('text-center');
  });
});
