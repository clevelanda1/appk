import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import PricingScreen from './components/PricingScreen';
import { useAuth } from './hooks/useAuth';

// Simple Loading Screen
const LoadingScreen = () => (
  <div className="bg-gradient-to-b from-gray-900 to-black fixed inset-0 flex items-center justify-center"
       style={{
         height: 'calc(var(--vh, 1vh) * 100)',
         paddingBottom: 'env(safe-area-inset-bottom, 0px)'
       }}>
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        
        <div 
          className="absolute -inset-2 rounded-full opacity-30 blur-xl" 
          style={{ 
            background: 'radial-gradient(circle, rgba(10, 132, 255, 0.6) 0%, rgba(10, 132, 255, 0) 70%)'
          }}
        ></div>
      </div>
      
      <div className="text-center">
        <p className="text-white text-lg font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-1">Checking authentication</p>
      </div>
    </div>
  </div>
);

function App() {
  const { user, loading, isPremium, sessionChecked } = useAuth();
  
  // iOS viewport fixes
  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setAppHeight();
    
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    document.body.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    document.body.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
    document.body.style.paddingRight = 'env(safe-area-inset-right, 0px)';
    document.body.style.backgroundColor = '#000000';
    
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🎯 App state:', {
      user: user?.email || 'none',
      isPremium,
      loading,
      sessionChecked,
      currentPath: window.location.pathname
    });
  }, [user, isPremium, loading, sessionChecked]);
  
  // Show loading screen until auth is checked
  if (loading || !sessionChecked) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <div className="app-container" style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes */}
          <Route 
            path="/signin" 
            element={
              user ? (
                // User is logged in, redirect based on premium status
                <Navigate to={isPremium ? "/dashboard" : "/pricing"} replace />
              ) : (
                <SignInScreen />
              )
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              user ? (
                <Navigate to={isPremium ? "/dashboard" : "/pricing"} replace />
              ) : (
                <SignUpScreen />
              )
            } 
          />
          
          {/* Pricing page - only for authenticated users */}
          <Route 
            path="/pricing" 
            element={
              !user ? (
                // Not logged in, go to sign in
                <Navigate to="/signin" replace />
              ) : isPremium ? (
                // Already premium, go to dashboard
                <Navigate to="/dashboard" replace />
              ) : (
                // Perfect - show pricing
                <PricingScreen />
              )
            } 
          />
          
          {/* Dashboard - only for premium users */}
          <Route 
            path="/dashboard" 
            element={
              !user ? (
                // Not logged in
                <Navigate to="/signin" replace />
              ) : !isPremium ? (
                // Not premium
                <Navigate to="/pricing" replace />
              ) : (
                // Perfect - show dashboard
                <Dashboard isPremium={isPremium} />
              )
            } 
          />
          
          {/* Catch all */}
          <Route 
            path="*" 
            element={
              <Navigate to={
                user ? 
                  (isPremium ? "/dashboard" : "/pricing") : 
                  "/"
              } replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;