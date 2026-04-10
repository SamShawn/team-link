'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WorkspaceSidebar } from '@/components/sidebar/WorkspaceSidebar';
import { ChannelSidebar } from '@/components/sidebar/ChannelSidebar';
import { DMSidebar } from '@/components/sidebar/DMSidebar';
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
        <div className={styles.welcome}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            TeamLink
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Select a channel or DM to start messaging
          </p>
        </div>
      </main>
    </div>
  );
}