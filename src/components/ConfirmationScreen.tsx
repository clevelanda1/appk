import React, { useState, useRef, useEffect } from 'react';
import { Transaction } from '../hooks/useTransactions';
import { Command, Lock } from 'react-bootstrap-icons';

// Define card theme types
type CardTheme = {
  id: string;
  name: string;
  background: string;
  pattern: string;
  topAccent: string;
  bottomAccent: string;
  contentColor: string;
  patternOpacity: number;
  logoText: string;
  logoStyle: string;
};

interface ConfirmationScreenProps {
  amount?: number;
  selectedContact?: string | null;
  onDone: () => void;
  transactions?: Transaction[];
  paymentAmount?: number;
  onRefund?: (transactionId: string) => Promise<void>;
  onSendRequest?: () => void;
  onClearTransactions?: () => Promise<void>;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ 
  amount = 0, 
  selectedContact = null,
  onDone,
  transactions = [],
  paymentAmount = 0,
  onRefund,
  onSendRequest,
  onClearTransactions
}) => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [showThemeLabel, setShowThemeLabel] = useState(false);
  const [showLockIcon, setShowLockIcon] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [displayPaymentAmount, setDisplayPaymentAmount] = useState(paymentAmount);
  const cardRef = useRef<HTMLDivElement>(null);

  // Format currency with commas and two decimal places
  const formatCurrency = (value: number): string => {
    // Ensure values don't exceed maximum
    const cappedValue = Math.min(value, 999999.99);
    return cappedValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeIndex = localStorage.getItem('defaultCardTheme');
    if (savedThemeIndex !== null) {
      setCurrentThemeIndex(parseInt(savedThemeIndex));
    }
  }, []);
  
  // Update display payment amount when prop changes
  useEffect(() => {
    setDisplayPaymentAmount(paymentAmount);
  }, [paymentAmount]);
  
  // Define card themes
  const cardThemes: CardTheme[] = [
    {
      id: 'default-purple',
      name: 'Cash Purple',
      background: 'black',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
      topAccent: 'from-transparent via-white to-transparent',
      bottomAccent: 'from-transparent via-purple-400 to-transparent',
      contentColor: 'text-white',
      patternOpacity: 0.10,
      logoText: '⌘Cash',
      logoStyle: 'text-white flex items-center'
    },
    {
      id: 'midnight-blue',
      name: 'Midnight Blue',
      background: 'linear-gradient(145deg, #1E3A8A 0%, #0F172A 100%)',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3Ccircle cx='3' cy='13' r='1'/%3E%3Ccircle cx='13' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
      topAccent: 'from-transparent via-blue-300 to-transparent',
      bottomAccent: 'from-transparent via-blue-400 to-transparent',
      contentColor: 'text-white',
      patternOpacity: 0.15,
      logoText: '⌘Cash',
      logoStyle: 'text-blue-300 flex items-center'
    },
    {
      id: 'emerald',
      name: 'Emerald',
      background: 'linear-gradient(145deg, #065F46 0%, #064E3B 100%)',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M10 0l10 20H0L10 0z'/%3E%3C/g%3E%3C/svg%3E")`,
      topAccent: 'from-transparent via-green-300 to-transparent',
      bottomAccent: 'from-transparent via-emerald-400 to-transparent',
      contentColor: 'text-white',
      patternOpacity: 0.15,
      logoText: '⌘Cash',
      logoStyle: 'text-emerald-300 flex items-center'
    },
    {
      id: 'carbon-black',
      name: 'Carbon Black',
      background: 'linear-gradient(145deg, #111827 0%, #000000 100%)',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h4v4H0V0zm8 0h4v4H8V0zm8 0h4v4h-4V0zM4 8h4v4H4V8zm8 0h4v4h-4V8zm8 0h4v4h-4V8zM0 16h4v4H0v-4zm16 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
      topAccent: 'from-transparent via-gray-400 to-transparent',
      bottomAccent: 'from-transparent via-gray-500 to-transparent',
      contentColor: 'text-white',
      patternOpacity: 0.10,
      logoText: '⌘Cash',
      logoStyle: 'text-gray-300 flex items-center'
    },
    {
      id: 'sunset-gold',
      name: 'Sunset Gold',
      background: 'linear-gradient(145deg, #92400E 0%, #78350F 100%)',
      pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M2 0h4l4 4-4 4H2V0zm10 0h4v8h-4V0zM0 10h8l4 4-4 4H0v-8z'/%3E%3C/g%3E%3C/svg%3E")`,
      topAccent: 'from-transparent via-yellow-300 to-transparent',
      bottomAccent: 'from-transparent via-amber-400 to-transparent',
      contentColor: 'text-white',
      patternOpacity: 0.12,
      logoText: '⌘Cash',
      logoStyle: 'text-amber-300 flex items-center'
    }
  ];

  const currentTheme = cardThemes[currentThemeIndex];
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${String(currentDate.getFullYear()).slice(2)}`;

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 5) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 120) return '1 minute ago';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 7200) return '1 hour ago';
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    
    return formattedDate;
  };

  const getInitials = (name: string) => {
    if (!name) return null;
    if (name.startsWith("+")) return null;
    if (name.includes("'")) return null;
    
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0].charAt(0)}${names[1].charAt(0)}`
      : name.charAt(0);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    if (transaction.status !== 'Refunded') {
      setSelectedTransactionId(transaction.id === selectedTransactionId ? null : transaction.id);
    }
  };

  const handleRefund = async () => {
    if (selectedTransactionId && onRefund) {
      // Clear the payment amount display when refunding
      setDisplayPaymentAmount(0);
      await onRefund(selectedTransactionId);
      setSelectedTransactionId(null);
    }
  };

  const handleClearTransactions = async () => {
    if (onClearTransactions) {
      await onClearTransactions();
      setShowMenu(false);
    }
  };
  
  const PurpleDotsPattern = () => {
    const dotColorClass = currentThemeIndex === 0 ? 'bg-purple-700' :
                          currentThemeIndex === 1 ? 'bg-blue-700' :
                          currentThemeIndex === 2 ? 'bg-emerald-700' :
                          currentThemeIndex === 3 ? 'bg-gray-700' : 'bg-amber-700';
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full">
          {Array.from({ length: 15 }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center">
              {Array.from({ length: 20 }).map((_, colIndex) => {
                const size = 4;
                const top = rowIndex * 10;
                const left = colIndex * 10 - (rowIndex % 2 ? 5 : 0);
                const centerX = 150;
                const centerY = 75;
                const distanceFromCenter = Math.sqrt(
                  Math.pow(left - centerX, 2) + Math.pow(top - centerY, 2)
                );
                const maxDistance = 170;
                const opacity = Math.max(0, 1 - distanceFromCenter / maxDistance);
                
                if (opacity < 0.2) return null;
                
                return (
                  <div
                    key={`dot-${rowIndex}-${colIndex}`}
                    className={`absolute rounded-full ${dotColorClass}`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      top: `${top}px`,
                      left: `${left}px`,
                      opacity: opacity,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-60" 
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(246, 246, 250, 0.9) 0%, 
                rgba(252, 252, 255, 1) 25%,
                rgba(248, 248, 252, 0.9) 50%,
                rgba(246, 248, 252, 0.9) 75%, 
                rgba(248, 250, 253, 1) 100%)
            `,
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite'
          }}
        ></div>
        
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-50 opacity-30 blur-xl"></div>
        <div className="absolute top-1/4 -left-20 w-48 h-48 rounded-full bg-purple-50 opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-indigo-50 opacity-15 blur-xl"></div>
      </div>
      
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        @keyframes shineEffect {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes lockPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        .transactions-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior: contain;
        }
        
        .transactions-container::-webkit-scrollbar {
          display: none;
        }

        .ios-blur {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="flex-1 flex flex-col z-10">
        <div className="px-5 pt-12 pb-4 flex justify-between items-center">
          <button 
            onClick={onSendRequest}
            className="text-blue-500 font-medium text-lg"
          >
            Done
          </button>
          <div className="flex items-center space-x-6">
            <button className="text-black opacity-80">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="text-black opacity-80">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="px-5 py-0 mb-2">
          <div 
            ref={cardRef}
            onClick={handleCardClick}
            onMouseDown={handleCardHoldStart}
            onMouseUp={handleCardHoldEnd}
            onMouseLeave={handleCardHoldEnd}
            onTouchStart={handleCardHoldStart}
            onTouchEnd={handleCardHoldEnd}
            onTouchCancel={handleCardHoldEnd}
            className={`p-5 rounded-xl overflow-hidden transform transition-all duration-500 cursor-pointer shadow-lg ${
              isChangingTheme || isHolding ? 'scale-95 opacity-70' : 'hover:scale-[1.02]'
            }`} 
            style={{
              background: currentTheme.background,
              height: '14rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(255, 255, 255, 0.1) inset',
              position: 'relative',
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
            
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${shinePosition.x} ${shinePosition.y}, rgba(255, 255, 255, 0.8), transparent 60%)`,
                mixBlendMode: 'overlay',
              }}
            ></div>
            
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: currentTheme.pattern,
              backgroundSize: '20px 20px',
              opacity: currentTheme.patternOpacity
            }}></div>
            
            <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${currentTheme.topAccent} opacity-30`}></div>
            
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between relative z-10">
                <span className={`text-lg font-semibold ${currentTheme.logoStyle}`}>
                  <Command className="inline mr-1" size={18} />Cash
                </span>
                <div className="h-10">
                  {displayPaymentAmount > 0 && (
                    <div className={`text-[32px] font-bold tracking-tight leading-none ${currentTheme.contentColor}`} style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                      ${formatCurrency(displayPaymentAmount)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-grow flex justify-center items-center relative z-10">
                <div className="w-full h-36 relative overflow-hidden">
                  <PurpleDotsPattern />
                </div>
              </div>
            </div>
            
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${currentTheme.bottomAccent} opacity-20`}></div>
          </div>
        </div>
        
        <div className="px-5 py-2 mb-2 bg-white rounded-t-3xl">
          <div className="text-sm text-gray-500 font-normal tracking-wide uppercase mb-0.5">Balance</div>
          <div className="flex items-center justify-between mt-0.5">
            <div className="text-[32px] font-bold tracking-tight leading-none text-gray-900">${formatCurrency(amount)}</div>
            {selectedTransactionId ? (
              <button 
                onClick={handleRefund}
                className="relative bg-black hover:bg-red-600 text-white rounded-full text-sm py-2.5 px-5 font-medium overflow-hidden transition-colors duration-200"
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="relative z-10">Refund Payment</span>
              </button>
            ) : (
              <button 
                onClick={onSendRequest}
                className="relative bg-black text-white rounded-full text-sm py-2.5 px-5 font-medium overflow-hidden"
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="relative z-10">Send or Request</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="px-5 pt-1 pb-2 flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-3 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900">Latest Transactions</h3>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="2"></circle>
                  <circle cx="12" cy="5" r="2"></circle>
                  <circle cx="12" cy="19" r="2"></circle>
                </svg>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1.5 z-50 ios-blur" style={{
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                  <button
                    onClick={handleClearTransactions}
                    className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Transaction list container with improved visibility */}
          <div 
            className="flex-1 overflow-y-auto transactions-container" 
            style={{ 
              maxHeight: 'calc(100vh - 380px)', /* Reduced height to ensure full visibility */
              paddingBottom: '1px',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch' // For smoother scrolling on iOS
            }}
          >
            <div className="space-y-2.5 pb-6">
              {transactions.map((transaction) => (
                <button
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className={`w-full p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 flex items-center justify-between ${
                    selectedTransactionId === transaction.id ? 'bg-blue-50/80' : 'bg-white'
                  } ${transaction.status === 'Refunded' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={transaction.status === 'Refunded'}
                  style={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    border: selectedTransactionId === transaction.id ? '1px solid rgba(59, 130, 246, 0.1)' : '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="flex items-center">
                    {transaction.is_merchant ? (
                      <div className="w-12 h-12 bg-red-600 rounded-lg mr-3 flex items-center justify-center text-white text-lg font-bold">
                        M
                      </div>
                    ) : transaction.is_phone_number ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full mr-3 flex items-center justify-center text-gray-700 text-xl font-semibold">
                        {getInitials(transaction.contact_name) || "D"}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900 mb-[3px]">{transaction.contact_name}</div>
                      <div className="text-sm text-gray-500 mb-[3px]">{transaction.status}</div>
                      <div className="text-xs text-gray-400">{formatTimestamp(transaction.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`font-medium ${
                      transaction.status === "Refunded" 
                        ? "text-red-500" 
                        : transaction.status === "Received" 
                          ? formatTimestamp(transaction.created_at) === 'Just now'
                            ? "text-green-500"
                            : "text-black"
                          : "text-black"
                    }`}>
                      {transaction.status === "Refunded" ? "-" : transaction.status === "Received" ? "+" : "-"}${formatCurrency(transaction.amount)}
                    </div>
                    <svg className="w-5 h-5 text-gray-300 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
              {/* Empty spacer for better scrolling experience */}
              <div className="h-12"></div>
            </div>
          </div>
          
          <div className="w-full flex justify-center mt-2 mb-3 flex-shrink-0">
            <div className="w-32 h-1 bg-gray-300 opacity-60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;