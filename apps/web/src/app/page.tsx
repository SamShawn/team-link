'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/sidebar/WorkspaceSidebar';
import { ChannelSidebar } from '@/components/sidebar/ChannelSidebar';
import { DMSidebar } from '@/components/sidebar/DMSidebar';
import { MessageList, Composer } from '@/components/chat';
import { ThreadPanel } from '@/components/thread';
import { SearchModal } from '@/components/search';
import { CallPanel } from '@/components/call/CallPanel';
import { IncomingCallOverlay } from '@/components/call/IncomingCallOverlay';
import { useChatStore } from '@/stores/chatStore';
import styles from './page.module.css';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setSearchModalOpen = useChatStore((s) => s.setSearchModalOpen);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  return (
    <div className={styles.layout}>
      {/* Mobile hamburger */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Workspace sidebar */}
      <div className={`${styles.workspaceSidebar} ${sidebarOpen ? styles.mobileOpen : ''}`}>
        <WorkspaceSidebar />
      </div>

      {/* Channel/DM sidebar */}
      <div className={`${styles.channelSidebar} ${sidebarOpen ? styles.mobileOpen : ''}`}>
        <ChannelSidebar />
        <DMSidebar />
      </div>

      {/* Main message area */}
      <main className={styles.main}>
        <div className={styles.messageArea}>
          <MessageList />
          <Composer />
        </div>
      </main>

      {/* Thread panel */}
      <ThreadPanel />

      {/* Search modal */}
      <SearchModal />

      {/* Call UI */}
      <IncomingCallOverlay />
      <CallPanel />
    </div>
  );
}