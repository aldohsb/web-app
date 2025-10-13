import clsx from 'clsx';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'zen',
  fullScreen = false,
  message = '',
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  
  const colors = {
    zen: 'text-zen-600',
    bamboo: 'text-bamboo-600',
    white: 'text-white',
  };
  
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={clsx('relative', sizes[size])}>
        <div className={clsx(
          'absolute inset-0 rounded-full border-4 border-zen-200'
        )} />
        <div className={clsx(
          'absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin',
          colors[color]
        )} />
      </div>
      {message && (
        <p className="font-medium text-zen-600 animate-pulse">{message}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }
  
  return spinner;
};

export default LoadingSpinner;