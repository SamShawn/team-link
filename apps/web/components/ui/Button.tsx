'use client';

import React from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#6366F1',
    color: '#FFFFFF',
    border: 'none',
  },
  secondary: {
    background: '#F3F4F6',
    color: '#374151',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: '#4B5563',
    border: 'none',
  },
  danger: {
    background: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: '32px', padding: '0 12px', fontSize: '13px', gap: '6px' },
  md: { height: '36px', padding: '0 16px', fontSize: '14px', gap: '8px' },
  lg: { height: '40px', padding: '0 20px', fontSize: '15px', gap: '8px' },
  icon: { height: '32px', width: '32px', padding: '0', justifyContent: 'center' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  style,
  className,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 100ms ease-out',
    fontFamily: 'inherit',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      style={baseStyle}
      className={clsx('button', className)}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const target = e.currentTarget;
          if (variant === 'primary') target.style.background = '#4F46E5';
          else if (variant === 'secondary') target.style.background = '#E5E7EB';
          else if (variant === 'ghost') target.style.background = '#F3F4F6';
          else if (variant === 'danger') target.style.background = '#DC2626';
          target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        if (variant === 'primary') target.style.background = '#6366F1';
        else if (variant === 'secondary') target.style.background = '#F3F4F6';
        else if (variant === 'ghost') target.style.background = 'transparent';
        else if (variant === 'danger') target.style.background = '#EF4444';
        target.style.boxShadow = 'none';
      }}
      {...props}
    >
      {loading ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
