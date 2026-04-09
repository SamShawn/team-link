'use client';

import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Send, Paperclip, AtSign, Smile } from 'lucide-react';

interface ComposerProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onTyping?: () => void;
}

export function Composer({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  onTyping,
}: ComposerProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        // Stop typing indicator
      }, 2000);
    }
  };

  const handleSubmit = () => {
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '12px 16px',
    background: '#FFFFFF',
    borderTop: '1px solid #E5E7EB',
    minHeight: '56px',
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '24px',
    maxHeight: '200px',
    padding: '8px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'inherit',
    color: '#111827',
    background: '#FFFFFF',
    outline: 'none',
    resize: 'none',
    lineHeight: 1.5,
    transition: 'border-color 100ms, box-shadow 100ms',
  };

  const iconButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#D1D5DB' : '#6B7280',
    transition: 'all 100ms',
  };

  const sendButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    background: content.trim() ? '#6366F1' : '#F3F4F6',
    borderRadius: '8px',
    cursor: content.trim() && !disabled ? 'pointer' : 'not-allowed',
    color: content.trim() && !disabled ? '#FFFFFF' : '#9CA3AF',
    transition: 'all 100ms',
  };

  return (
    <div style={containerStyle}>
      <button
        style={iconButtonStyle}
        disabled={disabled}
        aria-label="Attach file"
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#F3F4F6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
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
        style={textareaStyle}
        rows={1}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#6366F1';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.25)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#E5E7EB';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      <button
        style={iconButtonStyle}
        disabled={disabled}
        aria-label="Insert mention"
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#F3F4F6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <AtSign size={20} />
      </button>

      <button
        style={iconButtonStyle}
        disabled={disabled}
        aria-label="Add emoji"
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.background = '#F3F4F6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Smile size={20} />
      </button>

      <button
        style={sendButtonStyle}
        onClick={handleSubmit}
        disabled={!content.trim() || disabled}
        aria-label="Send message"
        onMouseEnter={(e) => {
          if (content.trim() && !disabled) e.currentTarget.style.background = '#4F46E5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = content.trim() ? '#6366F1' : '#F3F4F6';
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
