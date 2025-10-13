import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Play } from 'lucide-react';
import Card from '@/components/common/Card';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/common/Button';
import { useUserStore } from '@/store/useUserStore';
import { TOTAL_LEVELS } from '@/data/levelConfig';
import clsx from 'clsx';

const Levels = () => {
  const navigate = useNavigate();
  const { progress } = useUserStore();
  const [filter, setFilter] = useState('all'); // all, hiragana, katakana, mixed, kanji
  
  const levels = useMemo(() => {
    return Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);
  }, []);
  
  const filteredLevels = useMemo(() => {
    if (filter === 'all') return levels;
    if (filter === 'hiragana') return levels.filter(l => l >= 1 && l <= 50);
    if (filter === 'katakana') return levels.filter(l => l >= 51 && l <= 100);
    if (filter === 'mixed') return levels.filter(l => l >= 101 && l <= 150);
    if (filter === 'kanji') return levels.filter(l => l >= 151 && l <= 200);
    return levels;
  }, [levels, filter]);
  
  const isLevelUnlocked = (level) => {
    return progress?.unlockedLevels?.includes(level) || false;
  };
  
  const getLevelStars = (level) => {
    const levelProgress = progress?.levelProgress?.find(lp => lp.level === level);
    return levelProgress?.stars || 0;
  };
  
  const getLevelType = (level) => {
    if (level >= 1 && level <= 50) return { label: 'Hiragana', color: 'from-blue-500 to-blue-600' };
    if (level >= 51 && level <= 100) return { label: 'Katakana', color: 'from-purple-500 to-purple-600' };
    if (level >= 101 && level <= 150) return { label: 'Mixed', color: 'from-green-500 to-green-600' };
    if (level >= 151 && level <= 200) return { label: 'Kanji', color: 'from-orange-500 to-orange-600' };
    return { label: 'Unknown', color: 'from-gray-500 to-gray-600' };
  };
  
  const handleLevelClick = (level) => {
    if (isLevelUnlocked(level)) {
      navigate(`/quiz/${level}`);
    }
  };
  
  const filters = [
    { value: 'all', label: 'All Levels' },
    { value: 'hiragana', label: 'Hiragana (1-50)' },
    { value: 'katakana', label: 'Katakana (51-100)' },
    { value: 'mixed', label: 'Mixed (101-150)' },
    { value: 'kanji', label: 'Kanji (151-200)' },
  ];
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-zen-800">Practice Levels</h1>
          <p className="text-zen-600">
            Choose a level to start practicing
          </p>
        </div>
        
        {/* Progress Summary */}
        <Card className="mb-8 text-white border-none bg-gradient-to-r from-zen-600 to-bamboo-600">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="mb-1 text-sm text-white/80">Total Progress</p>
              <p className="text-3xl font-bold">
                {progress?.completedLevels?.length || 0} / {TOTAL_LEVELS}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-white/80">Total Stars</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{progress?.totalStars || 0}</p>
                <StarRating stars={3} size="md" />
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm text-white/80">Current Level</p>
              <p className="text-3xl font-bold">{progress?.currentLevel || 1}</p>
            </div>
          </div>
        </Card>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        
        {/* Levels Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filteredLevels.map((level) => {
            const unlocked = isLevelUnlocked(level);
            const stars = getLevelStars(level);
            const type = getLevelType(level);
            
            return (
              <Card
                key={level}
                hoverable={unlocked}
                className={clsx(
                  'relative overflow-hidden transition-all duration-300',
                  unlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                )}
                onClick={() => handleLevelClick(level)}
              >
                {/* Type Badge */}
                <div className={clsx(
                  'absolute top-0 right-0 px-2 py-1 text-xs font-medium text-white rounded-bl-lg',
                  `bg-gradient-to-br ${type.color}`
                )}>
                  {type.label}
                </div>
                
                {/* Level Content */}
                <div className="py-6 text-center">
                  {unlocked ? (
                    <>
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-zen-100">
                        <Play className="w-6 h-6 text-zen-600" />
                      </div>
                      <p className="mb-2 text-2xl font-bold text-zen-800">
                        {level}
                      </p>
                      <StarRating stars={stars} size="sm" className="justify-center" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-zen-200">
                        <Lock className="w-6 h-6 text-zen-400" />
                      </div>
                      <p className="mb-2 text-2xl font-bold text-zen-400">
                        {level}
                      </p>
                      <p className="text-xs text-zen-400">Locked</p>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
        
        {filteredLevels.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-zen-600">No levels found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Levels;