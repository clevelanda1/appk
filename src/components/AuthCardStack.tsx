import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthCardStackProps {
  isVisible: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

const AuthCardStack: React.FC<AuthCardStackProps> = ({
  isVisible,
  onClose,
  onSignIn,
  onSignUp
}) => {
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    navigate('/signup');
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
      }}
    >
      <div className="w-full flex justify-center py-3">
        <div className="w-32 h-1 bg-gray-600 rounded-full opacity-30"></div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex justify-center py-5 mb-1">
          <button 
            onClick={onSignUp}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-center font-medium focus:outline-none px-6"
          >
            Sign Up
          </button>
          <div className="h-6 w-px bg-gray-700 mx-8"></div>
          <button 
            onClick={onSignIn}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-center font-medium focus:outline-none px-6"
          >
            Sign In
          </button>
        </div>

        <div className="py-5">
          <div className="rounded-2xl overflow-hidden mb-6 bg-gray-800/60 border border-gray-700/30">
            <div className="bg-blue-500 py-3 px-3 text-white font-semibold tracking-wide text-center text-sm">
              PREMIUM FEATURES
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg">Lifetime Access</h3>
                  <p className="text-gray-400 text-sm mt-1">All Features Included</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white font-bold text-2xl">$5.99</div>
                  <div className="text-gray-400 text-xs">One-time Purchase</div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Unlimited Prank Requests</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Native Apple Pay Sound</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Optional Request Amounts</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Customize Saved Contacts</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Live Transaction History</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Premium Card Designs</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">Premium Receiptant Screens</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePremiumClick}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3.5 px-4 rounded-2xl transition-colors duration-200 font-medium focus:outline-none text-base"
              style={{ boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)' }}
            >
              Buy Now
            </button>
            
            <button
              onClick={onClose}
              className={`w-full ${buttonBgColor} text-white py-3.5 px-4 rounded-2xl font-medium focus:outline-none`}
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCardStack;