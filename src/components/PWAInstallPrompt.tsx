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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isVisible ? 'bg-black bg-opacity-50' : 'bg-transparent pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 pointer-events-auto ${
            isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* App Icon and Header */}
          <div className="text-center pt-8 pb-4 px-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V19H11V17H5V15H11V13H5V11H11V9H5V7H5V5H13V9H21ZM15 15V13H17V11H19V13H21V15H19V17H17V15H15Z"/>
              </svg>
            </div>
            <h2 className="text-gray-900 text-lg font-semibold mb-2">Add "Apple Pay Prank" to Home Screen?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Install this app on your home screen for quick and easy access when you're on the go.
            </p>
          </div>

          {/* Instructions */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              {platform === 'ios' ? (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-medium">Tap the Share button</p>
                    <p className="text-gray-600 text-xs">Then choose "Add to Home Screen"</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-medium">Tap the menu button</p>
                    <p className="text-gray-600 text-xs">Then choose "Add to Home Screen"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 px-4 rounded-xl transition-all duration-200 font-semibold focus:outline-none text-base"
                style={{
                  boxShadow: '0 1px 3px rgba(59, 130, 246, 0.4)'
                }}
              >
                Install App
              </button>
              
              <button
                onClick={onDismiss}
                className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 py-3.5 px-4 rounded-xl transition-all duration-200 font-medium focus:outline-none text-base"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAInstallPrompt;