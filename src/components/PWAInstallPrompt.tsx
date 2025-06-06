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
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Tap the <span className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm font-medium text-gray-900 mx-1">Share</span> button in Safari
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Select <span className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm font-medium text-gray-900 mx-1">Add to Home Screen</span> from the menu
            </p>
          </div>
        </div>
      );
    } else if (platform === 'android') {
      return (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Tap the menu (⋮) button in your browser
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Select <span className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm font-medium text-gray-900 mx-1">Add to Home Screen</span> from the menu
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Tap the <span className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm font-medium text-gray-900 mx-1">Share</span> button in your browser
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Select <span className="inline-flex items-center bg-gray-100 rounded-md px-2 py-1 text-sm font-medium text-gray-900 mx-1">Add to Home Screen</span> from the menu
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white rounded-t-3xl shadow-lg border-t border-gray-100 mx-4 mb-4">
        {/* Handle bar */}
        <div className="w-full flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-gray-900 text-xl font-semibold">Native Mobile App</h2>
              <p className="text-gray-600 text-base mt-1">Designed to feel natural as an app.</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>

          {/* Instructions Card */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Quick Setup Guide</h3>
              <p className="text-gray-600 text-sm">Install this app on your device for the best experience</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {renderInstructions()}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 px-6 rounded-2xl transition-all duration-200 font-semibold focus:outline-none text-base shadow-sm hover:shadow-md"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;