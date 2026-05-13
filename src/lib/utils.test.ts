import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins truthy classes and skips falsy ones', () => {
    const visible: boolean = false;
    const result = cn('px-2', visible && 'hidden', undefined, 'text-sm');
    expect(result).toBe('px-2 text-sm');
  });

  it('merges conflicting tailwind classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles array and object inputs from clsx', () => {
    expect(cn(['rounded-md', { 'opacity-50': false, 'opacity-100': true }])).toBe(
      'rounded-md opacity-100'
    );
  });
});
