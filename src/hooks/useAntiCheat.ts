import { useState, useEffect, useCallback } from 'react';
import { Violation } from '../types';

export const useAntiCheat = (onViolation: (violation: Violation) => void) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [isTabActive, setIsTabActive] = useState(true);

  const addViolation = useCallback((type: Violation['type'], details: string) => {
    const violation: Violation = {
      type,
      timestamp: new Date(),
      details
    };
    
    setViolations(prev => [...prev, violation]);
    onViolation(violation);
  }, [onViolation]);

  // Tab change detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        addViolation('tab_change', 'User switched to another tab');
      } else {
        setIsTabActive(true);
      }
    };

    const handleFocusLoss = () => {
      addViolation('focus_loss', 'Browser window lost focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleFocusLoss);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleFocusLoss);
    };
  }, [addViolation]);

  // Copy/Paste detection
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('copy', 'Attempted to copy content');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('paste', 'Attempted to paste content');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common copy/paste shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault();
        addViolation(e.key === 'v' ? 'paste' : 'copy', `Keyboard shortcut: Ctrl+${e.key.toUpperCase()}`);
      }
      
      // Prevent right-click context menu
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [addViolation]);

  return {
    violations,
    isTabActive,
    violationCount: violations.length
  };
};