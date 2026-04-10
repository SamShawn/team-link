'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Message } from '@teamlink/shared/types';
import { useChatStore, useThreadParentId, useActiveChannelId } from '@/stores/chatStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { Composer } from '@/components/chat/Composer';
import styles from './ThreadPanel.module.css';

export function ThreadPanel() {
  const threadParentId = useThreadParentId();
  const activeChannelId = useActiveChannelId();
  const closeThread = useChatStore((s) => s.closeThread);
  const messages = useChatStore((s) => s.messages);
  const channels = useChatStore((s) => s.channels);

  // Find the parent message
  let parentMessage: Message | null = null;
  let threadMessages: Message[] = [];

  if (threadParentId && activeChannelId) {
    const channelMessages = messages[activeChannelId] ?? [];
    parentMessage = channelMessages.find((m) => m.id === threadParentId) ?? null;
    // Thread replies are messages with the same threadId
    threadMessages = channelMessages.filter((m) => m.threadId === threadParentId);
  }

  const channel = channels.find((c) => c.id === activeChannelId);

  return (
    <AnimatePresence>
      {threadParentId && parentMessage && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeThread}
          />

          {/* Panel */}
          <motion.div
            className={styles.panel}
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                Thread in {channel ? `#${channel.name}` : 'channel'}
              </span>
              <button className={styles.closeBtn} onClick={closeThread} aria-label="Close thread">
                <X size={18} />
              </button>
            </div>

            <div className={styles.parentMessage}>
              <MessageBubble message={parentMessage} />
            </div>

            <div className={styles.replies}>
              {threadMessages.length === 0 ? (
                <div className={styles.noReplies}>No replies yet. Start the conversation!</div>
              ) : (
                threadMessages.map((reply) => (
                  <MessageBubble key={reply.id} message={reply} />
                ))
              )}
            </div>

            <div className={styles.composerWrapper}>
              <Composer threadId={threadParentId} parentMessageId={threadParentId} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}