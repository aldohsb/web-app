import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // State
  soundEnabled: true,
  volume: 0.7,
  theme: 'zen',
  animationsEnabled: true,
  
  // Sound settings
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },
  
  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  
  // Theme settings
  setTheme: (theme) => {
    set({ theme });
  },
  
  // Animation settings
  toggleAnimations: () => {
    set((state) => ({ animationsEnabled: !state.animationsEnabled }));
  },
  
  // Play sound effect
  playSound: (soundName) => {
    const { soundEnabled, volume } = get();
    if (!soundEnabled) return;
    
    // Sound implementation would go here
    // For now, just a placeholder
    console.log(`Playing sound: ${soundName} at volume ${volume}`);
  },
  
  // Save settings to localStorage
  saveSettings: () => {
    const { soundEnabled, volume, theme, animationsEnabled } = get();
    localStorage.setItem('japasense_settings', JSON.stringify({
      soundEnabled,
      volume,
      theme,
      animationsEnabled,
    }));
  },
  
  // Load settings from localStorage
  loadSettings: () => {
    try {
      const saved = localStorage.getItem('japasense_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        set(settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },
}));

export default useGameStore;