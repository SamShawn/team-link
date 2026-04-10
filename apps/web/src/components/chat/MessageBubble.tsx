'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Reply, Smile, Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { Message } from '@teamlink/shared/types';
import { useChatStore } from '@/stores/chatStore';
import { CURRENT_USER_ID } from '@/lib/mockData';
import { format, isToday, isYesterday } from 'date-fns';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isGrouped?: boolean;
  onReply?: (messageId: string) => void;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return `Yesterday ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d h:mm a');
}

export function MessageBubble({ message, isGrouped = false, onReply }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const users = useChatStore((s) => s.users);
  const editMessage = useChatStore((s) => s.editMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);
  const addReaction = useChatStore((s) => s.addReaction);
  const removeReaction = useChatStore((s) => s.removeReaction);
  const openThread = useChatStore((s) => s.openThread);

  const author = users[message.authorId];
  const isOwn = message.authorId === CURRENT_USER_ID;
  const isDeleted = message.isDeleted;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  function handleSaveEdit() {
    if (editContent.trim() && editContent !== message.content) {
      editMessage(message.channelId, message.id, editContent.trim());
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditContent(message.content);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }

  function handleAddReaction(emoji: string) {
    addReaction(message.channelId, message.id, emoji, CURRENT_USER_ID);
  }

  function handleRemoveReaction(emoji: string) {
    removeReaction(message.channelId, message.id, emoji, CURRENT_USER_ID);
  }

  const COMMON_EMOJIS = ['👍', '❤️', '😂', '🎉', '🚀', '👀'];

  if (isDeleted) {
    return (
      <div className={`${styles.bubble} ${isOwn ? styles.own : ''} ${isGrouped ? styles.grouped : ''}`}>
        {isGrouped || !author ? null : (
          <Avatar src={author.avatarUrl} name={author.displayName} size="md" />
        )}
        <div className={styles.content}>
          <span className={styles.deletedText}>This message was deleted</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${styles.bubble} ${isOwn ? styles.own : ''} ${isGrouped ? styles.grouped : ''}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isGrouped || !author ? null : (
        <Avatar src={author.avatarUrl} name={author.displayName} size="md" />
      )}

      <div className={styles.content}>
        {isGrouped || !author ? null : (
          <div className={styles.meta}>
            <span className={styles.authorName}>{author?.displayName}</span>
            <span className={styles.timestamp}>{formatTimestamp(message.createdAt)}</span>
            {message.isEdited && <span className={styles.edited}>(edited)</span>}
          </div>
        )}

        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              ref={textareaRef}
              className={styles.editTextarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSaveEdit}>Save</button>
              <button className={styles.cancelBtn} onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className={styles.text}>{message.content}</p>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={styles.reactions}>
            {message.reactions.map((reaction) => {
              const isReactedByMe = reaction.userIds.includes(CURRENT_USER_ID);
              return (
                <button
                  key={reaction.emoji}
                  className={`${styles.reactionPill} ${isReactedByMe ? styles.reacted : ''}`}
                  onClick={() => isReactedByMe ? handleRemoveReaction(reaction.emoji) : handleAddReaction(reaction.emoji)}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {reaction.emoji}
                  </motion.span>
                  <span className={styles.reactionCount}>{reaction.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hover action bar */}
        <motion.div
          className={styles.actionBar}
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          transition={{ duration: 0.12 }}
        >
          <button className={styles.actionBtn} onClick={() => { openThread(message.id); onReply?.(message.id); }} title="Reply in thread">
            <Reply size={14} />
          </button>
          <div className={styles.reactionPicker}>
            <button className={styles.actionBtn} title="Add reaction">
              <Smile size={14} />
            </button>
            <div className={styles.reactionGrid}>
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className={styles.emojiBtn}
                  onClick={() => handleAddReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          {isOwn && (
            <>
              <button className={styles.actionBtn} onClick={() => setIsEditing(true)} title="Edit">
                <Pencil size={14} />
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => deleteMessage(message.channelId, message.id)}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}