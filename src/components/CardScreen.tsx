import React, { useState, useRef, useEffect } from 'react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { MoreVertical, Lock } from 'lucide-react';
import { Apple } from 'react-bootstrap-icons';
import CardStack from './CardStack';

type CardTheme = {
  id: string;
  name: string;
  background: string;
  logoColor: string;
  pattern: string;
  rainbow: boolean;
  shine: boolean;
  logoBackground: string;
  logoInnerBackground: string;
  borderAccent: string;
};

interface CardScreenProps {
  onPayButtonPress: () => void;
  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;
  isPremium?: boolean;
  onReset: () => void;
  totalAmount: number;
  selectedContact: string | null;
  onContactSelect: (contactName: string | null) => void;
  onMenuClick?: () => void;
}

const CardScreen: React.FC<CardScreenProps> = ({ 
  onPayButtonPress, 
  paymentAmount,
  setPaymentAmount,
  isPremium = false,
  onReset,
  totalAmount,
  selectedContact,
  onContactSelect,
  onMenuClick
}) => {
  const [isCardStackVisible, setIsCardStackVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [showThemeLabel, setShowThemeLabel] = useState(false);
  const [bankName, setBankName] = useState(() => {
    return localStorage.getItem('bankName') || 'Bank';
  });
  const [showLockIcon, setShowLockIcon] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  // Add new state for card number
  const [cardLastFour, setCardLastFour] = useState(() => {
    return localStorage.getItem('cardLastFour') || '9521';
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedThemeIndex = localStorage.getItem('defaultCardTheme');
    if (savedThemeIndex !== null) {
      setCurrentThemeIndex(parseInt(savedThemeIndex));
    }
  }, []);

  // Function to generate random 4-digit number
  const generateRandomCardNumber = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
    return randomNumber;
  };
  
  // Function to limit and format currency values
  const formatCurrency = (amount: number) => {
    // Limit the amount to 999,999.99
    const limitedAmount = Math.min(amount, 999999.99);
    
    return limitedAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const cardThemes: CardTheme[] = [
    {
      id: 'classic-blue',
      name: 'Chase Sapphire',
      background: 'linear-gradient(145deg, #0A4DA8 0%, #062E65 100%)',
      logoColor: '#0E59A9',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
      rainbow: true,
      shine: true,
      logoBackground: 'linear-gradient(135deg, #2D80D2 0%, #1C6ABD 100%)',
      logoInnerBackground: '#0E59A9',
      borderAccent: 'white'
    },
    {
      id: 'obsidian',
      name: 'Obsidian Reserve',
      background: 'linear-gradient(145deg, #1A1A1A 0%, #000000 100%)',
      logoColor: '#333333',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h4v4H0V0zm8 0h4v4H8V0zm8 0h4v4h-4V0zM4 8h4v4H4V8zm8 0h4v4h-4V8zm8 0h4v4h-4V8zM0 16h4v4H0v-4zm16 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
      rainbow: false,
      shine: true,
      logoBackground: 'linear-gradient(135deg, #333333 0%, #1A1A1A 100%)',
      logoInnerBackground: '#333333',
      borderAccent: '#888888'
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold',
      background: 'linear-gradient(145deg, #E6B8AB 0%, #BD8C7D 100%)',
      logoColor: '#9D6B5E',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3Ccircle cx='3' cy='13' r='1'/%3E%3Ccircle cx='13' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
      rainbow: true,
      shine: true,
      logoBackground: 'linear-gradient(135deg, #D1A193 0%, #BD8C7D 100%)',
      logoInnerBackground: '#9D6B5E',
      borderAccent: '#F4DAD3'
    },
    {
      id: 'emerald',
      name: 'Emerald Elite',
      background: 'linear-gradient(145deg, #0E6655 0%, #145A32 100%)',
      logoColor: '#0B5345',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M10 0l10 20H0L10 0z'/%3E%3C/g%3E%3C/svg%3E")`,
      rainbow: false,
      shine: true,
      logoBackground: 'linear-gradient(135deg, #1E8449 0%, #117A65 100%)',
      logoInnerBackground: '#0B5345',
      borderAccent: '#7DCEA0'
    },
    {
      id: 'amethyst',
      name: 'Amethyst',
      background: 'linear-gradient(145deg, #9B59B6 0%, #6C3483 100%)',
      logoColor: '#512E5F',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M2 0h4l4 4-4 4H2V0zm10 0h4v8h-4V0zM0 10h8l4 4-4 4H0v-8z'/%3E%3C/g%3E%3C/svg%3E")`,
      rainbow: true,
      shine: true,
      logoBackground: 'linear-gradient(135deg, #AF7AC5 0%, #9B59B6 100%)',
      logoInnerBackground: '#512E5F',
      borderAccent: '#D7BDE2'
    }
  ];

  const currentTheme = cardThemes[currentThemeIndex];

  const { isSwiping } = useSwipeGesture(containerRef, {
    onSwipeUp: () => setIsCardStackVisible(true),
    onSwipeDown: () => setIsCardStackVisible(false),
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCardClick = () => {
    if (isChangingTheme || isHolding || justSaved) {
      if (justSaved) {
        setJustSaved(false);
      }
      return;
    }
    
    setIsChangingTheme(true);
    setShowThemeLabel(true);
    
    setTimeout(() => {
      setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % cardThemes.length);
    }, 150);
    
    setTimeout(() => {
      setIsChangingTheme(false);
      
      setTimeout(() => {
        setShowThemeLabel(false);
      }, 2000);
    }, 300);
  };

  const handleCardHoldStart = () => {
    if (isChangingTheme) return;
    
    setIsHolding(true);
    setHoldProgress(0);
    
    const startTime = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 2000, 1);
      setHoldProgress(progress);
      
      if (progress >= 1) {
        localStorage.setItem('defaultCardTheme', currentThemeIndex.toString());
        
        // Generate and save new card number when the card design is saved
        const newCardNumber = generateRandomCardNumber();
        setCardLastFour(newCardNumber);
        localStorage.setItem('cardLastFour', newCardNumber);
        
        setShowLockIcon(true);
        clearInterval(interval);
        setHoldTimer(null);
        setIsHolding(false);
        setJustSaved(true);
        
        setTimeout(() => {
          setShowLockIcon(false);
        }, 2000);
      }
    }, 50);
    
    setHoldTimer(interval);
  };

  const handleCardHoldEnd = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const calculateShinePosition = () => {
    if (!cardRef.current) return { x: '0%', y: '0%' };
    
    const { x, y } = mousePosition;
    const card = cardRef.current;
    const width = card.offsetWidth;
    const height = card.offsetHeight;
    
    const xPercent = Math.round((x / width) * 100);
    const yPercent = Math.round((y / height) * 100);
    
    return { x: `${xPercent}%`, y: `${yPercent}%` };
  };

  const shinePosition = calculateShinePosition();

  const handleBankNameChange = (newName: string) => {
    setBankName(newName);
    localStorage.setItem('bankName', newName);
  };

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-b from-gray-900 to-black h-screen w-full overflow-hidden relative"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="absolute top-0 left-1/4 w-1/2 h-80 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500 opacity-5 blur-3xl pointer-events-none"></div>
      
      <div className="flex justify-center items-center mt-14 px-6">
        <div 
          ref={cardRef}
          onClick={handleCardClick}
          onMouseDown={handleCardHoldStart}
          onMouseUp={handleCardHoldEnd}
          onMouseLeave={handleCardHoldEnd}
          onTouchStart={handleCardHoldStart}
          onTouchEnd={handleCardHoldEnd}
          onTouchCancel={handleCardHoldEnd}
          className={`chase-card w-full max-w-sm rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 ${
            isChangingTheme ? 'scale-95 opacity-70' : isHolding ? '' : 'hover:scale-[1.02]'
          }`}
          style={{
            background: currentTheme.background,
            height: '14rem',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05) inset',
            position: 'relative',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          {isHolding && holdProgress > 0 && (
            <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-100"
                 style={{ width: `${holdProgress * 100}%` }}></div>
          )}
          
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
              showLockIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-150'
            }`}
          >
            <div className="bg-black bg-opacity-80 rounded-full p-4">
              <Lock size={36} className="text-white" />
            </div>
          </div>
          
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-90 rounded-2xl px-5 py-2.5 transition-opacity duration-300 ${
              showThemeLabel ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="text-white font-medium text-sm whitespace-nowrap">{currentTheme.name}</div>
          </div>
          
          <div 
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex justify-center space-x-2 transition-opacity duration-300 ${
              showThemeLabel ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {cardThemes.map((theme, index) => (
              <div
                key={theme.id}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentThemeIndex ? 'bg-white scale-125' : 'bg-white opacity-50'
                }`}
              ></div>
            ))}
          </div>
          
          {currentTheme.shine && (
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${shinePosition.x} ${shinePosition.y}, rgba(255, 255, 255, 0.8), transparent 60%)`,
                mixBlendMode: 'overlay',
              }}
            ></div>
          )}
          
          {currentTheme.rainbow && (
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden"
              style={{
                background: 'linear-gradient(45deg, rgba(255,0,0,0), rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(255,0,0,0))',
                backgroundSize: '400% 400%',
                animation: 'rainbowShift 5s ease infinite',
                filter: 'blur(20px)',
              }}
            ></div>
          )}
          
          <div className="absolute inset-0 bg-repeat opacity-15" style={{
            backgroundImage: currentTheme.pattern,
            backgroundSize: '20px 20px',
          }}></div>
          
          <div 
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
            style={{ 
              background: `linear-gradient(to right, transparent, ${currentTheme.borderAccent}, transparent)` 
            }}
          ></div>
          
          <div className="p-6 flex flex-col h-full relative z-10">
            <div className="flex justify-between">
              <div className="text-white text-xl font-medium">
                {bankName}<span className="ml-1 text-xs align-top relative -top-0.0">®</span>
              </div>
            </div>
            
            <div className="flex-grow"></div>
            
            <div>
              <div className="flex justify-end mb-1">
                <div className="text-white text-xs font-medium tracking-wide opacity-90"
                     style={{ textShadow: '0 0.5px 1px rgba(0, 0, 0, 0.3)' }}>DEBIT</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-white text-sm tracking-widest opacity-90 font-medium"
                     style={{ textShadow: '0 0.5px 1px rgba(0, 0, 0, 0.3)' }}>•••• {cardLastFour}</div>
                <div className="text-white text-2xl font-bold italic tracking-wider"
                     style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>VISA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full px-6 max-w-sm mx-auto mt-6 flex justify-between items-center">
        <button
          onClick={onReset}
          className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-200 flex items-center focus:outline-none"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-white/50"> {formatCurrency(totalAmount)}</span>
        </button>
        <button
          onClick={onMenuClick}
          className="text-gray-400 hover:text-gray-300 transition-colors duration-200 p-1.5 hover:bg-gray-800 rounded-full"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      {!isCardStackVisible && (
        <div className="absolute bottom-36 w-full flex flex-col items-center px-6">
          <button 
            onClick={onPayButtonPress}
            className="request-button group relative w-48 text-white/50 py-3.5 text-base font-medium tracking-tight focus:outline-none transition-all duration-300 rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.05)',
              border: '0.5px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Shimmer effect overlay */}
            <div className="shimmer-overlay absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="shimmer-light absolute top-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            </div>
            
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
                 style={{
                   background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
                 }}></div>
            
            <span className="relative z-10 text-white/60 transition-colors duration-300 flex items-center justify-center group-hover:text-white/90">
              <Apple className="w-5 h-5 mr-2 opacity-80" />
              Request
            </span>
          </button>
        </div>
      )}
      
      <div className="absolute bottom-14 w-full text-center flex flex-col items-center space-y-2">
        <p className="text-gray-400/30 text-xs font-medium">Swipe up to edit request </p>
        <p className="text-gray-500/30 mb-[10px] text-xs font-medium">Tap card to change design & hold to save</p>
      </div>
      
      <style jsx>{`
        @keyframes shineEffect {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes lockPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.05);
          }
          50% { 
            transform: scale(1.02); 
            box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.05);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(12deg); }
          100% { transform: translateX(200%) skewX(12deg); }
        }
        
        .request-button {
          animation: breathe 3s ease-in-out infinite;
        }
        
        .request-button:hover {
          animation: none;
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.1);
        }
        
        .request-button:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
        
        .request-button:hover .shimmer-light {
          animation: shimmer 1.5s ease-in-out;
        }
        
        .shimmer-overlay {
          border-radius: inherit;
        }
      `}</style>
      
      <CardStack 
        isVisible={isCardStackVisible} 
        onClose={() => setIsCardStackVisible(false)}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        onContactSelect={onContactSelect}
        onSignOut={() => {}}  // If you want to handle sign out in CardScreen
        onBankNameChange={handleBankNameChange}
      />
    </div>
  );
};

export default CardScreen;