// ============================================================
// User & Presence
// ============================================================

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  status: PresenceStatus;
  customStatus: string | null;
  statusEmoji: string | null;
  timezone: string;
  locale: string;
  workspaceIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Workspace
// ============================================================

export interface WorkspaceSettings {
  defaultChannelVisibility: 'public' | 'private';
  allowGuestAccounts: boolean;
  enforceMFA: boolean;
  allowedFileTypes: string[];
  maxFileSize: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  ownerId: string;
  memberIds: string[];
  settings: WorkspaceSettings;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Channels
// ============================================================

export type ChannelVisibility = 'public' | 'private' | 'shared';

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  visibility: ChannelVisibility;
  topic: string | null;
  memberIds: string[];
  messageCount: number;
  lastMessageAt: Date | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ChannelRole = 'owner' | 'admin' | 'member';
export type NotificationPreference = 'all' | 'mentions' | 'nothing';

export interface ChannelMember {
  channelId: string;
  userId: string;
  role: ChannelRole;
  notifications: NotificationPreference;
  lastReadAt: Date;
  unreadCount: number;
}

// ============================================================
// Messages
// ============================================================

export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
}

export type MentionType = 'user' | 'channel' | 'here';

export interface Mention {
  userId: string | null;
  type: MentionType;
  offset: number;
  length: number;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface Message {
  id: string;
  channelId: string;
  threadId: string | null;
  authorId: string;
  content: string;
  attachments: Attachment[];
  mentions: Mention[];
  reactions: Reaction[];
  replyCount: number;
  replyAuthors: string[];
  isEdited: boolean;
  editedAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageGroup {
  id: string;
  author: User;
  messages: Message[];
  timestamp: Date;
}

// ============================================================
// Direct Messages
// ============================================================

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DirectMessageThread {
  id: string;
  dmId: string;
  messages: Message[];
  participantIds: string[];
  lastReadAt: Record<string, Date>;
}

// ============================================================
// Typing & Presence
// ============================================================

export interface TypingIndicator {
  channelId: string | null;
  dmId: string | null;
  userId: string;
  timestamp: Date;
}

// ============================================================
// API Responses
// ============================================================

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
}

export interface APIResponse<T> {
  data: T;
  error?: APIError;
}
