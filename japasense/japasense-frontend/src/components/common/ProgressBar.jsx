import clsx from 'clsx';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  showLabel = true,
  color = 'zen',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colors = {
    zen: 'bg-zen-600',
    bamboo: 'bg-bamboo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx(
        'relative w-full bg-zen-200 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between mt-2 text-sm text-zen-600">
          <span>{value} / {max}</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;