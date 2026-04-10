'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, MessageSquare, Hash, User, ArrowRight } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { apiClient } from '../../lib/apiClient';
import type { Message, Channel, User as UserType } from '@teamlink/shared/types';
import { formatDistanceToNow } from 'date-fns';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

interface SearchResults {
  messages: Message[];
  channels: Channel[];
  users: UserType[];
}

type SearchTab = 'all' | 'messages' | 'channels' | 'people';

export function SearchModal({ isOpen, onClose, workspaceId }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [results, setResults] = useState<SearchResults>({ messages: [], channels: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const users = useChatStore((s) => s.users);
  const channels = useChatStore((s) => s.channels);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Cmd+K / Ctrl+K to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ messages: [], channels: [], users: [] });
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchResults = await apiClient.search(workspaceId, query);
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        // Fallback to local search if API fails
        const lowerQuery = query.toLowerCase();
        const localMessages: Message[] = [];
        const localChannels: Channel[] = [];
        const localUsers: UserType[] = [];

        // Search locally through store
        users.forEach((user) => {
          if (
            user.displayName.toLowerCase().includes(lowerQuery) ||
            user.email.toLowerCase().includes(lowerQuery)
          ) {
            localUsers.push(user);
          }
        });

        channels.forEach((channel) => {
          if (
            channel.name.toLowerCase().includes(lowerQuery) ||
            channel.description?.toLowerCase().includes(lowerQuery)
          ) {
            localChannels.push(channel);
          }
        });

        setResults({
          messages: localMessages,
          channels: localChannels,
          users: localUsers,
        });
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, workspaceId, users, channels]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const flatResults = getFlatResults();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && flatResults.length > 0) {
        e.preventDefault();
        handleSelect(flatResults[selectedIndex]);
      }
    },
    [selectedIndex, results]
  );

  const getFlatResults = () => {
    switch (activeTab) {
      case 'messages':
        return results.messages;
      case 'channels':
        return results.channels;
      case 'people':
        return results.users;
      default:
        return [...results.messages, ...results.channels, ...results.users];
    }
  };

  const handleSelect = (item: Message | Channel | UserType) => {
    // Navigate to the selected item
    if ('displayName' in item) {
      // User - could open DM
      onClose();
    } else if ('memberIds' in item) {
      // Channel - could switch to channel
      onClose();
    } else {
      // Message - could scroll to message
      onClose();
    }
  };

  const filteredResults = getFlatResults();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search messages, channels, and people..."
            className="flex-1 text-base outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
            ESC
          </kbd>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['all', 'messages', 'channels', 'people'] as SearchTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'messages' ? 'Messages' : tab === 'channels' ? 'Channels' : 'People'}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : query && filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search size={32} className="mb-2 text-gray-300" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          ) : !query ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search size={32} className="mb-2 text-gray-300" />
              <p>Start typing to search</p>
              <p className="text-sm mt-1">Search messages, channels, and team members</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredResults.map((item, index) => (
                <button
                  key={'id' in item ? item.id : index}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  {'displayName' in item ? (
                    // User
                    <>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {item.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{item.email}</p>
                      </div>
                      <User size={16} className="text-gray-400" />
                    </>
                  ) : 'memberIds' in item ? (
                    // Channel
                    <>
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Hash size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </>
                  ) : (
                    // Message
                    <>
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <MessageSquare size={16} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 line-clamp-2">{item.content}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span>Powered by TeamLink</span>
        </div>
      </div>
    </div>
  );
}
