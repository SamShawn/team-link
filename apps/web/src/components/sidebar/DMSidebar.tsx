'use client';

import React from 'react';
import { Avatar } from '@/components/ui';
import { useDirectMessages, useActiveDMId, useChatStore, useUser } from '@/stores/chatStore';
import styles from './DMSidebar.module.css';

export function DMSidebar() {
  const dms = useDirectMessages();
  const activeDMId = useActiveDMId();
  const setActiveDM = useChatStore((s) => s.setActiveDM);

  // Resolve all other participant user IDs upfront (hooks at top level)
  const dmUsers = dms.map((dm) => {
    const otherUserId = dm.participants.find((p) => p !== 'user-1') ?? 'user-2';
    const otherUser = useUser(otherUserId);
    return { dm, otherUser };
  });

  return (
    <div className={styles.dmSection}>
      <div className={styles.sectionHeader}>Direct Messages</div>
      <div className={styles.list}>
        {dmUsers.map(({ dm, otherUser }) => {
          if (!otherUser) return null;
          return (
            <button
              key={dm.id}
              className={`${styles.item} ${activeDMId === dm.id ? styles.active : ''}`}
              onClick={() => setActiveDM(dm.id)}
            >
              <Avatar
                src={otherUser.avatarUrl}
                name={otherUser.displayName}
                size="sm"
                status={otherUser.status}
                showStatus
              />
              <span className={styles.dmName}>{otherUser.displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}