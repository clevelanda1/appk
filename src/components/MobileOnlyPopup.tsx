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
    setIsVisible(window.innerWidth > mobileMaxWidth);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md transition-all duration-300">
      <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-md w-full mx-4 transform transition-all border border-gray-800">
        <div className="relative">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] opacity-40" 
               style={{ background: 'linear-gradient(to right, transparent, #3b82f6, transparent)' }}>
          </div>
          
          {/* Background glow effect */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Optimized for Mobile
              </h3>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-white focus:outline-none transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Bootstrap Phone Icon */}
                  <svg className="w-16 h-16 text-blue-500" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                  {/* Glow effect behind icon */}
                  <div className="absolute inset-0 bg-blue-500 opacity-20 blur-xl rounded-full"></div>
                </div>
              </div>
              
              <p className="text-gray-300 text-center mb-2">
                This application is designed for mobile devices.
              </p>
              <p className="text-gray-400 text-center text-sm">
                Please view on a smartphone or resize your browser window to a mobile width for the best experience.
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-64 h-12 border border-gray-700 rounded-xl overflow-hidden relative bg-gray-800 bg-opacity-50">
                {/* Desktop indicator - Bootstrap Laptop Icon */}
                <div className="absolute inset-y-0 left-1 right-2/3 bg-gray-700 bg-opacity-50 rounded-lg m-1.5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
                  </svg>
                </div>
                
                {/* Mobile indicator - Bootstrap Phone Icon */}
                <div className="absolute inset-y-0 right-1 left-2/3 bg-blue-500 bg-opacity-20 rounded-lg m-1.5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 px-6 py-4">
            <button
              onClick={handleClose}
              className="w-full py-3 text-white font-medium rounded-xl transition-all focus:outline-none relative overflow-hidden group"
              style={{
                background: 'linear-gradient(to right, #0A84FF, #0070E0)',
                boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3)'
              }}
            >
              {/* Button top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-xl"></div>
              
              {/* Button shine animation */}
              <div className="absolute inset-0 w-full transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
              
              <span className="relative z-10 flex items-center justify-center">
                Continue Anyway
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOnlyPopup;