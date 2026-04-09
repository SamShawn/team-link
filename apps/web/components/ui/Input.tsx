'use client';

import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export function Input({
  error = false,
  icon,
  style,
  className,
  ...props
}: InputProps) {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    padding: icon ? '0 12px 0 40px' : '0 12px',
    border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    color: '#111827',
    background: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 100ms, box-shadow 100ms',
    ...style,
  };

  return (
    <div style={containerStyle} className={clsx('input-container', className)}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: '12px',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
      )}
      <input
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#6366F1';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#EF4444' : '#E5E7EB';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({
  error = false,
  style,
  className,
  ...props
}: TextareaProps) {
  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '80px',
    padding: '10px 12px',
    border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`,
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    color: '#111827',
    background: '#FFFFFF',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 100ms, box-shadow 100ms',
    ...style,
  };

  return (
    <textarea
      style={textareaStyle}
      className={clsx(className)}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#6366F1';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? '#EF4444' : '#E5E7EB';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
}
