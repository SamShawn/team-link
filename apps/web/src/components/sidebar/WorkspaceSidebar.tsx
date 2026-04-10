'use client';

import React from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { CURRENT_USER } from '@/stores/chatStore';
import styles from './WorkspaceSidebar.module.css';

export function WorkspaceSidebar() {
  const user = CURRENT_USER();

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.workspaceName}>TeamLink</span>
        <ChevronDown size={16} className={styles.chevron} />
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Channels</span>
      </div>
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Direct Messages</span>
      </div>
      <div className={styles.footer}>
        <Avatar src={user.avatarUrl} name={user.displayName} size="sm" status={user.status} showStatus />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.displayName}</span>
        </div>
        <Settings size={16} className={styles.settingsIcon} />
      </div>
    </div>
  );
}