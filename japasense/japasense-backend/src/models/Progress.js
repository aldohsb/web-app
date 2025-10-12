import mongoose from 'mongoose';

const levelProgressSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 200,
  },
  stars: {
    type: Number,
    default: 0,
    min: 0,
    max: 3,
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  currentLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 200,
  },
  unlockedLevels: [{
    type: Number,
    min: 1,
    max: 200,
  }],
  levelProgress: [levelProgressSchema],
  totalStars: {
    type: Number,
    default: 0,
  },
  completedLevels: [{
    type: Number,
    min: 1,
    max: 200,
  }],
  lastSyncedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
progressSchema.index({ userId: 1 });
progressSchema.index({ 'levelProgress.level': 1 });

// Initialize with level 1 unlocked
progressSchema.pre('save', function(next) {
  if (this.isNew && this.unlockedLevels.length === 0) {
    this.unlockedLevels = [1];
  }
  next();
});

// Get progress for specific level
progressSchema.methods.getLevelProgress = function(level) {
  return this.levelProgress.find(lp => lp.level === level);
};

// Update level progress
progressSchema.methods.updateLevelProgress = function(level, stars, score) {
  const existingProgress = this.levelProgress.find(lp => lp.level === level);
  
  if (existingProgress) {
    // Update existing progress
    existingProgress.stars = Math.max(existingProgress.stars, stars);
    existingProgress.bestScore = Math.max(existingProgress.bestScore, score);
    existingProgress.attempts += 1;
    existingProgress.lastAttemptAt = new Date();
    
    if (stars > 0) {
      existingProgress.completedAt = new Date();
    }
  } else {
    // Create new progress entry
    this.levelProgress.push({
      level,
      stars,
      bestScore: score,
      attempts: 1,
      completedAt: stars > 0 ? new Date() : null,
      lastAttemptAt: new Date(),
    });
  }
  
  // Unlock next level if passed
  if (stars > 0 && !this.unlockedLevels.includes(level + 1) && level < 200) {
    this.unlockedLevels.push(level + 1);
  }
  
  // Update current level
  this.currentLevel = Math.max(this.currentLevel, level);
  
  // Add to completed levels if passed
  if (stars > 0 && !this.completedLevels.includes(level)) {
    this.completedLevels.push(level);
  }
  
  // Recalculate total stars
  this.totalStars = this.levelProgress.reduce((sum, lp) => sum + lp.stars, 0);
  
  this.lastSyncedAt = new Date();
  
  return this.save();
};

// Get statistics
progressSchema.methods.getStats = function() {
  return {
    currentLevel: this.currentLevel,
    totalLevelsCompleted: this.completedLevels.length,
    totalStars: this.totalStars,
    unlockedLevels: this.unlockedLevels.length,
    averageStars: this.completedLevels.length > 0 
      ? (this.totalStars / this.completedLevels.length).toFixed(2)
      : 0,
    perfectLevels: this.levelProgress.filter(lp => lp.stars === 3).length,
  };
};

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;