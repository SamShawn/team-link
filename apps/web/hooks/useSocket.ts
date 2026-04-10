'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../stores/chatStore';
import type { Message, PresenceStatus } from '@teamlink/shared/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

interface UseSocketOptions {
  token: string;
  onMessage?: (message: Message, channelId: string) => void;
  onPresence?: (userId: string, status: PresenceStatus) => void;
  onTyping?: (channelId: string, dmId: string | null, userId: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface UseSocketReturn {
  isConnected: boolean;
  error: Error | null;
  emitTyping: (channelId: string, dmId: string | null) => void;
  sendMessage: (channelId: string, content: string, dmId?: string | null) => void;
  updatePresence: (status: PresenceStatus) => void;
  socket: Socket | null;
}

export function useSocket({
  token,
  onMessage,
  onPresence,
  onTyping,
  onConnect,
  onDisconnect,
}: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const addMessage = useChatStore((s) => s.addMessage);
  const setPresence = useChatStore((s) => s.setPresence);
  const setTyping = useChatStore((s) => s.setTyping);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
      onConnect?.();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (err) => {
      setError(err);
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        socket.disconnect();
      }
    });

    socket.on('message:created', ({ channelId, dmId, message }: { channelId?: string; dmId?: string; message: Message }) => {
      const targetId = channelId || dmId;
      if (targetId) {
        addMessage(targetId, message);
        onMessage?.(message, targetId);
      }
    });

    socket.on('presence:updated', ({ userId, status }: { userId: string; status: PresenceStatus }) => {
      setPresence(userId, status);
      onPresence?.(userId, status);
    });

    socket.on('typing:started', ({ channelId, dmId, userId }: { channelId?: string; dmId?: string; userId: string }) => {
      const targetId = channelId || dmId || '';
      if (targetId) {
        setTyping(channelId || null, dmId || null, userId, true);
        onTyping?.(channelId || '', dmId || null, userId);
      }
    });

    socket.on('typing:stopped', ({ channelId, dmId, userId }: { channelId?: string; dmId?: string; userId: string }) => {
      setTyping(channelId || null, dmId || null, userId, false);
    });

    socket.on('message:updated', ({ channelId, message }: { channelId: string; message: Message }) => {
      useChatStore.getState().updateMessage(channelId, message.id, message);
    });

    socket.on('message:deleted', ({ channelId, messageId }: { channelId: string; messageId: string }) => {
      useChatStore.getState().deleteMessage(channelId, messageId);
    });

    socket.on('reaction:added', ({ channelId, messageId, emoji, userId }: { channelId: string; messageId: string; emoji: string; userId: string }) => {
      useChatStore.getState().addReaction(channelId, messageId, emoji, userId);
    });

    socket.on('reaction:removed', ({ channelId, messageId, emoji, userId }: { channelId: string; messageId: string; emoji: string; userId: string }) => {
      useChatStore.getState().removeReaction(channelId, messageId, emoji, userId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, addMessage, setPresence, setTyping, onConnect, onDisconnect, onMessage, onPresence, onTyping]);

  const emitTyping = useCallback((channelId: string, dmId: string | null) => {
    socketRef.current?.emit('typing:start', { channelId, dmId });
  }, []);

  const sendMessage = useCallback((channelId: string, content: string, dmId?: string | null) => {
    socketRef.current?.emit('message:send', { channelId, dmId, content });
  }, []);

  const updatePresence = useCallback((status: PresenceStatus) => {
    socketRef.current?.emit('presence:update', { status });
  }, []);

  return {
    isConnected,
    error,
    emitTyping,
    sendMessage,
    updatePresence,
    socket: socketRef.current,
  };
}
