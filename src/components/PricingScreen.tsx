import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PRODUCTS } from '../stripe-config';

interface PricingScreenProps {
  setIsPremium: (isPremium: boolean) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ setIsPremium }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { loading, error, purchaseLifetimeAccess } = useStripe();

  const handleUpgrade = async () => {
    setIsTransitioning(true);
    await purchaseLifetimeAccess();
    setIsTransitioning(false);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-black text-white transition-opacity duration-300 ${
      isTransitioning ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      {/* Ambient light effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-80 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-purple-500 opacity-5 blur-3xl pointer-events-none"></div>
      
      {/* Main content area */}
      <div className="p-6 relative z-10">
        <div className="mt-3 mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 font-medium text-lg focus:outline-none transition-colors duration-200"
          >
            Done
          </button>
        </div>

        <div className="max-w-md mx-auto mt-6">
          <h1 className="text-3xl font-bold mb-2 text-center">Unlock All Features</h1>
          <p className="text-gray-400 text-center mb-8">One-time payment to access premium features</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-800/60 rounded-2xl overflow-hidden mb-8 border border-gray-700/30">
            <div className="bg-blue-500 py-3 px-4 text-white font-semibold tracking-wide text-center text-sm">
              PREMIUM ACCESS
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-white font-semibold text-lg">Lifetime Access</h3>
                  <p className="text-gray-400 text-sm mt-1">All features included</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white font-bold text-2xl">$7.99</div>
                  <div className="text-gray-400 text-xs">One-time Payment</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
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

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="relative w-full py-3.5 text-base font-medium focus:outline-none active:opacity-90 transition-all duration-200 rounded-xl text-white mt-4 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(to right, #0A84FF, #0070E0)',
                  boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3)'
                }}
              >
                {/* Subtle top highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-xl"></div>
                <span className="relative z-10">{loading ? 'Processing...' : 'Purchase'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingScreen;