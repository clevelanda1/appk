import React, { useState, useEffect } from 'react';

interface MobileOnlyPopupProps {
  mobileMaxWidth?: number; // Maximum width in pixels to be considered mobile
}

const MobileOnlyPopup: React.FC<MobileOnlyPopupProps> = ({ 
  mobileMaxWidth = 768 // Default breakpoint for mobile devices
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check screen size on mount
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const checkScreenSize = () => {
    // Show on mobile devices (opposite of original logic)
    setIsVisible(window.innerWidth <= mobileMaxWidth);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-t-3xl shadow-lg border-t border-gray-100 mx-4 mb-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Native Mobile App
            </h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 text-base mb-4 leading-relaxed">
            Designed to feel natural as an app.
          </p>
          
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-semibold focus:outline-none text-base shadow-sm hover:shadow-md"
          >
            QUICK SETUP GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileOnlyPopup;