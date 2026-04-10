'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../stores/chatStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import {
  workspace,
  channels,
  users,
  currentUser,
  directMessages,
  generalMessages,
  engineeringMessages,
  dm1Messages,
  getUserById,
  groupMessages,
} from '../lib/mockData';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { Message } from '../components/chat/Message';
import { Composer } from '../components/chat/Composer';
import { MessageSkeleton } from '../components/ui/Skeleton';
import { SearchModal } from '../components/modals/SearchModal';
import { ThreadPanel } from '../components/chat/ThreadPanel';
import type { Message as MessageType, User } from '@teamlink/shared/types';

export default function HomePage() {
  const {
    activeChannelId,
    activeDMId,
    setActiveChannel,
    setActiveDM,
    setMessages,
    addMessage,
    addReaction,
    updateMessage,
    setUsers,
    setChannels,
    messages,
    setTyping,
    typingUsers,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [threadMessage, setThreadMessage] = useState<MessageType | null>(null);
  const [threadAuthor, setThreadAuthor] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        meta: true,
        handler: () => setShowSearch(true),
        description: 'Open search',
      },
      {
        key: 'k',
        ctrl: true,
        handler: () => setShowSearch(true),
        description: 'Open search',
      },
      {
        key: 'n',
        meta: true,
        handler: () => {
          // Focus composer - handled by MentionAutocomplete
        },
        description: 'New message',
      },
      {
        key: 'n',
        ctrl: true,
        handler: () => {},
        description: 'New message',
      },
      {
        key: ']',
        ctrl: true,
        handler: () => {
          const currentIndex = channels.findIndex((c) => c.id === activeChannelId);
          if (currentIndex < channels.length - 1) {
            setActiveChannel(channels[currentIndex + 1].id);
          }
        },
        description: 'Next channel',
      },
      {
        key: '[',
        ctrl: true,
        handler: () => {
          const currentIndex = channels.findIndex((c) => c.id === activeChannelId);
          if (currentIndex > 0) {
            setActiveChannel(channels[currentIndex - 1].id);
          }
        },
        description: 'Previous channel',
      },
    ],
  });

  // Initialize data
  useEffect(() => {
    setUsers(users);
    setChannels(channels);
    setMessages('ch-1', generalMessages);
    setMessages('ch-2', engineeringMessages);
    setMessages('dm-1', dm1Messages);
    setTimeout(() => setIsLoading(false), 500);
  }, [setUsers, setChannels, setMessages]);

  // Auto-select general channel
  useEffect(() => {
    if (!activeChannelId && !activeDMId) {
      setActiveChannel('ch-1');
    }
  }, [activeChannelId, activeDMId, setActiveChannel]);

  const activeChannel = activeChannelId
    ? channels.find((c) => c.id === activeChannelId)
    : null;

  const activeDM = activeDMId
    ? directMessages.find((dm) => dm.id === activeDMId)
    : null;

  const activeDMUser = activeDM
    ? users.find((u) => u.id !== currentUser.id && activeDM.participants.includes(u.id))
    : null;

  const currentMessages = activeChannelId
    ? messages.get(activeChannelId) || []
    : activeDMId
    ? messages.get(activeDMId) || []
    : [];

  const messageGroups = groupMessages(currentMessages);

  const currentTypingUsers = activeChannelId
    ? typingUsers.get(activeChannelId) || []
    : activeDMId
    ? typingUsers.get(activeDMId) || []
    : [];

  // Virtualizer for message groups
  const virtualizer = useVirtualizer({
    count: messageGroups.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated height per message group
    overscan: 5,
  });

  // Scroll to bottom when messages change or on initial load
  useEffect(() => {
    if (messageGroups.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageGroups.length]);

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: MessageType = {
      id: uuidv4(),
      channelId: activeChannelId || activeDMId || '',
      threadId: null,
      authorId: currentUser.id,
      content,
      attachments: [],
      mentions: [],
      reactions: [],
      replyCount: 0,
      replyAuthors: [],
      isEdited: false,
      editedAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addMessage(activeChannelId || activeDMId || '', newMessage);
  }, [activeChannelId, activeDMId, currentUser.id, addMessage]);

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    addReaction(activeChannelId || activeDMId || '', messageId, emoji, currentUser.id);
  }, [activeChannelId, activeDMId, currentUser.id, addReaction]);

  const handleEdit = useCallback((messageId: string, content: string) => {
    updateMessage(activeChannelId || activeDMId || '', messageId, { content, isEdited: true, editedAt: new Date() });
  }, [activeChannelId, activeDMId, updateMessage]);

  const handleTyping = useCallback(() => {
    setTyping(activeChannelId || null, activeDMId || null, currentUser.id, true);
  }, [activeChannelId, activeDMId, currentUser.id, setTyping]);

  const handleStopTyping = useCallback(() => {
    setTyping(activeChannelId || null, activeDMId || null, currentUser.id, false);
  }, [activeChannelId, activeDMId, currentUser.id, setTyping]);

  const handleThreadReply = useCallback((content: string) => {
    if (!threadMessage) return;
    const newMessage: MessageType = {
      id: uuidv4(),
      channelId: threadMessage.channelId,
      threadId: threadMessage.id,
      authorId: currentUser.id,
      content,
      attachments: [],
      mentions: [],
      reactions: [],
      replyCount: 0,
      replyAuthors: [],
      isEdited: false,
      editedAt: null,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addMessage(threadMessage.channelId, newMessage);
  }, [threadMessage, currentUser.id, addMessage]);

  const dmUsersWithIds = directMessages.map((dm) => ({
    dmId: dm.id,
    user: users.find((u) => u.id !== currentUser.id && dm.participants.includes(u.id))!,
  })).filter((d) => d.user);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar
        workspace={workspace}
        channels={channels}
        directMessages={dmUsersWithIds}
        activeChannelId={activeChannelId || undefined}
        activeDMId={activeDMId || undefined}
        currentUser={currentUser}
        onChannelClick={setActiveChannel}
        onDMClick={setActiveDM}
        onSearchClick={() => setShowSearch(true)}
        onSettingsClick={() => {}}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <Header
          workspace={workspace}
          channel={activeChannel || undefined}
          dmUser={activeDMUser || undefined}
          memberCount={activeChannel?.memberIds.length}
          onSearchClick={() => setShowSearch(true)}
        />

        {/* Message Area */}
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4">
              <MessageSkeleton count={5} />
            </div>
          ) : currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 m-0">No messages yet</p>
              <p className="text-xs mt-1">Be the first to say something!</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Date separator for today */}
              <div className="flex items-center gap-4 px-4 py-4 shrink-0">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-medium text-gray-500 uppercase">Today</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Virtualized message groups */}
              <div
                className="relative w-full flex-1"
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const group = messageGroups[virtualRow.index];
                  return (
                    <div
                      key={`${group.author.id}-${virtualRow.index}`}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {group.messages.map((msg, msgIndex) => {
                        const isFirstInGroup = msgIndex === 0;
                        return (
                          <Message
                            key={msg.id}
                            message={msg}
                            author={group.author}
                            currentUserId={currentUser.id}
                            isGrouped={!isFirstInGroup}
                            isOwn={msg.authorId === currentUser.id}
                            onReact={(emoji) => handleReaction(msg.id, emoji)}
                            onReply={() => {
                              setThreadMessage(msg);
                              setThreadAuthor(group.author);
                            }}
                            onEdit={(content) => handleEdit(msg.id, content)}
                            onDelete={() => {}}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Typing indicator */}
          {currentTypingUsers.length > 0 && (
            <div className="px-4 py-1 text-xs text-gray-500 h-6">
              {currentTypingUsers.length === 1
                ? `${getUserById(currentTypingUsers[0])?.displayName || 'Someone'} is typing...`
                : `${currentTypingUsers.length} people are typing...`}
            </div>
          )}
        </div>

        {/* Composer */}
        <Composer
          onSend={handleSendMessage}
          placeholder={
            activeChannel
              ? `Message #${activeChannel.name}`
              : activeDMUser
              ? `Message ${activeDMUser.displayName}`
              : 'Type a message...'
          }
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        workspaceId={workspace.id}
      />

      {/* Thread Panel */}
      {threadMessage && threadAuthor && (
        <ThreadPanel
          parentMessage={threadMessage}
          author={threadAuthor}
          currentUserId={currentUser.id}
          threadMessages={[]}
          onClose={() => {
            setThreadMessage(null);
            setThreadAuthor(null);
          }}
          onSendMessage={handleThreadReply}
          onReact={(messageId, emoji) => {
            if (threadMessage) {
              addReaction(threadMessage.channelId, messageId, emoji, currentUser.id);
            }
          }}
          users={useChatStore.getState().users}
        />
      )}
    </div>
  );
}
