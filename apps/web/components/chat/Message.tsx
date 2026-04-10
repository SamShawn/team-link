/* eslint-disable react/no-danger */
'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { MoreHorizontal, Smile, Reply, Edit2, Trash2, Check, X } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import type { Message as MessageType, User } from '@teamlink/shared/types';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';

interface MessageProps {
  message: MessageType;
  author: User;
  currentUserId: string;
  isGrouped?: boolean;
  showActions?: boolean;
  onReact?: (emoji: string) => void;
  onReply?: () => void;
  onEdit?: (content: string) => void;
  onDelete?: () => void;
  isOwn?: boolean;
}

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

const reactionBadgeClasses = (
  hasReacted: boolean
): string =>
  clsx(
    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm cursor-pointer transition-all duration-100',
    hasReacted
      ? 'bg-indigo-50 border border-indigo-500 text-indigo-600'
      : 'bg-gray-100 border border-transparent text-gray-600 hover:bg-gray-200'
  );

export const Message = React.memo(function Message({
  message,
  author,
  currentUserId,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing, editContent]);

  const formattedTime = useMemo(
    () => formatDistanceToNow(new Date(message.createdAt), { addSuffix: false }),
    [message.createdAt]
  );

  // XSS protection: sanitize HTML content
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(message.content, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'] }),
    [message.content]
  );

  const handleReaction = useCallback((emoji: string) => {
    onReact?.(emoji);
    setShowReactionPicker(false);
  }, [onReact]);

  const handleEditStart = useCallback(() => {
    setEditContent(message.content);
    setIsEditing(true);
  }, [message.content]);

  const handleEditCancel = useCallback(() => {
    setEditContent(message.content);
    setIsEditing(false);
  }, [message.content]);

  const handleEditSave = useCallback(() => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(editContent.trim());
    }
    setIsEditing(false);
  }, [editContent, message.content, onEdit]);

  return (
    <div
      className={clsx(
        'relative px-4 py-1 transition-colors duration-100',
        isHovered ? 'bg-gray-50' : 'bg-transparent'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowReactionPicker(false);
      }}
    >
      {/* Action buttons */}
      {showActions && (
        <div
          className={clsx(
            'absolute top-0 right-4 flex gap-0.5 p-1 bg-white rounded-md shadow-sm border border-gray-200 z-10 transition-opacity duration-100',
            isHovered && showActions ? 'opacity-100' : 'opacity-0 pointer-events-none',
            isGrouped ? '-top-4' : 'top-1'
          )}
        >
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            aria-label="Add reaction"
            className="flex items-center justify-center w-7 h-7 border-none bg-transparent rounded hover:bg-gray-100 cursor-pointer text-gray-500 transition-colors"
          >
            <Smile size={16} />
          </button>
          <button
            onClick={onReply}
            aria-label="Reply in thread"
            className="flex items-center justify-center w-7 h-7 border-none bg-transparent rounded hover:bg-gray-100 cursor-pointer text-gray-500 transition-colors"
          >
            <Reply size={16} />
          </button>
          <Dropdown
            trigger={
              <button
                aria-label="More actions"
                className="flex items-center justify-center w-7 h-7 border-none bg-transparent rounded hover:bg-gray-100 cursor-pointer text-gray-500 transition-colors"
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
                  onClick: handleEditStart,
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

      {/* Reaction picker */}
      {showReactionPicker && (
        <div className="absolute -top-10 left-0 flex gap-0.5 p-1.5 bg-white rounded-lg shadow-md border border-gray-200 z-20">
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-lg p-1 border-none bg-transparent rounded cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Message content */}
      <div className="flex gap-3 px-4 py-2">
        {/* Avatar / timestamp column */}
        <div className="w-9 flex-shrink-0 flex items-start">
          {isGrouped ? (
            <span className="text-xs text-gray-400 pl-9">{formattedTime}</span>
          ) : (
            <Avatar
              src={author.avatarUrl}
              name={author.displayName}
              size={32}
              status={author.status}
              showPresence
            />
          )}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          {!isGrouped && (
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm font-medium text-gray-900">{author.displayName}</span>
              <span className="text-xs text-gray-400">{formattedTime}</span>
              {message.isEdited && (
                <span className="text-xs text-gray-400">(edited)</span>
              )}
            </div>
          )}

          {/* Content */}
          {message.isDeleted ? (
            <p className="text-sm text-gray-400 italic">This message was deleted</p>
          ) : isEditing ? (
            <div className="flex items-end gap-2">
              <textarea
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSave();
                  } else if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
                className="flex-1 p-2 border border-indigo-500 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                rows={2}
              />
              <div className="flex gap-1">
                <button
                  onClick={handleEditSave}
                  className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  aria-label="Save edit"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  aria-label="Cancel edit"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p
              className="text-sm leading-relaxed text-gray-700 break-words"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          )}

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {message.reactions.map((reaction) => {
                const hasReacted = reaction.userIds.includes(currentUserId);
                return (
                  <span
                    key={reaction.emoji}
                    className={reactionBadgeClasses(hasReacted)}
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
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo to prevent unnecessary re-renders
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.isEdited === nextProps.message.isEdited &&
    prevProps.message.isDeleted === nextProps.message.isDeleted &&
    prevProps.message.reactions.length === nextProps.message.reactions.length &&
    prevProps.author.id === nextProps.author.id &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.isGrouped === nextProps.isGrouped
  );
});
