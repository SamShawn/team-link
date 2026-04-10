'use client';

import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../stores/chatStore';
import type { Message } from '@teamlink/shared/types';

interface OptimisticMessageOptions {
  channelId: string;
  dmId?: string | null;
  content: string;
  tempId?: string;
  authorId: string;
}

interface PendingMessage {
  tempId: string;
  channelId: string;
  timestamp: number;
}

interface UseOptimisticMessagesReturn {
  sendOptimisticMessage: (options: OptimisticMessageOptions) => Message;
  confirmMessage: (tempId: string, confirmedMessage: Message) => void;
  failMessage: (tempId: string) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  getPendingMessages: (channelId: string) => string[];
}

/**
 * Hook for optimistic message updates.
 * Allows immediate UI updates while waiting for server confirmation.
 */
export function useOptimisticMessages(): UseOptimisticMessagesReturn {
  const pendingMessagesRef = useRef<PendingMessage[]>([]);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);

  /**
   * Create an optimistic message and add it to the store immediately.
   * Returns the temporary message object.
   */
  const sendOptimisticMessage = useCallback(({
    channelId,
    dmId,
    content,
    tempId,
    authorId,
  }: OptimisticMessageOptions): Message => {
    const id = tempId || uuidv4();
    const targetId = channelId || dmId || '';

    const optimisticMessage: Message = {
      id,
      channelId: targetId,
      threadId: null,
      authorId,
      content,
      attachments: [],
      mentions: [],
      reactions: [],
      replyCount: 0,
      replyAuthors: [],
      isEdited: false,
      editedAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addMessage(targetId, optimisticMessage);
    pendingMessagesRef.current.push({ tempId: id, channelId: targetId, timestamp: Date.now() });

    return optimisticMessage;
  }, [addMessage]);

  /**
   * Confirm an optimistic message with the actual server response.
   * Replaces the temporary message with the confirmed one.
   */
  const confirmMessage = useCallback((tempId: string, confirmedMessage: Message) => {
    const pendingIndex = pendingMessagesRef.current.findIndex((p) => p.tempId === tempId);
    if (pendingIndex !== -1) {
      const { channelId } = pendingMessagesRef.current[pendingIndex];
      // Update the optimistic message with server data
      updateMessage(channelId, tempId, confirmedMessage);
      pendingMessagesRef.current.splice(pendingIndex, 1);
    }
  }, [updateMessage]);

  /**
   * Mark an optimistic message as failed.
   * This could trigger a retry mechanism or show an error state.
   */
  const failMessage = useCallback((tempId: string) => {
    const pendingIndex = pendingMessagesRef.current.findIndex((p) => p.tempId === tempId);
    if (pendingIndex !== -1) {
      const { channelId } = pendingMessagesRef.current[pendingIndex];
      updateMessage(channelId, tempId, { isDeleted: true });
      pendingMessagesRef.current.splice(pendingIndex, 1);
    }
  }, [updateMessage]);

  /**
   * Remove a message (e.g., after deletion or failed send).
   */
  const removeMessage = useCallback((channelId: string, messageId: string) => {
    deleteMessage(channelId, messageId);
    pendingMessagesRef.current = pendingMessagesRef.current.filter(
      (p) => !(p.tempId === messageId && p.channelId === channelId)
    );
  }, [deleteMessage]);

  /**
   * Get list of pending (optimistic) message IDs for a channel.
   */
  const getPendingMessages = useCallback((channelId: string): string[] => {
    return pendingMessagesRef.current
      .filter((p) => p.channelId === channelId)
      .map((p) => p.tempId);
  }, []);

  return {
    sendOptimisticMessage,
    confirmMessage,
    failMessage,
    removeMessage,
    getPendingMessages,
  };
}
