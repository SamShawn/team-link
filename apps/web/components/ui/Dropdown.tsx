'use client';

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({
  trigger,
  items,
  align = 'left',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        items[activeIndex].onClick?.();
        setIsOpen(false);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, items]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    [align === 'left' ? 'left' : 'right']: 0,
    marginTop: '4px',
    minWidth: '200px',
    padding: '4px',
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
    border: '1px solid #E5E7EB',
    zIndex: 50,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>
      <div ref={menuRef} style={menuStyle} role="menu">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => {
              item.onClick?.();
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            onMouseEnter={() => setActiveIndex(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              background: activeIndex === index ? '#F3F4F6' : 'transparent',
              color: item.danger ? '#EF4444' : '#111827',
              fontSize: '14px',
              transition: 'background 50ms',
            }}
            role="menuitem"
          >
            {item.icon && (
              <span style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                {item.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && (
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                {item.shortcut}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
