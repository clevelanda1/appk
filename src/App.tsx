import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import PricingScreen from './components/PricingScreen';
import { useAuth } from './hooks/useAuth';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="bg-gradient-to-b from-gray-900 to-black fixed inset-0 flex items-center justify-center"
       style={{
         height: 'calc(var(--vh, 1vh) * 100)',
         paddingBottom: 'env(safe-area-inset-bottom, 0px)'
       }}>
    <div className="flex flex-col items-center space-y-4">
      {/* Animated Apple Pay style loading */}
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
      
      <div className="text-center">
        <p className="text-white text-lg font-medium">Loading...</p>
        <p className="text-gray-400 text-sm mt-1">Checking authentication</p>
      </div>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requirePremium = false 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
  requirePremium?: boolean;
}) => {
  const { user, loading, isPremium, sessionChecked } = useAuth();

  // CRITICAL: Show loading until we KNOW the auth state
  if (loading || !sessionChecked) {
    return <LoadingScreen />;
  }

  // Now we can safely evaluate auth requirements
  if (requireAuth && !user) {
    return <Navigate to="/signin" replace />;
  }

  if (requirePremium && user && !isPremium) {
    return <Navigate to="/pricing" replace />;
  }

  // Redirect premium users away from pricing
  if (user && isPremium && window.location.pathname === '/pricing') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user, loading, isPremium, sessionChecked } = useAuth();
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // EMERGENCY: Force app to load after 7 seconds if still loading
  useEffect(() => {
    const emergencyTimeout = setTimeout(() => {
      if (loading || !sessionChecked) {
        console.error('EMERGENCY MODE: Auth stuck, forcing app load');
        setEmergencyMode(true);
      }
    }, 7000);

    return () => clearTimeout(emergencyTimeout);
  }, [loading, sessionChecked]);

  // Apply full viewport coverage for iOS devices
  useEffect(() => {
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
    
    // Ensure body and html take full height
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    
    // Apply styles for safe areas
    document.body.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    document.body.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    document.body.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
    document.body.style.paddingRight = 'env(safe-area-inset-right, 0px)';
    
    // Apply background color to body
    document.body.style.backgroundColor = '#000000';
    
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  // Debug logging for auth state
  useEffect(() => {
    if (sessionChecked || emergencyMode) {
      console.log('App render state:', {
        user: user?.email || 'not logged in',
        isPremium,
        loading,
        sessionChecked,
        emergencyMode
      });
    }
  }, [user, isPremium, loading, sessionChecked, emergencyMode]);
  
  // CRITICAL: Don't render routes until auth state is confirmed OR emergency mode
  if ((loading || !sessionChecked) && !emergencyMode) {
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
        {/* Emergency mode warning */}
        {emergencyMode && (
          <div className="fixed top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-xs z-50">
            Emergency Mode: Auth timeout
          </div>
        )}
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth routes - redirect authenticated users */}
          <Route 
            path="/signin" 
            element={
              (user && !emergencyMode) ? (
                isPremium ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/pricing" replace />
                )
              ) : (
                <SignInScreen />
              )
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              (user && !emergencyMode) ? (
                isPremium ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/pricing" replace />
                )
              ) : (
                <SignUpScreen />
              )
            } 
          />
          
          {/* Protected routes using ProtectedRoute wrapper */}
          <Route 
            path="/pricing" 
            element={
              emergencyMode ? (
                <PricingScreen />
              ) : (
                <ProtectedRoute requireAuth={true}>
                  <PricingScreen />
                </ProtectedRoute>
              )
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              emergencyMode ? (
                <Dashboard isPremium={false} />
              ) : (
                <ProtectedRoute requireAuth={true} requirePremium={true}>
                  <Dashboard isPremium={isPremium} />
                </ProtectedRoute>
              )
            } 
          />
          
          {/* Catch all - redirect based on auth state */}
          <Route 
            path="*" 
            element={
              (user && !emergencyMode) ? (
                isPremium ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/pricing" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;