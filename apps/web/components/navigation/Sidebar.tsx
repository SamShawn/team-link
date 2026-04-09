'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  Search,
  Settings,
  Plus,
  ChevronDown,
  Hash,
  Lock,
  MessageSquare,
  Users,
  HelpCircle,
} from 'lucide-react';
import { WorkspaceAvatar, Avatar } from '../ui/Avatar';
import { ChannelItem, DMItem, ChannelSection } from '../chat/ChannelItem';
import type { Workspace, Channel, User } from '@teamlink/shared/types';

interface SidebarProps {
  workspace: Workspace;
  channels: Channel[];
  directMessages: { user: User; dmId: string }[];
  activeChannelId?: string;
  activeDMId?: string;
  currentUser: User;
  onChannelClick: (channelId: string) => void;
  onDMClick: (dmId: string) => void;
  onCreateChannel?: () => void;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
}

export function Sidebar({
  workspace,
  channels,
  directMessages,
  activeChannelId,
  activeDMId,
  currentUser,
  onChannelClick,
  onDMClick,
  onCreateChannel,
  onSearchClick,
  onSettingsClick,
}: SidebarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const sidebarStyle: React.CSSProperties = {
    width: '260px',
    height: '100vh',
    background: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  };

  const workspaceHeaderStyle: React.CSSProperties = {
    height: '56px',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E5E7EB',
    flexShrink: 0,
  };

  const workspaceButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 100ms',
    maxWidth: '180px',
  };

  const workspaceNameStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#111827',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '8px 0',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px 4px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const iconButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    border: 'none',
    background: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#6B7280',
    transition: 'all 50ms',
  };

  const userSectionStyle: React.CSSProperties = {
    height: '52px',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderTop: '1px solid #E5E7EB',
    flexShrink: 0,
  };

  const quickActionsStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '60px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    color: '#6B7280',
    transition: 'all 100ms',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Workspace Header */}
      <div style={workspaceHeaderStyle}>
        <button
          style={workspaceButtonStyle}
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <WorkspaceAvatar name={workspace.name} src={workspace.avatarUrl} size={32} />
          <span style={workspaceNameStyle}>{workspace.name}</span>
          <ChevronDown size={16} style={{ color: '#6B7280', flexShrink: 0 }} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        {/* Channels */}
        <div style={{ padding: '0 4px' }}>
          <ChannelSection title="Channels">
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={channel.id === activeChannelId}
                onClick={() => onChannelClick(channel.id)}
              />
            ))}
            {onCreateChannel && (
              <button
                onClick={onCreateChannel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 8px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#6B7280',
                  fontSize: '14px',
                  width: '100%',
                  transition: 'background 50ms',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Plus size={16} />
                <span>Add channels</span>
              </button>
            )}
          </ChannelSection>
        </div>

        {/* Direct Messages */}
        <div style={{ padding: '8px 4px 0' }}>
          <ChannelSection title="Direct Messages">
            {directMessages.map(({ user, dmId }) => (
              <DMItem
                key={dmId}
                user={user}
                isActive={dmId === activeDMId}
                onClick={() => onDMClick(dmId)}
              />
            ))}
          </ChannelSection>
        </div>
      </nav>

      {/* User Section */}
      <div style={userSectionStyle}>
        <Avatar
          src={currentUser.avatarUrl}
          name={currentUser.displayName}
          size={32}
          status={currentUser.status}
          showPresence
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser.displayName}
          </p>
          <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
            {currentUser.status === 'online' ? 'Active' : currentUser.status}
          </p>
        </div>
        <button
          style={iconButtonStyle}
          onClick={onSettingsClick}
          aria-label="Settings"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Settings size={18} />
        </button>
        <button
          style={iconButtonStyle}
          aria-label="Help"
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Quick Actions */}
      <div style={quickActionsStyle}>
        <button
          style={actionButtonStyle}
          onClick={onSearchClick}
          aria-label="Search"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F3F4F6';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <Search size={18} />
        </button>
      </div>
    </aside>
  );
}
