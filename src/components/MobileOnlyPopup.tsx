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
    // Show popup when screen is LARGER than mobile (desktop/tablet)
    setIsVisible(window.innerWidth > mobileMaxWidth);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-all duration-300 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 opacity-100">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 pointer-events-auto scale-100 translate-y-0"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* App Icon and Header */}
          <div className="text-center pt-8 pb-4 px-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-semibold mb-2">Optimized for Mobile</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              This app is designed for mobile devices. Please view on a smartphone for the best experience.
            </p>
          </div>

          {/* Visual Indicator */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 text-center mb-2 text-base">
                This application is designed for mobile devices.
              </p>
              <p className="text-gray-500 text-center text-sm">
                Please view on a smartphone or resize your browser window to a mobile width for the best experience.
              </p>
              
              <div className="flex justify-center mt-6 mb-4">
                <div className="w-80 h-16 border border-gray-300 rounded-xl overflow-hidden relative bg-gray-100 bg-opacity-50">
                  {/* Desktop indicator - Bootstrap Laptop Icon */}
                  <div className="absolute inset-y-0 left-1 right-2/3 bg-gray-400 bg-opacity-50 rounded-lg m-2 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-600" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
                    </svg>
                  </div>
                  
                  {/* Mobile indicator - Bootstrap Phone Icon */}
                  <div className="absolute inset-y-0 right-1 left-2/3 bg-blue-500 bg-opacity-20 rounded-lg m-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-3">
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 px-4 rounded-xl transition-all duration-200 font-semibold focus:outline-none text-base"
                style={{
                  boxShadow: '0 1px 3px rgba(59, 130, 246, 0.4)'
                }}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileOnlyPopup;
