import { User } from '@teamlink/shared/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'maya',
    displayName: 'Maya Chen',
    email: 'maya@teamlink.dev',
    avatarUrl: 'https://i.pravatar.cc/150?u=maya',
    status: 'online',
    customStatus: 'In a meeting',
    timezone: 'America/Los_Angeles',
    locale: 'en-US',
  },
  {
    id: 'user-2',
    username: 'alex',
    displayName: 'Alex Kim',
    email: 'alex@teamlink.dev',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    status: 'away',
    customStatus: undefined,
    timezone: 'America/New_York',
    locale: 'en-US',
  },
  {
    id: 'user-3',
    username: 'sam',
    displayName: 'Sam',
    email: 'sam@teamlink.dev',
    avatarUrl: 'https://i.pravatar.cc/150?u=sam',
    status: 'offline',
    customStatus: undefined,
    timezone: 'Europe/London',
    locale: 'en-GB',
  },
];

export const CURRENT_USER_ID = 'user-1';

import { Channel } from '@teamlink/shared/types';

export const MOCK_CHANNELS: Channel[] = [
  { id: 'ch-1', workspaceId: 'ws-1', name: 'general', visibility: 'public', memberIds: ['user-1', 'user-2', 'user-3'], messageCount: 47 },
  { id: 'ch-2', workspaceId: 'ws-1', name: 'design', visibility: 'public', memberIds: ['user-1', 'user-2'], messageCount: 23 },
  { id: 'ch-3', workspaceId: 'ws-1', name: 'engineering', visibility: 'public', memberIds: ['user-1', 'user-3'], messageCount: 31 },
];

import { DirectMessage } from '@teamlink/shared/types';

export const MOCK_DIRECT_MESSAGES: DirectMessage[] = [
  { id: 'dm-1', participants: ['user-1', 'user-2'], lastMessageAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'dm-2', participants: ['user-1', 'user-3'], lastMessageAt: new Date(Date.now() - 7200000).toISOString() },
];

import { Message, Reaction } from '@teamlink/shared/types';

const MINUTE = 60 * 1000;
const now = Date.now();

function makeMessage(
  id: string,
  channelId: string,
  authorId: string,
  content: string,
  offsetMinutes: number,
  reactions?: Reaction[],
  isEdited?: boolean
): Message {
  const ts = new Date(now - offsetMinutes * MINUTE).toISOString();
  return {
    id, channelId, authorId, content,
    attachments: [],
    mentions: [],
    reactions: reactions ?? [],
    replyCount: 0,
    isEdited: isEdited ?? false,
    isDeleted: false,
    createdAt: ts,
    updatedAt: ts,
  };
}

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'ch-1': [
    makeMessage('msg-1', 'ch-1', 'user-2', 'Good morning team! Ready for the design review?', 180),
    makeMessage('msg-2', 'ch-1', 'user-1', 'Morning! Yes, just reviewing the final deck now.', 175),
    makeMessage('msg-3', 'ch-1', 'user-3', "I'll be there in 5 — stuck in standup", 170),
    makeMessage('msg-4', 'ch-1', 'user-2', "No rush, we're waiting on Sam anyway 😅", 168),
    makeMessage('msg-5', 'ch-1', 'user-1', 'Hey team — design review moved to 4pm. Adding Sam to the invite.', 120, [
      { emoji: '👍', userIds: ['user-2'], count: 1 },
      { emoji: '❤️', userIds: ['user-3'], count: 1 },
    ]),
    makeMessage('msg-6', 'ch-1', 'user-3', 'Thanks for the heads up!', 118),
    makeMessage('msg-7', 'ch-1', 'user-2', 'Does that work for everyone?', 117),
    makeMessage('msg-8', 'ch-1', 'user-1', 'Works for me 👍', 116, [{ emoji: '👍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-9', 'ch-1', 'user-3', "Perfect, I'll wrap up by then", 115),
    makeMessage('msg-10', 'ch-1', 'user-2', "I'll share the Figma link before the meeting", 60),
    makeMessage('msg-11', 'ch-1', 'user-1', 'Should we prep a Loom walkthrough beforehand?', 45, [{ emoji: '🤔', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-12', 'ch-1', 'user-3', "That would be super helpful for async context", 44),
    makeMessage('msg-13', 'ch-1', 'user-2', "Agreed — I'll record one this afternoon", 43),
    makeMessage('msg-14', 'ch-1', 'user-1', "You're the best! 🚀", 42, [{ emoji: '🚀', userIds: ['user-2', 'user-3'], count: 2 }]),
    makeMessage('msg-15', 'ch-1', 'user-3', "Just pushed my component exports to the shared lib", 15, [{ emoji: '👏', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-16', 'ch-1', 'user-2', "Nice! I'll pull and test tonight", 12),
    makeMessage('msg-17', 'ch-1', 'user-1', 'Quick reminder: team retro is Friday at 3pm', 5),
  ],
  'ch-2': [
    makeMessage('msg-20', 'ch-2', 'user-1', 'Posted the new color palette to Figma — thoughts?', 300, [{ emoji: '😍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-21', 'ch-2', 'user-2', 'Love the peach tones! Very on-brand for the friendly direction', 295),
    makeMessage('msg-22', 'ch-2', 'user-2', 'The coral CTA is perfect contrast', 294),
    makeMessage('msg-23', 'ch-2', 'user-1', "I'm a bit worried about accessibility on the cream background", 200, [{ emoji: '👍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-24', 'ch-2', 'user-2', 'Checked with axe — it passes AA for normal text, just need to watch the placeholder text contrast', 195),
    makeMessage('msg-25', 'ch-2', 'user-1', 'Good call. I\'ll bump the secondary text slightly darker', 194),
    makeMessage('msg-26', 'ch-2', 'user-1', 'Updated! Also added the motion specs to the design page', 60, [{ emoji: '✨', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-27', 'ch-2', 'user-2', "This looks so polished. The spring easing on the panels is chef's kiss", 55),
  ],
  'ch-3': [
    makeMessage('msg-30', 'ch-3', 'user-3', 'PR #47 is ready for review — message virtualization', 400),
    makeMessage('msg-31', 'ch-3', 'user-1', "On it! I'll take a look after my 1:1", 395),
    makeMessage('msg-32', 'ch-3', 'user-3', 'Also found a nasty re-render issue with the typing indicator', 300),
    makeMessage('msg-33', 'ch-3', 'user-1', 'Selective hooks to the rescue?', 295),
    makeMessage('msg-34', 'ch-3', 'user-3', 'Exactly — wrapped the store slice usage properly. Massive improvement', 290, [{ emoji: '💡', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-35', 'ch-3', 'user-1', 'Nice work. The socket reconnection logic is solid too', 200),
    makeMessage('msg-36', 'ch-3', 'user-3', 'Yeah that was tricky — exponential backoff with jitter', 195),
    makeMessage('msg-37', 'ch-3', 'user-3', 'Hey, are we using DOMPurify for message content?', 100),
    makeMessage('msg-38', 'ch-3', 'user-1', 'Yes, on every message render. Why?', 99),
    makeMessage('msg-39', 'ch-3', 'user-3', "Just checking — someone on Hacker News mentioned XSS in similar apps. We're good 👍", 98, [{ emoji: '👍', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-40', 'ch-3', 'user-1', 'Security first! 🚀', 97),
    makeMessage('msg-41', 'ch-3', 'user-3', "Merging #47. Anyone else have open PRs?", 20),
    makeMessage('msg-42', 'ch-3', 'user-1', 'Nothing major — just the CSS refactor in a side branch', 15),
  ],
  'dm-1': [
    makeMessage('dm1-msg-1', 'dm-1', 'user-2', "Hey, did you see Maya's message about the design review?", 60),
    makeMessage('dm1-msg-2', 'dm-1', 'user-1', 'Yeah just saw it. 4pm works better for me honestly', 58),
    makeMessage('dm1-msg-3', 'dm-1', 'user-2', 'Same. I can finish the prototype by then', 55, [{ emoji: '💪', userIds: ['user-1'], count: 1 }]),
    makeMessage('dm1-msg-4', 'dm-1', 'user-1', "You're crushing it lately btw", 50),
    makeMessage('dm1-msg-5', 'dm-1', 'user-2', 'Stop it, you\'ll make me blush 😂', 48, [{ emoji: '😂', userIds: ['user-1'], count: 1 }]),
  ],
};
