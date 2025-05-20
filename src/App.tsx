import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import PricingScreen from './components/PricingScreen';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading, isPremium } = useAuth();
  
  // Show loading state if auth is still initializing
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black h-screen w-full flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInScreen />} />
        <Route path="/signup" element={<SignUpScreen />} />
        <Route 
          path="/pricing" 
          element={
            user ? (
              isPremium ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <PricingScreen />
              )
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              isPremium ? (
                <Dashboard isPremium={isPremium} />
              ) : (
                <Navigate to="/pricing" replace />
              )
            ) : (
              <Navigate to="/signin" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;