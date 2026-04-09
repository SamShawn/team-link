import type { User, Workspace, Channel, Message, DirectMessage } from '@teamlink/shared/types';

// Current user
export const currentUser: User = {
  id: 'user-1',
  username: 'sarah.chen',
  displayName: 'Sarah Chen',
  email: 'sarah@teamlink.io',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  status: 'online',
  customStatus: null,
  statusEmoji: null,
  timezone: 'America/Los_Angeles',
  locale: 'en-US',
  workspaceIds: ['ws-1'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),
};

// Team members
export const users: User[] = [
  currentUser,
  {
    id: 'user-2',
    username: 'alex.rivera',
    displayName: 'Alex Rivera',
    email: 'alex@teamlink.io',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    status: 'online',
    customStatus: null,
    statusEmoji: null,
    timezone: 'America/New_York',
    locale: 'en-US',
    workspaceIds: ['ws-1'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'user-3',
    username: 'maya.patel',
    displayName: 'Maya Patel',
    email: 'maya@teamlink.io',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    status: 'away',
    customStatus: null,
    statusEmoji: null,
    timezone: 'Europe/London',
    locale: 'en-GB',
    workspaceIds: ['ws-1'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'user-4',
    username: 'james.wilson',
    displayName: 'James Wilson',
    email: 'james@teamlink.io',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    customStatus: 'In a meeting',
    statusEmoji: null,
    timezone: 'America/Chicago',
    locale: 'en-US',
    workspaceIds: ['ws-1'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'user-5',
    username: 'emily.tokuda',
    displayName: 'Emily Tokuda',
    email: 'emily@teamlink.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    status: 'offline',
    customStatus: null,
    statusEmoji: null,
    timezone: 'Asia/Tokyo',
    locale: 'ja-JP',
    workspaceIds: ['ws-1'],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

// Workspace
export const workspace: Workspace = {
  id: 'ws-1',
  name: 'Acme Corp',
  slug: 'acme',
  avatarUrl: null,
  ownerId: 'user-1',
  memberIds: users.map((u) => u.id),
  settings: {
    defaultChannelVisibility: 'public',
    allowGuestAccounts: false,
    enforceMFA: true,
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.gif'],
    maxFileSize: 25 * 1024 * 1024,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),
};

// Channels
export const channels: Channel[] = [
  {
    id: 'ch-1',
    workspaceId: 'ws-1',
    name: 'general',
    description: 'Company-wide announcements and updates',
    visibility: 'public',
    topic: 'Welcome to TeamLink!',
    memberIds: users.map((u) => u.id),
    messageCount: 142,
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000),
    isArchived: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'ch-2',
    workspaceId: 'ws-1',
    name: 'engineering',
    description: 'Engineering team discussions',
    visibility: 'public',
    topic: 'Code reviews and technical discussions',
    memberIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    messageCount: 89,
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000),
    isArchived: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'ch-3',
    workspaceId: 'ws-1',
    name: 'design',
    description: 'Design team collaboration',
    visibility: 'public',
    topic: 'UI/UX discussions and feedback',
    memberIds: ['user-1', 'user-3', 'user-5'],
    messageCount: 56,
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
    isArchived: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'ch-4',
    workspaceId: 'ws-1',
    name: 'random',
    description: 'Non-work banter',
    visibility: 'public',
    topic: null,
    memberIds: users.map((u) => u.id),
    messageCount: 234,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
    isArchived: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'ch-5',
    workspaceId: 'ws-1',
    name: 'leadership',
    description: 'Leadership team only',
    visibility: 'private',
    topic: 'Strategic discussions',
    memberIds: ['user-1', 'user-2'],
    messageCount: 23,
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000),
    isArchived: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

// Messages for #general
export const generalMessages: Message[] = [
  {
    id: 'msg-1',
    channelId: 'ch-1',
    threadId: null,
    authorId: 'user-2',
    content: 'Good morning everyone! Just pushed the new dashboard feature to staging. Would love some feedback before we ship.',
    attachments: [],
    mentions: [],
    reactions: [{ emoji: '👍', userIds: ['user-1', 'user-3'], count: 2 }],
    replyCount: 3,
    replyAuthors: ['user-1', 'user-3', 'user-4'],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'msg-2',
    channelId: 'ch-1',
    threadId: null,
    authorId: 'user-1',
    content: "Looks great Alex! I noticed the loading states could use a skeleton animation instead of the spinner. What do you think?",
    attachments: [],
    mentions: [],
    reactions: [],
    replyCount: 0,
    replyAuthors: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 'msg-3',
    channelId: 'ch-1',
    threadId: null,
    authorId: 'user-3',
    content: "I can take a look at the design review today. The new color scheme is working well! 🎨",
    attachments: [],
    mentions: [],
    reactions: [{ emoji: '❤️', userIds: ['user-2'], count: 1 }],
    replyCount: 1,
    replyAuthors: ['user-2'],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'msg-4',
    channelId: 'ch-1',
    threadId: null,
    authorId: 'user-4',
    content: "Quick reminder: All-hands meeting tomorrow at 2pm PT. Link is in the calendar invite. See you there!",
    attachments: [],
    mentions: [],
    reactions: [{ emoji: '🎉', userIds: ['user-1', 'user-2', 'user-3'], count: 3 }],
    replyCount: 0,
    replyAuthors: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'msg-5',
    channelId: 'ch-1',
    threadId: null,
    authorId: 'user-2',
    content: "Thanks for the feedback @Sarah Chen! I'll add the skeleton loading states. Maya, would you be able to share the specs for the animation timing?",
    attachments: [],
    mentions: [{ userId: 'user-1', type: 'user', offset: 22, length: 10 }],
    reactions: [],
    replyCount: 2,
    replyAuthors: ['user-1'],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
];

// Messages for #engineering
export const engineeringMessages: Message[] = [
  {
    id: 'msg-e1',
    channelId: 'ch-2',
    threadId: null,
    authorId: 'user-2',
    content: 'Has anyone tried the new React Server Components setup? I\'m seeing some interesting performance improvements.',
    attachments: [],
    mentions: [],
    reactions: [{ emoji: '😮', userIds: ['user-1'], count: 1 }],
    replyCount: 5,
    replyAuthors: ['user-1', 'user-3'],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'msg-e2',
    channelId: 'ch-2',
    threadId: null,
    authorId: 'user-1',
    content: "Yeah! We migrated the message list component last week. Initial bundle size dropped by 40%. Worth looking into for the composer too.",
    attachments: [],
    mentions: [],
    reactions: [{ emoji: '🔥', userIds: ['user-2', 'user-3'], count: 2 }],
    replyCount: 0,
    replyAuthors: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 90 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 60 * 1000),
  },
];

// Direct messages
export const directMessages: DirectMessage[] = [
  {
    id: 'dm-1',
    participants: ['user-1', 'user-2'],
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'dm-2',
    participants: ['user-1', 'user-3'],
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000),
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-12-01'),
  },
];

// DM messages for dm-1
export const dm1Messages: Message[] = [
  {
    id: 'dm-msg-1',
    channelId: 'dm-1',
    threadId: null,
    authorId: 'user-2',
    content: 'Hey Sarah, do you have a few minutes to review the auth refactor?',
    attachments: [],
    mentions: [],
    reactions: [],
    replyCount: 0,
    replyAuthors: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'dm-msg-2',
    channelId: 'dm-1',
    threadId: null,
    authorId: 'user-1',
    content: "Sure! Let me take a look now. Standing by 📚",
    attachments: [],
    mentions: [],
    reactions: [],
    replyCount: 0,
    replyAuthors: [],
    isEdited: false,
    editedAt: null,
    isDeleted: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000),
  },
];

// Helper to get user by ID
export const getUserById = (id: string): User | undefined => users.find((u) => u.id === id);

// Helper to get channel by ID
export const getChannelById = (id: string): Channel | undefined => channels.find((c) => c.id === id);

// Helper to group messages by author and time
export const groupMessages = (messages: Message[]): { author: User; messages: Message[]; timestamp: Date }[] => {
  const groups: { author: User; messages: Message[]; timestamp: Date }[] = [];
  const FIVE_MINUTES = 5 * 60 * 1000;

  messages.forEach((message) => {
    const author = getUserById(message.authorId);
    if (!author) return;

    const lastGroup = groups[groups.length - 1];
    const isWithinFiveMinutes = lastGroup &&
      lastGroup.author.id === author.id &&
      new Date(message.createdAt).getTime() - new Date(lastGroup.timestamp).getTime() < FIVE_MINUTES;

    if (isWithinFiveMinutes) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ author, messages: [message], timestamp: new Date(message.createdAt) });
    }
  });

  return groups;
};
