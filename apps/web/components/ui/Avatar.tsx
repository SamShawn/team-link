'use client';

import React from 'react';
import { clsx } from 'clsx';
import type { PresenceStatus } from '@teamlink/shared/types';

type AvatarSize = 24 | 32 | 40 | 64;

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  status?: PresenceStatus;
  showPresence?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  24: 24,
  32: 32,
  40: 40,
  64: 64,
};

const presenceColors: Record<PresenceStatus, string> = {
  online: '#10B981',
  away: '#F59E0B',
  busy: '#EF4444',
  offline: '#9CA3AF',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const gradients = [
  ['#6366F1', '#8B5CF6'],
  ['#EC4899', '#F43F5E'],
  ['#10B981', '#14B8A6'],
  ['#F59E0B', '#F97316'],
  ['#3B82F6', '#6366F1'],
  ['#8B5CF6', '#A855F7'],
  ['#EF4444', '#F97316'],
  ['#14B8A6', '#06B6D4'],
];

export function Avatar({
  src,
  name,
  size = 32,
  status,
  showPresence = false,
  className,
}: AvatarProps) {
  const pixelSize = sizeMap[size];
  const initials = getInitials(name);
  const gradient = gradients[hashString(name) % gradients.length];
  const fontSize = pixelSize * 0.4;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexShrink: 0,
  };

  const avatarStyle: React.CSSProperties = {
    width: pixelSize,
    height: pixelSize,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: 600,
    color: '#FFFFFF',
    background: src ? 'transparent' : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
    flexShrink: 0,
  };

  const presenceStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: pixelSize * 0.35,
    height: pixelSize * 0.35,
    borderRadius: '50%',
    background: showPresence && status ? presenceColors[status] : 'transparent',
    border: '2px solid #FFFFFF',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle} className={clsx('avatar', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={avatarStyle}
          width={pixelSize}
          height={pixelSize}
        />
      ) : (
        <div style={avatarStyle}>{initials}</div>
      )}
      {showPresence && (
        <span style={presenceStyle} />
      )}
    </div>
  );
}

interface WorkspaceAvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export function WorkspaceAvatar({
  name,
  src,
  size = 40,
  className,
}: WorkspaceAvatarProps) {
  const initials = getInitials(name);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.4,
    fontWeight: 600,
    color: '#FFFFFF',
    background: src ? 'transparent' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    flexShrink: 0,
  };

  return (
    <div style={style} className={clsx('workspace-avatar', className)}>
      {src ? (
        <img src={src} alt={name} width={size} height={size} style={{ borderRadius: '8px' }} />
      ) : (
        initials
      )}
    </div>
  );
}
