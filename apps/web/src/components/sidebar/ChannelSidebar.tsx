'use client';

import React, { useState } from 'react';
import { Hash, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useChannels, useActiveChannelId, useChatStore } from '@/stores/chatStore';
import styles from './ChannelSidebar.module.css';

export function ChannelSidebar() {
  const channels = useChannels();
  const activeChannelId = useActiveChannelId();
  const setActiveChannel = useChatStore((s) => s.setActiveChannel);
  const [channelsCollapsed, setChannelsCollapsed] = useState(false);
  const [dmsCollapsed, setDmsCollapsed] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>TeamLink</span>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => setChannelsCollapsed(!channelsCollapsed)}
          >
            {channelsCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            <span>Channels</span>
          </button>
          {!channelsCollapsed && (
            <div className={styles.list}>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`${styles.item} ${activeChannelId === channel.id ? styles.active : ''}`}
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <Hash size={16} className={styles.hashIcon} />
                  <span className={styles.channelName}>{channel.name}</span>
                  {channel.messageCount > 0 && <Badge count={channel.messageCount > 20 ? 20 : Math.floor(channel.messageCount / 3)} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}