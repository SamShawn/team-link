'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, MoreHorizontal, Send } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import type { Message, User } from '@teamlink/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

interface ThreadPanelProps {
  parentMessage: Message;
  author: User;
  currentUserId: string;
  threadMessages: Message[];
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  users: Map<string, User>;
}

export function ThreadPanel({
  parentMessage,
  author,
  currentUserId,
  threadMessages,
  onClose,
  onSendMessage,
  onReact,
  users,
}: ThreadPanelProps) {
  const [content, setContent] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  // Scroll to bottom when thread messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (content.trim()) {
      onSendMessage(content.trim());
      setContent('');
    }
  }, [content, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    onReact(messageId, emoji);
    setShowReactionPicker(null);
  };

  const getMessageAuthor = (authorId: string): User => {
    const user = users.get(authorId);
    if (user) return user;
    return {
      id: authorId,
      username: 'unknown',
      displayName: 'Unknown User',
      email: '',
      avatarUrl: null,
      status: 'offline',
      customStatus: null,
      statusEmoji: null,
      timezone: 'UTC',
      locale: 'en',
      workspaceIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 w-96">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Thread</h3>
          <p className="text-xs text-gray-500">
            {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close thread"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Parent message */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-3">
          <Avatar
            src={author.avatarUrl}
            name={author.displayName}
            size={40}
            status={author.status}
            showPresence
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-900">{author.displayName}</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(parentMessage.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
              {parentMessage.content}
            </p>
          </div>
        </div>
      </div>

      {/* Thread messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {threadMessages.map((msg) => {
          const msgAuthor = getMessageAuthor(msg.authorId);
          return (
            <div key={msg.id} className="group">
              <div className="flex gap-3">
                <Avatar
                  src={msgAuthor.avatarUrl}
                  name={msgAuthor.displayName}
                  size={32}
                  status={msgAuthor.status}
                  showPresence
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gray-900">{msgAuthor.displayName}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>

                  {/* Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {msg.reactions.map((reaction) => {
                        const hasReacted = reaction.userIds.includes(currentUserId);
                        return (
                          <button
                            key={reaction.emoji}
                            onClick={() => handleReaction(msg.id, reaction.emoji)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                              hasReacted
                                ? 'bg-indigo-50 border border-indigo-500 text-indigo-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {reaction.emoji} {reaction.count}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick reaction button */}
                  <div className="relative mt-1">
                    <button
                      onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Add reaction
                    </button>

                    {showReactionPicker === msg.id && (
                      <div className="absolute top-0 left-0 flex gap-0.5 p-1.5 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        {quickReactions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="text-base p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply input */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Reply..."
            className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none min-h-10 max-h-32"
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send reply"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
