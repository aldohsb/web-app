import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'zen-card',
        hoverable && 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1',
        !padding && 'p-0',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={clsx('border-b border-zen-200 pb-4 mb-4', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={clsx('text-xl font-semibold text-zen-800', className)}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={clsx('', className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={clsx('border-t border-zen-200 pt-4 mt-4', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;