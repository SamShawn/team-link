'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CallControls } from './CallControls';
import { Avatar } from '@/components/ui';
import { useCallState, useChatStore } from '@/stores/chatStore';
import styles from './CallPanel.module.css';

export function CallPanel() {
  const callState = useCallState();
  const endCall = useChatStore((s) => s.endCall);
  const users = useChatStore((s) => s.users);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const remoteUser = users[callState.callerId ?? ''];

  if (callState.status !== 'active') return null;

  return (
    <motion.div
      className={styles.panel}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className={styles.videoArea}>
        {/* Remote video - large tile */}
        <div className={styles.remoteVideo}>
          {isScreenSharing ? (
            <div className={styles.screenShare}>
              <div className={styles.screenShareIcon}>📹</div>
              <span className={styles.screenShareText}>You are sharing your screen</span>
            </div>
          ) : (
            <>
              <Avatar
                src={remoteUser?.avatarUrl}
                name={remoteUser?.displayName ?? 'Remote'}
                size="xl"
              />
              <span className={styles.remoteName}>{remoteUser?.displayName ?? 'Remote'}</span>
            </>
          )}
        </div>

        {/* Local video - small PiP */}
        <div className={styles.localVideo}>
          <Avatar
            src={remoteUser?.avatarUrl}
            name={remoteUser?.displayName ?? 'You'}
            size="lg"
          />
        </div>
      </div>

      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleMute={() => setIsMuted((m) => !m)}
        onToggleVideo={() => setIsVideoOff((v) => !v)}
        onToggleScreenShare={() => setIsScreenSharing((s) => !s)}
        onEndCall={endCall}
      />
    </motion.div>
  );
}