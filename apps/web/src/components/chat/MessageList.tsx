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

type Item =
  | { type: 'date'; date: Date }
  | { type: 'message'; message: ReturnType<typeof useMessagesForChannel>[number]; isGrouped: boolean };

export function MessageList() {
  const channelId = useActiveChannelId();
  const messages = useMessagesForChannel(channelId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessagesBtn, setShowNewMessagesBtn] = useState(false);

  // Build items list: date separators + messages interleaved
  const items: Item[] = [];
  let lastDate: Date | null = null;

  messages.forEach((msg, idx) => {
    const msgDate = new Date(msg.createdAt);
    if (!lastDate || !isSameDay(lastDate, msgDate)) {
      items.push({ type: 'date', date: msgDate });
      lastDate = msgDate;
    }
    const prevMsg = messages[idx - 1];
    const isGrouped =
      !!prevMsg &&
      prevMsg.authorId === msg.authorId &&
      new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000;
    items.push({ type: 'message', message: msg, isGrouped });
  });

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => {
      // Date separators are smaller
      return items[index]?.type === 'date' ? 40 : 80;
    },
    overscan: 5,
  });

  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length, isAtBottom]);

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

  return (
    <div className={styles.container} ref={containerRef} onScroll={handleScroll}>
      <div
        className={styles.virtualList}
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          const top = virtualRow.start;

          if (item.type === 'date') {
            return (
              <div
                key={`date-${item.date.toISOString()}`}
                className={styles.virtualItem}
                style={{ transform: `translateY(${top}px)` }}
              >
                <DateSeparator date={item.date} />
              </div>
            );
          }

          return (
            <div
              key={item.message.id}
              className={styles.virtualItem}
              style={{ transform: `translateY(${top}px)` }}
            >
              <MessageBubble message={item.message} isGrouped={item.isGrouped} />
            </div>
          );
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