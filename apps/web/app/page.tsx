'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../stores/chatStore';
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
import type { Message as MessageType } from '@teamlink/shared/types';

export default function HomePage() {
  const {
    activeChannelId,
    activeDMId,
    setActiveChannel,
    setActiveDM,
    setMessages,
    addMessage,
    addReaction,
    setUsers,
    setChannels,
    messages,
    setTyping,
    typingUsers,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleTyping = useCallback(() => {
    setTyping(activeChannelId || null, activeDMId || null, currentUser.id, true);
  }, [activeChannelId, activeDMId, currentUser.id, setTyping]);

  const handleStopTyping = useCallback(() => {
    setTyping(activeChannelId || null, activeDMId || null, currentUser.id, false);
  }, [activeChannelId, activeDMId, currentUser.id, setTyping]);

  const dmUsersWithIds = directMessages.map((dm) => ({
    dmId: dm.id,
    user: users.find((u) => u.id !== currentUser.id && dm.participants.includes(u.id))!,
  })).filter((d) => d.user);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#FFFFFF',
      }}
    >
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLoading ? (
            <div style={{ padding: '16px' }}>
              <MessageSkeleton count={5} />
            </div>
          ) : currentMessages.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#374151', margin: 0 }}>
                No messages yet
              </p>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
                Be the first to say something!
              </p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', padding: '8px 0' }}>
              {/* Date separator for today */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B7280', textTransform: 'uppercase' }}>
                  Today
                </span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              </div>

              {messageGroups.map((group, groupIndex) => (
                <div key={`${group.author.id}-${groupIndex}`}>
                  {group.messages.map((msg, msgIndex) => {
                    const isFirstInGroup = msgIndex === 0;
                    const isLastInGroup = msgIndex === group.messages.length - 1;
                    return (
                      <div key={msg.id}>
                        <Message
                          message={msg}
                          author={group.author}
                          currentUserId={currentUser.id}
                          isGrouped={!isFirstInGroup}
                          isOwn={msg.authorId === currentUser.id}
                          onReact={(emoji) => handleReaction(msg.id, emoji)}
                          onReply={() => {}}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Typing indicator */}
          {currentTypingUsers.length > 0 && (
            <div
              style={{
                padding: '4px 16px',
                fontSize: '12px',
                color: '#6B7280',
                height: '24px',
              }}
            >
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
    </div>
  );
}
