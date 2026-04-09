# TeamLink

Enterprise real-time collaboration platform with channels, direct messages, reactions, and threading.

## Project Structure

```
teamlink/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   └── api/                   # Node.js API server
├── packages/
│   └── shared/                # Shared types, constants
├── turbo.json                 # Turborepo configuration
├── package.json
└── tsconfig.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Develop all apps
npm run dev
```

## Development

### Apps

- **Web** (`apps/web`): Next.js 14 frontend with Tailwind CSS
- **API** (`apps/api`): Node.js Express API server

### Packages

- **Shared** (`packages/shared`): Shared TypeScript types and utilities

## Design System

See [SPEC.md](./SPEC.md) for complete design language, color palette, typography, and component specifications.

Key design tokens:
- Primary: Indigo (#6366F1)
- Accent: Emerald (#10B981)
- Typography: Inter variable font
- Icons: Lucide React (24px, 1.5px stroke)

## Architecture

- **State Management**: Zustand for client-side state
- **Real-time**: WebSocket server with Redis pub/sub
- **Styling**: Tailwind CSS with custom design tokens
- **Monorepo**: Turborepo for build orchestration

## Implementation Phases

1. **Foundation**: Project setup, design tokens, base components, layout shell
2. **Core Messaging**: Message list, composer, grouping, real-time simulation, reactions
3. **Channels & DMs**: Sidebar, switching, direct messages, presence
4. **Advanced Features**: Threading, mentions, file uploads, search
5. **Polish**: Keyboard shortcuts, notifications, performance, accessibility, dark mode

## License

Private
