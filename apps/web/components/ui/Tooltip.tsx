'use client';

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 500,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '6px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '6px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '6px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '6px',
    },
  };

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: '-4px',
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
    },
    bottom: {
      top: '-4px',
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
    },
    left: {
      right: '-4px',
      top: '50%',
      transform: 'translateY(-50%) rotate(45deg)',
    },
    right: {
      left: '-4px',
      top: '50%',
      transform: 'translateY(-50%) rotate(45deg)',
    },
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    ...positionStyles[position],
    padding: '6px 10px',
    background: '#1F2937',
    color: '#FFFFFF',
    fontSize: '12px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    zIndex: 50,
    opacity: isVisible ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 100ms ease-out',
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: '#1F2937',
    ...arrowStyles[position],
  };

  return (
    <div
      ref={triggerRef}
      style={{ display: 'inline-block', position: 'relative' }}
      className={className}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <div style={tooltipStyle} role="tooltip">
        {content}
        <span style={arrowStyle} />
      </div>
    </div>
  );
}
