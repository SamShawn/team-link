'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Hash, FileText, Users, X } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import styles from './SearchModal.module.css';

type Tab = 'all' | 'messages' | 'channels' | 'files' | 'people';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Search size={14} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={14} /> },
  { id: 'channels', label: 'Channels', icon: <Hash size={14} /> },
  { id: 'files', label: 'Files', icon: <FileText size={14} /> },
  { id: 'people', label: 'People', icon: <Users size={14} /> },
];

const RECENT_SEARCHES_KEY = 'teamlink:recent-searches';
const MAX_RECENT = 5;

export function SearchModal() {
  const isOpen = useChatStore((s) => s.searchModalOpen);
  const setSearchModalOpen = useChatStore((s) => s.setSearchModalOpen);
  const messages = useChatStore((s) => s.messages);
  const channels = useChatStore((s) => s.channels);
  const users = useChatStore((s) => s.users);

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          setRecentSearches([]);
        }
      }
      setQuery('');
      setActiveTab('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Save recent search
  const saveRecentSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  // Search results
  function getResults() {
    if (!query.trim()) return { messages: [], channels: [], users: [], files: [] };

    const q = query.toLowerCase();
    const allMessages = Object.values(messages).flat();

    return {
      messages: allMessages.filter((m) => !m.isDeleted && m.content.toLowerCase().includes(q)).slice(0, 10),
      channels: channels.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5),
      users: Object.values(users).filter((u) => u.displayName.toLowerCase().includes(q)).slice(0, 5),
      files: [] as Array<{ id: string; name: string; type: string }>,
    };
  }

  const results = getResults();
  const { messages: msgResults, channels: chResults, users: userResults, files: fileResults } = results;

  function getAllResults() {
    return [
      ...msgResults.map((m) => ({ type: 'message' as const, data: m })),
      ...chResults.map((c) => ({ type: 'channel' as const, data: c })),
      ...userResults.map((u) => ({ type: 'user' as const, data: u })),
      ...fileResults.map((f) => ({ type: 'file' as const, data: f })),
    ];
  }

  function getFilteredResults() {
    switch (activeTab) {
      case 'messages': return msgResults.map((m) => ({ type: 'message' as const, data: m }));
      case 'channels': return chResults.map((c) => ({ type: 'channel' as const, data: c }));
      case 'people': return userResults.map((u) => ({ type: 'user' as const, data: u }));
      case 'files': return fileResults.map((f) => ({ type: 'file' as const, data: f }));
      default: return getAllResults();
    }
  }

  const filteredResults = getFilteredResults();

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        saveRecentSearch(query);
        setSearchModalOpen(false);
      }
    } else if (e.key === 'Escape') {
      setSearchModalOpen(false);
    }
  }

  function handleResultClick(result: (typeof filteredResults)[0]) {
    saveRecentSearch(query);
    setSearchModalOpen(false);
  }

  if (!isOpen) return null;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={() => setSearchModalOpen(false)}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Search TeamLink..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => { setActiveTab(tab.id); setSelectedIndex(0); }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className={styles.results}>
          {!query && recentSearches.length > 0 && (
            <div className={styles.recentSection}>
              <div className={styles.sectionLabel}>Recent searches</div>
              {recentSearches.map((s) => (
                <button key={s} className={styles.recentItem} onClick={() => setQuery(s)}>
                  <Search size={14} />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          )}

          {query && filteredResults.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>&#128269;</div>
              <p className={styles.emptyTitle}>No results found</p>
              <p className={styles.emptySubtitle}>Try a different search term</p>
            </div>
          )}

          {filteredResults.map((result, i) => {
            if (result.type === 'message') {
              const msg = result.data;
              const author = users[msg.authorId];
              return (
                <button
                  key={msg.id}
                  className={`${styles.resultItem} ${selectedIndex === i ? styles.selected : ''}`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <MessageSquare size={16} className={styles.resultIcon} />
                  <div className={styles.resultContent}>
                    <span className={styles.resultTitle}>{author?.displayName ?? 'Unknown'}</span>
                    <span className={styles.resultSnippet}>{msg.content.slice(0, 80)}</span>
                  </div>
                </button>
              );
            }
            if (result.type === 'channel') {
              const ch = result.data;
              return (
                <button
                  key={ch.id}
                  className={`${styles.resultItem} ${selectedIndex === i ? styles.selected : ''}`}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <Hash size={16} className={styles.resultIcon} />
                  <div className={styles.resultContent}>
                    <span className={styles.resultTitle}>#{ch.name}</span>
                    <span className={styles.resultSnippet}>{ch.visibility} channel</span>
                  </div>
                </button>
              );
            }
            if (result.type === 'user') {
              const user = result.data;
              return (
                <button
                  key={user.id}
                  className={`${styles.resultItem} ${selectedIndex === i ? styles.selected : ''}`}
                  onClick={() => handleResultClick(result)}
                  onMouseOver={() => setSelectedIndex(i)}
                >
                  <Users size={16} className={styles.resultIcon} />
                  <div className={styles.resultContent}>
                    <span className={styles.resultTitle}>{user.displayName}</span>
                    <span className={styles.resultSnippet}>@{user.username}</span>
                  </div>
                </button>
              );
            }
            return null;
          })}
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span className={styles.hint}><kbd>Enter</kbd> Select</span>
          <span className={styles.hint}><kbd>Esc</kbd> Close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}