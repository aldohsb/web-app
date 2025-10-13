import { BookOpen, Target, Zap, Heart } from 'lucide-react';
import Card from '@/components/common/Card';

const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Learning',
      description: '200 levels covering Hiragana, Katakana, and basic Kanji characters',
    },
    {
      icon: Target,
      title: 'Progressive Difficulty',
      description: 'Start with basics and gradually advance to more complex characters',
    },
    {
      icon: Zap,
      title: 'Interactive Practice',
      description: 'Engaging quiz format with immediate feedback and star ratings',
    },
    {
      icon: Heart,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed statistics and achievements',
    },
  ];
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-zen-800">
            About <span className="japanese-text">JapaSense</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-zen-600">
            Master Japanese characters through systematic practice and engaging quizzes
          </p>
        </div>
        
        {/* Mission */}
        <Card className="mb-8 text-white border-none bg-gradient-to-br from-zen-600 to-bamboo-600">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="text-lg leading-relaxed text-white/90">
            JapaSense is designed to make learning Japanese characters accessible, engaging, 
            and effective. We believe that consistent practice with immediate feedback is the 
            key to mastering Japanese writing systems.
          </p>
        </Card>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hoverable>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zen-100 rounded-xl">
                    <Icon className="w-6 h-6 text-zen-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-zen-800">
                      {feature.title}
                    </h3>
                    <p className="text-zen-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Learning Path */}
        <Card className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-zen-800">Learning Path</h2>
          <div className="space-y-4">
            {[
              {
                level: '1-50',
                title: 'Hiragana (ひらがな)',
                description: 'Learn the foundational 46 Hiragana characters used for native Japanese words',
              },
              {
                level: '51-100',
                title: 'Katakana (カタカナ)',
                description: 'Master 46 Katakana characters used for foreign words and emphasis',
              },
              {
                level: '101-150',
                title: 'Mixed Kana Practice',
                description: 'Strengthen your skills by mixing Hiragana and Katakana',
              },
              {
                level: '151-200',
                title: 'Kanji Introduction (漢字)',
                description: 'Begin learning essential Kanji characters (JLPT N5/N4 level)',
              },
            ].map((stage, index) => (
              <div key={index} className="flex gap-4 p-4 bg-zen-50 rounded-xl">
                <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 font-bold text-white rounded-lg bg-zen-600">
                  {stage.level}
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-zen-800">{stage.title}</h3>
                  <p className="text-sm text-zen-600">{stage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* How It Works */}
        <Card>
          <h2 className="mb-6 text-2xl font-bold text-zen-800">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white rounded-full bg-zen-600">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zen-800">Choose Your Level</h3>
                <p className="text-zen-600">Start from Level 1 or continue where you left off</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white rounded-full bg-zen-600">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zen-800">Practice with Quizzes</h3>
                <p className="text-zen-600">Answer 10 questions per level with immediate feedback</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white rounded-full bg-zen-600">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zen-800">Earn Stars</h3>
                <p className="text-zen-600">Get 1-3 stars based on your score (8+ correct to pass)</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white rounded-full bg-zen-600">
                4
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-zen-800">Track Progress</h3>
                <p className="text-zen-600">Monitor your improvement and unlock new levels</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;