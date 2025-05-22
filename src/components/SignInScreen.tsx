import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase, testSupabaseConnection } from '../lib/supabaseClient';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ tested: false, success: false });
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Test connection when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testSupabaseConnection();
      setConnectionStatus({ tested: true, success: result });
      
      // Log environment info for debugging
      console.log('Environment check:', {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        mode: import.meta.env.MODE || 'unknown'
      });
    };
    
    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Show connection warnings if applicable
      if (!connectionStatus.success && connectionStatus.tested) {
        console.warn('Attempting login despite failed connection test');
      }
      
      // Validate input
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Log authentication attempt
      console.log('Starting sign in with:', email);
      console.log('Using Supabase URL:', supabase.supabaseUrl);
      
      // Attempt sign in
      const { error: signInError, data } = await signIn(email, password);
        console.log ('Sign-in error', signInError);
      
      if (signInError) {
        // Handle specific error cases
        if (signInError.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        } else if (
          signInError.message?.includes('network') || 
          signInError.message?.includes('ERR_NAME_NOT_RESOLVED') ||
          signInError.message?.includes('fetch') ||
          signInError.message?.includes('connect')
        ) {
          throw new Error('Network error - cannot connect to authentication service. Please try again later.');
        } else {
          throw signInError;
        }
      }

      // Check premium status and redirect
      if (data?.user) {
        try {
          const { data: orders, error: ordersError } = await supabase
            .from('stripe_orders')
            .select('status')
            .eq('status', 'completed')
            .not('payment_status', 'eq', 'unpaid')
            .maybeSingle();

          if (ordersError) throw ordersError;

          // Redirect based on premium status
          navigate(orders ? '/dashboard' : '/pricing');
        } catch (err) {
          console.error('Error checking premium status:', err);
          // Default to pricing page if status check fails
          navigate('/pricing');
        }
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      
      if (!connectionStatus.success && connectionStatus.tested) {
        throw new Error('Unable to connect to authentication service. Please try again later.');
      }
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        if (error.message?.includes('popup')) {
          throw new Error('Popup blocked - please allow popups and try again');
        } else if (
          error.message?.includes('network') || 
          error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
          error.message?.includes('fetch') ||
          error.message?.includes('connect')
        ) {
          throw new Error('Network error - cannot connect to authentication service. Please try again later.');
        } else {
          throw error;
        }
      }
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/90 p-6 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-r-2 rounded-full"></div>
              <p className="text-white font-medium">Signing in...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <div className="p-6 relative z-10">
        <div className="mt-6 mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 font-medium text-lg focus:outline-none transition-colors duration-200"
          >
            Done
          </button>
        </div>

        <div className="max-w-md mx-auto mt-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Sign In</h1>
          
          {/* Connection status warning */}
          {connectionStatus.tested && !connectionStatus.success && (
            <div className="mb-6 p-4 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl text-yellow-400 text-sm">
              <p className="font-medium mb-1">Connection Warning:</p>
              <p>We're having trouble connecting to our authentication service. You can still try signing in, but might encounter issues.</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/60 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200 border border-gray-700/30"
                style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/60 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200 border border-gray-700/30"
                style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 text-base font-medium focus:outline-none active:opacity-90 transition-all duration-200 rounded-xl text-white mt-4 disabled:opacity-70"
              style={{
                background: 'linear-gradient(to right, #0A84FF, #0070E0)',
                boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3)'
              }}
            >
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-xl"></div>
              <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
          
          <div className="my-7 flex items-center">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="px-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-gray-800/60 text-white rounded-xl py-3.5 font-medium flex items-center justify-center space-x-3 transition-all duration-200 border border-gray-700/30 active:bg-gray-700/70 disabled:opacity-70"
            style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <p className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 font-medium hover:text-blue-400 transition-colors duration-200">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      
      {/* iOS-style home indicator */}
      <div className="absolute bottom-8 w-full flex flex-col items-center space-y-3">
        <p className="text-gray-500 text-xs font-medium">Apple Pay Prank v1.0</p>
      </div>
    </div>
  );
};

export default SignInScreen;