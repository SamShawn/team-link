# TeamLink — Enterprise Real-Time Collaboration Platform

## 1. Vision & Design Philosophy

### 1.1 Product Vision
TeamLink is a next-generation enterprise communication platform that redefines workplace collaboration through **invisible complexity, visible clarity**. Where Slack feels like a tool, TeamLink feels like a natural extension of thought — an environment where conversations flow effortlessly and information finds people before they search for it.

### 1.2 Design Philosophy: "Surgical Precision"
- **Purposeful Minimalism**: Every pixel serves a function. No decorative noise.
- **Information Hierarchy**: Progressive disclosure — show what matters now, reveal depth on demand.
- **Spatial Intelligence**: Intelligent use of negative space creates mental breathing room during intense collaboration.
- **Adaptive Humanity**: The interface adapts to user context — calm when browsing, urgent when needed.
- **Frictionless Onboarding**: Every interaction should feel inevitable, not learned.

### 1.3 Design Influences
- **Linear** — Software that gets out of the way
- **Figma** — Real-time collaboration as a first-class citizen
- **Raycast** — Keyboard-first interactions, speed as a feature
- **Vercel Dashboard** — Clean data presentation, thoughtful empty states
- **Notion** — Information density without overwhelm

---

## 2. Design Language System

### 2.1 Color System

#### Core Palette
```
Primary Brand:     #6366F1  (Indigo 500 — trust, focus, depth)
Primary Hover:     #4F46E5  (Indigo 600)
Primary Active:    #4338CA  (Indigo 700)
Primary Subtle:    #EEF2FF  (Indigo 50)

Accent:            #10B981  (Emerald 500 — success, online, positive)
Accent Hover:      #059669  (Emerald 600)
Warning:           #F59E0B  (Amber 500)
Danger:            #EF4444  (Red 500)
Danger Hover:      #DC2626  (Red 600)

Neutral 0:         #FFFFFF  (Pure white — primary backgrounds light)
Neutral 50:        #F9FAFB  (Gray 50 — secondary backgrounds)
Neutral 100:       #F3F4F6  (Gray 100 — borders, dividers)
Neutral 200:       #E5E7EB  (Gray 200 — disabled states)
Neutral 300:       #D1D5DB  (Gray 300 — placeholders)
Neutral 400:       #9CA3AF  (Gray 400 — tertiary text)
Neutral 500:        #6B7280  (Gray 500 — secondary text)
Neutral 600:        #4B5563  (Gray 600 — body text)
Neutral 700:        #374151  (Gray 700 — headings)
Neutral 800:        #1F2937  (Gray 800 — emphasis)
Neutral 900:        #111827  (Gray 900 — primary text dark)
Neutral 950:        #030712  (Near black — primary backgrounds dark)
```

#### Semantic Colors
```
--color-bg-primary:       var(--neutral-0)      / var(--neutral-950)
--color-bg-secondary:     var(--neutral-50)     / var(--neutral-900)
--color-bg-tertiary:      var(--neutral-100)    / var(--neutral-800)
--color-bg-hover:         var(--neutral-50)     / var(--neutral-900)
--color-bg-active:        var(--primary-subtle) / var(--primary-subtle)

--color-text-primary:     var(--neutral-900)    / var(--neutral-0)
--color-text-secondary:   var(--neutral-500)   / var(--neutral-400)
--color-text-tertiary:    var(--neutral-400)    / var(--neutral-500)
--color-text-inverse:     var(--neutral-0)      / var(--neutral-900)

--color-border-default:   var(--neutral-200)    / var(--neutral-700)
--color-border-strong:     var(--neutral-300)    / var(--neutral-600)
--color-border-focus:     var(--primary)        / var(--primary)
```

#### Message Status Colors
```
--color-sent:             var(--accent)         (Message delivered)
--color-delivered:        var(--accent)         (All recipients received)
--color-read:             var(--primary)        (All recipients read)
--color-pending:          var(--neutral-400)    (Sending...)
--color-failed:           var(--danger)         (Failed to send)
```

#### User Presence Colors
```
--color-online:           #10B981  (Emerald 500)
--color-away:             #F59E0B  (Amber 500)
--color-busy:             #EF4444  (Red 500)
--color-offline:          #9CA3AF  (Gray 400)
```

#### Dark Mode Adaptation
Dark mode uses **elevated surface** logic:
- Backgrounds increase in luminance as they "approach" the user
- Cards/surfaces: neutral-950 → neutral-900 → neutral-800 (ascending elevation)
- Primary surfaces feel like deep space, not flat gray

### 2.2 Typography

#### Font Stack
```css
--font-sans: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale (1.25 — Major Third)
```
--text-xs:    11px / 1.4   (timestamps, badges)
--text-sm:    13px / 1.5   (secondary text, metadata)
--text-base:  15px / 1.6   (body text, messages)
--text-lg:    17px / 1.5   (emphasized body)
--text-xl:    20px / 1.4   (section headers)
--text-2xl:   25px / 1.3   (page titles)
--text-3xl:   31px / 1.2   (major headings)
--text-4xl:   39px / 1.1   (hero text)
```

#### Font Weights
```
--font-normal:      400
--font-medium:      500
--font-semibold:    600
--font-bold:        700
```

#### Letter Spacing
```
--tracking-tight:   -0.025em   (headings)
--tracking-normal:  0          (body)
--tracking-wide:    0.025em   (caps, badges)
--tracking-wider:   0.05em    (timestamps)
```

### 2.3 Spacing System

Base unit: **4px**

```
--space-0:    0
--space-1:    4px
--space-2:    8px
--space-3:    12px
--space-4:    16px
--space-5:    20px
--space-6:    24px
--space-8:    32px
--space-10:   40px
--space-12:   48px
--space-16:   64px
--space-20:   80px
--space-24:   96px
```

#### Semantic Spacing
```
--space-message-gap:      2px     (between consecutive messages same author)
--space-message-section:  16px    (between message groups/sections)
--space-component-gap:    8px     (internal component spacing)
--space-section-gap:      24px    (between major sections)
--space-page-padding:     24px    (edge padding on desktop)
--space-sidebar-width:    260px   (primary navigation)
--space-content-max:      720px   (max readable width)
```

### 2.4 Border & Shadow System

#### Border Radius
```
--radius-sm:     4px
--radius-md:     8px
--radius-lg:     12px
--radius-xl:     16px
--radius-full:   9999px
```

#### Border Widths
```
--border-width:  1px
--border-strong: 2px
```

#### Shadow System
```
--shadow-sm:     0 1px 2px rgba(0,0,0,0.05);
--shadow-md:     0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
--shadow-lg:     0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03);
--shadow-xl:     0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.02);
--shadow-focus:  0 0 0 3px rgba(99, 102, 241, 0.25);
--shadow-glow:   0 0 20px rgba(99, 102, 241, 0.15);
```

### 2.5 Motion & Animation

#### Timing Functions
```
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1)      (exits, reveals)
--ease-in:       cubic-bezier(0.7, 0, 0.84, 0)     (entrances, focus)
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1)    (state changes)
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)  (bouncy feedback)
```

#### Durations
```
--duration-instant:  50ms    (micro-interactions: hover)
--duration-fast:     100ms   (toggles, small state changes)
--duration-normal:   200ms   (standard transitions)
--duration-slow:     300ms   (reveals, modals)
--duration-slower:    500ms   (page transitions)
```

#### Animation Patterns
```
1. Fade + Scale (modals, dropdowns):
   opacity: 0 → 1, scale: 0.95 → 1, duration: 200ms, ease-out

2. Slide + Fade (sidebars, panels):
   translateX: 100% → 0, opacity: 0 → 1, duration: 300ms, ease-out

3. Stagger (lists, message groups):
   each item: 40ms delay, 150ms duration, fade + translateY(4px)

4. Pulse (unread indicators):
   scale: 1 → 1.1 → 1, duration: 2s, ease-in-out, infinite

5. Shimmer (loading skeletons):
   gradient slide, 1.5s duration, ease-in-out, infinite
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.6 Visual Assets

#### Icon System
- **Primary**: Lucide React (consistent 24px, 1.5px stroke)
- **Usage**: Actions, navigation, status indicators
- **Sizing**: 16px (inline), 20px (buttons), 24px (navigation)

#### Avatar System
- **Sizes**: 24px (inline), 32px (messages), 40px (lists), 64px (profiles)
- **Shape**: Circle for users, Rounded square (radius-md) for bots
- **Fallback**: Initials on gradient background (generated from user ID hash)
- **Presence dot**: 10px circle, positioned bottom-right with 2px border

#### Decorative Elements
- Gradient meshes for empty states (subtle, 5% opacity)
- Noise texture overlay for depth (optional, 2% opacity)
- Geometric shapes for loading states (circles, squares)

---

## 3. Layout & Structure

### 3.1 Application Shell

```
┌────────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────┐ ┌──────────────────┐  │
│ │          │ │         HEADER              │ │                  │  │
│ │          │ │  (Workspace / Channel info) │ │                  │  │
│ │  SIDEBAR │ ├─────────────────────────────┤ │    THREAD        │  │
│ │          │ │                             │ │    PANEL         │  │
│ │  (260px) │ │      MESSAGE AREA           │ │    (optional)    │  │
│ │          │ │      (scrollable)           │ │    (320px)       │  │
│ │          │ │                             │ │                  │  │
│ │          │ │                             │ │                  │  │
│ │          │ ├─────────────────────────────┤ │                  │  │
│ │          │ │      COMPOSER               │ │                  │  │
│ └──────────┘ └─────────────────────────────┘ └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

#### Sidebar (260px, fixed)
- Workspace switcher (top)
- Channel navigation (scrollable)
- Direct messages
- Quick actions (search, settings)
- User profile (bottom)

#### Header (56px, fixed)
- Breadcrumb: Workspace > Channel / DM
- Channel description (collapsible)
- Member count & actions
- Pin/Star/Notification controls

#### Message Area (flexible)
- Virtualized scrolling
- Message grouping by author + time
- Date separators
- Unread marker

#### Composer (auto-height, min 56px, max 200px)
- Rich text input
- Formatting toolbar (slash commands)
- Attachment preview
- Emoji picker
- Send button

#### Thread Panel (320px, optional slide-in)
- Opens from right
- Shows thread context
- Reply composer
- Participant list

### 3.2 Responsive Strategy

#### Breakpoints
```
sm:   640px   (large phones)
md:   768px   (tablets)
lg:   1024px  (small laptops)
xl:   1280px  (desktops)
2xl:  1536px  (large screens)
```

#### Adaptive Behaviors

**Mobile (< 768px)**
- Sidebar: Hidden, slide-out drawer (100% width)
- Thread panel: Full-screen modal
- Composer: Fixed bottom
- Message area: Full width
- Header: Collapsed to hamburger + title

**Tablet (768px - 1024px)**
- Sidebar: Collapsible (icons only, 64px)
- Thread panel: Side-by-side (320px)
- Header: Simplified
- Message area: Fluid

**Desktop (> 1024px)**
- Full layout as shown
- Sidebar: Full with text labels
- Thread panel: Slide-in from right
- All features visible

### 3.3 Page Templates

#### Main Chat View
- Default view
- Full application shell
- URL: `/` or `/channel/:channelId`

#### Channel View
- Same as main chat
- Header shows channel info
- URL: `/channel/:channelId`

#### Direct Message View
- Same layout
- DM header shows user(s)
- URL: `/dm/:userId`

#### User Profile Modal
- Overlay modal (480px width)
- User info, status, bio
- Direct message button
- URL: `/user/:userId` (hash navigation)

#### Settings Pages
- Full-page layout (no sidebar toggle)
- Left navigation rail
- Content area (max 720px centered)
- URL: `/settings/:section`

---

## 4. Component Library

### 4.1 Button

#### Variants
- **Primary**: Solid indigo background, white text
- **Secondary**: Gray-100 background, gray-700 text
- **Ghost**: Transparent, gray-600 text, gray-100 hover
- **Danger**: Red-500 background, white text

#### Sizes
- **sm**: 32px height, 12px horizontal padding, 13px text
- **md**: 36px height, 16px horizontal padding, 14px text
- **lg**: 40px height, 20px horizontal padding, 15px text
- **icon**: Square, sizes match above

#### States
- Default, Hover (+shadow-sm, slight darken), Active (pressed), Disabled (50% opacity), Loading (spinner replaces text)

#### Variants Preview
```
[Primary]    [Secondary]    [Ghost]    [Danger]
```

### 4.2 Input

#### Base Input
- Height: 40px
- Border: 1px solid neutral-200
- Border radius: var(--radius-md)
- Padding: 0 12px
- Placeholder: neutral-400
- Focus: border-primary, shadow-focus ring

#### Textarea
- Min-height: 80px
- Auto-resize up to max-height
- Vertical padding: 10px

#### States
- Default, Focus (primary border + ring), Error (red border + ring), Disabled (neutral-100 bg)

### 4.3 Avatar

#### User Avatar
- Circle shape
- Sizes: 24, 32, 40, 64px
- Image or initials fallback
- Gradient background from user ID hash
- Presence indicator (optional)

#### Workspace Avatar
- Rounded square (radius-md)
- 40px default size
- Logo or initials

### 4.4 Message

#### Message Bubble
- Padding: 8px 12px
- Border radius: var(--radius-md)
- Author name: font-medium, primary text
- Timestamp: font-normal, tertiary text, text-xs
- Grouped messages: no author, reduced spacing

#### Message States
- Default, Hover (show actions), Selected (primary subtle bg), Editing (input replaces content)

#### Message Actions (on hover)
- React (emoji)
- Reply (thread)
- More (...)
- Edit (own messages)
- Delete (own messages)

### 4.5 Channel Item

#### Sidebar Channel
- Height: 28px
- Padding: 0 8px
- Border radius: var(--radius-sm)
- Icon: # (public), lock (private), group (shared)
- Hover: neutral-100 bg
- Active: neutral-200 bg, font-medium

#### DM Item
- Avatar + Name + Status
- Same sizing as channel

### 4.6 Dropdown Menu

#### Structure
```
Trigger → Menu (appears below/above based on space)
         ├── Item 1 (icon + label + shortcut)
         ├── Item 2
         ├── Separator
         └── Submenu →
```

#### Animation
- Scale from 0.95 + fade
- 150ms duration
- Origin: top-left for dropdowns

### 4.7 Modal

#### Structure
```
Overlay (black 50% opacity, blur backdrop)
└── Dialog (centered, max-width based on size)
    ├── Header (title + close button)
    ├── Content (scrollable)
    └── Footer (actions)
```

#### Sizes
- sm: 400px
- md: 500px
- lg: 640px
- xl: 800px
- full: 100% viewport (mobile)

### 4.8 Tooltip

- Background: neutral-800
- Text: neutral-0
- Padding: 6px 10px
- Border radius: var(--radius-sm)
- Arrow pointing to trigger
- Delay: 500ms before show

### 4.9 Toast

#### Position
- Bottom-right, stacked
- 24px from edges

#### Types
- Info (neutral)
- Success (accent)
- Warning (amber)
- Error (danger)

#### Structure
```
Toast
├── Icon (left)
├── Content (title + description)
└── Dismiss (right)
```

#### Animation
- Slide in from right + fade
- Auto-dismiss: 5000ms
- Swipe to dismiss

### 4.10 Skeleton

- Background: neutral-200 (light) / neutral-700 (dark)
- Shimmer animation
- Shapes: text line, circle, rectangle
- Match component dimensions exactly

---

## 5. Features & Interactions

### 5.1 Core Messaging

#### Sending Messages
1. User types in composer
2. Press Enter or click Send
3. Message appears immediately (pending state)
4. Server confirms → delivered state
5. Recipients open → read state

#### Message Grouping
- Same author + within 5 minutes = grouped
- Groups separated by author name + timestamp
- Date changes create new groups

#### Message Actions
- **Hover**: Show action bar (react, reply, more)
- **Right-click**: Context menu
- **Long-press (mobile)**: Context menu

#### Editing Messages
- Own messages show "Edit" in context menu
- Inline editing replaces message with input
- "Edited" indicator appears
- Edit history accessible via context menu

#### Deleting Messages
- Soft delete (shows "Message deleted")
- Only own messages (or admin)
- Deletion announced in thread if threading enabled

### 5.2 Threading

#### Thread Creation
- Click "Reply in thread" on any message
- Opens thread panel
- Original message pinned at top
- Thread replies shown chronologically

#### Thread Notifications
- Thread badge on parent message
- "Follow thread" option
- Thread replies don't appear in main channel (unless followed)

### 5.3 Reactions

#### Adding Reactions
- Click reaction button → emoji picker
- Recent/recommended emojis shown first
- Search by keyword or emoji name
- Skin tone selector

#### Reaction Display
- Shown below message
- Collapsed if > 5 unique emoji
- "+N" expands to show all
- Hover shows who reacted

#### Reaction States
- Default (outline)
- Own reaction (filled, primary tint)
- Animated on add (scale bounce)

### 5.4 Mentions & Notifications

#### @Mention Types
- @username (direct)
- @channel (all members)
- @here (online members)

#### Mention UX
- Autocomplete dropdown when typing @
- Avatar + name + username shown
- Keyboard navigation (up/down/enter)
- Highlighted in sent message

#### Notification Settings
- Per-channel: All / Mentions only / Nothing
- Do Not Disturb schedule
- Desktop notification preferences
- Sound on/off

### 5.5 File Sharing

#### Upload Flow
1. Drag & drop or click attachment
2. File preview shown in composer
3. Upload progress indicator
4. Message sent with file card

#### File Card Display
```
┌─────────────────────────────────────┐
│ 📎 filename.pdf                     │
│ 2.4 MB • Download                  │
│ [Preview thumbnail if image]       │
└─────────────────────────────────────┘
```

#### Supported Previews
- Images: Inline thumbnail (max 400px wide)
- PDFs: First page thumbnail + page count
- Code: Syntax highlighted (for < 100 lines)
- Other: Icon + metadata

### 5.6 Search

#### Global Search (Cmd+K)
- Modal overlay
- Recent searches shown
- Filter by: Messages / Files / Channels / People

#### Search Results
- Highlighted match context
- Filter by: Date range / From user / In channel
- Click to navigate to message

#### Search Syntax
- "exact phrase" for exact match
- from:user for specific author
- in:channel for specific channel
- has:file for attachments
- on:YYYY-MM-DD for date

### 5.7 User Presence

#### Presence States
- Online (green): Active within 5 minutes
- Away (yellow): Idle > 5 minutes
- Busy (red): Do not disturb
- Offline (gray): Not recently active

#### Status Customization
- Set custom status text (max 100 chars)
- Status emoji
- Auto-clear after duration option

#### Typing Indicators
- "Samantha is typing..." below composer
- Multiple: "Samantha and 2 others are typing..."
- Auto-clear after 5 seconds of no keystrokes

### 5.8 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New message | Cmd/Ctrl + N |
| Search | Cmd/Ctrl + K |
| Jump to channel | Cmd/Ctrl + T |
| Previous channel | Cmd/Ctrl + [ |
| Next channel | Cmd/Ctrl + ] |
| Mark as read | Cmd/Ctrl + Shift + M |
| Toggle sidebar | Cmd/Ctrl + S |
| Edit last message | Up arrow (in empty composer) |
| Bold | Cmd/Ctrl + B |
| Italic | Cmd/Ctrl + I |
| Code | Cmd/Ctrl + E |
| Link | Cmd/Ctrl + U |

---

## 6. Data Models

### 6.1 User
```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  status: 'online' | 'away' | 'busy' | 'offline';
  customStatus: string | null;
  statusEmoji: string | null;
  timezone: string;
  locale: string;
  workspaceIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.2 Workspace
```typescript
interface Workspace {
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

interface WorkspaceSettings {
  defaultChannelVisibility: 'public' | 'private';
  allowGuestAccounts: boolean;
  enforce MFA: boolean;
  allowedFileTypes: string[];
  maxFileSize: number; // bytes
}
```

### 6.3 Channel
```typescript
interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  visibility: 'public' | 'private' | 'shared';
  topic: string | null;
  memberIds: string[];
  messageCount: number;
  lastMessageAt: Date | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ChannelMember {
  channelId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  notifications: 'all' | 'mentions' | 'nothing';
  lastReadAt: Date;
  unreadCount: number;
}
```

### 6.4 Message
```typescript
interface Message {
  id: string;
  channelId: string;
  threadId: string | null; // null = top-level message
  authorId: string;
  content: string; // Markdown/Rich text
  attachments: Attachment[];
  mentions: Mention[];
  reactions: Reaction[];
  replyCount: number;
  replyAuthors: string[]; // IDs of users who replied
  isEdited: boolean;
  editedAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
}

interface Mention {
  userId: string | null; // null for @channel, @here
  type: 'user' | 'channel' | 'here';
  offset: number; // position in content
  length: number;
}

interface Reaction {
  emoji: string;
  userIds: string[];
  count: number;
}
```

### 6.5 Direct Message
```typescript
interface DirectMessage {
  id: string;
  participants: string[]; // exactly 2 users
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DirectMessageThread {
  id: string;
  dmId: string;
  messages: Message[];
  participantIds: string[];
  lastReadAt: Record<string, Date>; // userId → lastRead
}
```

### 6.6 Typing Indicator
```typescript
interface TypingIndicator {
  channelId: string | null; // null = DM
  dmId: string | null;
  userId: string;
  timestamp: Date;
}
```

---

## 7. API Design

### 7.1 REST Endpoints

#### Authentication
```
POST   /api/auth/login          { email, password } → { token, user }
POST   /api/auth/logout         {} → { success }
POST   /api/auth/register       { email, password, name } → { token, user }
POST   /api/auth/refresh         { refreshToken } → { token }
```

#### Users
```
GET    /api/users/me                               → User
PATCH  /api/users/me                               { status?, customStatus? } → User
GET    /api/users/:userId                          → User
GET    /api/users/search?q=:query                  → User[]
```

#### Workspaces
```
GET    /api/workspaces                              → Workspace[]
POST   /api/workspaces                              { name } → Workspace
GET    /api/workspaces/:workspaceId                 → Workspace
PATCH  /api/workspaces/:workspaceId                 { name?, settings? } → Workspace
GET    /api/workspaces/:workspaceId/members        → User[]
POST   /api/workspaces/:workspaceId/invite         { email } → { inviteId }
```

#### Channels
```
GET    /api/workspaces/:workspaceId/channels        → Channel[]
POST   /api/workspaces/:workspaceId/channels        { name, visibility? } → Channel
GET    /api/channels/:channelId                     → Channel
PATCH  /api/channels/:channelId                     { name?, topic?, description? } → Channel
POST   /api/channels/:channelId/members             { userId } → { success }
DELETE /api/channels/:channelId/members/:userId     → { success }
```

#### Messages
```
GET    /api/channels/:channelId/messages?before=:cursor&limit=50 → Message[]
POST   /api/channels/:channelId/messages           { content, attachments? } → Message
PATCH  /api/messages/:messageId                    { content } → Message
DELETE /api/messages/:messageId                    → { success }
POST   /api/messages/:messageId/reactions          { emoji } → Message
DELETE /api/messages/:messageId/reactions/:emoji   → Message
```

#### Threads
```
GET    /api/messages/:messageId/thread             → { parent: Message, replies: Message[] }
POST   /api/messages/:messageId/thread             { content } → Message
```

#### Direct Messages
```
GET    /api/dms                                      → DirectMessage[]
POST   /api/dms                                      { participantId } → DirectMessage
GET    /api/dms/:dmId/messages?before=:cursor        → Message[]
POST   /api/dms/:dmId/messages                       { content } → Message
```

#### Files
```
POST   /api/upload                                  FormData(file) → { url, thumbnail?, metadata }
GET    /api/files/:fileId                           → { downloadUrl }
```

### 7.2 WebSocket Events

#### Connection
```typescript
// Client → Server
{ type: 'auth', token: string }
{ type: 'subscribe', channel: 'channel' | 'dm', id: string }
{ type: 'unsubscribe', channel: 'channel' | 'dm', id: string }

// Server → Client
{ type: 'auth_success', user: User }
{ type: 'auth_failure', error: string }
```

#### Real-time Events
```typescript
// Message events
{ type: 'message.created', channelId: string, message: Message }
{ type: 'message.updated', channelId: string, messageId: string, updates: Partial<Message> }
{ type: 'message.deleted', channelId: string, messageId: string }

// Reaction events
{ type: 'reaction.added', channelId: string, messageId: string, reaction: Reaction }
{ type: 'reaction.removed', channelId: string, messageId: string, emoji: string, userId: string }

// Presence events
{ type: 'presence.updated', userId: string, status: PresenceStatus }
{ type: 'typing.started', channelId: string | null, dmId: string | null, userId: string }
{ type: 'typing.stopped', channelId: string | null, dmId: string | null, userId: string }

// Channel events
{ type: 'channel.updated', channel: Channel }
{ type: 'member.joined', channelId: string, userId: string }
{ type: 'member.left', channelId: string, userId: string }
```

### 7.3 Error Handling

#### Error Response Format
```typescript
interface APIError {
  code: string;           // e.g., 'MESSAGE_NOT_FOUND'
  message: string;        // Human-readable message
  details?: unknown;      // Additional context
  requestId: string;     // For debugging
}
```

#### Common Error Codes
```
400  BAD_REQUEST           - Invalid request body/params
401  UNAUTHORIZED          - Missing or invalid token
403  FORBIDDEN             - Insufficient permissions
404  NOT_FOUND             - Resource doesn't exist
409  CONFLICT              - Resource already exists (e.g., username taken)
429  RATE_LIMITED          - Too many requests
500  INTERNAL_ERROR        - Server error
```

---

## 8. Technical Architecture

### 8.1 Project Structure
```
teamlink/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── chat/         # Chat-specific components
│   │   │   ├── navigation/   # Sidebar, header
│   │   │   └── modals/       # Modal components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities, API client
│   │   ├── stores/           # State management (Zustand)
│   │   ├── types/            # TypeScript types
│   │   └── styles/           # Global styles, Tailwind config
│   │
│   └── api/                   # Node.js API server
│       ├── src/
│       │   ├── routes/       # Express routes
│       │   ├── services/     # Business logic
│       │   ├── models/       # Data models
│       │   ├── middleware/   # Auth, validation
│       │   ├── websocket/    # WS handlers
│       │   └── utils/        # Helpers
│       └── package.json
│
├── packages/
│   └── shared/                # Shared types, constants
│       ├── types/
│       ├── constants/
│       └── utils/
│
├── turbo.json                 # Turborepo config
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── SPEC.md
```

### 8.2 State Management

Using Zustand for client-side state:

```typescript
// stores/chatStore.ts
interface ChatStore {
  // Channels
  activeChannelId: string | null;
  channels: Map<string, Channel>;
  setActiveChannel: (id: string) => void;

  // Messages
  messages: Map<string, Message[]>; // channelId → messages
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (channelId: string, messageId: string) => void;

  // Presence
  presence: Map<string, PresenceStatus>;
  setPresence: (userId: string, status: PresenceStatus) => void;

  // Typing
  typingUsers: Map<string, string[]>; // channelId → userIds
  setTyping: (channelId: string, userId: string, isTyping: boolean) => void;
}
```

### 8.3 Real-time Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API GW    │────▶│  WS Server  │
│  (Browser)  │◀────│  (REST)     │◀────│  (Socket)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   Redis      │     │   Redis     │
                    │   (Cache)    │     │ (Pub/Sub)   │
                    └─────────────┘     └─────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ PostgreSQL  │     │ PostgreSQL  │
                    │  (Primary)  │     │ (Read Repl) │
                    └─────────────┘     └─────────────┘
```

### 8.4 Performance Optimizations

1. **Message Virtualization**: Only render visible messages (react-window)
2. **Lazy Loading**: Load older messages on scroll-up
3. **Optimistic Updates**: Update UI before server confirmation
4. **Debounced Typing**: Send typing indicator every 2s, not on every keystroke
5. **Connection Pooling**: Reuse WebSocket connections
6. **Asset Optimization**: Next.js image optimization, code splitting

---

## 9. Accessibility (WCAG 2.1 AA)

### 9.1 Requirements
- All interactive elements keyboard accessible
- Focus indicators visible (2px solid primary, 2px offset)
- ARIA labels on icon-only buttons
- Role attributes for custom components
- Skip links for navigation
- Screen reader announcements for dynamic content

### 9.2 Color Contrast
- Primary text: 4.5:1 minimum
- Secondary text: 3:1 minimum
- UI components: 3:1 minimum (against adjacent colors)
- Focus indicators: 3:1 minimum

### 9.3 Keyboard Navigation
- Logical tab order
- No keyboard traps
- Escape closes modals/dropdowns
- Arrow keys for menus and lists
- Enter/Space for activation

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Utility functions
- Custom hooks
- Store actions/reducers
- Parsers (markdown, mentions)

### 10.2 Component Tests
- Render tests (snapshot)
- Interaction tests (user events)
- Accessibility tests (axe-core)
- Edge cases (empty, loading, error)

### 10.3 Integration Tests
- API routes
- WebSocket events
- Full user flows

### 10.4 E2E Tests (Playwright)
- Critical user journeys
- Cross-browser testing
- Performance budgets

---

## 11. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [x] Project setup (Next.js, Tailwind, TypeScript)
- [x] Design tokens implementation
- [x] Base UI component library
- [x] Layout shell and navigation
- [x] Mock data and state management

### Phase 2: Core Messaging (Weeks 3-4)
- [ ] Message list with virtualization
- [x] Message composer
- [x] Message grouping
- [x] Basic real-time (simulated)
- [x] Reactions

### Phase 3: Channels & DMs (Week 5)
- [x] Channel sidebar
- [x] Channel switching
- [x] Direct messages
- [x] User presence display

### Phase 4: Advanced Features (Weeks 6-7)
- [ ] Threading
- [ ] Mentions with autocomplete
- [ ] File uploads
- [ ] Search (Cmd+K)

### Phase 5: Polish & Integration (Week 8)
- [ ] Keyboard shortcuts
- [ ] Notifications
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Dark mode

---

*This specification serves as the source of truth for TeamLink development. Update this document before making significant changes to design or architecture.*
