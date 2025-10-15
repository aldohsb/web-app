import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Plus } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useUserStore } from '@/store/useUserStore';
import { getUserId, getUserName, storage } from '@/utils/helpers';
import { STORAGE_KEYS } from '@/utils/constants';

const Auth = () => {
  const navigate = useNavigate();
  const { user, progress } = useUserStore();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const currentUserId = getUserId();
  const currentUserName = getUserName();
  
  // Get saved users from localStorage
  const getSavedUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('japasense_saved_users') || '[]');
      return users.filter(u => u.userId !== currentUserId); // Exclude current user
    } catch {
      return [];
    }
  };
  
  const handleSwitchUser = (userId, userName) => {
    setLoading(true);
    try {
      // Clear current session
      storage.set(STORAGE_KEYS.USER_ID, userId);
      storage.set(STORAGE_KEYS.USER_NAME, userName);
      
      // Reload app
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to switch user:', error);
      setLoading(false);
    }
  };
  
  const handleCreateNewUser = async () => {
    if (!newUserName.trim()) return;
    
    setLoading(true);
    try {
      // Save current user
      const savedUsers = getSavedUsers();
      savedUsers.unshift({
        userId: currentUserId,
        userName: currentUserName,
        lastActive: new Date().toISOString(),
      });
      localStorage.setItem('japasense_saved_users', JSON.stringify(savedUsers.slice(0, 10))); // Keep last 10
      
      // Clear session & create new user
      storage.remove(STORAGE_KEYS.USER_ID);
      storage.remove(STORAGE_KEYS.USER_NAME);
      storage.remove(STORAGE_KEYS.PROGRESS);
      
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to create new user:', error);
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setLoading(true);
    try {
      // Save current user
      const savedUsers = getSavedUsers();
      savedUsers.unshift({
        userId: currentUserId,
        userName: currentUserName,
        lastActive: new Date().toISOString(),
      });
      localStorage.setItem('japasense_saved_users', JSON.stringify(savedUsers.slice(0, 10)));
      
      // Clear all data
      storage.clear();
      
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to logout:', error);
      setLoading(false);
    }
  };
  
  const savedUsers = getSavedUsers();
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-zen-800">Account Management</h1>
          <p className="text-zen-600">Switch between users or create a new account</p>
        </div>
        
        {/* Current User */}
        <Card className="mb-8 text-white border-none bg-gradient-to-br from-zen-600 to-bamboo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-white/80">Current User</p>
              <h2 className="text-3xl font-bold">{currentUserName}</h2>
              <p className="mt-1 text-sm text-white/70">ID: {currentUserId.slice(0, 12)}...</p>
            </div>
            <div className="text-5xl">👤</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/20">
            <div>
              <p className="text-sm text-white/80">Current Level</p>
              <p className="text-2xl font-bold">{progress?.currentLevel || 1}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Total Stars</p>
              <p className="text-2xl font-bold">{progress?.totalStars || 0}</p>
            </div>
          </div>
        </Card>
        
        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/profile')}
          >
            Edit Profile
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => setShowSwitchModal(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Switch / Add User
          </Button>
        </div>
        
        {/* Saved Users */}
        {savedUsers.length > 0 && (
          <Card className="mb-8">
            <Card.Header>
              <Card.Title>Recent Users</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {savedUsers.map((u) => (
                  <div key={u.userId} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-zen-50 hover:bg-zen-100">
                    <div>
                      <p className="font-semibold text-zen-800">{u.userName}</p>
                      <p className="text-xs text-zen-500">Last active: {new Date(u.lastActive).toLocaleDateString()}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwitchUser(u.userId, u.userName)}
                      loading={loading}
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}
        
        {/* Logout Button */}
        <div className="text-center">
          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
            loading={loading}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout All Users
          </Button>
          <p className="mt-3 text-sm text-zen-500">This will clear all data and return to welcome screen</p>
        </div>
      </div>
      
      {/* Switch User Modal */}
      <Modal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        title="Switch or Create User"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-zen-800">
              Enter User Name
            </label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newUserName.trim()) {
                  handleCreateNewUser();
                }
              }}
              placeholder="New user name"
              className="zen-input"
              maxLength={50}
              autoFocus
            />
          </div>
          
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-800">
              💡 Enter a name to create or switch to a new user. Your current progress will be saved.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowSwitchModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateNewUser}
              loading={loading}
              disabled={!newUserName.trim()}
            >
              Create/Switch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Auth;