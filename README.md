# TeamLink

A real-time team messaging app with a warm, friendly design. Built with Next.js 15, Socket.io, Zustand, and Framer Motion.

**Design epithet**: "Where work feels human."

## Design

- **Aesthetic**: Soft & Friendly — Warm Peach & Cream palette
- **Typography**: DM Sans (geometric, approachable)
- **Motion**: Expressive spring-based animations throughout
- **Layout**: Classic sidebar left (260px workspace + 220px channels + fluid message area)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 |
| State | Zustand 5 |
| Real-time | Socket.io-client |
| Animation | Framer Motion 11 |
| Virtualization | @tanstack/react-virtual 3 |
| Icons | Lucide React |
| Dates | date-fns 4 |
| Styling | CSS Modules + CSS custom properties |
| Build | Turborepo 2 (npm workspaces) |

## Features

- **Channels & DMs** — Sidebar navigation with unread badges, presence indicators
- **Message threads** — Slide-in 380px panel with spring animation
- **Reactions** — Emoji picker with spring pop animation, reaction pills
- **Inline editing** — Click to edit, Enter saves, Escape cancels
- **Search** — Cmd+K modal with tab filtering and keyboard navigation
- **Video call UI** — Split view (60/40), PiP local video, call controls (mock)
- **Typing indicators** — Animated bouncing dots with staggered timing
- **Responsive** — Mobile hamburger menu, full-screen panels on small screens

## Project Structure

```
teamlink/
├── apps/
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/            # App Router pages
│           ├── components/
│           │   ├── chat/       # MessageBubble, MessageList, Composer, etc.
│           │   ├── sidebar/    # WorkspaceSidebar, ChannelSidebar, DMSidebar
│           │   ├── thread/     # ThreadPanel
│           │   ├── call/      # CallPanel, CallControls, IncomingCallOverlay
│           │   ├── search/     # SearchModal
│           │   └── ui/        # Button, Avatar, Badge, Modal, Toast
│           ├── hooks/
│           ├── stores/         # Zustand chat store
│           └── lib/            # Mock data, API client
└── packages/
    └── shared/                # Shared types and design tokens
        ├── types/
        └── constants/
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Notes

- Uses mock data — no backend required to run the UI
- Socket.io hook is wired to `http://localhost:3001` when available
- All features are functional with mock data
- Video/audio calls are UI-complete (no actual WebRTC)

## Scripts

```bash
npm run dev     # Start dev server with Turbopack
npm run build   # Production build
npm run lint    # Lint
```
