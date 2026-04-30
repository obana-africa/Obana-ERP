import { useState, useCallback } from 'react';

export const useThemeHistory = (initialTheme) => {
  const initialSnapshot = JSON.stringify(initialTheme);
  const [history, setHistory] = useState([initialSnapshot]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback((newTheme) => {
    const snapshot = JSON.stringify(newTheme);
    setHistory(prev => [...prev.slice(0, currentIndex + 1), snapshot]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return JSON.parse(history[currentIndex - 1]);
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return JSON.parse(history[currentIndex + 1]);
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { pushState, undo, redo, canUndo, canRedo };
};