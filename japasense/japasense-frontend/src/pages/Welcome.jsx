import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useUserStore } from '@/store/useUserStore';
import { getUserId, setUserName } from '@/utils/helpers';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, initialize } = useUserStore();
  const [userName, setUserNameLocal] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user already has a name
    const storedName = localStorage.getItem('japasense_user_name');
    if (storedName && storedName !== 'Guest') {
      // User already set name, go to home
      navigate('/');
    }
  }, [navigate]);
  
  const handleContinueAsGuest = async () => {
    setLoading(true);
    try {
      await initialize();
      // Go directly to home
      navigate('/');
    } catch (error) {
      console.error('Failed to initialize:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetName = () => {
    setShowNameModal(true);
  };
  
  const handleSaveName = async () => {
    if (!userName.trim()) return;
    
    setLoading(true);
    try {
      setUserName(userName.trim());
      await initialize();
      navigate('/');
    } catch (error) {
      console.error('Failed to set name:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-zen-50 via-bamboo-50 to-zen-100">
      <Card className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-zen-600 to-bamboo-600 rounded-3xl">
            <span className="text-5xl font-bold text-white japanese-text">日</span>
          </div>
          
          {/* Welcome Text */}
          <h1 className="mb-4 text-5xl font-bold text-zen-800">
            Welcome to <span className="japanese-text">JapaSense</span>
          </h1>
          <p className="mb-2 text-xl text-zen-600">
            Master Japanese Characters Through Practice
          </p>
          <p className="text-zen-500">
            Start your learning journey with Hiragana, Katakana, and Kanji
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <div className="p-4 text-center bg-zen-50 rounded-xl">
            <p className="mb-2 text-3xl">200</p>
            <p className="text-sm font-medium text-zen-700">Learning Levels</p>
          </div>
          <div className="p-4 text-center bg-zen-50 rounded-xl">
            <p className="mb-2 text-3xl">⭐⭐⭐</p>
            <p className="text-sm font-medium text-zen-700">Star System</p>
          </div>
          <div className="p-4 text-center bg-zen-50 rounded-xl">
            <p className="mb-2 text-3xl">📊</p>
            <p className="text-sm font-medium text-zen-700">Track Progress</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSetName}
            loading={loading}
          >
            Enter Your Name & Start
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleContinueAsGuest}
            loading={loading}
          >
            Continue as Guest
          </Button>
        </div>
        
        {/* Info */}
        <div className="p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Enter your name to save your progress. Your progress will be automatically saved to your device.
          </p>
        </div>
      </Card>
      
      {/* Name Modal */}
      <Modal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        title="What's Your Name?"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-zen-600">
            Enter your name to personalize your learning experience. Your progress will be saved!
          </p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserNameLocal(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveName();
              }
            }}
            placeholder="Enter your name"
            className="text-lg zen-input"
            maxLength={50}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowNameModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSaveName}
              loading={loading}
              disabled={!userName.trim()}
            >
              Start Learning
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Welcome;