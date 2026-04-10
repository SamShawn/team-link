'use client';

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

/**
 * Hook for registering keyboard shortcuts.
 * Automatically cleans up listeners on unmount.
 */
export function useKeyboardShortcuts({
  enabled = true,
  shortcuts,
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields (unless explicitly allowed)
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcutsRef.current) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = !!shortcut.meta === (e.metaKey || e.metaKey);
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.ctrlKey);
        const shiftMatch = !!shortcut.shift === e.shiftKey;
        const altMatch = !!shortcut.alt === e.altKey;

        // Skip if modifier keys don't match and shortcut specifies them
        const hasModifiers = shortcut.meta || shortcut.ctrl || shortcut.shift || shortcut.alt;
        if (!hasModifiers && isInputField) continue;

        if (keyMatch && metaMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          e.stopPropagation();
          shortcut.handler();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}

/**
 * Predefined shortcuts for TeamLink
 */
export const KEYBOARD_SHORTCUTS = {
  // Navigation
  GO_TO_DM: { key: 'k', ctrl: true, description: 'Open direct messages' },
  GO_TO_CHANNEL: { key: 'c', ctrl: true, description: 'Open channel browser' },

  // Messaging
  NEW_MESSAGE: { key: 'n', ctrl: true, description: 'New message' },
  REPLY_TO_THREAD: { key: 'Enter', shift: false, description: 'Reply to selected thread' },

  // Search
  SEARCH: { key: 'k', meta: true, description: 'Search (Cmd+K)' },
  SEARCH_ALT: { key: 'k', ctrl: true, description: 'Search (Ctrl+K)' },

  // Navigation in messages
  NEXT_CHANNEL: { key: ']', ctrl: true, description: 'Go to next channel' },
  PREV_CHANNEL: { key: '[', ctrl: true, description: 'Go to previous channel' },

  // Mark as read
  MARK_ALL_READ: { key: 'Escape', description: 'Mark all as read' },

  // Help
  SHOW_SHORTCUTS: { key: '?', shift: true, description: 'Show keyboard shortcuts' },

  // Editing
  EDIT_MESSAGE: { key: 'e', description: 'Edit selected message' },
  DELETE_MESSAGE: { key: 'Delete', description: 'Delete selected message' },

  // Reactions
  QUICK_REACTION: { key: 'r', description: 'Quick reaction' },

  // Status
  SET_STATUS: { key: 's', ctrl: true, description: 'Set status' },
} as const;
