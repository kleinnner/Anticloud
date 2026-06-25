▄▄                     ██               ▄▄                                    
██                     ▀▀               ██                                    
██            ▄▄▄█   ████     █▄▄▄      ██▄███▄    ▄████▄    ██▄████  ██▄████▄
██        ▄▄█▀▀▀       ██       ▀▀▀█▄▄  ██▀  ▀██  ██▄▄▄▄██   ██▀      ██▀   ██
██        ▀▀█▄▄▄       ██       ▄▄▄█▀▀  ██    ██  ██▀▀▀▀▀▀   ██       ██    ██
██▄▄▄▄▄▄      ▀▀▀█  ▄▄▄██▄▄▄  █▀▀▀      ███▄▄██▀  ▀██▄▄▄▄█   ██       ██    ██
▀▀▀▀▀▀▀▀            ▀▀▀▀▀▀▀▀            ▀▀ ▀▀▀      ▀▀▀▀▀    ▀▀       ▀▀    ▀▀

Libern — Sovereign Collaborative Telecom Engine
Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

Document Version: 1.0.0
Category: Developer Guide
Document ID: DEV-004
Last Updated: 2026-06-19

────────────────────────────────────────────────────────────────

# Modifying the Frontend

## Introduction

Libern's frontend is a React 18 application built with TypeScript, Vite, Tailwind CSS, and a suite of supporting libraries. This guide covers the architecture of the frontend, how to create and modify React components, manage state with Zustand stores, style with Tailwind CSS, and work with the Tauri IPC layer.

The frontend follows a component-based architecture with clear separation of concerns: UI primitives, layout components, feature components, stores, hooks, and an API layer. The state management pattern uses Zustand for global UI state and TanStack Query (React Query) for server state caching.

By the end of this guide, you will be able to:
- Understand the component hierarchy and directory structure
- Create new React components following project conventions
- Add and modify Zustand stores for state management
- Style components using Tailwind CSS utility classes
- Connect components to Tauri backend commands
- Handle streaming data from AI commands
- Add animations with Framer Motion
- Add new views/pages to the application

---

## Part 1: Frontend Architecture Overview

### Technology Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS v3 | Utility-first styling |
| Zustand | State management |
| TanStack Query (React Query) | Server state caching |
| Framer Motion | Animations and transitions |
| Fabric.js | Whiteboard canvas rendering |

### Directory Structure

```
apps/desktop/src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root component with routing
├── index.css                   # Global styles + Tailwind directives
├── vite-env.d.ts               # Vite type declarations
├── components/
│   ├── ui/                     # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── Dropdown.tsx
│   ├── layout/                 # App shell layout components
│   │   ├── ServerListSidebar.tsx
│   │   ├── ChannelSidebar.tsx
│   │   ├── MainContentArea.tsx
│   │   └── UserPanel.tsx
│   ├── chat/                   # Chat-related components
│   │   ├── MessageInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageContent.tsx
│   │   ├── MessageItem.tsx
│   │   └── SlashCommands.tsx
│   ├── server/                 # Server management components
│   │   ├── CreateServerModal.tsx
│   │   ├── CreateChannelModal.tsx
│   │   └── ServerSettings.tsx
│   ├── marketplace/            # Marketplace components
│   │   ├── MarketplacePage.tsx
│   │   └── PublishDialog.tsx
│   ├── whiteboard/             # Whiteboard canvas components
│   │   ├── WhiteboardCanvas.tsx
│   │   └── CanvasToolbar.tsx
│   ├── compliance/             # Compliance dashboard components
│   │   └── ComplianceDashboard.tsx
│   ├── levels/                 # XP and leaderboard components
│   │   ├── LevelBadge.tsx
│   │   └── Leaderboard.tsx
│   ├── ai/                     # AI-related components
│   │   ├── LiberMessageBubble.tsx
│   │   └── ModelDownloadModal.tsx
│   ├── onboarding/             # Onboarding flow
│   │   └── OnboardingFlow.tsx
│   └── profile/                # Profile components
│       └── ProfilePanel.tsx
├── hooks/                      # Custom React hooks
│   ├── useLiberStream.ts
│   └── useAiStatus.ts
├── stores/                     # Zustand stores
│   ├── uiStore.ts
│   ├── serverStore.ts
│   ├── messageStore.ts
│   └── aiStore.ts
├── lib/                        # Tauri invoke wrappers
│   ├── api.ts                  # All command wrappers
│   └── ai.ts                   # AI-specific wrappers
├── types/                      # TypeScript type definitions
│   └── index.ts
└── styles/
    └── liber.css               # Liber-specific styles
```

### Component Hierarchy

```
App
├── OnboardingFlow
├── ServerListSidebar
│   ├── ViewIcon (DM, Marketplace, Compliance)
│   ├── ServerIcon (per server)
│   └── ServerCreateButton
├── ChannelSidebar
│   ├── ServerHeader
│   ├── ChannelCategory (Text, Voice, Whiteboard)
│   │   └── ChannelItem (per channel)
│   └── CreateChannelButton
├── MainContentArea
│   ├── ChatView
│   │   ├── ChatHeader
│   │   ├── PinnedMessages
│   │   ├── MessageList
│   │   │   └── MessageItem
│   │   ├── MessageInput
│   │   └── LiberMessageBubble
│   ├── WhiteboardView
│   │   ├── CanvasToolbar
│   │   └── InfiniteCanvas
│   ├── VoiceView
│   │   ├── VoiceUserList
│   │   └── VoiceControls (Mute, Deafen, Leave)
│   ├── MarketplacePage
│   │   ├── MarketplaceHeader
│   │   ├── ItemGrid
│   │   └── PublishDialog
│   └── ComplianceDashboard
├── RightPanel
│   ├── MemberList
│   ├── SearchResults
│   └── ThreadPanel
├── UserPanel
│   ├── UserAvatar
│   ├── DisplayName
│   ├── StatusIndicator
│   └── SettingsButton
└── ModalSystem
    ├── CreateServerModal
    ├── CreateChannelModal
    ├── InvitePeopleModal
    └── RoleEditorModal
```

---

## Part 2: Creating React Components

### Component File Structure

Each component should be in its own file with the same name as the component:

```typescript
// apps/desktop/src/components/chat/MessageInput.tsx
import { useState, useCallback } from "react";
import { useMessageStore } from "../../stores/messageStore";
import { sendMessage } from "../../lib/api";

interface MessageInputProps {
    channelId: string;
    authorId: string;
    placeholder?: string;
}

export function MessageInput({ channelId, authorId, placeholder = "Type a message..." }: MessageInputProps) {
    const [content, setContent] = useState("");
    const { addMessage } = useMessageStore();

    const handleSend = useCallback(async () => {
        if (!content.trim()) return;

        try {
            const message = await sendMessage(channelId, authorId, content);
            addMessage(channelId, message);
            setContent("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }, [content, channelId, authorId, addMessage]);

    return (
        <div className="flex items-center gap-2 p-3 border-t border-gray-700">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSend}
                disabled={!content.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send
            </button>
        </div>
    );
}
```

### Component Conventions

- **Props interface**: Define at the top of the file with `ComponentNameProps`.
- **Exports**: Named export (not default export).
- **File name**: PascalCase matching the component name.
- **Directory**: Place in the appropriate subdirectory under `components/`.

### Typing Conventions

```typescript
// Import shared types
import type { Message } from "../../types";

// Props interface
interface MessageItemProps {
    message: Message;
    isOwnMessage: boolean;
    onReply: (messageId: string) => void;
    onEdit: (messageId: string, content: string) => void;
    onDelete: (messageId: string) => void;
}

// State typing
const [isEditing, setIsEditing] = useState<boolean>(false);
const [editContent, setEditContent] = useState<string>("");

// Event handlers
const handleEdit = useCallback(async () => {
    try {
        await onEdit(message.id, editContent);
        setIsEditing(false);
    } catch (error) {
        console.error("Edit failed:", error);
    }
}, [message.id, editContent, onEdit]);
```

### Component Composition Example

```typescript
// apps/desktop/src/components/chat/MessageItem.tsx
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Message } from "../../types";

interface MessageItemProps {
    message: Message;
    isOwnMessage: boolean;
    onReply: (id: string) => void;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
    onReact: (id: string, emoji: string) => void;
}

export function MessageItem({ message, isOwnMessage, onReply, onEdit, onDelete, onReact }: MessageItemProps) {
    const [showActions, setShowActions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 px-4 py-2 hover:bg-gray-800/50 group ${isOwnMessage ? "flex-row-reverse" : ""}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {message.author_id.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{message.author_id}</span>
                    <span className="text-gray-500 text-xs">
                        {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                </div>
                <p className="text-gray-300 text-sm mt-0.5">{message.content}</p>
            </div>
            {showActions && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onReact(message.id, "👍")} className="text-gray-400 hover:text-white">👍</button>
                    <button onClick={() => onReply(message.id)} className="text-gray-400 hover:text-white">↩️</button>
                    {isOwnMessage && (
                        <>
                            <button onClick={() => onEdit(message.id, message.content)} className="text-gray-400 hover:text-white">✏️</button>
                            <button onClick={() => onDelete(message.id)} className="text-gray-400 hover:text-red-400">🗑️</button>
                        </>
                    )}
                </div>
            )}
        </motion.div>
    );
}
```

---

## Part 3: Working with Zustand Stores

### Store Definition Pattern

```typescript
// apps/desktop/src/stores/messageStore.ts
import { create } from "zustand";
import type { Message } from "../types";

interface MessageState {
    messages: Map<string, Message[]>;
    isLoading: boolean;
    error: string | null;

    // Actions
    setMessages: (channelId: string, messages: Message[]) => void;
    addMessage: (channelId: string, message: Message) => void;
    removeMessage: (channelId: string, messageId: string) => void;
    updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
    messages: new Map(),
    isLoading: false,
    error: null,

    setMessages: (channelId, messages) =>
        set((state) => {
            const newMessages = new Map(state.messages);
            newMessages.set(channelId, messages);
            return { messages: newMessages };
        }),

    addMessage: (channelId, message) =>
        set((state) => {
            const newMessages = new Map(state.messages);
            const existing = newMessages.get(channelId) || [];
            newMessages.set(channelId, [...existing, message]);
            return { messages: newMessages };
        }),

    removeMessage: (channelId, messageId) =>
        set((state) => {
            const newMessages = new Map(state.messages);
            const existing = newMessages.get(channelId) || [];
            newMessages.set(
                channelId,
                existing.filter((m) => m.id !== messageId),
            );
            return { messages: newMessages };
        }),

    updateMessage: (channelId, messageId, updates) =>
        set((state) => {
            const newMessages = new Map(state.messages);
            const existing = newMessages.get(channelId) || [];
            newMessages.set(
                channelId,
                existing.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
            );
            return { messages: newMessages };
        }),

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}));
```

### Using Stores in Components

```typescript
import { useMessageStore } from "../../stores/messageStore";

export function MessageList({ channelId }: { channelId: string }) {
    const messages = useMessageStore((state) => state.messages.get(channelId) || []);
    const isLoading = useMessageStore((state) => state.isLoading);
    const setMessages = useMessageStore((state) => state.setMessages);
    const setLoading = useMessageStore((state) => state.setLoading);

    // ... component logic
}
```

### Store Selectors

Use selectors for performance — components only re-render when their selected slice changes:

```typescript
// Good: only re-renders when selectedServerId changes
const selectedServerId = useUiStore((state) => state.selectedServerId);

// Bad: re-renders on any uiStore change
const { selectedServerId, setView } = useUiStore();
```

### Store Composition

For complex stores, compose smaller stores:

```typescript
// apps/desktop/src/stores/uiStore.ts
export type ViewType = "chat" | "marketplace" | "compliance";
export type RightPanelType = "members" | "search" | "thread" | null;

interface UiState {
    view: ViewType;
    selectedServerId: string | null;
    selectedChannelId: string | null;
    rightPanel: RightPanelType;
    setView: (view: ViewType) => void;
    setSelectedServer: (serverId: string | null) => void;
    setSelectedChannel: (channelId: string | null) => void;
    setRightPanel: (panel: RightPanelType) => void;
}

export const useUiStore = create<UiState>()((set) => ({
    view: "chat",
    selectedServerId: null,
    selectedChannelId: null,
    rightPanel: null,
    setView: (view) => set({ view }),
    setSelectedServer: (selectedServerId) => set({ selectedServerId }),
    setSelectedChannel: (selectedChannelId) => set({ selectedChannelId }),
    setRightPanel: (rightPanel) => set({ rightPanel }),
}));
```

---

## Part 4: Styling with Tailwind CSS

### Core Principles

- Use Tailwind utility classes for all styling.
- Avoid custom CSS files for component-specific styles.
- Use `@apply` in `index.css` only for highly repeated patterns.
- Follow the Discord-like dark theme (dark gray backgrounds, white text, blue accents).

### Common Tailwind Patterns

```tsx
// Dark theme card
<div className="bg-gray-800 rounded-lg p-4 shadow-md">
    <h3 className="text-white font-semibold text-lg">Title</h3>
    <p className="text-gray-400 text-sm">Description</p>
</div>

// Server icon (circular, 48px)
<div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-gray-600 transition-colors">
    {initials}
</div>

// Channel item with hover and selected states
<div className={`
    px-2 py-1 rounded cursor-pointer text-sm
    ${isSelected
        ? "bg-gray-700 text-white"
        : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
    }
`}>
    # {name}
</div>

// Message bubble
<div className="flex items-start gap-3 px-4 py-2 hover:bg-gray-800/50 group">
    <img src={avatar} className="w-10 h-10 rounded-full" />
    <div>
        <span className="text-white font-medium">{author}</span>
        <span className="text-gray-500 text-xs ml-2">{timestamp}</span>
        <p className="text-gray-300 mt-1">{content}</p>
    </div>
</div>

// Button variants
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors">
    Primary
</button>
<button className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
    Secondary
</button>
<button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
    Danger
</button>
```

### Dark Theme Configuration

The Tailwind configuration in `tailwind.config.js`:

```javascript
module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "discord-dark": "#1e1f22",
                "discord-darker": "#111214",
                "discord-sidebar": "#2b2d31",
                "discord-channel": "#313338",
                "discord-hover": "#3c3f45",
                "discord-accent": "#5865f2",
                "discord-green": "#23a55a",
                "discord-red": "#da373c",
                "discord-yellow": "#f0b232",
            },
        },
    },
    plugins: [],
};
```

### Responsive Design

Use Tailwind's responsive prefixes for different screen sizes:

```tsx
// Responsive layout
<div className="flex flex-col md:flex-row gap-4">
    <div className="w-full md:w-72">Sidebar</div>
    <div className="flex-1">Content</div>
</div>

// Responsive text
<p className="text-sm md:text-base lg:text-lg">Responsive text</p>
```

---

## Part 5: Connecting to the Backend

### The API Layer

All Tauri command calls go through `apps/desktop/src/lib/api.ts`:

```typescript
// apps/desktop/src/lib/api.ts
import { invoke } from "@tauri-apps/api/core";

// --- Server commands ---
export async function getServers(): Promise<Server[]> {
    return invoke<Server[]>("get_servers");
}

export async function createServer(name: string, ownerId: string): Promise<Server> {
    return invoke<Server>("create_server", { name, ownerId });
}

// --- Message commands ---
export async function sendMessage(
    channelId: string,
    authorId: string,
    content: string,
    replyTo?: string,
): Promise<Message> {
    return invoke<Message>("send_message", { channelId, authorId, content, replyTo });
}

export async function getMessages(
    channelId: string,
    before?: number,
    limit?: number,
): Promise<Message[]> {
    return invoke<Message[]>("get_messages", { channelId, before, limit });
}

// --- Casino commands ---
export async function rollDice(dice: string): Promise<string> {
    return invoke<string>("roll_dice", { dice });
}

export async function flipCoin(): Promise<string> {
    return invoke<string>("flip_coin");
}
```

### Using TanStack Query for Data Fetching

For data fetching and caching, use TanStack Query:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServers, createServer } from "../lib/api";

// Query hook
export function useServers() {
    return useQuery({
        queryKey: ["servers"],
        queryFn: getServers,
    });
}

// Mutation hook
export function useCreateServer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { name: string; ownerId: string }) =>
            createServer(params.name, params.ownerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["servers"] });
        },
    });
}

// Usage in component
export function ServerList() {
    const { data: servers, isLoading } = useServers();
    const createServerMutation = useCreateServer();

    if (isLoading) return <div className="text-gray-400 p-4">Loading servers...</div>;

    return (
        <div>
            {servers?.map((server) => (
                <ServerIcon key={server.id} server={server} />
            ))}
            <button
                onClick={() => createServerMutation.mutate({ name: "New", ownerId: "me" })}
                className="w-12 h-12 rounded-full bg-green-600 text-white text-2xl flex items-center justify-center hover:bg-green-500"
            >
                +
            </button>
        </div>
    );
}
```

### Handling AI Streaming

For AI commands that stream tokens back, use the custom hook pattern:

```typescript
// apps/desktop/src/hooks/useLiberStream.ts
import { useState, useCallback, useRef } from "react";
import { askLibern } from "../lib/ai";

interface UseLiberStreamOptions {
    channelId: string;
    onToken?: (token: string) => void;
    onDone?: (fullResponse: string) => void;
}

export function useLiberStream() {
    const [content, setContent] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const startStream = useCallback(async (query: string, channelId: string) => {
        setIsStreaming(true);
        setContent("");

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            await askLibern(
                channelId,
                query,
                (token) => {
                    if (!controller.signal.aborted) {
                        setContent((prev) => prev + token);
                    }
                },
                (full) => {
                    if (!controller.signal.aborted) {
                        setContent(full);
                        setIsStreaming(false);
                    }
                },
            );
        } catch (error) {
            if (!controller.signal.aborted) {
                setIsStreaming(false);
            }
        }
    }, []);

    const cancelStream = useCallback(() => {
        abortRef.current?.abort();
        setIsStreaming(false);
    }, []);

    return { content, isStreaming, startStream, cancelStream };
}
```

---

## Part 6: Animations with Framer Motion

### Import Animations

```typescript
import { motion, AnimatePresence } from "framer-motion";
```

### Common Animation Patterns

```tsx
// Fade in on mount
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
>

// Slide in from left
<motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
>

// Stagger children
<motion.div
    variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }}
    initial="hidden"
    animate="show"
>
    {items.map((item) => (
        <motion.div key={item.id} variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
        }}>
            {item.name}
        </motion.div>
    ))}
</motion.div>

// Hover scale
<motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
>
    Click me
</motion.button>

// Layout animations (for list reorder)
<motion.div layout>
    {items.map((item) => (
        <motion.div key={item.id} layout>
            {item.name}
        </motion.div>
    ))}
</motion.div>
```

---

## Part 7: Adding a New View/Page

### Step 1: Create the Component

```typescript
// apps/desktop/src/components/myfeature/MyFeaturePage.tsx
import { useState } from "react";
import { motion } from "framer-motion";

export function MyFeaturePage() {
    const [data, setData] = useState<string[]>([]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full bg-discord-dark"
        >
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">My Feature</h1>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Content */}
            </div>
        </motion.div>
    );
}
```

### Step 2: Add to App.tsx

```typescript
// apps/desktop/src/App.tsx
import { MyFeaturePage } from "./components/myfeature/MyFeaturePage";

export function App() {
    const view = useUiStore((state) => state.view);

    return (
        <div className="flex h-screen bg-discord-darker text-white">
            <ServerListSidebar />
            {view === "chat" && <ChatLayout />}
            {view === "marketplace" && <MarketplacePage />}
            {view === "compliance" && <ComplianceDashboard />}
            {view === "myfeature" && <MyFeaturePage />}
            <UserPanel />
        </div>
    );
}
```

### Step 3: Add View Type

```typescript
// apps/desktop/src/stores/uiStore.ts
export type ViewType = "chat" | "marketplace" | "compliance" | "myfeature";
```

### Step 4: Add Navigation Icon

```typescript
// apps/desktop/src/components/layout/ServerListSidebar.tsx
const VIEW_ICONS: { view: ViewType; icon: string; label: string }[] = [
    { view: "chat", icon: "@", label: "Direct Messages" },
    { view: "marketplace", icon: "🏪", label: "Marketplace" },
    { view: "compliance", icon: "🛡️", label: "Compliance" },
    { view: "myfeature", icon: "⭐", label: "My Feature" },
];
```

---

## Part 8: Debugging the Frontend

### Browser DevTools

Press `Ctrl+Shift+I` in the Libern window to open the DevTools console.

### Common Issues

| Issue | Solution |
|-------|----------|
| Component not rendering | Check for JS errors in console. Verify the component is imported and used in the parent. |
| State not updating | Check Zustand store selectors. Ensure you are not mutating state directly. |
| Tauri command not found | Verify the command is registered in `lib.rs`. Check the spelling matches between Rust and TypeScript. |
| Hot reload not working | Restart `pnpm tauri dev`. Check that Vite dev server is running on port 1420. |
| Tailwind styles not applied | Check that the class name is correct. Verify Tailwind content paths in config. |
| Framer Motion animations not playing | Ensure the component is wrapped in `AnimatePresence` if using exit animations. |
| "invoke" is not a function | Ensure `@tauri-apps/api` is installed. Check the import path. |
| Type errors in API calls | Verify that the TypeScript interface matches the Rust struct. Fields are automatically converted from snake_case to camelCase. |

### Performance Monitoring

- Use React DevTools Profiler to identify re-render issues.
- Use Zustand's `subscribe` to track store updates.
- Add `console.time()` / `console.timeEnd()` around expensive operations.
- Check for unnecessary re-renders with `useCallback` and `useMemo`.

---

## Next Steps

Now that you can modify the frontend, proceed to:

- **How-To Guide 05**: Testing — Writing unit tests and integration tests
- **How-To Guide 06**: Building an Installer — MSI and native installer packaging

────────────────────────────────────────────────────────────────

Copyright (c) 2026 Lois-Kleinner and 0-1.gg. All rights reserved.

```
.====================================================================.
!  Made in the UAE, Dubai #DubaiIt #Dubai #Dxb #SovereignAI          !
!  Made in The Emirates #Dubai_it                                    !
!                                                                    !
!  Lois-Kleinner Alpasan - The Anticloud 2026-                       !
!                                                                    !
!  0-1.gg ! GitHub ! LinkedIn ! DEV ! GH Pages                       !
!  HuggingFace ! Blog ! Tumblr ! Fandom ! Bluesky ! Mastodon          !
!  Zenodo ! Harvard Dataverse ! Internet Archive ! ORCID              !
!                                                                    !
!  Sovereign AI ! Local-First ! Privacy ! Zero Trust ! No Datacenter !
!  Air-Gapped ! Open Source ! Rust ! Hash Chain ! Single Binary      !
!  Offline LLM ! Crypto Ledger ! P2P ! Federated                     !
'===================================================================='
```

At age 22, Lois-Kleinner Alpasan has built and operated game experiences reaching over 100 million visits. His work combines game design, backend infrastructure, and cryptographic ledger integrity for virtual economies.

References:
1. Lois-Kleinner Zenodo: https://doi.org/10.5281/zenodo.20781790
2. Lois-Kleinner GitHub: https://github.com/kleinnner/Anticloud/tree/main/04-aioss-format
3. Lois-Kleinner Harvard DV: https://doi.org/10.7910/DVN/SZJMZA
4. Lois-Kleinner Internet Arc: https://archive.org/details/aioss-format
5. Lois-Kleinner ORCID: https://orcid.org/0009-0009-2233-6107
6. Lois-Kleinner DEV.to: https://dev.to/kleinner
7. Lois-Kleinner LinkedIn: https://linkedin.com/in/kleinner
8. Lois-Kleinner HuggingFace: https://huggingface.co/Anticloud
9. Lois-Kleinner Tumblr: https://anticloud.tumblr.com
10. Lois-Kleinner Mastodon: https://mastodon.social/@kleinner
11. Lois-Kleinner Bluesky: https://bsky.app/profile/kleinner.bsky.social
12. 0-1.gg: https://0-1.gg
