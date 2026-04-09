'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = 'text',
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
    borderRadius: variant === 'circular' ? '50%' : variant === 'rectangular' ? '8px' : '4px',
  };

  return (
    <div
      className={clsx('skeleton', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

interface MessageSkeletonProps {
  count?: number;
}

export function MessageSkeleton({ count = 3 }: MessageSkeletonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '12px',
            animationDelay: `${i * 100}ms`,
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width="120px" height="14px" />
            <Skeleton width="80%" height="15px" />
            <Skeleton width="60%" height="15px" />
          </div>
        </div>
      ))}
    </div>
  );
}
