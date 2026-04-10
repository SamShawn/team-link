'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReactionPicker.module.css';

const COMMON_REACTIONS = [
  '👍', '❤️', '😂', '🎉', '🚀', '👀',
  '😍', '🤔', '👏', '💡', '✨', '🙌',
];

const SEARCHABLE_EMOJIS = [
  ...COMMON_REACTIONS,
  '😊', '😅', '🤷', '💪', '🫡', '🎊',
  '😎', '🥳', '🤝', '💯', '🔝', '⭐',
  '✅', '❌', '🔥', '💬', '👋', '🎯',
];

interface ReactionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function ReactionPicker({ isOpen, onClose, onSelect, anchorRef }: ReactionPickerProps) {
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = search
    ? SEARCHABLE_EMOJIS.filter((e) => e.includes(search))
    : COMMON_REACTIONS;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className={styles.picker}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <input
            className={styles.search}
            placeholder="Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className={styles.grid}>
            {filtered.map((emoji) => (
              <button
                key={emoji}
                className={styles.emojiBtn}
                onClick={() => {
                  onSelect(emoji);
                  onClose();
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}