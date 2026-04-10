import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { Channel, DirectMessage, Message, User } from '@teamlink/shared/types';
import {
  MOCK_CHANNELS,
  MOCK_DIRECT_MESSAGES,
  MOCK_MESSAGES,
  MOCK_USERS,
  CURRENT_USER_ID,
} from '@/lib/mockData';

type CallStatus = 'idle' | 'incoming' | 'ringing' | 'connecting' | 'active' | 'ended';

interface CallState {
  status: CallStatus;
  callerId?: string;
}

interface ChatState {
  // State
  channels: Channel[];
  directMessages: DirectMessage[];
  messages: Record<string, Message[]>;
  users: Record<string, User>;
  activeChannelId: string | null;
  activeDMId: string | null;
  threadParentId: string | null;
  typingUsers: Record<string, string[]>;
  presence: Record<string, 'online' | 'away' | 'busy' | 'offline'>;
  callState: CallState;
  searchModalOpen: boolean;

  // Actions
  setActiveChannel: (id: string | null) => void;
  setActiveDM: (id: string | null) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  addMessage: (channelId: string, message: Message) => void;
  editMessage: (channelId: string, messageId: string, content: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  addReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  setTypingUser: (channelId: string, userId: string, isTyping: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  startCall: (userId: string) => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state from mock data
  channels: MOCK_CHANNELS,
  directMessages: MOCK_DIRECT_MESSAGES,
  messages: MOCK_MESSAGES,
  users: Object.fromEntries(MOCK_USERS.map(u => [u.id, u])),
  activeChannelId: 'ch-1',
  activeDMId: null,
  threadParentId: null,
  typingUsers: {},
  presence: {
    'user-1': 'online',
    'user-2': 'away',
    'user-3': 'offline',
  },
  callState: { status: 'idle' },
  searchModalOpen: false,

  setActiveChannel: (id) => set({ activeChannelId: id, activeDMId: null, threadParentId: null }),
  setActiveDM: (id) => set({ activeDMId: id, activeChannelId: null, threadParentId: null }),

  openThread: (messageId) => set({ threadParentId: messageId }),
  closeThread: () => set({ threadParentId: null }),

  addMessage: (channelId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] ?? []), message],
      },
    })),

  editMessage: (channelId, messageId, content) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId].map((m) =>
          m.id === messageId ? { ...m, content, isEdited: true, updatedAt: new Date().toISOString() } : m
        ),
      },
    })),

  deleteMessage: (channelId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId].map((m) =>
          m.id === messageId ? { ...m, isDeleted: true, content: '' } : m
        ),
      },
    })),

  addReaction: (channelId, messageId, emoji, userId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId].map((m) => {
          if (m.id !== messageId) return m;
          const existing = m.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, userIds: [...new Set([...r.userIds, userId])], count: r.count + 1 }
                  : r
              ),
            };
          }
          return { ...m, reactions: [...m.reactions, { emoji, userIds: [userId], count: 1 }] };
        }),
      },
    })),

  removeReaction: (channelId, messageId, emoji, userId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: state.messages[channelId].map((m) => {
          if (m.id !== messageId) return m;
          return {
            ...m,
            reactions: m.reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, userIds: r.userIds.filter((id) => id !== userId), count: Math.max(0, r.count - 1) }
                  : r
              )
              .filter((r) => r.count > 0),
          };
        }),
      },
    })),

  setTypingUser: (channelId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[channelId] ?? [];
      if (isTyping) {
        return { typingUsers: { ...state.typingUsers, [channelId]: [...new Set([...current, userId])] } };
      }
      return { typingUsers: { ...state.typingUsers, [channelId]: current.filter((id) => id !== userId) } };
    }),

  setSearchModalOpen: (open) => set({ searchModalOpen: open }),

  startCall: (userId) => set({ callState: { status: 'ringing', callerId: userId } }),
  acceptCall: () => set({ callState: { status: 'active' } }),
  declineCall: () => set({ callState: { status: 'idle' } }),
  endCall: () => set({ callState: { status: 'ended' } }),
}));

// Selective hooks to prevent unnecessary re-renders
export const useActiveChannelId = () => useChatStore((s) => s.activeChannelId);
export const useActiveDMId = () => useChatStore((s) => s.activeDMId);
export const useThreadParentId = () => useChatStore((s) => s.threadParentId);

// Stable empty arrays to prevent infinite loops in React 18 concurrent mode
const EMPTY_MESSAGES: Message[] = [];
const EMPTY_TYPING_USERS: string[] = [];

export const useMessagesForChannel = (channelId: string | null) =>
  useChatStore((s) => (channelId ? s.messages[channelId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES));
export const useTypingUsersForChannel = (channelId: string | null) =>
  useChatStore((s) => (channelId ? s.typingUsers[channelId] ?? EMPTY_TYPING_USERS : EMPTY_TYPING_USERS));
export const useChannel = (id: string | null) => useChatStore((s) => s.channels.find((c) => c.id === id) ?? null);
export const useDM = (id: string | null) => useChatStore((s) => s.directMessages.find((d) => d.id === id) ?? null);
export const useUser = (id: string | null) => useChatStore((s) => (id ? s.users[id] : undefined));
export const useUsersMap = () => useChatStore((s) => s.users);
export const useChannels = () => useChatStore((s) => s.channels);
export const useDirectMessages = () => useChatStore((s) => s.directMessages);
export const useCallState = () => useChatStore((s) => s.callState);
export const useSearchModalOpen = () => useChatStore((s) => s.searchModalOpen);
export const CURRENT_USER = () => MOCK_USERS.find((u) => u.id === CURRENT_USER_ID)!;
