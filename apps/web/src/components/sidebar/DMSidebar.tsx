'use client';

import React from 'react';
import DMItem from './DMItem';
import { useDirectMessages } from '@/stores/chatStore';
import styles from './DMSidebar.module.css';

const EXCLUDED_USER_ID = 'user-1';

export function DMSidebar() {
  const dms = useDirectMessages();

  return (
    <div className={styles.dmSection}>
      <div className={styles.sectionHeader}>Direct Messages</div>
      <div className={styles.list}>
        {dms.map((dm) => (
          <DMItem key={dm.id} dm={dm} excludeUserId={EXCLUDED_USER_ID} />
        ))}
      </div>
    </div>
  );
}