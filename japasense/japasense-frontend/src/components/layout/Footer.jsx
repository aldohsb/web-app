import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-white border-t border-zen-200">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-zen-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for Japanese learners</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-zen-600">
            <a href="#" className="transition-colors hover:text-zen-800">
              About
            </a>
            <a href="#" className="transition-colors hover:text-zen-800">
              Guide
            </a>
            <a href="#" className="transition-colors hover:text-zen-800">
              Contact
            </a>
          </div>
          
          <div className="text-sm text-zen-500">
            © {currentYear} JapaSense. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;