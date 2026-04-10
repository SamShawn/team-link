'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/sidebar/WorkspaceSidebar';
import { ChannelSidebar } from '@/components/sidebar/ChannelSidebar';
import { DMSidebar } from '@/components/sidebar/DMSidebar';
import { MessageList, Composer } from '@/components/chat';
import { ThreadPanel } from '@/components/thread';
import styles from './page.module.css';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    </div>
  );
}