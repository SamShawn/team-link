'use client';

import React from 'react';
import { Phone } from 'lucide-react';
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
  const startCall = useChatStore((s) => s.startCall);
  const otherUserId = dm.participants.find((p) => p !== excludeUserId) ?? excludeUserId;
  const otherUser = useUser(otherUserId);

  if (!otherUser) return null;

  return (
    <div
      className={`${styles.item} ${activeDMId === dm.id ? styles.active : ''}`}
      onClick={() => setActiveDM(dm.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActiveDM(dm.id);
        }
      }}
    >
      <Avatar
        src={otherUser.avatarUrl}
        name={otherUser.displayName}
        size="sm"
        status={otherUser.status}
        showStatus
      />
      <span className={styles.dmName}>{otherUser.displayName}</span>
      <button
        className={styles.callBtn}
        onClick={(e) => {
          e.stopPropagation();
          startCall(otherUserId);
        }}
        aria-label="Start call"
      >
        <Phone size={14} />
      </button>
    </div>
  );
}

export default DMItem;