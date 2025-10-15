import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Welcome from '@/pages/Welcome';
import Home from '@/pages/Home';
import Levels from '@/pages/Levels';
import Quiz from '@/pages/Quiz';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import About from '@/pages/About';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useUserStore } from '@/store/useUserStore';
import { useGameStore } from '@/store/useGameStore';
import { getUserName } from '@/utils/helpers';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { initialized, initialize } = useUserStore();
  const { loadSettings } = useGameStore();
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    // Initialize app
    loadSettings();
    
    // Check if user already has a name (returning user)
    const storedName = getUserName();
    if (storedName && storedName !== 'Guest') {
      setShowWelcome(false);
      if (!initialized) {
        initialize();
      }
    }
    // Otherwise show welcome screen
  }, []);
  
  if (!initialized && !showWelcome) {
    return (
      <div className="flex items-center justify-center min-h-screen zen-pattern">
        <LoadingSpinner size="xl" message="Loading JapaSense..." />
      </div>
    );
  }
  
  // Show welcome page if new user or no name set
  if (showWelcome) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Welcome />} />
        </Routes>
      </Router>
    );
  }
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen zen-pattern">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 pt-16 md:pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/quiz/:level" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;