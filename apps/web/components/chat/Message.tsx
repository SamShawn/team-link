'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MoreHorizontal, Smile, Reply, Edit2, Trash2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import type { Message as MessageType, User, Reaction } from '@teamlink/shared/types';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: MessageType;
  author: User;
  isGrouped?: boolean;
  showActions?: boolean;
  onReact?: (emoji: string) => void;
  onReply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwn?: boolean;
}

const reactionColors: Record<string, string> = {
  '👍': '#3B82F6',
  '❤️': '#EF4444',
  '😂': '#F59E0B',
  '😮': '#8B5CF6',
  '😢': '#06B6D4',
  '🎉': '#10B981',
};

export function Message({
  message,
  author,
  isGrouped = false,
  showActions = true,
  onReact,
  onReply,
  onEdit,
  onDelete,
  isOwn = false,
}: MessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  const handleReaction = (emoji: string) => {
    onReact?.(emoji);
    setShowReactionPicker(false);
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: isGrouped ? '2px 16px' : '8px 16px',
    transition: 'background 50ms',
    background: isHovered ? '#F9FAFB' : 'transparent',
    cursor: 'default',
  };

  const avatarContainerStyle: React.CSSProperties = {
    width: '36px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: isGrouped ? '0' : '4px',
  };

  const authorNameStyle: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '15px',
    color: '#111827',
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9CA3AF',
    letterSpacing: '0.02em',
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#374151',
    wordWrap: 'break-word',
  };

  const reactionsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '6px',
  };

  const reactionBadgeStyle = (hasReacted: boolean, emojiColor?: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 100ms',
    background: hasReacted ? '#EEF2FF' : '#F3F4F6',
    border: `1px solid ${hasReacted ? '#6366F1' : 'transparent'}`,
    color: hasReacted ? '#4F46E5' : '#4B5563',
  });

  const actionsStyle: React.CSSProperties = {
    position: 'absolute',
    top: isGrouped ? '-16px' : '4px',
    right: '16px',
    display: 'flex',
    gap: '2px',
    padding: '4px',
    background: '#FFFFFF',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
    opacity: isHovered && showActions ? 1 : 0,
    transition: 'opacity 100ms',
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#6B7280',
    transition: 'all 50ms',
  };

  const reactionPickerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '0',
    display: 'flex',
    gap: '2px',
    padding: '6px',
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
    border: '1px solid #E5E7EB',
    zIndex: 10,
  };

  const messageGroupStyle: React.CSSProperties = {
    position: 'relative',
  };

  return (
    <div
      style={messageGroupStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowReactionPicker(false);
      }}
    >
      {showActions && (
        <div style={actionsStyle} className="message-actions">
          <button
            style={actionButtonStyle}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            aria-label="Add reaction"
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Smile size={16} />
          </button>
          <button
            style={actionButtonStyle}
            onClick={onReply}
            aria-label="Reply in thread"
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Reply size={16} />
          </button>
          <Dropdown
            trigger={
              <button
                style={actionButtonStyle}
                aria-label="More actions"
                onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <MoreHorizontal size={16} />
              </button>
            }
            items={[
              ...(isOwn ? [
                {
                  id: 'edit',
                  label: 'Edit',
                  icon: <Edit2 size={16} />,
                  onClick: () => onEdit?.(),
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: <Trash2 size={16} />,
                  danger: true,
                  onClick: () => onDelete?.(),
                },
              ] : []),
            ]}
            align="right"
          />
        </div>
      )}

      {showReactionPicker && (
        <div style={reactionPickerStyle}>
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              style={{
                fontSize: '18px',
                padding: '4px',
                border: 'none',
                background: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 50ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div style={containerStyle}>
        {isGrouped ? (
          <div style={{ ...avatarContainerStyle, paddingLeft: '36px' }}>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
              {formatTime(new Date(message.createdAt))}
            </span>
          </div>
        ) : (
          <div style={avatarContainerStyle}>
            <Avatar src={author.avatarUrl} name={author.displayName} size={32} status={author.status} showPresence />
          </div>
        )}

        <div style={contentStyle}>
          {!isGrouped && (
            <div style={headerStyle}>
              <span style={authorNameStyle}>{author.displayName}</span>
              <span style={timestampStyle}>{formatTime(new Date(message.createdAt))}</span>
              {message.isEdited && (
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>(edited)</span>
              )}
            </div>
          )}

          {message.isDeleted ? (
            <p style={{ ...bodyStyle, fontStyle: 'italic', color: '#9CA3AF' }}>
              This message was deleted
            </p>
          ) : (
            <p style={bodyStyle}>{message.content}</p>
          )}

          {message.reactions.length > 0 && (
            <div style={reactionsStyle}>
              {message.reactions.map((reaction) => {
                const hasReacted = reaction.userIds.includes('current-user');
                return (
                  <span
                    key={reaction.emoji}
                    style={reactionBadgeStyle(hasReacted, reactionColors[reaction.emoji])}
                  >
                    {reaction.emoji} {reaction.count}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
