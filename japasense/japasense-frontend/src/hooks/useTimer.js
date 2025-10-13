import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (autoStart = false) => {
  const [isActive, setIsActive] = useState(autoStart);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  
  const start = useCallback(() => {
    startTimeRef.current = Date.now() - elapsed;
    setIsActive(true);
  }, [elapsed]);
  
  const pause = useCallback(() => {
    setIsActive(false);
  }, []);
  
  const reset = useCallback(() => {
    setIsActive(false);
    setElapsed(0);
    startTimeRef.current = null;
  }, []);
  
  const stop = useCallback(() => {
    pause();
    return elapsed;
  }, [pause, elapsed]);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 100);
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
  }, [isActive]);
  
  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    elapsed,
    isActive,
    formattedTime: formatTime(elapsed),
    start,
    pause,
    reset,
    stop,
  };
};

export default useTimer;