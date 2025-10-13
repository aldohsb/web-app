import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Target, TrendingUp } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';
import ProgressBar from '@/components/common/ProgressBar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useUserStore } from '@/store/useUserStore';
import { TOTAL_LEVELS } from '@/data/levelConfig';

const Home = () => {
  const navigate = useNavigate();
  const { user, progress, loading, initialized, initialize } = useUserStore();
  
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);
  
  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading your progress..." />
      </div>
    );
  }
  
  const stats = {
    currentLevel: progress?.currentLevel || 1,
    totalStars: progress?.totalStars || 0,
    completedLevels: progress?.completedLevels?.length || 0,
    accuracy: user?.stats?.accuracy || 0,
  };
  
  const handleContinue = () => {
    navigate(`/quiz/${stats.currentLevel}`);
  };
  
  const handleLevels = () => {
    navigate('/levels');
  };
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-zen-800 animate-fade-in">
            Welcome to <span className="japanese-text">JapaSense</span>
          </h1>
          <p className="mb-2 text-xl text-zen-600">
            Master Japanese Characters through Practice
          </p>
          <p className="text-zen-500">
            Hello, <span className="font-semibold">{user?.userName || 'Guest'}</span>!
          </p>
        </div>
        
        {/* Continue Card */}
        <Card className="mb-8 text-white border-none bg-gradient-to-br from-zen-600 to-bamboo-600">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex-1">
              <h2 className="mb-2 text-3xl font-bold">Continue Learning</h2>
              <p className="mb-4 text-white/90">
                You're on Level {stats.currentLevel} of {TOTAL_LEVELS}
              </p>
              <ProgressBar 
                value={stats.currentLevel} 
                max={TOTAL_LEVELS}
                color="bamboo"
                className="mb-4"
              />
              <Button
                variant="secondary"
                size="lg"
                onClick={handleContinue}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Level {stats.currentLevel}
              </Button>
            </div>
            
            <div className="text-center md:text-right">
              <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
                <p className="mb-2 text-sm text-white/80">Total Stars</p>
                <p className="text-5xl font-bold">{stats.totalStars}</p>
                <StarRating stars={3} size="lg" className="justify-center mt-2 md:justify-end" />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-zen-100 rounded-xl">
                <Target className="w-8 h-8 text-zen-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Current Level</p>
                <p className="text-3xl font-bold text-zen-800">
                  {stats.currentLevel}
                </p>
              </div>
            </div>
          </Card>
          
          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-xl">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Completed Levels</p>
                <p className="text-3xl font-bold text-zen-800">
                  {stats.completedLevels}
                </p>
              </div>
            </div>
          </Card>
          
          <Card hoverable>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="mb-1 text-sm text-zen-600">Accuracy</p>
                <p className="text-3xl font-bold text-zen-800">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card hoverable onClick={handleLevels} className="cursor-pointer">
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-zen-100 rounded-2xl">
                <span className="text-3xl japanese-text">練</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zen-800">
                Practice Levels
              </h3>
              <p className="mb-4 text-zen-600">
                Choose any unlocked level to practice
              </p>
              <Button variant="outline">
                View All Levels
              </Button>
            </div>
          </Card>
          
          <Card hoverable onClick={() => navigate('/profile')} className="cursor-pointer">
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-bamboo-100 rounded-2xl">
                <span className="text-3xl japanese-text">統</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zen-800">
                Your Progress
              </h3>
              <p className="mb-4 text-zen-600">
                View detailed statistics and achievements
              </p>
              <Button variant="outline">
                View Profile
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Learning Path Info */}
        <Card className="mt-8 bg-zen-50 border-zen-300">
          <h3 className="mb-4 text-xl font-bold text-zen-800">Learning Path</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-4 text-center bg-white rounded-xl">
              <p className="mb-2 text-sm text-zen-600">Level 1-50</p>
              <p className="mb-1 text-2xl font-bold text-zen-800 japanese-text">
                ひらがな
              </p>
              <p className="text-xs text-zen-500">Hiragana</p>
            </div>
            
            <div className="p-4 text-center bg-white rounded-xl">
              <p className="mb-2 text-sm text-zen-600">Level 51-100</p>
              <p className="mb-1 text-2xl font-bold text-zen-800 japanese-text">
                カタカナ
              </p>
              <p className="text-xs text-zen-500">Katakana</p>
            </div>
            
            <div className="p-4 text-center bg-white rounded-xl">
              <p className="mb-2 text-sm text-zen-600">Level 101-150</p>
              <p className="mb-1 text-2xl font-bold text-zen-800 japanese-text">
                混合
              </p>
              <p className="text-xs text-zen-500">Mixed Kana</p>
            </div>
            
            <div className="p-4 text-center bg-white rounded-xl">
              <p className="mb-2 text-sm text-zen-600">Level 151-200</p>
              <p className="mb-1 text-2xl font-bold text-zen-800 japanese-text">
                漢字
              </p>
              <p className="text-xs text-zen-500">With Kanji</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;