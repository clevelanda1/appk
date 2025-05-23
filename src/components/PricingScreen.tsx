import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useStripe } from "../hooks/useStripe";

interface PricingScreenProps {
  setIsPremium: (isPremium: boolean) => void;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ setIsPremium }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { loading, error, purchaseLifetimeAccess } = useStripe();
  const { signOut } = useAuth();

  const handleUpgrade = async () => {
    setIsTransitioning(true);
    await purchaseLifetimeAccess();
    setIsTransitioning(false);
  };

  const handleDone = async () => {
    console.log("Done clicked - signing out...");

    try {
      await signOut();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Remove all background decorative elements that might be blocking clicks */}

      {/* Simple header with working button */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 mt-6">
          <button
            onClick={handleDone}
            className="text-blue-500 font-medium text-lg hover:text-blue-400 focus:outline-none"
          >
            Done
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Unlock All Features
          </h1>
          <p className="text-gray-400 text-center mb-8">
            One-time payment to access premium features
          </p>

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
                  <h3 className="text-white font-semibold text-lg">
                    Lifetime Access
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    All features included
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-white font-bold text-2xl">$4.99</div>
                  <div className="text-gray-400 text-xs">One-time Payment</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Unlimited Prank Requests
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Native Apple Pay Sound</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Optional Request Amounts
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Customize Saved Contacts
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Live Transaction History
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">Premium Card Designs</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 mr-3 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300">
                    Premium Receiptant Screens
                  </span>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="relative w-full py-3.5 text-base font-medium focus:outline-none active:opacity-90 transition-all duration-200 rounded-xl text-white mt-4 disabled:opacity-50"
                style={{
                  background: "linear-gradient(to right, #0A84FF, #0070E0)",
                  boxShadow: "0 2px 8px rgba(10, 132, 255, 0.3)",
                }}
              >
                {/* Subtle top highlight */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-xl"></div>
                <span className="relative z-10">
                  {loading ? "Processing..." : "Purchase"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingScreen;
