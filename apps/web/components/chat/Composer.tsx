'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { MentionAutocomplete } from './MentionAutocomplete';

interface ComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
  onMention?: (userId: string, username: string) => void;
}

export function Composer({
  onSend,
  disabled = false,
  onTyping,
  onStopTyping,
  onMention,
}: ComposerProps) {
  const [content, setContent] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newContent: string) => {
    setContent(newContent);
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping();
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping?.();
      }, 2000);
    }
  };

  const handleSubmit = useCallback(() => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onStopTyping?.();
    }
  }, [content, disabled, onSend, onStopTyping]);

  return (
    <div className="flex items-end gap-2 px-4 py-3 bg-white border-t border-gray-200 min-h-14">
      <button
        disabled={disabled}
        aria-label="Attach file"
        className="flex items-center justify-center w-9 h-9 border-none bg-transparent rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Paperclip size={20} />
      </button>

      <MentionAutocomplete
        value={content}
        onChange={handleChange}
        onMention={onMention || (() => {})}
        disabled={disabled}
      />

      <button
        disabled={disabled}
        aria-label="Add emoji"
        className="flex items-center justify-center w-9 h-9 border-none bg-transparent rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Smile size={20} />
      </button>

      <button
        onClick={handleSubmit}
        disabled={!content.trim() || disabled}
        aria-label="Send message"
        className="flex items-center justify-center w-9 h-9 border-none rounded-lg transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <Send size={18} />
      </button>
    </div>
  );
}
