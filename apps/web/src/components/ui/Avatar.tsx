import React from 'react';
import styles from './Avatar.module.css';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: PresenceStatus;
  showStatus?: boolean;
}

const STATUS_COLORS: Record<PresenceStatus, string> = {
  online: 'var(--color-success)',
  away: 'var(--color-warning)',
  busy: 'var(--color-error)',
  offline: 'var(--color-text-secondary)',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ src, name, size = 'md', status, showStatus = false }: AvatarProps) {
  const sizeMap = { xs: 20, sm: 24, md: 32, lg: 40, xl: 64 };
  const dimension = sizeMap[size];

  return (
    <div className={`${styles.avatar} ${styles[size]}`} style={{ width: dimension, height: dimension }}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials(name)}</span>
      )}
      {showStatus && status && (
        <span
          className={styles.status}
          style={{ backgroundColor: STATUS_COLORS[status] }}
        />
      )}
    </div>
  );
}