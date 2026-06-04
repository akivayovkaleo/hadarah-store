'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'outline' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: [
    'bg-[#1A1A1A] text-white border border-[#1A1A1A]',
    'hover:bg-white hover:text-[#1A1A1A]',
  ].join(' '),
  outline: [
    'bg-transparent text-[#1A1A1A] border border-[#1A1A1A]',
    'hover:bg-[#1A1A1A] hover:text-white',
  ].join(' '),
  accent: [
    'bg-[#C8A882] text-[#1A1A1A] border border-[#C8A882]',
    'hover:bg-[#A88A62] hover:border-[#A88A62] hover:text-white',
  ].join(' '),
};

const SIZES: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-[10px] tracking-[0.25em]',
  md: 'px-8 py-3.5 text-[11px] tracking-[0.3em]',
  lg: 'px-10 py-4 text-[11px] tracking-[0.35em]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={[
          // Base
          'btn-ripple inline-flex items-center justify-center gap-2',
          'font-bold uppercase',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A882]',
          VARIANTS[variant],
          SIZES[size],
          className,
        ].join(' ')}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
