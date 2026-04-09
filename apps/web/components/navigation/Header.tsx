'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Hash, Lock, Users, Star, Bell, Pin, MoreHorizontal, Search } from 'lucide-react';
import { Avatar, WorkspaceAvatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import type { Channel, User, Workspace } from '@teamlink/shared/types';

interface HeaderProps {
  workspace?: Workspace;
  channel?: Channel;
  dmUser?: User;
  memberCount?: number;
  onPinClick?: () => void;
  onStarClick?: () => void;
  onNotificationClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({
  workspace,
  channel,
  dmUser,
  memberCount = 0,
  onPinClick,
  onStarClick,
  onNotificationClick,
  onSearchClick,
}: HeaderProps) {
  const headerStyle: React.CSSProperties = {
    height: '56px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E5E7EB',
    background: '#FFFFFF',
    flexShrink: 0,
  };

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  };

  const breadcrumbStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: '#6B7280',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const iconButtonStyle: React.CSSProperties = {
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
    transition: 'all 50ms',
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '20px',
    background: '#E5E7EB',
    margin: '0 4px',
  };

  const isDM = !!dmUser;

  return (
    <header style={headerStyle}>
      <div style={leftStyle}>
        <div style={breadcrumbStyle}>
          {workspace && (
            <WorkspaceAvatar name={workspace.name} src={workspace.avatarUrl} size={28} />
          )}
          {channel ? (
            <>
              <span style={iconStyle}>
                {channel.visibility === 'private' ? <Lock size={18} /> : <Hash size={18} />}
              </span>
              <div>
                <h1 style={titleStyle}>{channel.name}</h1>
                {channel.topic && (
                  <p style={subtitleStyle}>{channel.topic}</p>
                )}
              </div>
            </>
          ) : dmUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Avatar
                src={dmUser.avatarUrl}
                name={dmUser.displayName}
                size={32}
                status={dmUser.status}
                showPresence
              />
              <h1 style={titleStyle}>{dmUser.displayName}</h1>
            </div>
          ) : null}
        </div>
      </div>

      <div style={rightStyle}>
        {memberCount > 0 && (
          <>
            <button
              style={iconButtonStyle}
              aria-label="View members"
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Users size={18} />
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>{memberCount}</span>
            </button>
            <div style={dividerStyle} />
          </>
        )}

        <button
          style={iconButtonStyle}
          onClick={onSearchClick}
          aria-label="Search in channel"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Search size={18} />
        </button>

        <button
          style={iconButtonStyle}
          onClick={onPinClick}
          aria-label="Pinned messages"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Pin size={18} />
        </button>

        <button
          style={iconButtonStyle}
          onClick={onStarClick}
          aria-label="Star channel"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Star size={18} />
        </button>

        <button
          style={iconButtonStyle}
          onClick={onNotificationClick}
          aria-label="Notification settings"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={18} />
        </button>

        <Dropdown
          trigger={
            <button
              style={iconButtonStyle}
              aria-label="More options"
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MoreHorizontal size={18} />
            </button>
          }
          items={[
            { id: 'notifications', label: 'Notification preferences', onClick: () => {} },
            { id: 'members', label: 'View members', onClick: () => {} },
            { id: 'settings', label: 'Channel settings', onClick: () => {} },
          ]}
          align="right"
        />
      </div>
    </header>
  );
}
