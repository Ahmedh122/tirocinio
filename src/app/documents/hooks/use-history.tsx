import { useState } from 'react';

interface UseEditorHistoryProps<T> {
  initialData: T;
  onUpdate: (data: T) => Promise<void>;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEditorHistory<T extends Record<string, any>>({
  initialData,
  onUpdate,
}: UseEditorHistoryProps<T>) {
  const [history, setHistory] = useState<T[]>([initialData]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleUpdate = async (updatedData: T) => {
    try {
      await onUpdate(updatedData);
      const newHistory = history.slice(0, currentIndex + 1);
      setHistory([...newHistory, updatedData]);
      setCurrentIndex(newHistory.length);
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
    }
  };

  const handleUndo = async () => {
    if (currentIndex > 0) {
      const previousState = history[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      await onUpdate(previousState);
    }
  };

  const handleRedo = async () => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      await onUpdate(nextState);
    }
  };

  return {
    currentData: history[currentIndex],
    handleUpdate,
    handleUndo,
    handleRedo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}