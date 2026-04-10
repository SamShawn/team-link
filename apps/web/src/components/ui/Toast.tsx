'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onDismiss, duration = 4000 }: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 50);
    const timeout = setTimeout(onDismiss, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onDismiss]);

  return (
    <motion.div
      className={`${styles.toast} ${styles[type]}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <span className={styles.message}>{message}</span>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}