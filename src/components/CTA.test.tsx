import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CTA from './CTA';

describe('<CTA />', () => {
  it('renders the headline and primary CTA button', () => {
    render(<CTA />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/mental health/i);
    expect(screen.getByRole('button', { name: /start your free session/i })).toBeInTheDocument();
  });

  it('exposes the NIMHANS crisis line as a tel: link', () => {
    render(<CTA />);
    const link = screen.getByRole('link', { name: /NIMHANS Crisis Support/i });
    expect(link).toHaveAttribute('href', 'tel:8277946600');
  });
});
