import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, User, BookOpen, Trophy, Settings } from 'lucide-react';
import clsx from 'clsx';

const Navigation = ({ isMobile = false, onItemClick }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home', description: 'Dashboard' },
    { path: '/levels', icon: Grid3x3, label: 'Levels', description: 'Practice levels' },
    { path: '/profile', icon: User, label: 'Profile', description: 'Your stats' },
  ];
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };
  
  if (isMobile) {
    return (
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                isActive(item.path)
                  ? 'bg-zen-600 text-white shadow-lg'
                  : 'text-zen-700 hover:bg-zen-100'
              )}
            >
              <Icon className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">{item.label}</p>
                <p className={clsx(
                  'text-xs',
                  isActive(item.path) ? 'text-zen-100' : 'text-zen-500'
                )}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }
  
  return (
    <nav className="flex items-center gap-2">
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
  );
};

export default Navigation;