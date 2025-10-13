import { useState, useEffect } from 'react';
import { User, Trophy, Target, TrendingUp, Award, Flame, Edit2 } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';
import Modal from '@/components/common/Modal';
import { useUserStore } from '@/store/useUserStore';
import { userAPI } from '@/services/api';
import { TOTAL_LEVELS } from '@/data/levelConfig';

const Profile = () => {
  const { user, progress, updateUserName } = useUserStore();
  const [stats, setStats] = useState(null);
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);
  
  const loadStats = async () => {
    try {
      const response = await userAPI.getStats(user.userId);
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  
  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.userName) {
      setShowEditName(false);
      return;
    }
    
    setLoading(true);
    try {
      await updateUserName(newName.trim());
      setShowEditName(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const progressPercentage = Math.round((progress?.currentLevel / TOTAL_LEVELS) * 100);
  const perfectLevels = progress?.levelProgress?.filter(lp => lp.stars === 3).length || 0;
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-zen-800">Your Profile</h1>
          <p className="text-zen-600">Track your learning progress</p>
        </div>
        
        {/* Profile Card */}
        <Card className="mb-8 text-white border-none bg-gradient-to-br from-zen-600 to-bamboo-600">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center gap-2 mb-2 md:justify-start">
                <h2 className="text-3xl font-bold">{user?.userName || 'Guest'}</h2>
                <button
                  onClick={() => {
                    setNewName(user?.userName || '');
                    setShowEditName(true);
                  }}
                  className="p-2 transition-colors rounded-lg hover:bg-white/10"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/80">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-center">
              <p className="mb-2 text-sm text-white/80">Total Stars</p>
              <div className="flex items-center gap-2">
                <p className="text-5xl font-bold">{progress?.totalStars || 0}</p>
                <StarRating stars={3} size="lg" />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Completed</p>
                <p className="text-3xl font-bold text-zen-800">
                  {progress?.completedLevels?.length || 0}
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Accuracy</p>
                <p className="text-3xl font-bold text-zen-800">
                  {user?.stats?.accuracy || 0}%
                </p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-100 rounded-xl">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Perfect Levels</p>
                <p className="text-3xl font-bold text-zen-800">
                  {perfectLevels}
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Detailed Stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Progress Overview */}
          <Card>
            <Card.Header>
              <Card.Title>Progress Overview</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zen-700">Overall Progress</span>
                    <span className="font-bold text-zen-800">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 overflow-hidden rounded-full bg-zen-200">
                    <div 
                      className="h-full transition-all duration-500 bg-gradient-to-r from-zen-600 to-bamboo-600"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zen-200">
                  <div>
                    <p className="mb-1 text-sm text-zen-600">Total Questions</p>
                    <p className="text-2xl font-bold text-zen-800">
                      {user?.stats?.totalQuestionsAnswered || 0}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-zen-600">Correct Answers</p>
                    <p className="text-2xl font-bold text-green-600">
                      {user?.stats?.totalCorrectAnswers || 0}
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          {/* Achievements */}
          <Card>
            <Card.Header>
              <Card.Title>Achievements</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zen-50">
                  <div className="flex items-center gap-3">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-medium text-zen-800">Current Streak</p>
                      <p className="text-sm text-zen-600">Days in a row</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-zen-800">
                    {user?.stats?.currentStreak || 0}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-zen-50">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-medium text-zen-800">Longest Streak</p>
                      <p className="text-sm text-zen-600">Best performance</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-zen-800">
                    {user?.stats?.longestStreak || 0}
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-zen-50">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="font-medium text-zen-800">Total Stars</p>
                      <p className="text-sm text-zen-600">All levels combined</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-zen-800">
                    {progress?.totalStars || 0}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        
        {/* Learning Path Progress */}
        <Card className="mt-6">
          <Card.Header>
            <Card.Title>Learning Path Progress</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                { name: 'Hiragana', range: '1-50', levels: [1, 50], char: 'ひ' },
                { name: 'Katakana', range: '51-100', levels: [51, 100], char: 'カ' },
                { name: 'Mixed', range: '101-150', levels: [101, 150], char: '混' },
                { name: 'Kanji', range: '151-200', levels: [151, 200], char: '漢' },
              ].map((path, index) => {
                const completed = progress?.completedLevels?.filter(
                  l => l >= path.levels[0] && l <= path.levels[1]
                ).length || 0;
                const total = path.levels[1] - path.levels[0] + 1;
                const percentage = Math.round((completed / total) * 100);
                
                return (
                  <div key={index} className="p-4 bg-zen-50 rounded-xl">
                    <div className="mb-3 text-center">
                      <p className="mb-1 text-2xl font-bold japanese-text text-zen-800">
                        {path.char}
                      </p>
                      <p className="font-medium text-zen-800">{path.name}</p>
                      <p className="text-xs text-zen-600">Level {path.range}</p>
                    </div>
                    <div className="w-full h-2 mb-2 overflow-hidden rounded-full bg-zen-200">
                      <div 
                        className="h-full transition-all duration-500 bg-zen-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-center text-zen-600">
                      {completed} / {total}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      </div>
      
      {/* Edit Name Modal */}
      <Modal
        isOpen={showEditName}
        onClose={() => setShowEditName(false)}
        title="Edit Your Name"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
            className="zen-input"
            maxLength={50}
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowEditName(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleUpdateName}
              loading={loading}
              disabled={!newName.trim() || newName === user?.userName}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;<div className="flex items-center gap-4">
              <div className="p-4 bg-zen-100 rounded-xl">
                <Target className="w-8 h-8 text-zen-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Current Level</p>
                <p className="text-3xl font-bold text-zen-800">
                  {progress?.currentLevel || 1}
                </p>
              </div>
            </div>
          </Card>
          
          <Card></Card>