import { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div 
          className={clsx(
            'relative w-full bg-white rounded-2xl shadow-2xl',
            'transform transition-all animate-slide-up',
            sizes[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-zen-200">
              {title && (
                <h2 className="text-2xl font-bold text-zen-800">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 transition-colors rounded-lg hover:bg-zen-100"
                >
                  <X className="w-5 h-5 text-zen-600" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;