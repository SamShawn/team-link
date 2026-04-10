'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Smile, Paperclip, SendHorizontal, CornerDownRight } from 'lucide-react';
import { useChatStore, useActiveChannelId } from '@/stores/chatStore';
import { useTypingUsersForChannel } from '@/stores/chatStore';
import { CURRENT_USER_ID } from '@/lib/mockData';
import { TypingIndicator } from './TypingIndicator';
import { ReactionPicker } from './ReactionPicker';
import { v4 as uuidv4 } from 'uuid';
import styles from './Composer.module.css';

interface ComposerProps {
  threadId?: string;
  parentMessageId?: string;
}

export function Composer({ threadId, parentMessageId }: ComposerProps) {
  const channelId = useActiveChannelId();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMessage = useChatStore((s) => s.addMessage);
  const setTypingUser = useChatStore((s) => s.setTypingUser);

  const isInThread = !!threadId;
  const placeholder = isInThread ? 'Reply in thread...' : 'Type a message...';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);

    // Typing indicator
    if (e.target.value && channelId) {
      setTypingUser(channelId, CURRENT_USER_ID, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(channelId, CURRENT_USER_ID, false);
      }, 3000);
    }
  }

  function handleSend() {
    if (!content.trim() || !channelId) return;

    const message = {
      id: uuidv4(),
      channelId: threadId ?? channelId,
      threadId: threadId,
      authorId: CURRENT_USER_ID,
      content: content.trim(),
      attachments: [],
      mentions: [],
      reactions: [],
      replyCount: 0,
      isEdited: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMessage(channelId, message);
    setContent('');
    setFiles([]);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingUser(channelId, CURRENT_USER_ID, false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleAddReaction(emoji: string) {
    // Reaction is handled in MessageBubble, this is for composer emoji picker
    setContent((prev) => prev + emoji);
    setShowReactionPicker(false);
    textareaRef.current?.focus();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const canSend = content.trim().length > 0;

  return (
    <div className={styles.container}>
      {files.length > 0 && (
        <div className={styles.fileChips}>
          {files.map((file, i) => (
            <div key={i} className={styles.fileChip}>
              <Paperclip size={12} />
              <span className={styles.fileName}>{file.name}</span>
              <button className={styles.removeFile} onClick={() => removeFile(i)}>×</button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.composer}>
        <CornerDownRight size={16} className={styles.replyIcon} />
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className={styles.actions}>
          <div className={styles.emojiWrapper}>
            <button
              className={styles.actionBtn}
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              type="button"
            >
              <Smile size={18} />
            </button>
            <ReactionPicker
              isOpen={showReactionPicker}
              onClose={() => setShowReactionPicker(false)}
              onSelect={handleAddReaction}
            />
          </div>
          <label className={styles.actionBtn}>
            <input
              type="file"
              multiple
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <Paperclip size={18} />
          </label>
          <button
            className={`${styles.sendBtn} ${canSend ? styles.active : ''}`}
            onClick={handleSend}
            disabled={!canSend}
            type="button"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
      <TypingIndicator />
    </div>
  );
}