'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const icons: Record<ToastType, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  error: <AlertCircle size={20} />,
};

const colors: Record<ToastType, string> = {
  info: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 200,
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    const exitDuration = 200;

    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, exitDuration);
    }, duration);

    return () => clearTimeout(timeout);
  }, [toast.duration, onDismiss]);

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
    border: '1px solid #E5E7EB',
    minWidth: '320px',
    maxWidth: '420px',
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
    transition: 'opacity 200ms ease-out, transform 200ms ease-out',
  };

  return (
    <div style={style} role="alert">
      <span style={{ color: colors[toast.type], display: 'flex', flexShrink: 0 }}>
        {icons[toast.type]}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: 0 }}>
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0', lineHeight: 1.5 }}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onDismiss, 200);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          border: 'none',
          background: 'transparent',
          borderRadius: '4px',
          cursor: 'pointer',
          color: '#9CA3AF',
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
