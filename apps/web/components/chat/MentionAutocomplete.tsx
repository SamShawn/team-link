'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AtSign } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import type { User as UserType } from '@teamlink/shared/types';

interface MentionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onMention: (userId: string, username: string) => void;
  disabled?: boolean;
}

export function MentionAutocomplete({
  value,
  onChange,
  onMention,
  disabled = false,
}: MentionAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const users = useChatStore((s) => s.users);

  // Find mention trigger position
  const findMentionTrigger = useCallback((text: string, cursorPos: number): { trigger: string; query: string; startPos: number } | null => {
    // Look for @ trigger
    const textBeforeCursor = text.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      return {
        trigger: '@',
        query: atMatch[1],
        startPos: cursorPos - atMatch[0].length,
      };
    }

    // Look for # trigger for channels
    const hashMatch = textBeforeCursor.match(/#(\w*)$/);
    if (hashMatch) {
      return {
        trigger: '#',
        query: hashMatch[1],
        startPos: cursorPos - hashMatch[0].length,
      };
    }

    return null;
  }, []);

  // Filter users based on query
  const filteredUsers = Array.from(users.values()).filter((user) =>
    user.displayName.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newCursorPosition = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(newCursorPosition);

    const mentionTrigger = findMentionTrigger(newValue, newCursorPosition);
    if (mentionTrigger && mentionTrigger.trigger === '@') {
      setQuery(mentionTrigger.query);
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredUsers[selectedIndex]) {
          insertMention(filteredUsers[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Insert mention into text
  const insertMention = (user: UserType) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);

    // Find the @ symbol position
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
    const newTextBefore = textBeforeCursor.slice(0, atSymbolIndex);
    const mentionText = `@${user.displayName} `;

    const newValue = newTextBefore + mentionText + textAfterCursor;
    onChange(newValue);
    onMention(user.id, user.displayName);
    setIsOpen(false);

    // Focus back on input
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = newTextBefore.length + mentionText.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type @ to mention someone..."
        className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        rows={3}
      />

      {/* Mention trigger indicator */}
      {isOpen && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <AtSign size={16} className="text-indigo-500" />
        </div>
      )}

      {/* Autocomplete dropdown */}
      {isOpen && filteredUsers.length > 0 && (
        <div
          className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
            People
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredUsers.slice(0, 8).map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                  index === selectedIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {index === selectedIndex && (
                  <span className="text-xs text-indigo-600">↵</span>
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
            ↑↓ to navigate, ↵ to select, ESC to close
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && query && filteredUsers.length === 0 && (
        <div
          className="absolute z-50 w-64 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-sm text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          No users found matching "{query}"
        </div>
      )}
    </div>
  );
}
