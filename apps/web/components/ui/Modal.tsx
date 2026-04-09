'use client';

import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: '400px',
  md: '500px',
  lg: '640px',
  xl: '800px',
  full: '100vw',
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 100,
    animation: 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const dialogStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: sizeMap[size],
    maxHeight: size === 'full' ? '100vh' : '90vh',
    background: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div
        ref={dialogRef}
        style={dialogStyle}
        onClick={(e) => e.stopPropagation()}
        className={clsx('modal-dialog', className)}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'background 100ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
