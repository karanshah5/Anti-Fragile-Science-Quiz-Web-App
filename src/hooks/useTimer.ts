import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime: number = 30, onTimeUp?: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = (newTime: number = initialTime) => {
    setTimeLeft(newTime);
    setIsRunning(false);
  };

  return {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer
  };
};