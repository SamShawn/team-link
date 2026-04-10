'use client';

import React from 'react';
import { Avatar } from '@/components/ui';
import { DirectMessage } from '@teamlink/shared/types';
import { useUser, useActiveDMId, useChatStore } from '@/stores/chatStore';
import styles from './DMSidebar.module.css';

interface DMItemProps {
  dm: DirectMessage;
  excludeUserId: string;
}

function DMItem({ dm, excludeUserId }: DMItemProps) {
  const activeDMId = useActiveDMId();
  const setActiveDM = useChatStore((s) => s.setActiveDM);
  const otherUserId = dm.participants.find((p) => p !== excludeUserId) ?? excludeUserId;
  const otherUser = useUser(otherUserId);

  if (!otherUser) return null;

  return (
    <button
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
}

export default DMItem;