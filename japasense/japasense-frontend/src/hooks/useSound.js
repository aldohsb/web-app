import { useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';

// Sound effect URLs (would be actual audio files in production)
const SOUNDS = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  level_complete: '/sounds/level_complete.mp3',
  star: '/sounds/star.mp3',
  click: '/sounds/click.mp3',
};

export const useSound = () => {
  const { soundEnabled, volume } = useGameStore();
  
  const play = useCallback((soundName) => {
    if (!soundEnabled) return;
    
    // In production, this would actually play the audio file
    // For now, just a placeholder
    console.log(`Playing sound: ${soundName} at volume ${volume}`);
    
    // Actual implementation would be:
    // const audio = new Audio(SOUNDS[soundName]);
    // audio.volume = volume;
    // audio.play().catch(err => console.error('Failed to play sound:', err));
  }, [soundEnabled, volume]);
  
  const playCorrect = useCallback(() => play('correct'), [play]);
  const playWrong = useCallback(() => play('wrong'), [play]);
  const playLevelComplete = useCallback(() => play('level_complete'), [play]);
  const playStar = useCallback(() => play('star'), [play]);
  const playClick = useCallback(() => play('click'), [play]);
  
  return {
    play,
    playCorrect,
    playWrong,
    playLevelComplete,
    playStar,
    playClick,
  };
};

export default useSound;