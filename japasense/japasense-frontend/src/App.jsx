import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Levels from '@/pages/Levels';
import Quiz from '@/pages/Quiz';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useUserStore } from '@/store/useUserStore';
import { useGameStore } from '@/store/useGameStore';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { initialized, initialize } = useUserStore();
  const { loadSettings } = useGameStore();
  
  useEffect(() => {
    // Initialize app
    loadSettings();
    if (!initialized) {
      initialize();
    }
  }, []);
  
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen zen-pattern">
        <LoadingSpinner size="xl" message="Initializing JapaSense..." />
      </div>
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
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;