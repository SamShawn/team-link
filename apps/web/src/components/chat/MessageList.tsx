'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MessageBubble } from './MessageBubble';
import { useMessagesForChannel, useActiveChannelId } from '@/stores/chatStore';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import styles from './MessageList.module.css';

function DateSeparator({ date }: { date: Date }) {
  let label: string;
  if (isToday(date)) label = 'Today';
  else if (isYesterday(date)) label = 'Yesterday';
  else label = format(date, 'MMMM d, yyyy');

  return (
    <div className={styles.dateSeparator}>
      <span className={styles.dateLabel}>{label}</span>
    </div>
  );
}

export function MessageList() {
  const channelId = useActiveChannelId();
  const messages = useMessagesForChannel(channelId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessagesBtn, setShowNewMessagesBtn] = useState(false);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    } else if (!isAtBottom) {
      setShowNewMessagesBtn(true);
    }
  }, [messages.length]);

  function handleScroll() {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distFromBottom < 100);
    if (distFromBottom < 100) setShowNewMessagesBtn(false);
  }

  function scrollToBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setIsAtBottom(true);
      setShowNewMessagesBtn(false);
    }
  }

  // Determine grouping and date separators
  const items: Array<{ type: 'message' | 'date'; messageIdx?: number; date?: Date }> = [];
  let lastDate: Date | null = null;

  messages.forEach((msg, idx) => {
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      items.push({ type: 'date', date: msgDate });
      lastDate = msgDate;
    }
    const prevMsg = messages[idx - 1];
    const isGrouped =
      prevMsg &&
      prevMsg.authorId === msg.authorId &&
      new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000;
    items.push({ type: 'message', messageIdx: idx });
  });

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      <div className={styles.virtualList} style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          if (item.type === 'date' && item.date) {
            return (
              <div
                key={`date-${item.date.toISOString()}`}
                className={styles.virtualItem}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <DateSeparator date={item.date} />
              </div>
            );
          }
          if (item.type === 'message' && item.messageIdx !== undefined) {
            const msg = messages[item.messageIdx];
            const prevMsg = messages[item.messageIdx - 1];
            const isGrouped =
              prevMsg &&
              prevMsg.authorId === msg.authorId &&
              new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <div
                key={msg.id}
                className={styles.virtualItem}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <MessageBubble message={msg} isGrouped={isGrouped} />
              </div>
            );
          }
          return null;
        })}
      </div>

      {showNewMessagesBtn && (
        <button className={styles.newMessagesBtn} onClick={scrollToBottom}>
          <ChevronDown size={16} />
          New messages
        </button>
      )}
    </div>
  );
}