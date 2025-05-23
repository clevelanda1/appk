import React, { useState, useEffect } from 'react';

// Define card theme types from CardScreen
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
  bankName: string; // Added bank name to each theme
};

const BankCardCycler = () => {
  // Combined bank names with card themes
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
      borderAccent: 'white',
      bankName: "CHASE"
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
      bankName: "CITI"
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
      bankName: "BANK OF AMERICA"
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
      bankName: "CAPITAL ONE"
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
      bankName: "DISCOVER"
    }
  ];
  
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [nextThemeIndex, setNextThemeIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('down'); // 'up' or 'down'
  
  useEffect(() => {
    // Set up timer to change bank name and card theme every 5 seconds
    const interval = setInterval(() => {
      // Toggle animation direction for variety
      setAnimationDirection(prev => prev === 'up' ? 'down' : 'up');
      setIsAnimating(true);
      
      // After animation starts, prepare the next theme
      setTimeout(() => {
        setNextThemeIndex((currentThemeIndex + 1) % cardThemes.length);
        
        // After animation completes, update current theme and reset animation
        setTimeout(() => {
          setCurrentThemeIndex(nextThemeIndex);
          setIsAnimating(false);
        }, 400); // Animation completion time
      }, 100); // Slight delay before changing theme
      
    }, 5000); // 5 seconds per bank name/theme
    
    return () => clearInterval(interval);
  }, [currentThemeIndex, nextThemeIndex]);
  
  // Update the card design based on current theme
  useEffect(() => {
    const cardElement = document.querySelector('.chase-card');
    if (cardElement) {
      const currentTheme = cardThemes[currentThemeIndex];
      
      // Update card background
      cardElement.setAttribute('style', `
        background: ${currentTheme.background};
        height: 14rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
        position: relative;
        transition: background 0.5s ease-in-out;
      `);
      
      // Update pattern overlay
      const patternElement = cardElement.querySelector('.pattern-overlay');
      if (patternElement) {
        patternElement.setAttribute('style', `
          background-image: ${currentTheme.pattern};
          background-size: 20px 20px;
        `);
      }
      
      // Update rainbow effect visibility
      const rainbowElement = cardElement.querySelector('.rainbow-effect');
      if (rainbowElement) {
        rainbowElement.style.display = currentTheme.rainbow ? 'block' : 'none';
      }
      
      // Update border accent
      const borderElement = cardElement.querySelector('.border-accent');
      if (borderElement) {
        borderElement.setAttribute('style', `
          background: linear-gradient(to right, transparent, ${currentTheme.borderAccent}, transparent);
        `);
      }
    }
  }, [currentThemeIndex]);
  
  // Animation classes based on direction and state
  const currentNameClasses = isAnimating
    ? `transform ${animationDirection === 'up' ? '-translate-y-8' : 'translate-y-8'} opacity-0`
    : 'transform translate-y-0 opacity-100';
    
  const nextNameClasses = isAnimating
    ? 'transform translate-y-0 opacity-100'
    : `transform ${animationDirection === 'up' ? 'translate-y-8' : '-translate-y-8'} opacity-0`;
  
  return (
    <div className="relative h-6 overflow-hidden">
      {/* Current bank name */}
      <div 
        className={`text-white text-xl font-medium absolute transition-all duration-400 ease-out flex items-center ${currentNameClasses}`}
        style={{ 
          left: '0',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {cardThemes[currentThemeIndex].bankName}
        <span className="ml-1 text-xs align-top">®</span>
      </div>
      
      {/* Next bank name (for transition) */}
      <div 
        className={`text-white text-xl font-medium absolute transition-all duration-400 ease-out flex items-center ${nextNameClasses}`}
        style={{ 
          left: '0',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {cardThemes[nextThemeIndex].bankName}
        <span className="ml-1 text-xs align-top">®</span>
      </div>

      {/* Export the current themes for use by parent component */}
      <div className="hidden">
        {JSON.stringify({
          currentTheme: cardThemes[currentThemeIndex],
          nextTheme: cardThemes[nextThemeIndex]
        })}
      </div>
    </div>
  );
};

export default BankCardCycler;