import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, User, Menu, Star, LogIn } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import clsx from 'clsx';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, progress } = useUserStore();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/levels', icon: Grid3x3, label: 'Levels' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/auth', icon: LogIn, label: 'Account' },
  ];
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b shadow-sm bg-white/90 backdrop-blur-md border-zen-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 transition-transform transform bg-gradient-to-br from-zen-600 to-bamboo-600 rounded-xl group-hover:scale-110">
              <span className="text-xl font-bold text-white japanese-text">日</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-zen-800">JapaSense</h1>
              <p className="text-xs text-zen-600">Learn Japanese Characters</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="items-center hidden gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                    isActive(item.path)
                      ? 'bg-zen-600 text-white shadow-md'
                      : 'text-zen-700 hover:bg-zen-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User Stats */}
          <div className="flex items-center gap-4">
            <div className="items-center hidden gap-2 px-4 py-2 rounded-lg sm:flex bg-zen-100">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-zen-800">{progress?.totalStars || 0}</span>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 transition-colors rounded-lg md:hidden hover:bg-zen-100"
            >
              <Menu className="w-6 h-6 text-zen-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="bg-white border-t md:hidden border-zen-200">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300',
                  isActive(item.path)
                    ? 'text-zen-700 bg-zen-100'
                    : 'text-zen-500'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;