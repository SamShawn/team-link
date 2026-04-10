'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Hash, Lock } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import type { Channel, User } from '@teamlink/shared/types';

interface ChannelItemProps {
  channel: Channel;
  isActive?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function ChannelItem({
  channel,
  isActive = false,
  unreadCount = 0,
  onClick,
}: ChannelItemProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 8px',
    height: '28px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 50ms',
    background: isActive ? '#F3F4F6' : 'transparent',
    fontWeight: isActive ? 500 : 400,
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: isActive ? '#374151' : '#6B7280',
  };

  const nameStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '14px',
    color: isActive ? '#111827' : '#4B5563',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const badgeStyle: React.CSSProperties = {
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    background: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = '#F3F4F6';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
      role="button"
      tabIndex={0}
    >
      <span style={iconStyle}>
        {channel.visibility === 'private' ? <Lock size={16} /> : <Hash size={16} />}
      </span>
      <span style={nameStyle}>{channel.name}</span>
      {unreadCount > 0 && <span style={badgeStyle}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </div>
  );
}

interface DMItemProps {
  user: User;
  isActive?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function DMItem({ user, isActive = false, unreadCount = 0, onClick }: DMItemProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 8px',
    height: '28px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 50ms',
    background: isActive ? '#F3F4F6' : 'transparent',
  };

  const nameStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '14px',
    color: isActive ? '#111827' : '#4B5563',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: isActive ? 500 : 400,
  };

  const badgeStyle: React.CSSProperties = {
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    background: '#EF4444',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = '#F3F4F6';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
      role="button"
      tabIndex={0}
    >
      <Avatar src={user.avatarUrl} name={user.displayName} size={24} status={user.status} showPresence />
      <span style={nameStyle}>{user.displayName}</span>
      {unreadCount > 0 && <span style={badgeStyle}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </div>
  );
}

interface ChannelSectionProps {
  title: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function ChannelSection({ title, children, defaultCollapsed = false }: ChannelSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 8px 4px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const chevronStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: '#9CA3AF',
    transition: 'transform 150ms',
    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
  };

  const titleTextStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <div>
      <div style={headerStyle} onClick={() => setIsCollapsed(!isCollapsed)}>
        <span style={chevronStyle}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4.5 2L8 6L4.5 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </span>
        <span style={titleTextStyle}>{title}</span>
      </div>
      {!isCollapsed && (
        <div style={{ padding: '0 4px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
