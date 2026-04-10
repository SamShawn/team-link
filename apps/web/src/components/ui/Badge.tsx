import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  count: number;
  max?: number;
}

export function Badge({ count, max = 99 }: BadgeProps) {
  if (count === 0) return null;
  const display = count > max ? `${max}+` : String(count);
  return <span className={styles.badge}>{display}</span>;
}