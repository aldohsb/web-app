import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userName: {
    type: String,
    default: 'Guest',
    maxlength: 50,
  },
  isGuest: {
    type: Boolean,
    default: true,
  },
  stats: {
    totalLevelsCompleted: {
      type: Number,
      default: 0,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for performance
userSchema.index({ userId: 1 });
userSchema.index({ lastActive: -1 });

// Update last active on any activity
userSchema.methods.updateActivity = function() {
  this.lastActive = new Date();
  return this.save();
};

// Calculate accuracy
userSchema.methods.calculateAccuracy = function() {
  if (this.stats.totalQuestionsAnswered === 0) return 0;
  return Math.round((this.stats.totalCorrectAnswers / this.stats.totalQuestionsAnswered) * 100);
};

// Update stats
userSchema.methods.updateStats = function(correctAnswers, totalQuestions, levelCompleted, stars) {
  this.stats.totalQuestionsAnswered += totalQuestions;
  this.stats.totalCorrectAnswers += correctAnswers;
  
  if (levelCompleted) {
    this.stats.totalLevelsCompleted += 1;
  }
  
  if (stars > 0) {
    this.stats.totalStars += stars;
    this.stats.currentStreak += 1;
    this.stats.longestStreak = Math.max(this.stats.longestStreak, this.stats.currentStreak);
  } else {
    this.stats.currentStreak = 0;
  }
  
  this.stats.accuracy = this.calculateAccuracy();
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;