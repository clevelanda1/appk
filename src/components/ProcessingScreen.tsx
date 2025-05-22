import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple } from 'react-bootstrap-icons';

interface ProcessingScreenProps {
  onComplete?: () => void;
  redirectTo?: string;
  paymentAmount?: number;
  contactName?: string | null;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ 
  onComplete,
  redirectTo = '/success',
  paymentAmount = 0,
  contactName = null
}) => {
  const [dots, setDots] = useState('.');
  const [processingStage, setProcessingStage] = useState<'processing' | 'confirmed'>('processing');
  const navigate = useNavigate();
  
  // Format currency with commas for thousands
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Handle dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return '.';
        return prevDots + '.';
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle the processing stages - transitions to confirmed then navigates
  useEffect(() => {
    const processingDuration = 2000; // Total time in processing state (2 seconds)
    const soundDelay = processingDuration - 0; // Play sound 700ms before state change
    
    // Play the sound shortly before changing state
    const soundTimer = setTimeout(() => {
      // Play Apple Pay success sound
      const audio = new Audio('../public/applePayChime.mp4');
      audio.play().catch(e => console.log('Audio playback error:', e));
    }, soundDelay);
    
    // Change to confirmed after processingDuration
    const confirmedTimer = setTimeout(() => {
      setProcessingStage('confirmed');
      
      // Redirect or call onComplete after a delay
      const redirectTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        } else {
          navigate(redirectTo);
        }
      }, 2500); // Show confirmed state for 2.5 seconds before redirecting
      
      return () => clearTimeout(redirectTimer);
    }, processingDuration);
    
    return () => {
      clearTimeout(soundTimer);
      clearTimeout(confirmedTimer);
    };
  }, [onComplete, navigate, redirectTo]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white w-full">
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
      
      <div className="flex flex-col items-center justify-center h-screen px-6 relative z-10">
        {/* Fixed positioning structure */}
        <div className="flex flex-col items-center w-full" style={{ height: '280px' }}>
          {/* Apple Pay Logo - absolutely positioned to stay in one place */}
          <div className="absolute" style={{ top: '25%', transform: 'translateY(-50%)' }}>
            <div className={`w-24 h-24 rounded-full bg-black flex items-center justify-center 
              ${processingStage === 'processing' ? 'animate-pulse' : ''} 
              transition-all duration-500 ease-in-out`}
            >
              <Apple className="w-10 h-10 text-white -mt-1" />
            </div>
          </div>
          
          {/* Processing Animation - positioned below the Apple logo */}
          <div className="absolute" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            {processingStage === 'processing' && (
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                
                {/* Subtle glow effect */}
                <div 
                  className="absolute -inset-2 rounded-full opacity-30 blur-xl" 
                  style={{ 
                    background: 'radial-gradient(circle, rgba(10, 132, 255, 0.6) 0%, rgba(10, 132, 255, 0) 70%)'
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction Details Card - Only show for confirmed state */}
        <div className="flex justify-center w-full">
          {processingStage === 'confirmed' && (
            <div className="bg-gray-800/70 rounded-2xl p-5 w-full max-w-xs mb-6 backdrop-blur-md border border-gray-700/30 animate-fadeIn relative">
              <div className="flex h-8 items-center justify-between mb-4">
                <span className="text-gray-400 text-lg mt-[15px]">Amount</span>
                <span className="text-white font-bold text-3xl mt-[15px]">
                  ${typeof paymentAmount === 'number' ? formatCurrency(paymentAmount) : '0.00'}
                </span>
              </div>
              
              {/* Checkmark icon inside the card */}
              <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Status Text */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {processingStage === 'processing' && (
            <span>Processing<span className="text-white">{dots}</span></span>
          )}
          {processingStage === 'confirmed' && 'Payment Confirmed'}
        </h2>
        
        {/* Subtle hint text */}
        <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
          {processingStage === 'processing' && 'Please keep your device still'}
          {processingStage === 'confirmed' && 'Your payment has been received'}
        </p>
      </div>
      
      {/* iOS-style home indicator */}
      {/*<div className="absolute bottom-8 w-full flex flex-col items-center space-y-3">
        <p className="text-gray-50/10 text-xs font-medium">Apple Pay Prank v1.0</p>
          </div>*/}
    </div>
  );
};

export default ProcessingScreen;