'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, AtSign, Smile } from 'lucide-react';

interface ComposerProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export function Composer({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  onTyping,
  onStopTyping,
}: ComposerProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
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
      textareaRef.current?.focus();
    }
  }, [content, disabled, onSend, onStopTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-end gap-2 px-4 py-3 bg-white border-t border-gray-200 min-h-14">
      <button
        disabled={disabled}
        aria-label="Attach file"
        className="flex items-center justify-center w-9 h-9 border-none bg-transparent rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Paperclip size={20} />
      </button>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 min-h-6 max-h-48 py-2 px-3 border border-gray-200 rounded-lg text-sm font-inherit text-gray-900 bg-white outline-none resize-none leading-6 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
      />

      <button
        disabled={disabled}
        aria-label="Insert mention"
        className="flex items-center justify-center w-9 h-9 border-none bg-transparent rounded-lg cursor-pointer text-gray-500 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <AtSign size={20} />
      </button>

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
