'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTypingUsersForChannel, useActiveChannelId } from '@/stores/chatStore';
import { useUser } from '@/stores/chatStore';
import { CURRENT_USER_ID } from '@/lib/mockData';
import styles from './TypingIndicator.module.css';

function TypingDots() {
  return (
    <span className={styles.dots}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={styles.dot}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}

export function TypingIndicator() {
  const channelId = useActiveChannelId();
  const typingUserIds = useTypingUsersForChannel(channelId);

  if (typingUserIds.length === 0) return null;

  // Get display names (exclude current user)
  const otherTyping = typingUserIds.filter((id) => id !== CURRENT_USER_ID);
  if (otherTyping.length === 0) return null;

  let text: string;
  if (otherTyping.length === 1) {
    text = `${otherTyping[0]} is typing`;
  } else if (otherTyping.length === 2) {
    text = `${otherTyping[0]} and ${otherTyping[1]} are typing`;
  } else {
    text = `${otherTyping[0]} and ${otherTyping.length - 1} others are typing`;
  }

  return (
    <div className={styles.indicator}>
      <TypingDots />
      <span className={styles.text}>{text}</span>
    </div>
  );
}