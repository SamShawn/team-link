'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from 'lucide-react';
import styles from './CallControls.module.css';

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

export function CallControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className={styles.controls}>
      <button
        className={`${styles.btn} ${isMuted ? styles.active : ''}`}
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <button
        className={`${styles.btn} ${isVideoOff ? styles.active : ''}`}
        onClick={onToggleVideo}
        aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      <button
        className={`${styles.btn} ${isScreenSharing ? styles.active : ''}`}
        onClick={onToggleScreenShare}
        aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        <Monitor size={20} />
      </button>

      <button
        className={`${styles.btn} ${styles.endCall}`}
        onClick={onEndCall}
        aria-label="End call"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
}