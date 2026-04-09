# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TeamLink is an enterprise real-time collaboration platform defined in SPEC.md. The codebase follows a Turborepo monorepo structure with a Next.js frontend and Node.js API server.

## Source of Truth

**SPEC.md** is the authoritative specification for this project. All design, architecture, and feature decisions should reference it. Before implementing, read the relevant sections thoroughly.

## Architecture

```
teamlink/
├── apps/
│   ├── web/                    # Next.js 14 frontend (to be created)
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
│   └── api/                   # Node.js API server (to be created)
│       ├── src/
│       │   ├── routes/       # Express routes
│       │   ├── services/     # Business logic
│       │   ├── models/       # Data models
│       │   ├── middleware/   # Auth, validation
│       │   ├── websocket/    # WS handlers
│       │   └── utils/        # Helpers
│
├── packages/
│   └── shared/                # Shared types, constants (to be created)
│       ├── types/
│       ├── constants/
│       └── utils/
│
├── turbo.json                 # Turborepo config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## State Management

Uses Zustand for client-side state. See SPEC.md section 8.2 for store structure.

## Real-time Architecture

WebSocket server for real-time events (messages, presence, typing indicators). Redis pub/sub for distributing events across server instances. See SPEC.md section 8.3 for diagram.

## Design System

- **Colors**: Indigo primary (#6366F1), Emerald accent (#10B981), neutral grays
- **Typography**: Inter variable font, 1.25 major third scale
- **Spacing**: 4px base unit
- **Motion**: ease-out for exits, ease-spring for bouncy feedback
- **Icons**: Lucide React (24px, 1.5px stroke)

See SPEC.md sections 2-3 for complete design language and layout specs.

## Data Models

Key interfaces defined in SPEC.md section 6: User, Workspace, Channel, Message, DirectMessage, TypingIndicator.

## API Design

REST endpoints for CRUD operations + WebSocket for real-time events. See SPEC.md section 7 for full endpoint specs and WebSocket event types.

## Testing Strategy

Unit tests for utilities/hooks, component tests for UI, integration tests for API routes, E2E tests with Playwright for critical flows. See SPEC.md section 10.

## Implementation Phases

1. Foundation: Project setup, design tokens, base components, layout shell
2. Core Messaging: Message list, composer, grouping, real-time simulation, reactions
3. Channels & DMs: Sidebar, switching, direct messages, presence
4. Advanced Features: Threading, mentions, file uploads, search
5. Polish: Keyboard shortcuts, notifications, performance, accessibility, dark mode
