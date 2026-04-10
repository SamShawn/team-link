# TeamLink — Design Specification

**Version**: 1.0
**Date**: 2026-04-10
**Status**: Approved

---

## 1. Concept & Vision

TeamLink is a real-time team messaging app that feels like a warm, sunlit workspace — optimistic and human, not corporate. It should feel like walking into a well-designed café where people do their best collaborative work. Every interaction is purposeful but has a slight warmth and playfulness that makes you want to be there.

**Design epithet**: "Where work feels human."

---

## 2. Visual Identity

### Color Palette — Warm Peach & Cream

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FFF5F0` | App background (warm cream) |
| `surface` | `#FFEEE6` | Cards, panels, sidebars |
| `surface-hover` | `#FFE4D6` | Hover states on surfaces |
| `surface-active` | `#FFD4C4` | Active/selected states |
| `primary` | `#FF9B7A` | Peachy coral — primary accent |
| `primary-hover` | `#FF7A5A` | Darker coral for hover |
| `cta` | `#C75D3A` | Amber-terracotta — CTAs, important actions |
| `cta-hover` | `#A84A2E` | Darker CTA hover |
| `text-primary` | `#6B4F4F` | Main body text (warm brown) |
| `text-secondary` | `#8A7A7A` | Muted/secondary text |
| `text-inverse` | `#FFF5F0` | Text on dark backgrounds |
| `success` | `#7AB89A` | Online status, success states |
| `warning` | `#E8C87A` | Away status, warnings |
| `error` | `#D47A7A` | Error states, destructive actions |
| `border` | `#F0D8CC` | Dividers, borders |
| `border-strong` | `#E0C8BC` | More prominent borders |

### Typography

**Font**: DM Sans (Google Fonts) — geometric sans-serif with subtle warmth

| Role | Spec |
|---|---|
| Font family | `'DM Sans', system-ui, sans-serif` |
| Body / messages | 15px / 1.5 line-height |
| Heading 1 | 24px / 700 weight |
| Heading 2 | 18px / 600 weight |
| Caption | 12px / 400 weight |
| Message meta | 12px / 400 weight / text-secondary |

### Spatial System

- **Base unit**: 4px
- **Border radius**:
  - Small (chips, badges): 6px
  - Medium (inputs, buttons): 10px
  - Card (message bubbles, panels): 16px
  - Large (modals, overlays): 20px
  - Full round (avatars): 50%
- **Sidebar widths**: Workspace 260px, Channel 220px, Thread 380px
- **Message bubble padding**: 12px 16px
- **Standard gap**: 8px between tight elements, 16px between groups

### Motion Philosophy — Expressive & Delightful

All motion uses spring-based easing with slight overshoot. Animations communicate weight and life — nothing feels mechanical.

| Interaction | Duration | Easing |
|---|---|---|
| Panel slide in | 300ms | spring(1, 80, 10) |
| Panel slide out | 200ms | ease-out |
| Message appear | 250ms | spring(1, 60, 8) — float up + fade |
| Reaction pop | 200ms | spring(2, 100, 8) — scale 0→1.2→1 |
| Hover state | 120ms | ease-out |
| Modal appear | 300ms | spring(1, 80, 10) — scale 0.95→1 + fade |
| Button press | 100ms | ease-out — scale 0.97 |

### Visual Assets

- **Icons**: Lucide React (consistent 1.5px stroke, 20px default size)
- **Avatars**: 32px for messages, 40px for sidebar, 24px for compact/metadata
- **Empty states**: Illustrated with warm line art (inline SVG), encouraging copy
- **Decorative**: Subtle dot pattern on sidebar backgrounds at 3% opacity

---

## 3. Layout Architecture

### Desktop — Classic Sidebar Left

```
┌──────────────────────────────────────────────────────────┐
│  Workspace Sidebar (260px)  │ Channel Sidebar (220px)  │
│  ─────────────────────────────│─────────────────────────│
│  Workspace name + switcher    │ # general                │
│  ─────────────────────────────│ # design                 │
│  Channels                     │ # engineering            │
│  # general                    │ ─────────────────────── │
│  # design                     │ Direct Messages          │
│  # engineering                │ ◯ Maya Chen             │
│  ─────────────────────────────│ ◯ Alex Kim              │
│  Direct Messages              │                          │
│  ◯ Maya Chen                  │                          │
│  ◯ Alex Kim                   ├─────────────────────────│
│  ─────────────────────────────│ Message Area (fluid)      │
│  User profile                 │ ─────────────────────── │
│                               │ ThreadPanel (380px)      │
│                               │ slides OVER this area → │
└───────────────────────────────┴──────────────────────────┘
```

### Thread Panel

Opens from the right edge, slides over the message area (does not push content). A subtle backdrop dims the message area behind it at 40% opacity.

### Video Call — Split View (40% / 60%)

```
┌────────────────────────────┬─────────────────────────────┐
│                            │                             │
│      Chat (60%)            │    Call Panel (40%)         │
│                            │                             │
│  Message list continues    │  ┌─────────┐ ┌─────────┐   │
│  in this area              │  │ Remote  │ │ Local   │   │
│                            │  │  Video  │ │  Video  │   │
│                            │  └─────────┘ └─────────┘   │
│                            │                             │
│                            │  [Mute] [Vid] [Share] [End] │
└────────────────────────────┴─────────────────────────────┘
```

### Mobile (< 768px)

- Both sidebars collapse into a hamburger menu
- Full-width message area
- Thread panel becomes a full-screen sheet sliding from bottom
- Call panel is full-screen
- Composer is sticky at bottom

---

## 4. Features & Interactions

### 4.1 Channels & Direct Messages

- **Sidebar sections**: "Channels" and "Direct Messages" are collapsible
- **Active state**: `surface-active` background, `primary` left border accent
- **Unread badge**: Coral pill with white count, positioned top-right of item
- **Hover**: `surface-hover` background, 120ms transition
- **Click behavior**: Switches active channel/DM, message area updates instantly
- **Channel naming**: `#` prefix in `text-secondary`, name in `text-primary`
- **DM naming**: Avatar (24px) + display name in `text-primary`, status dot on avatar

### 4.2 Message List

- **Virtualized rendering**: Only visible messages + overscan are rendered (critical for performance)
- **Grouping**: Consecutive messages from the same author within 5 minutes are grouped — no repeated avatar/header, just continuous text blocks
- **Date separators**: Warm dashed line with centered date chip ("Today", "Yesterday", or "Mar 15")
- **New message indicator**: When scrolled up, a floating "↓ New messages" button appears; clicking scrolls to bottom
- **Scroll behavior**: Auto-scroll to bottom on new message only if user is already at bottom; otherwise show new-message indicator

### 4.3 Message Bubble

```
┌─────────────────────────────────────────────────────┐
│ ◯ Maya Chen                           Yesterday 3:42 PM│
│ Hey team — design review moved to 4pm. Adding          │
│ Sam to the invite.                                     │
│                                          💬 3  ❤️ 5 ↗ │
└─────────────────────────────────────────────────────┘
```

- **Own messages**: `surface-active` background (peachy coral tint)
- **Others' messages**: `surface` background (warm cream)
- **Metadata row**: Avatar (32px) + name + timestamp on first message of a group
- **Hover actions** (revealed on hover, 120ms fade-in):
  - ↗ Reply in thread
  - ❤️ React
  - ✏️ Edit (own messages only)
  - 🗑️ Delete (own messages only)
- **Edited indicator**: Small "(edited)" label in `text-secondary` after timestamp
- **Deleted state**: Message content replaced with `"This message was deleted"`, italic, `text-secondary`

### 4.4 Thread Panel

- **Trigger**: Clicking ↗ on any message opens the thread side panel
- **Header**: Shows parent message preview at top ("Thread in #general")
- **Parent message**: Displayed at top of panel with full context
- **Reply composer**: Sticky at bottom of panel, same as main composer
- **Close**: X button top-right, or Escape key, or click outside
- **Animation**: Slides in from right, 300ms spring. Message area gets backdrop dim.
- **Reply count**: Updates live as replies are added

### 4.5 Reactions

- **Adding**: Hover message → click ❤️ emoji button → picker floats above button
- **Reaction picker**: 6-column emoji grid, recently used first, "Search all emojis" at bottom
- **Animation**: Picker scales in with spring pop (200ms)
- **Selected reactions display**: Row below message content — emoji + count, separated by small gaps
- **Adding reaction**: Scale pop animation (0→1.2→1) when reaction appears below message
- **Own reacted state**: Own reactions have a subtle `surface-hover` background pill
- **Removing**: Click own reaction to remove it (scale-out animation)

### 4.6 Inline Message Editing

- **Trigger**: Click ✏️ on hover (own message only), or click directly on message content
- **UI**: Message content becomes a textarea, same styling as composer
- **Controls**: "Save" button (primary) + "Cancel" link
- **Behavior**: Enter saves, Escape cancels
- **Feedback**: Saved state briefly shows "Saved ✓" before reverting to static text
- **Edited indicator**: "(edited)" appears in metadata after save

### 4.7 Composer

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐  Type a message...               [😊] [📎] [➤] │
│ └──────────┘                                                │
└─────────────────────────────────────────────────────────┘
```

- **Textarea**: Auto-expands up to 6 lines, then scrolls. 44px minimum height.
- **Formatting**: Basic markdown shortcuts rendered live (bold `**text**`, code `` `code` ``)
- **Emoji picker**: Floating picker on 😊 click
- **File attachment**: 📎 button opens file picker. Selected files appear as chips above the textarea, showing filename + size + X to remove
- **Send**: ➤ button, enabled when textarea has content. Enter sends (Shift+Enter for newline).
- **Disabled state**: When thread is open and requires context, shows "Reply in thread..."
- **Typing indicator**: Below composer, shows "Maya and 2 others are typing..." with animated dots

### 4.8 File Sharing

- **Upload**: Select file via 📎 → file chip appears above composer with preview (image thumbnail or file icon)
- **File chip**: Shows icon (by type), filename (truncated), size, X to remove
- **Send**: File is sent alongside message text if present
- **Preview**: Clicking a file in a message opens a preview modal (images show inline, other types show icon + metadata + mock download)
- **Image messages**: Renders inline at max 400px width, rounded corners, click to expand

### 4.9 Search (Cmd+K)

- **Trigger**: Cmd+K (Mac) / Ctrl+K (Windows), or click search icon
- **UI**: Centered modal overlay with backdrop blur
- **Search input**: Large, auto-focused, placeholder "Search TeamLink..."
- **Tabs**: All / Messages / Channels / Files / People
- **Results**: Live as you type (debounced 200ms). Each result shows icon, title, preview snippet, metadata.
- **Navigation**: Arrow keys to navigate, Enter to select, Escape to close
- **Recent searches**: Shown before typing
- **Animation**: Modal scales in (0.95→1) + fades in, 200ms

### 4.10 Video/Audio Calls

#### Incoming Call Overlay

```
┌─────────────────────────────────────────────────┐
│                                                 │
│            [Avatar]                             │
│            Maya Chen                            │
│            Incoming video call                  │
│                                                 │
│         [Decline]      [Accept]                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

- **Overlay**: Full-screen semi-transparent backdrop
- **Animation**: Slides in from top with spring physics
- **Decline**: Red button — declines and dismisses
- **Accept**: Primary coral button — joins the call

#### Active Call — Split View

- **Layout**: 40% right panel for call, 60% left continues showing chat
- **Remote video**: Large tile, fills top 70% of call panel
- **Local video**: Small PiP overlay in corner of remote tile (draggable)
- **Controls bar**: Centered at bottom — Mute, Video Toggle, Screen Share, End Call
- **Control buttons**: 48px circular, `surface` background, hover `surface-hover`
- **End Call**: Red background (`error` color), always visible
- **Screen share**: When active, remote tile shows screen share; small remote video moves to corner
- **Mock implementation**: Local video shows camera feed (or avatar if video off). Remote video shows static mock with participant name. No actual WebRTC connection.

#### Call States

- **Idle**: No call active
- **Ringing**: Outgoing call — modal showing "Calling Maya..." with cancel option
- **Connecting**: Brief "Connecting..." state after accept
- **Active**: Split view as described above
- **Ended**: Panel closes, brief "Call ended" toast appears

### 4.11 Typing Indicators

- **Display**: Appears below composer when 1+ other users are typing
- **Text**: "Maya is typing..." / "Maya and Alex are typing..." / "Maya and 2 others are typing..."
- **Animation**: Three dots with staggered bounce animation
- **Timing**: Indicator disappears 3 seconds after the last keystroke from a user

### 4.12 Presence & Status

- **Status dot**: 10px circle, positioned bottom-right of avatar
  - Online: `success` (#7AB89A)
  - Away: `warning` (#E8C87A)
  - Busy: `error` (#D47A7A)
  - Offline: `text-secondary` (#8A7A7A), 40% opacity
- **Status message**: Below name in DM sidebar — "In a meeting", custom text, etc.
- **Profile view**: Clicking a user avatar shows a profile popover with status, timezone, custom status

---

## 5. Component Inventory

### MessageBubble

| State | Appearance |
|---|---|
| Default (others) | `surface` bg, `text-primary` text, 16px radius |
| Default (own) | `surface-active` bg, `text-primary` text |
| Hover | Action bar fades in (reply, react, edit, delete) |
| Editing | Content replaced with textarea, Save/Cancel controls |
| Deleted | Italic "This message was deleted" in `text-secondary` |
| With reactions | Reaction pills row below content |

### ChannelSidebar

| State | Appearance |
|---|---|
| Default | `surface` bg, channel name + # prefix |
| Hover | `surface-hover` bg |
| Active | `surface-active` bg + 3px `primary` left border |
| Unread | Bold name + coral badge with count |
| Collapsed section | Chevron rotated, items hidden |

### ThreadPanel

| State | Appearance |
|---|---|
| Closed | Not visible |
| Opening | Slides in from right, 300ms spring, backdrop dims message area |
| Open | 380px fixed width, full height, `surface` bg, shadow on left edge |
| Closing | Slides out right, 200ms ease-out |

### ReactionPicker

| State | Appearance |
|---|---|
| Hidden | Not rendered |
| Visible | Floats above trigger, 6-column emoji grid, subtle shadow |
| Hover emoji | Scale 1.2, background `surface-hover` |
| Selected emoji | Has checkmark or highlighted background |

### SearchModal

| State | Appearance |
|---|---|
| Closed | Not rendered |
| Opening | Scales in 0.95→1, fades in, 200ms |
| Open | Centered 600px max-width, backdrop blur |
| With results | Tab-filtered list, keyboard navigable |
| Empty | Illustrated empty state per tab |

### CallPanel

| State | Appearance |
|---|---|
| Hidden | Not rendered |
| Incoming | Full-screen overlay, avatar, accept/decline |
| Ringing | Full-screen overlay, "Calling..." |
| Active | 40% right panel, split with chat, video tiles + controls |
| Ending | Brief "Call ended" toast, then panel closes |

### Composer

| State | Appearance |
|---|---|
| Default | Textarea with placeholder, emoji + attachment buttons |
| With content | Send button enabled (coral) |
| With attachment | File chips above textarea |
| Expanded | Auto-grows up to 6 lines |
| In thread | Placeholder "Reply in thread..."

### Button

| Variant | Appearance |
|---|---|
| Primary | `cta` bg, `text-inverse` text, 10px radius |
| Secondary | `surface` bg, `text-primary` text, border `border` |
| Ghost | Transparent bg, `text-secondary` text, hover `surface-hover` |
| Danger | `error` bg, `text-inverse` text |
| Disabled | 50% opacity, cursor not-allowed |

### Avatar

| Size | Dimensions |
|---|---|
| xs | 20px — inline with text |
| sm | 24px — DM list compact |
| md | 32px — messages |
| lg | 40px — sidebar |
| xl | 64px — profile / call |

---

## 6. Technical Approach

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 |
| Styling | CSS Modules + CSS custom properties (design tokens) |
| State | Zustand 5 with selective hooks |
| Real-time | Socket.io-client (mock server at localhost:3001) |
| Virtualization | @tanstack/react-virtual 3 |
| Icons | Lucide React |
| Animation | Framer Motion 11 |
| Dates | date-fns 4 |
| IDs | uuid v13 |
| Security | DOMPurify for message content |
| Build | Turborepo 2 (npm workspaces) |

### Architecture

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main chat page
│   └── globals.css         # Design tokens as CSS variables
├── components/
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   ├── Composer.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── ReactionPicker.tsx
│   ├── sidebar/
│   │   ├── WorkspaceSidebar.tsx
│   │   ├── ChannelSidebar.tsx
│   │   └── DMSidebar.tsx
│   ├── thread/
│   │   └── ThreadPanel.tsx
│   ├── call/
│   │   ├── CallPanel.tsx
│   │   ├── IncomingCallOverlay.tsx
│   │   └── CallControls.tsx
│   ├── search/
│   │   └── SearchModal.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useSocket.ts
│   ├── useMessages.ts
│   └── useKeyboardShortcuts.ts
├── stores/
│   └── chatStore.ts
└── lib/
    ├── apiClient.ts
    └── mockData.ts

packages/shared/
├── types/
│   └── index.ts            # User, Channel, Message, DM, etc.
└── constants/
    └── designTokens.ts     # Shared token constants
```

### Mock Data Strategy

All features use realistic mock data seeded from `lib/mockData.ts`. No backend required — Socket.io hook is ready to connect to `localhost:3001` when available. Mock data includes:

- 3 users (Maya Chen, Alex Kim, Sam)
- 3 channels (#general, #design, #engineering)
- 15-20 messages per channel with varied authors, reactions, and timestamps
- 2 DMs
- Simulated typing indicators via mock timers

### API Shape (for future backend)

REST API at `NEXT_PUBLIC_API_URL` with endpoints:
- `GET /api/channels` → `Channel[]`
- `GET /api/channels/:id/messages` → `Message[]`
- `POST /api/channels/:id/messages` → `Message`
- `PATCH /api/messages/:id` → `Message`
- `DELETE /api/messages/:id` → `void`
- `POST /api/messages/:id/reactions` → `Reaction`
- `GET /api/dms` → `DirectMessage[]`

Socket.io events (for real-time):
- `message:new` / `message:edit` / `message:delete`
- `typing:start` / `typing:stop`
- `reaction:add` / `reaction:remove`
- `call:incoming` / `call:start` / `call:end`

---

## 7. Scope for MVP

**In scope** (build):
- Full visual design system (colors, typography, spacing, motion)
- Channel and DM navigation (sidebar)
- Message list with virtualization
- Message sending and receiving (mock + Socket.io ready)
- Inline message editing and deletion
- Thread panel with reply functionality
- Reactions (add/remove, picker)
- Search modal (Cmd+K) with tab filtering
- Typing indicators
- Presence indicators
- Video call UI (split view, controls, PiP) — fully mocked
- Responsive mobile layout

**Out of scope** (design, not built):
- Actual WebRTC video/audio streaming
- Actual file upload/storage
- Real user authentication
- Push notifications
- Message search indexing
- Channel/workspace creation UI

---

*Spec approved 2026-04-10. Next: Implementation plan.*
