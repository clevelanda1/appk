import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BankCardCycler from './BankCardCycler';
import MobileOnlyPopup from './MobileOnlyPopup';
import AuthCardStack from './AuthCardStack';
import PWAInstallPrompt from './PWAInstallPrompt';
import { 
  CreditCard2Front, 
  Coin, 
  CreditCard, 
  ArrowRepeat, 
  PatchCheck, 
  CardList 
} from 'react-bootstrap-icons';

const HomePage: React.FC = () => {
  const [isCardStackVisible, setIsCardStackVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(100); // Default to $100
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [randomCardNumbers, setRandomCardNumbers] = useState('4852');
  const [isPWAPromptVisible, setIsPWAPromptVisible] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isPWAMode, setIsPWAMode] = useState(false);
  const [hasNavigatedToFeatures, setHasNavigatedToFeatures] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  
  const cardThemes = [
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
      borderAccent: 'white',
      bankName: "UNITI"
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
      borderAccent: '#888888',
      bankName: "American National Bank"
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
      borderAccent: '#F4DAD3',
      bankName: "UNITED FEDERAL"
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
      borderAccent: '#7DCEA0',
      bankName: "Allied Credit Union"
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
      borderAccent: '#D7BDE2',
      bankName: "First American Bank"
    }
  ];

  const features = [
    {
      title: "Realistic Payment Interface",
      description: "Create convincing payment screens with authentic card designs and balance displays that look just like real banking apps",
      icon: <CreditCard2Front className="w-8 h-8" />,
      premium: true,
      imageUrl: "/1.png"
    },
    {
      title: "Custom Payment Setup", 
      description: "Add custom contacts, set payment amounts ($20, $50, $100, or custom), and personalize your prank experience",
      icon: <Coin className="w-8 h-8" />,
      premium: true,
      imageUrl: "/2.png"
    },
    {
      title: "Multiple Card Designs",
      description: "Access exclusive card themes including Blue, Rose Gold, Emerald, and Purple designs with custom bank names", 
      icon: <CreditCard className="w-8 h-8" />,
      premium: true,
      imageUrl: "/6.png"
    },
    {
      title: "Processing Screen",
      description: "Authentic loading screens with realistic timing and effects that make the prank completely convincing",
      icon: <ArrowRepeat className="w-8 h-8" />,
      premium: true,
      imageUrl: "/3.png"
    },
    {
      title: "Payment Confirmation Screen",
      description: "Authentic loading screens with realistic timing and effects that make the prank completely convincing",
      icon: <PatchCheck className="w-8 h-8" />,
      premium: true,
      imageUrl: "/4.png"
    },
    {
      title: "Live Transaction History",
      description: "Keep track of all your prank payments with detailed history showing received amounts and contact names",
      icon: <CardList className="w-8 h-8" />,
      premium: true,
      imageUrl: "/5.png"
    }
  ];
  
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
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsThemeChanging(true);
      
      setTimeout(() => {
        setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % cardThemes.length);
        
        setTimeout(() => {
          setIsThemeChanging(false);
        }, 300);
      }, 200);
      
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const generateRandomNumbers = () => {
      const random = Math.floor(1000 + Math.random() * 9000).toString();
      setRandomCardNumbers(random);
    };
    
    // Generate random numbers initially
    generateRandomNumbers();
    
    // Set up interval to change numbers every 5 seconds
    const interval = setInterval(generateRandomNumbers, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log('HomePage - user state changed:', user);
    // Force update certain components when user state changes
    if (user === null) {
      // Force CardStack to re-evaluate its rendering conditions
      setIsCardStackVisible(false);
    }
  }, [user]);
  
  // Check if PWA prompt should be shown (on initial load)
  useEffect(() => {
    // Check if the app is already running in standalone mode (installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || // For iOS
                        document.referrer.includes('android-app://');
    
    console.log('PWA Detection:', {
      displayMode: window.matchMedia('(display-mode: standalone)').matches,
      navigatorStandalone: (window.navigator as any).standalone,
      referrer: document.referrer,
      isStandalone: isStandalone
    });
    
    // Set PWA mode state
    setIsPWAMode(isStandalone);
    
    // If already installed as PWA, don't show the prompt
    if (isStandalone) {
      console.log('App is running as installed PWA, not showing prompt');
      return;
    }
    
    const hasSeenPWAPrompt = localStorage.getItem('hasSeenPWAPrompt') === 'true';
    
    // Check if the user is on a mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || navigator.vendor
    );
    
    // Only show the prompt if:
    // 1. It hasn't been dismissed before
    // 2. User is on a mobile device
    // 3. The app is not already installed as PWA
    if (!hasSeenPWAPrompt && isMobileDevice && !isStandalone) {
      // Show the prompt after a short delay to allow page to load
      const timer = setTimeout(() => {
        console.log('Setting PWA prompt visible');
        setIsPWAPromptVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Add this effect to ensure that the body background matches your app's background
  useEffect(() => {
    // Apply background color and gradient to document body
    document.documentElement.classList.add('dark-theme');
    document.body.classList.add('dark-theme');
    
    // Handle iOS viewport height issues
    const setAppHeight = () => {
      // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set the initial height
    setAppHeight();
    
    // Listen to window resize events
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);
  
  const handleGetStarted = () => {
    navigate('/signin');
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  const handleSignIn = () => {
    navigate('/signin');
    setIsNavDropdownOpen(false);
  };

  const handleSignUp = () => {
    navigate('/signup');
    setIsNavDropdownOpen(false);
  };
  
  const handlePricing = () => {
    navigate('/pricing');
    setIsNavDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      
      // Force a re-render and ensure sign-out is properly detected
      setIsCardStackVisible(false);
      
      // Force a re-render by using a state update 
      setRandomCardNumbers(Math.floor(1000 + Math.random() * 9000).toString());
      
      console.log('After sign out - user:', user);
      
      // Navigate to home to ensure a fresh state
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const handleClosePWAPrompt = () => {
    setIsPWAPromptVisible(false);
  };
  
  const handleDismissPWAPrompt = () => {
    // Save to localStorage so the prompt doesn't show again
    localStorage.setItem('hasSeenPWAPrompt', 'true');
    setIsPWAPromptVisible(false);
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
  
  const currentTheme = cardThemes[currentThemeIndex];
  
  const dropdownOptions = [
    { 
      label: "Sign In", 
      iconPath: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
      onClick: handleSignIn
    },
    { 
      label: "Sign Up", 
      iconPath: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      onClick: handleSignUp
    },
    { 
      label: "Pricing", 
      iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      onClick: handlePricing
    }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black fixed inset-0 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black overflow-auto"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {!showFeatures && !isPWAMode && !hasNavigatedToFeatures && <MobileOnlyPopup mobileMaxWidth={768} />}
      
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="absolute top-0 left-1/4 w-1/2 h-80 rounded-full bg-blue-500 opacity-5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500 opacity-5 blur-3xl pointer-events-none"></div>
      
      {/* Main Hero Section */}
      <div className={`flex-shrink-0 transition-all duration-500 ${showFeatures ? 'pb-4' : 'min-h-screen'}`}>
        <div className="flex justify-center items-center mt-2 px-6">
          <div 
            ref={cardRef}
            className={`chase-card w-full max-w-sm rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 ${
              isThemeChanging ? 'scale-95 opacity-80' : 'hover:scale-[1.02]'
            }`} 
            style={{
              background: currentTheme.background,
              height: '14rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05) inset',
              position: 'relative',
              transition: 'all 0.5s ease',
            }}
          >
            {currentTheme.shine && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at ${shinePosition.x} ${shinePosition.y}, rgba(255, 255, 255, 0.8), transparent 60%)`,
                  mixBlendMode: 'overlay',
                }}
              ></div>
            )}
            
            {currentTheme.rainbow && (
              <div 
                className="rainbow-effect absolute inset-0 opacity-10 pointer-events-none overflow-hidden transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, rgba(255,0,0,0), rgba(255,0,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(255,0,0,0))',
                  backgroundSize: '400% 400%',
                  animation: 'rainbowShift 5s ease infinite',
                  filter: 'blur(20px)',
                }}
              ></div>
            )}
            
            <div 
              className="pattern-overlay absolute inset-0 bg-repeat opacity-15 transition-all duration-500" 
              style={{
                backgroundImage: currentTheme.pattern,
                backgroundSize: '20px 20px',
              }}
            ></div>
            
            <div 
              className="border-accent absolute top-0 left-0 right-0 h-[1px] opacity-40 transition-all duration-500"
              style={{ 
                background: `linear-gradient(to right, transparent, ${currentTheme.borderAccent}, transparent)` 
              }}
            ></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold tracking-tight drop-shadow-md">
                Apple Pay Prank
              </h1>
            </div>
            
            <div className="p-6 flex flex-col h-full relative z-10">
              <div className="flex justify-between">
                <div className="text-white text-xl font-medium flex items-center">
                  {currentTheme.bankName}
                  <span className="ml-1 text-xs align-top relative -top-1.5">®</span>
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
                       style={{ textShadow: '0 0.5px 1px rgba(0, 0, 0, 0.3)' }}>•••• {randomCardNumbers}</div>
                  <div className="text-white text-2xl font-bold italic tracking-wider"
                       style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>VISA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!showFeatures && (
          <>
            <div className="px-8 mt-2 text-center">
              <h2 className="text-white text-xl font-semibold mb-3">
                <span className="relative inline-block">
                  <span className="relative z-10"></span>
                  <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
                </span>
              </h2>
              <p className="text-gray-400 text-md leading-relaxed mx-auto max-w-xs opacity-80">
                Create convincing Apple Pay notifications to share with your
                <span className="text-blue-400 mx-1 font-medium">friends & family</span>
              </p>
              
              <div className="mt-6 flex flex-col items-center">
                <button 
                  onClick={() => {
                    setShowFeatures(true);
                    setHasNavigatedToFeatures(true);
                  }}
                  className="text-gray-400 text-sm font-medium animate-pulse bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-200 flex items-center px-6 py-1.5 rounded-full border border-white border-opacity-20 focus:outline-none"
                  style={{ animationDuration: "2s" }}
                >
                  Explore features
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-24 w-full flex flex-col items-center px-6">
              <button 
                onClick={handleGetStarted}
                className="group relative w-48 text-white py-3.5 text-base font-medium focus:outline-none active:opacity-90 transition-all duration-200 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(to right, #0A84FF, #0070E0)',
                  boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-full"></div>
                <span className="relative z-10 flex items-center justify-center">
                  Get Started
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Features Section */}
      {showFeatures && (
        <div 
          ref={featuresRef}
          className="flex-grow bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="px-4 py-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-3xl font-semibold mb-3 tracking-tight">
                Everything you need for the perfect prank
              </h2>
              <p className="text-gray-600 text-lg font-normal max-w-md mx-auto leading-relaxed">
                Powerful features designed to create the most convincing payment experience.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="space-y-8 max-w-sm mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 ease-out"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: showFeatures ? 'fadeInUp 0.8s ease-out forwards' : 'none',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {/* Image Section */}
                  <div className="relative bg-gray-50 overflow-hidden">
                    <img 
                      src={feature.imageUrl} 
                      alt={`${feature.title} Screenshot`}
                      className="w-full h-[800px] object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {feature.premium && (
                      <div className="absolute top-4 right-4">
                        {/* Premium badge commented out */}
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`p-2.5 rounded-xl ${
                          feature.premium 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {feature.icon}
                        </div>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h3 className="text-gray-900 font-semibold text-lg mb-2 leading-tight">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-base leading-relaxed font-normal">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action Section */}
            <div className="mt-16 text-center space-y-6">
              <button 
                onClick={handleSignUp}
                className="w-full max-w-sm mx-auto block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 px-6 rounded-3xl transition-all duration-200 font-semibold focus:outline-none text-base shadow-sm hover:shadow-md"
              >
                Sign Up
              </button>
              
              {/* Pricing Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    $2.99 lifetime premium
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm font-normal">
                  No subscription required. Pay once, prank forever.
                </p>
              </div>
              
              {/* Back to Top */}
              <button 
                onClick={() => setShowFeatures(false)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 text-base font-medium mt-8"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                </svg>
                Back to top
              </button>
            </div>
          </div>
        </div>
      )}
      
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
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        
        @keyframes pulse-once {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        /* Add this to fix bottom area on iOS */
        .fixed {
          position: fixed !important;
        }
        
        /* Ensure full height for all elements */
        html, body, #root {
          height: 100% !important;
          overflow: hidden !important;
          background-color: #000 !important;
        }
      `}</style>
      
      {/* PWA Installation Prompt */}
      <PWAInstallPrompt
        isVisible={isPWAPromptVisible}
        onClose={handleClosePWAPrompt}
        onDismiss={handleDismissPWAPrompt}
      />
    </div>
  );
}

export default HomePage;