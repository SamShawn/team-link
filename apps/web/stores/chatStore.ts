import { create } from 'zustand';
import type { Channel, Message, User, PresenceStatus, DirectMessage } from '@teamlink/shared/types';

interface ChatState {
  // Active selections
  activeChannelId: string | null;
  activeDMId: string | null;

  // Data
  channels: Map<string, Channel>;
  directMessages: Map<string, DirectMessage>;
  messages: Map<string, Message[]>; // channelId/dmId -> messages
  users: Map<string, User>;
  presence: Map<string, PresenceStatus>;
  typingUsers: Map<string, string[]>; // channelId/dmId -> userIds

  // Current user
  currentUserId: string | null;

  // Actions
  setActiveChannel: (channelId: string | null) => void;
  setActiveDM: (dmId: string | null) => void;

  addChannel: (channel: Channel) => void;
  setChannels: (channels: Channel[]) => void;

  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  setMessages: (channelId: string, messages: Message[]) => void;

  addReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;

  setUser: (user: User) => void;
  setUsers: (users: User[]) => void;
  setPresence: (userId: string, status: PresenceStatus) => void;

  setTyping: (channelId: string | null, dmId: string | null, userId: string, isTyping: boolean) => void;

  setCurrentUser: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  activeChannelId: null,
  activeDMId: null,
  channels: new Map(),
  directMessages: new Map(),
  messages: new Map(),
  users: new Map(),
  presence: new Map(),
  typingUsers: new Map(),
  currentUserId: null,

  // Actions
  setActiveChannel: (channelId) => set({ activeChannelId: channelId, activeDMId: null }),
  setActiveDM: (dmId) => set({ activeDMId: dmId, activeChannelId: null }),

  addChannel: (channel) =>
    set((state) => {
      const newChannels = new Map(state.channels);
      newChannels.set(channel.id, channel);
      return { channels: newChannels };
    }),

  setChannels: (channels) =>
    set(() => {
      const channelMap = new Map<string, Channel>();
      channels.forEach((c) => channelMap.set(c.id, c));
      return { channels: channelMap };
    }),

  addMessage: (channelId, message) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const existing = newMessages.get(channelId) || [];
      newMessages.set(channelId, [...existing, message]);
      return { messages: newMessages };
    }),

  updateMessage: (channelId, messageId, updates) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const existing = newMessages.get(channelId) || [];
      newMessages.set(
        channelId,
        existing.map((m) => (m.id === messageId ? { ...m, ...updates } : m))
      );
      return { messages: newMessages };
    }),

  deleteMessage: (channelId, messageId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const existing = newMessages.get(channelId) || [];
      newMessages.set(
        channelId,
        existing.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
      );
      return { messages: newMessages };
    }),

  setMessages: (channelId, messages) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      newMessages.set(channelId, messages);
      return { messages: newMessages };
    }),

  addReaction: (channelId, messageId, emoji, userId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const existing = newMessages.get(channelId) || [];
      newMessages.set(
        channelId,
        existing.map((m) => {
          if (m.id !== messageId) return m;
          const existingReaction = m.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...m,
              reactions: m.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, userIds: [...r.userIds, userId], count: r.count + 1 }
                  : r
              ),
            };
          }
          return {
            ...m,
            reactions: [...m.reactions, { emoji, userIds: [userId], count: 1 }],
          };
        })
      );
      return { messages: newMessages };
    }),

  removeReaction: (channelId, messageId, emoji, userId) =>
    set((state) => {
      const newMessages = new Map(state.messages);
      const existing = newMessages.get(channelId) || [];
      newMessages.set(
        channelId,
        existing.map((m) => {
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
        })
      );
      return { messages: newMessages };
    }),

  setUser: (user) =>
    set((state) => {
      const newUsers = new Map(state.users);
      newUsers.set(user.id, user);
      return { users: newUsers };
    }),

  setUsers: (users) =>
    set(() => {
      const userMap = new Map<string, User>();
      users.forEach((u) => userMap.set(u.id, u));
      return { users: userMap };
    }),

  setPresence: (userId, status) =>
    set((state) => {
      const newPresence = new Map(state.presence);
      newPresence.set(userId, status);
      return { presence: newPresence };
    }),

  setTyping: (channelId, dmId, userId, isTyping) =>
    set((state) => {
      const key = channelId || dmId || '';
      const newTyping = new Map(state.typingUsers);
      const existing = newTyping.get(key) || [];
      if (isTyping && !existing.includes(userId)) {
        newTyping.set(key, [...existing, userId]);
      } else if (!isTyping) {
        newTyping.set(key, existing.filter((id) => id !== userId));
      }
      return { typingUsers: newTyping };
    }),

  setCurrentUser: (userId) => set({ currentUserId: userId }),
}));

// Selective hooks to prevent unnecessary re-renders
// Use these instead of useChatStore() for specific slices of state

export const useActiveChannelId = () => useChatStore((state) => state.activeChannelId);
export const useActiveDMId = () => useChatStore((state) => state.activeDMId);

export const useMessagesForChannel = (channelId: string | null | undefined) =>
  useChatStore((state) => (channelId ? state.messages.get(channelId) || [] : []));

export const useTypingUsersForChannel = (channelId: string | null | undefined) =>
  useChatStore((state) => (channelId ? state.typingUsers.get(channelId) || [] : []));

export const useChannel = (channelId: string | null | undefined) =>
  useChatStore((state) => (channelId ? state.channels.get(channelId) : undefined));

export const useUser = (userId: string | null | undefined) =>
  useChatStore((state) => (userId ? state.users.get(userId) : undefined));

export const useUsersMap = () => useChatStore((state) => state.users);
export const useChannelsMap = () => useChatStore((state) => state.channels);
export const usePresenceMap = () => useChatStore((state) => state.presence);
