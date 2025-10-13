class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
  }
  
  preload(soundName, url) {
    if (typeof Audio === 'undefined') return;
    
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds[soundName] = audio;
  }
  
  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName].cloneNode();
      sound.volume = this.volume;
      sound.play();
    } catch (error) {
      console.error(`Failed to play sound: ${soundName}`, error);
    }
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }
}

// Singleton instance
const audioManager = new AudioManager();

// Preload sounds (URLs would be actual audio files in production)
if (typeof window !== 'undefined') {
  audioManager.preload('correct', '/sounds/correct.mp3');
  audioManager.preload('wrong', '/sounds/wrong.mp3');
  audioManager.preload('level_complete', '/sounds/level_complete.mp3');
  audioManager.preload('star', '/sounds/star.mp3');
  audioManager.preload('click', '/sounds/click.mp3');
}

export default audioManager;