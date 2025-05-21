import React, { useState, useEffect } from 'react';

interface PWAInstallPromptProps {
  isVisible: boolean;
  onClose: () => void;
  onDismiss: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  isVisible,
  onClose,
  onDismiss
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect platform and if mobile
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    setIsMobile(isMobileDevice);
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('other');
    }
  }, []);
  
  // In production, uncomment this to only show on mobile
  if (!isMobile) {
    return null;
  }
  
  const renderInstructions = () => {
    if (platform === 'ios') {
      return (
        <div className="mt-2">
          <p className="text-gray-300 mb-4">
            <span className="font-medium text-white">Step 1:</span> Click the
            <span className="bg-gray-700 rounded px-2 py-0.5 mx-1 text-sm">share</span>
            option in your browser window
          </p>
          <p className="text-gray-300">
            <span className="font-medium text-white">Step 2:</span> Click 
            <span className="bg-gray-700 rounded px-2 py-0.5 mx-1 text-sm">Add to Home Screen</span>
            to add an app to your device
          </p>
        </div>
      );
    } else if (platform === 'android') {
      return (
        <div className="mt-2">
          <p className="text-gray-300 mb-4">
            <span className="font-medium text-white">Step 1:</span> Click the menu option in your browser window
          </p>
          <p className="text-gray-300">
            <span className="font-medium text-white">Step 2:</span> Click 
            <span className="bg-gray-700 rounded px-2 py-0.5 mx-1 text-sm">Add to Home Screen</span>
            to add an app to your device
          </p>
        </div>
      );
    } else {
      // For all other mobile browsers, give a generic instruction
      return (
        <div className="mt-2">
          <p className="text-gray-300 mb-4">
            <span className="font-medium text-white">Step 1:</span> Click the
            <span className="bg-gray-700 rounded px-2 py-0.5 mx-1 text-sm">share</span>
            option in your browser window
          </p>
          <p className="text-gray-300">
            <span className="font-medium text-white">Step 2:</span> Click 
            <span className="bg-gray-700 rounded px-2 py-0.5 mx-1 text-sm">Add to Home Screen</span>
            to add an app to your device
          </p>
        </div>
      );
    }
  };

  const buttonBgColor = "bg-gray-800/80";

  return (
    <div
      className={`absolute inset-x-0 bottom-0 bg-[#121418] rounded-t-3xl transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        height: 'auto',
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 50,
      }}
    >
      <div className="w-full flex justify-center py-3">
        <div className="w-32 h-1 bg-gray-600 rounded-full opacity-30"></div>
      </div>

      <div className="px-6 pb-8">
        <div className="text-center mb-2">
          <h2 className="text-white text-xl font-bold">Add to Home Screen</h2>
          <p className="text-gray-400 text-sm mt-1">Experience Apple Pay Prank at its best</p>
        </div>

        <div className="py-5">
          <div className="rounded-2xl overflow-hidden mb-6 bg-gray-800/60 border border-gray-700/30">
            <div className="bg-blue-500 py-3 px-3 text-white font-semibold tracking-wide text-center text-sm">
              QUICK SETUP GUIDE
            </div>
            
            <div className="p-5">
              <div className="bg-blue-500/10 rounded-lg p-4 mb-5">
                {renderInstructions()}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3.5 px-4 rounded-2xl transition-colors duration-200 font-medium focus:outline-none text-base"
              style={{ boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)' }}
            >
              Got It!
            </button>
            
            {/* <button
              onClick={onDismiss}
              className={`w-full ${buttonBgColor} text-white py-3.5 px-4 rounded-2xl font-medium focus:outline-none text-sm`}
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              Do not show this again
            </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;