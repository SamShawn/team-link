# TeamLink Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portfolio-grade real-time team messaging app with the Warm Peach & Cream design system — soft & friendly aesthetic, expressive spring animations, classic sidebar-left layout, side-panel threads, and split-view video call UI.

**Architecture:** Next.js 15 (App Router) with CSS Modules + CSS custom properties for design tokens. Zustand 5 for state management. Socket.io-client ready for real-time. Framer Motion for animations. @tanstack/react-virtual for message virtualization. Mock data throughout — no backend required.

**Tech Stack:** Next.js 15, TypeScript 5.7, Zustand 5, Framer Motion 11, @tanstack/react-virtual 3, Socket.io-client 4, Lucide React, date-fns 4, DOMPurify, uuid v13, Turborepo 2

---

## File Structure

```
apps/web/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, global CSS, providers
│   ├── page.tsx                      # Main chat page composition
│   └── globals.css                   # Design tokens as CSS custom properties
├── components/
│   ├── chat/
│   │   ├── MessageBubble.tsx         # Single message with hover actions
│   │   ├── MessageList.tsx          # Virtualized message list with date separators
│   │   ├── Composer.tsx             # Message input with emoji + file support
│   │   ├── TypingIndicator.tsx      # Animated typing dots
│   │   └── ReactionPicker.tsx       # Floating emoji picker grid
│   ├── sidebar/
│   │   ├── WorkspaceSidebar.tsx      # Left-most: workspace switcher + user profile
│   │   ├── ChannelSidebar.tsx        # Channels list with # prefix + unread badges
│   │   └── DMSidebar.tsx            # DMs list with avatars + presence dots
│   ├── thread/
│   │   └── ThreadPanel.tsx           # 380px slide-in panel from right
│   ├── call/
│   │   ├── CallPanel.tsx             # Split-view 40% call panel
│   │   ├── IncomingCallOverlay.tsx   # Full-screen incoming call UI
│   │   └── CallControls.tsx          # Mute/video/share/end control bar
│   ├── search/
│   │   └── SearchModal.tsx           # Cmd+K modal with tab filtering
│   └── ui/
│       ├── Button.tsx                # Button with primary/secondary/ghost/danger variants
│       ├── Avatar.tsx                # Avatar with presence dot
│       ├── Badge.tsx                 # Unread count badge
│       ├── Modal.tsx                 # Animated modal with backdrop blur
│       └── Toast.tsx                 # Ephemeral notification toast
├── hooks/
│   ├── useSocket.ts                  # Socket.io client hook
│   ├── useMessages.ts                # Message CRUD operations
│   └── useKeyboardShortcuts.ts       # Global keyboard shortcuts
├── stores/
│   └── chatStore.ts                  # Zustand store: channels, DMs, messages, presence
└── lib/
    ├── apiClient.ts                   # REST API client (wired to mock for now)
    └── mockData.ts                   # Seeded mock: 3 users, 3 channels, 2 DMs, ~60 messages

packages/shared/
├── types/
│   └── index.ts                      # User, Channel, Message, DirectMessage, Reaction
└── constants/
    └── designTokens.ts               # Color/spacing/motion token constants (TS)
```

---

## Phase 1: Foundation — Design System & Types

### Task 1: Project Setup & Design Tokens

**Files:**
- Modify: `apps/web/app/globals.css` — replace existing CSS with design tokens
- Modify: `packages/shared/constants/designTokens.ts` — TS token constants
- Create: `packages/shared/types/index.ts` — shared type definitions

- [ ] **Step 1: Write globals.css with design tokens**

Replace the existing `globals.css` content with:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

:root {
  /* Colors */
  --color-background: #FFF5F0;
  --color-surface: #FFEEE6;
  --color-surface-hover: #FFE4D6;
  --color-surface-active: #FFD4C4;
  --color-primary: #FF9B7A;
  --color-primary-hover: #FF7A5A;
  --color-cta: #C75D3A;
  --color-cta-hover: #A84A2E;
  --color-text-primary: #6B4F4F;
  --color-text-secondary: #8A7A7A;
  --color-text-inverse: #FFF5F0;
  --color-success: #7AB89A;
  --color-warning: #E8C87A;
  --color-error: #D47A7A;
  --color-border: #F0D8CC;
  --color-border-strong: #E0C8BC;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Sidebar widths */
  --sidebar-workspace: 260px;
  --sidebar-channel: 220px;
  --sidebar-thread: 380px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(107, 79, 79, 0.08);
  --shadow-md: 0 4px 12px rgba(107, 79, 79, 0.1);
  --shadow-lg: 0 8px 24px rgba(107, 79, 79, 0.12);
  --shadow-panel: -4px 0 20px rgba(107, 79, 79, 0.08);

  /* Typography */
  --font-family: 'DM Sans', system-ui, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-base: 15px;
  --font-size-lg: 17px;
  --font-size-xl: 18px;
  --font-size-2xl: 24px;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.3;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.6;

  /* Transitions */
  --transition-fast: 120ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;

  /* Avatar sizes */
  --avatar-xs: 20px;
  --avatar-sm: 24px;
  --avatar-md: 32px;
  --avatar-lg: 40px;
  --avatar-xl: 64px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100vh;
}

::selection {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-strong);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

input, textarea {
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 2: Write shared types**

Create `packages/shared/types/index.ts`:

```typescript
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
```

- [ ] **Step 3: Write design token constants**

Create `packages/shared/constants/designTokens.ts`:

```typescript
export const COLORS = {
  background: '#FFF5F0',
  surface: '#FFEEE6',
  surfaceHover: '#FFE4D6',
  surfaceActive: '#FFD4C4',
  primary: '#FF9B7A',
  primaryHover: '#FF7A5A',
  cta: '#C75D3A',
  ctaHover: '#A84A2E',
  textPrimary: '#6B4F4F',
  textSecondary: '#8A7A7A',
  textInverse: '#FFF5F0',
  success: '#7AB89A',
  warning: '#E8C87A',
  error: '#D47A7A',
  border: '#F0D8CC',
  borderStrong: '#E0C8BC',
} as const;

export const SPACING = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

export const SIDEBAR_WIDTHS = {
  workspace: 260,
  channel: 220,
  thread: 380,
} as const;

export const TYPOGRAPHY = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  sizes: {
    xs: '12px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '18px',
    '2xl': '24px',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const MOTION = {
  fast: '120ms',
  base: '200ms',
  slow: '300ms',
  spring: {
    panel: { type: 'spring' as const, stiffness: 300, damping: 30 },
    message: { type: 'spring' as const, stiffness: 300, damping: 30 },
    reaction: { type: 'spring' as const, stiffness: 400, damping: 20 },
    modal: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
} as const;

export const AVATAR_SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/globals.css packages/shared/types/index.ts packages/shared/constants/designTokens.ts
git commit -m "$(cat <<'EOF'
feat: establish design system foundation

- CSS custom properties for Warm Peach & Cream tokens
- Shared TypeScript types (User, Channel, Message, etc.)
- Design token constants

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Mock Data & Zustand Store

**Files:**
- Create: `apps/web/lib/mockData.ts` — seeded mock users, channels, DMs, messages
- Modify: `apps/web/stores/chatStore.ts` — extend with full state and actions

- [ ] **Step 1: Write mock data**

Create `apps/web/lib/mockData.ts`. Include 3 users (Maya Chen, Alex Kim, Sam), 3 channels (#general, #design, #engineering), 2 DMs, and 15-20 messages per channel with varied authors, timestamps spread across today/yesterday, reactions on some messages, and a few edited messages.

```typescript
import { User, Channel, Message, DirectMessage } from '@teamlink/shared/types';

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

export const MOCK_CHANNELS: Channel[] = [
  { id: 'ch-1', workspaceId: 'ws-1', name: 'general', visibility: 'public', memberIds: ['user-1', 'user-2', 'user-3'], messageCount: 47 },
  { id: 'ch-2', workspaceId: 'ws-1', name: 'design', visibility: 'public', memberIds: ['user-1', 'user-2'], messageCount: 23 },
  { id: 'ch-3', workspaceId: 'ws-1', name: 'engineering', visibility: 'public', memberIds: ['user-1', 'user-3'], messageCount: 31 },
];

export const MOCK_DIRECT_MESSAGES: DirectMessage[] = [
  { id: 'dm-1', participants: ['user-1', 'user-2'], lastMessageAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'dm-2', participants: ['user-1', 'user-3'], lastMessageAt: new Date(Date.now() - 7200000).toISOString() },
];

// Generate messages with date-fns for realistic timestamps
const now = Date.now();
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

function makeMessage(id: string, channelId: string, authorId: string, content: string, offsetMinutes: number, reactions?: Reaction[], isEdited?: boolean): Message {
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
    makeMessage('msg-3', 'ch-1', 'user-3', 'I'll be there in 5 — stuck in standup', 170),
    makeMessage('msg-4', 'ch-1', 'user-2', 'No rush, we\'re waiting on Sam anyway 😅', 168),
    makeMessage('msg-5', 'ch-1', 'user-1', 'Hey team — design review moved to 4pm. Adding Sam to the invite.', 120, [
      { emoji: '👍', userIds: ['user-2'], count: 1 },
      { emoji: '❤️', userIds: ['user-3'], count: 1 },
    ]),
    makeMessage('msg-6', 'ch-1', 'user-3', 'Thanks for the heads up!', 118),
    makeMessage('msg-7', 'ch-1', 'user-2', 'Does that work for everyone?', 117),
    makeMessage('msg-8', 'ch-1', 'user-1', 'Works for me 👍', 116, [{ emoji: '👍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-9', 'ch-1', 'user-3', 'Perfect, I\'ll wrap up by then', 115),
    makeMessage('msg-10', 'ch-1', 'user-2', 'Great! I\'ll share the Figma link before the meeting', 60),
    makeMessage('msg-11', 'ch-1', 'user-1', 'Should we prep a Loom walkthrough beforehand?', 45, [{ emoji: '🤔', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-12', 'ch-1', 'user-3', 'That would be super helpful for async context', 44),
    makeMessage('msg-13', 'ch-1', 'user-2', 'Agreed — I\'ll record one this afternoon', 43),
    makeMessage('msg-14', 'ch-1', 'user-1', 'You\'re the best! 🚀', 42, [{ emoji: '🚀', userIds: ['user-2', 'user-3'], count: 2 }]),
    makeMessage('msg-15', 'ch-1', 'user-3', 'Just pushed my component exports to the shared lib', 15, [{ emoji: '👏', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-16', 'ch-1', 'user-2', 'Nice! I\'ll pull and test tonight', 12),
    makeMessage('msg-17', 'ch-1', 'user-1', 'Quick reminder: team retro is Friday at 3pm', 5),
  ],
  'ch-2': [
    makeMessage('msg-20', 'ch-2', 'user-1', 'Posted the new color palette to Figma — thoughts?', 300, [{ emoji: '😍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-21', 'ch-2', 'user-2', 'Love the peach tones! Very on-brand for the friendly direction', 295),
    makeMessage('msg-22', 'ch-2', 'user-2', 'The coral CTA is perfect contrast', 294),
    makeMessage('msg-23', 'ch-2', 'user-1', 'I\'m a bit worried about accessibility on the cream background', 200, [{ emoji: '👍', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-24', 'ch-2', 'user-2', 'Checked with axe — it passes AA for normal text, just need to watch the placeholder text contrast', 195),
    makeMessage('msg-25', 'ch-2', 'user-1', 'Good call. I\'ll bump the secondary text slightly darker', 194),
    makeMessage('msg-26', 'ch-2', 'user-1', 'Updated! Also added the motion specs to the design page', 60, [{ emoji: '✨', userIds: ['user-2'], count: 1 }]),
    makeMessage('msg-27', 'ch-2', 'user-2', 'This looks so polished. The spring easing on the panels is chef\'s kiss', 55),
  ],
  'ch-3': [
    makeMessage('msg-30', 'ch-3', 'user-3', 'PR #47 is ready for review — message virtualization', 400),
    makeMessage('msg-31', 'ch-3', 'user-1', 'On it! I\'ll take a look after my 1:1', 395),
    makeMessage('msg-32', 'ch-3', 'user-3', 'Thanks. Also found a nasty re-render issue with the typing indicator', 300),
    makeMessage('msg-33', 'ch-3', 'user-1', 'Selective hooks to the rescue?', 295),
    makeMessage('msg-34', 'ch-3', 'user-3', 'Exactly — wrapped the store slice usage properly. Massive improvement', 290, [{ emoji: '💡', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-35', 'ch-3', 'user-1', 'Nice work. The socket reconnection logic is solid too', 200),
    makeMessage('msg-36', 'ch-3', 'user-3', 'Yeah that was tricky — exponential backoff with jitter', 195),
    makeMessage('msg-37', 'ch-3', 'user-3', 'Hey, are we using DOMPurify for message content?', 100),
    makeMessage('msg-38', 'ch-3', 'user-1', 'Yes, on every message render. Why?', 99),
    makeMessage('msg-39', 'ch-3', 'user-3', 'Just checking — someone on Hacker News mentioned XSS in similar apps. We\'re good 👍', 98, [{ emoji: '👍', userIds: ['user-1'], count: 1 }]),
    makeMessage('msg-40', 'ch-3', 'user-1', 'Security first! 🚀', 97),
    makeMessage('msg-41', 'ch-3', 'user-3', 'Merging #47. Anyone else have open PRs?', 20),
    makeMessage('msg-42', 'ch-3', 'user-1', 'Nothing major — just the CSS refactor in a side branch', 15),
  ],
  'dm-1': [
    makeMessage('dm1-msg-1', 'dm-1', 'user-2', 'Hey, did you see Maya\'s message about the design review?', 60),
    makeMessage('dm1-msg-2', 'dm-1', 'user-1', 'Yeah just saw it. 4pm works better for me honestly', 58),
    makeMessage('dm1-msg-3', 'dm-1', 'user-2', 'Same. I can finish the prototype by then', 55, [{ emoji: '💪', userIds: ['user-1'], count: 1 }]),
    makeMessage('dm1-msg-4', 'dm-1', 'user-1', 'You\'re crushing it lately btw', 50),
    makeMessage('dm1-msg-5', 'dm-1', 'user-2', 'Stop it, you\'ll make me blush 😂', 48, [{ emoji: '😂', userIds: ['user-1'], count: 1 }]),
  ],
};
```

- [ ] **Step 2: Write Zustand store**

Replace `apps/web/stores/chatStore.ts`. The store manages: `channels`, `directMessages`, `messages` (Map<channelId, Message[]>), `users` (Map<userId, User>), `activeChannelId`, `activeDMId`, `presence` Map, `typingUsers` Map, `threadParentId`, `callState`, and actions: `setActiveChannel`, `setActiveDM`, `addMessage`, `editMessage`, `deleteMessage`, `addReaction`, `removeReaction`, `openThread`, `closeThread`, `setTypingUser`, `startCall`, `endCall`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/mockData.ts apps/web/stores/chatStore.ts
git commit -m "$(cat <<'EOF'
feat: add mock data and Zustand store

- 3 users, 3 channels, 2 DMs, ~60 total messages
- Full Zustand store with messages, channels, presence, typing, thread state

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Base UI Components

**Files:**
- Create: `apps/web/components/ui/Button.tsx` + `Button.module.css`
- Create: `apps/web/components/ui/Avatar.tsx` + `Avatar.module.css`
- Create: `apps/web/components/ui/Badge.tsx` + `Badge.module.css`
- Create: `apps/web/components/ui/Modal.tsx` + `Modal.module.css`
- Create: `apps/web/components/ui/Toast.tsx` + `Toast.module.css`

- [ ] **Step 1: Write Button component**

Button has variants: `primary` (cta bg), `secondary` (surface bg + border), `ghost` (transparent), `danger` (error bg). Sizes: `sm`, `md`, `lg`. States: default, hover, active (scale 0.97), disabled (50% opacity). Use CSS Modules.

- [ ] **Step 2: Write Avatar component**

Avatar shows an image or initials fallback. Sizes: xs(20), sm(24), md(32), lg(40), xl(64). Has an optional presence dot (bottom-right, 10px) using status colors from tokens. Uses `border-radius: 50%`.

- [ ] **Step 3: Write Badge component**

Small coral (`primary`) pill with white text. Shows count (up to "99+"). Used for unread message counts in sidebar.

- [ ] **Step 4: Write Modal component**

Framer Motion animated modal. Props: `isOpen`, `onClose`, `children`. Animates: scale 0.95→1 + opacity 0→1, 300ms spring. Has `backdrop-blur(8px)` overlay. Closes on Escape key or backdrop click. Renders `children` inside a centered card with `surface` background and `radius-xl` border radius.

- [ ] **Step 5: Write Toast component**

Ephemeral notification. Props: `message`, `type` (success/error/info), `onDismiss`. Auto-dismisses after 4s with progress bar. Slides in from bottom-right, 300ms spring.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/ui/
git commit -m "$(cat <<'EOF'
feat: add base UI components

- Button with primary/secondary/ghost/danger variants
- Avatar with presence dot and size variants
- Badge for unread counts
- Modal with spring animation and backdrop blur
- Toast with auto-dismiss

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Layout & Navigation

### Task 4: Sidebar Components

**Files:**
- Create: `apps/web/components/sidebar/WorkspaceSidebar.tsx` + CSS Module
- Create: `apps/web/components/sidebar/ChannelSidebar.tsx` + CSS Module
- Create: `apps/web/components/sidebar/DMSidebar.tsx` + CSS Module
- Create: `apps/web/components/sidebar/Sidebar.module.css` (shared styles)

- [ ] **Step 1: Write WorkspaceSidebar**

260px wide, `surface` background. Top: workspace name ("TeamLink") with a dropdown chevron. Middle sections: Channels (links to ChannelSidebar) and DMs (links to DMSidebar). Bottom: current user avatar + name + status indicator, settings gear icon. Collapses to icon-only on mobile.

- [ ] **Step 2: Write ChannelSidebar**

220px wide, sits to the right of WorkspaceSidebar. Shows channel list with `#` prefix in `text-secondary`, name in `text-primary`. Active: `surface-active` bg + 3px `primary` left border. Unread: bold name + Badge with count. Sections are collapsible (Channels, Direct Messages). Chevron rotates on collapse. Hover: `surface-hover` bg, 120ms transition.

- [ ] **Step 3: Write DMSidebar**

Same width as ChannelSidebar. DM items show Avatar (24px) + display name + presence dot. Active/hover same as channels.

- [ ] **Step 4: Write main layout in page.tsx**

Assemble the three-column layout: `WorkspaceSidebar | ChannelSidebar/DMSidebar | MessageArea`. Both sidebars are fixed-width, message area is `flex: 1`. On mobile (<768px): show only one sidebar at a time via hamburger toggle.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/sidebar/ apps/web/app/page.tsx
git commit -m "$(cat <<'EOF'
feat: add sidebar navigation components

- WorkspaceSidebar: workspace name, user profile
- ChannelSidebar: collapsible channel list with unread badges
- DMSidebar: DM list with presence dots
- Responsive: hamburger menu on mobile

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Messaging Core

### Task 5: Message Bubble & Message List

**Files:**
- Create: `apps/web/components/chat/MessageBubble.tsx` + CSS Module
- Create: `apps/web/components/chat/MessageList.tsx` + CSS Module

- [ ] **Step 1: Write MessageBubble component**

MessageBubble shows: avatar + name + timestamp (first in group only), message content, hover action bar.

States:
- Default others: `surface` bg, 16px radius
- Default own: `surface-active` bg
- Hover: action bar fades in (120ms) with Reply, React, Edit (own), Delete (own)
- Editing: content becomes textarea, Save/Cancel controls appear
- Deleted: italic "This message was deleted" in `text-secondary`
- With reactions: row of reaction pills below content

Reactions display: emoji + count in small pills. Own reacted pills have `surface-hover` bg. Click own reaction to remove.

Use Framer Motion for:
- Message appear: `y: 10→0, opacity: 0→1`, 250ms spring
- Reaction pop: `scale: 0→1.2→1`, 200ms spring
- Action bar: `opacity: 0→1`, 120ms

- [ ] **Step 2: Write MessageList component**

Use `@tanstack/react-virtual` for virtualization. `useVirtualizer` with `estimateSize` returning ~80px per message (adjusts dynamically). Container is `flex: 1`, `overflow-y: auto`.

Features:
- Date separators: "Today", "Yesterday", or formatted date between message groups when day changes
- Message grouping: consecutive messages from same author within 5 minutes share avatar/name header
- Auto-scroll to bottom when `isAtBottom` (within 100px)
- "↓ New messages" floating button appears when scrolled up and new messages arrive
- Click "↓ New messages" scrolls to bottom

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/chat/MessageBubble.tsx apps/web/components/chat/MessageList.tsx
git commit -m "$(cat <<'EOF'
feat: add message bubble and virtualized message list

- MessageBubble: grouped messages, hover actions, reactions, inline edit
- MessageList: @tanstack/react-virtual, date separators, auto-scroll
- Spring animations for message appear and reaction pop

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Composer & ReactionPicker

**Files:**
- Create: `apps/web/components/chat/Composer.tsx` + CSS Module
- Create: `apps/web/components/chat/ReactionPicker.tsx` + CSS Module
- Create: `apps/web/components/chat/TypingIndicator.tsx` + CSS Module

- [ ] **Step 1: Write Composer**

Sticky at bottom of message area. Textarea auto-expands up to 6 lines (then scrolls). Left: expand handle icon (decorative). Right: emoji button, attachment button, send button (coral, only enabled when content exists). Enter sends, Shift+Enter = newline.

File attachment: clicking 📎 opens file input. Selected files appear as chips above textarea: file icon + truncated name + size + X to remove.

Emoji picker: clicking 😊 opens `ReactionPicker` floating above the composer.

When thread is open: composer shows "Reply in thread..." and is disabled.

Typing indicator: below composer, use `TypingIndicator` component.

- [ ] **Step 2: Write ReactionPicker**

Floating panel, 6-column emoji grid (common emojis: 👍 ❤️ 😂 🎉 🚀 👀 + more). Recently used reactions shown first (stored in localStorage). "Search emojis" text input at bottom.

Animation: scale 0→1 with spring overshoot (200ms). Closes on Escape or click outside.

- [ ] **Step 3: Write TypingIndicator**

Shows "Maya is typing..." / "Maya and Alex are typing..." with animated bouncing dots (3 dots, staggered bounce, 400ms loop). Reads from `typingUsers` in store.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/chat/Composer.tsx apps/web/components/chat/ReactionPicker.tsx apps/web/components/chat/TypingIndicator.tsx
git commit -m "$(cat <<'EOF'
feat: add composer, reaction picker, and typing indicator

- Composer: auto-expand textarea, file chips, emoji picker trigger
- ReactionPicker: floating emoji grid with spring animation
- TypingIndicator: animated dots with staggered bounce

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Thread Panel

**Files:**
- Create: `apps/web/components/thread/ThreadPanel.tsx` + CSS Module

- [ ] **Step 1: Write ThreadPanel**

380px wide, fixed height, `surface` bg, `shadow-panel` on left edge. Slides in from right edge using Framer Motion: `x: 380→0`, 300ms spring.

Header: "Thread in #general" title + X close button.

Parent message: full `MessageBubble` displayed at top (read-only, no hover actions).

Reply list: scrollable list of `MessageBubble` components (not virtualized, thread replies are few).

Reply composer: sticky at bottom, same as main `Composer` but with thread context.

Backdrop: semi-transparent overlay (`rgba(107, 79, 79, 0.15)`) on message area behind panel. Clicking backdrop closes thread.

Close triggers: X button, Escape key, backdrop click.

- [ ] **Step 2: Wire into page.tsx**

Thread panel renders conditionally when `threadParentId` is set in store. Use `AnimatePresence` from Framer Motion for enter/exit animation.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/thread/ThreadPanel.tsx
git commit -m "$(cat <<'EOF'
feat: add thread panel with slide-in animation

- 380px slide-in panel with spring physics
- Parent message at top, scrollable replies
- Reply composer with thread context
- Backdrop dim on message area, closes on X/Escape/backdrop click

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Features

### Task 8: Search Modal (Cmd+K)

**Files:**
- Create: `apps/web/components/search/SearchModal.tsx` + CSS Module

- [ ] **Step 1: Write SearchModal**

Triggered by Cmd+K / Ctrl+K. Framer Motion modal: scale 0.95→1 + fade, 200ms.

Layout: centered 600px max-width card. Large search input at top (auto-focused on open). Tab bar below: All / Messages / Channels / Files / People.

Results: live search as you type (debounce 200ms). Results list shows icon + title + snippet + metadata per result. Keyboard navigation: Arrow Up/Down to move selection, Enter to "open" (just closes modal with a console.log for now), Escape to close.

Empty state per tab: warm illustrated SVG + encouraging copy ("No messages found — maybe start the conversation?").

Recent searches shown before typing (stored in localStorage).

- [ ] **Step 2: Wire keyboard shortcut**

Add `useEffect` in `page.tsx` that listens for Cmd+K / Ctrl+K and toggles modal open state. Also listens for Escape.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/search/SearchModal.tsx
git commit -m "$(cat <<'EOF'
feat: add Cmd+K search modal with tab filtering

- Spring animated modal with backdrop blur
- Live search with 200ms debounce, keyboard navigation
- Tab filtering: All, Messages, Channels, Files, People
- Recent searches in localStorage

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Video Call UI

**Files:**
- Create: `apps/web/components/call/IncomingCallOverlay.tsx` + CSS Module
- Create: `apps/web/components/call/CallPanel.tsx` + CSS Module
- Create: `apps/web/components/call/CallControls.tsx` + CSS Module

- [ ] **Step 1: Write CallControls**

Row of 4 circular buttons (48px): Mute (mic icon), Video (camera icon), Screen Share (monitor icon), End Call (phone-down icon, red `error` bg). Buttons have `surface` bg, hover `surface-hover`, active scale 0.95.

Mute/Video toggle state: button fills with `surface-active` when active (e.g., mic muted = button bg changes).

- [ ] **Step 2: Write IncomingCallOverlay**

Full-screen overlay, `surface` at 95% opacity. Centered content: Avatar (xl, 64px), caller name (heading), "Incoming video call" subtitle. Two buttons: Decline (ghost/danger) left, Accept (primary/cta) right.

Animation: slides down from top with spring physics (translateY: -100→0).

- [ ] **Step 3: Write CallPanel**

40% right panel (split view). Remote video: large tile, `surface` bg with mock participant avatar + name overlay. Local video: small 120×90px PiP in bottom-right corner of remote tile, `radius-md`, draggable (mouse drag only).

Controls bar at bottom: `CallControls` centered.

Screen share state: when "Screen Share" is clicked, remote tile shows a "Screen sharing..." mock screen; local video moves to top-right corner.

Panel animates in from right with spring. `AnimatePresence` handles open/close.

- [ ] **Step 4: Wire call state to store**

Add `callState: { status: 'idle' | 'incoming' | 'ringing' | 'active' | 'ended', callerId?: string }` to Zustand store. Add `startCall(userId)`, `acceptCall()`, `declineCall()`, `endCall()` actions. Add a "Start call" button in DM sidebar next to each user.

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/call/
git commit -m "$(cat <<'EOF'
feat: add video call UI with split view panel

- IncomingCallOverlay: spring slide-down animation, accept/decline
- CallPanel: 40% split view, remote/local video tiles, screen share mock
- CallControls: mute/video/share/end with toggle states
- Mock call state in Zustand store

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Keyboard Shortcuts & Polish

**Files:**
- Modify: `apps/web/app/page.tsx` — wire all components together
- Modify: `apps/web/components/chat/MessageBubble.tsx` — inline edit trigger
- Modify: `apps/web/hooks/useKeyboardShortcuts.ts` — extend shortcuts

- [ ] **Step 1: Wire keyboard shortcuts**

Shortcuts to implement:
- `Cmd+K` / `Ctrl+K` → open search
- `Escape` → close search / close thread / cancel editing
- `Cmd+Shift+C` → start call with active DM user
- `↑` in composer (when empty) → edit last own message
- `R` (when message hovered) → open thread
- `E` (when own message hovered) → start inline edit
- `Tab` / `Shift+Tab` → navigate channel list when sidebar focused

- [ ] **Step 2: Wire inline edit**

In `MessageBubble`, clicking ✏️ (or clicking message content directly for own messages) enters edit mode: content becomes textarea pre-filled, Save/Cancel appear. Enter saves (calls `editMessage` in store), Escape cancels. After save: brief "Saved ✓" feedback, then "(edited)" appears in metadata.

- [ ] **Step 3: Mobile responsive polish**

- [ ] **Step 4: Final integration pass**

Ensure the full app composes correctly in `page.tsx`. Test: switching channels updates message list, opening thread shows panel, starting call shows split view, Cmd+K opens search.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/page.tsx apps/web/components/chat/MessageBubble.tsx apps/web/hooks/useKeyboardShortcuts.ts
git commit -m "$(cat <<'EOF'
feat: add keyboard shortcuts and mobile responsive polish

- Global shortcut system: Cmd+K, Escape, call shortcut, message nav
- Inline edit: Enter saves, Escape cancels, "(edited)" indicator
- Responsive: hamburger sidebar, full-screen panels on mobile

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Spec Coverage Check

- [x] Color palette & typography tokens — Task 1
- [x] Layout architecture (sidebar left, thread panel, split call) — Tasks 4, 7, 9
- [x] Channels & DMs with sidebar navigation — Task 4
- [x] Message list virtualization — Task 5
- [x] Message bubble with hover actions, reactions, editing, deletion — Task 5
- [x] Thread panel with reply functionality — Task 7
- [x] Reactions picker + display — Task 6
- [x] Composer with emoji, file attachment, send — Task 6
- [x] Typing indicators — Task 6
- [x] Presence & status dots — Task 4 (DMSidebar), Task 3 (Avatar)
- [x] Search modal with Cmd+K, tabs, keyboard nav — Task 8
- [x] Video call split view with controls, PiP — Task 9
- [x] Incoming call overlay — Task 9
- [x] Responsive mobile layout — Task 4, Task 10
- [x] Spring-based motion system — Tasks 1, 5, 6, 7, 8, 9

**Gaps found:** None. All spec requirements are covered.

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
