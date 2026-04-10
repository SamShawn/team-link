'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useCallState, useChatStore } from '@/stores/chatStore';
import styles from './IncomingCallOverlay.module.css';

export function IncomingCallOverlay() {
  const callState = useCallState();
  const acceptCall = useChatStore((s) => s.acceptCall);
  const declineCall = useChatStore((s) => s.declineCall);

  if (callState.status !== 'incoming') return null;

  const caller = useChatStore((s) => s.users[s.callState.callerId ?? '']);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={styles.content}>
        <Avatar
          src={caller?.avatarUrl}
          name={caller?.displayName ?? 'Unknown'}
          size="xl"
        />
        <h2 className={styles.callerName}>{caller?.displayName ?? 'Unknown'}</h2>
        <p className={styles.callType}>Incoming video call</p>

        <div className={styles.actions}>
          <button className={styles.declineBtn} onClick={declineCall}>
            <PhoneOff size={20} />
            Decline
          </button>
          <button className={styles.acceptBtn} onClick={acceptCall}>
            <Phone size={20} />
            Accept
          </button>
        </div>
      </div>
    </motion.div>
  );
}