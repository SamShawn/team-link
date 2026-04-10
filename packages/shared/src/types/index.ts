export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  status: PresenceStatus;
  customStatus?: string;
  timezone: string;
  locale: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  memberIds: string[];
  settings: Record<string, unknown>;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  visibility: 'public' | 'private' | 'shared';
  memberIds: string[];
  messageCount: number;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Message {
  id: string;
  channelId: string;
  threadId?: string;
  authorId: string;
  content: string;
  attachments: MessageAttachment[];
  mentions: string[];
  reactions: Reaction[];
  replyCount: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  lastMessageAt: string;
}
