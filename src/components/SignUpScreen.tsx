import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate('/pricing');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
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
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Create Account</h1>
          
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
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/60 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200 border border-gray-700/30"
                style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
              />
            </div>
            
            <button
              type="submit"
              className="relative w-full py-3.5 text-base font-medium focus:outline-none active:opacity-90 transition-all duration-200 rounded-xl text-white mt-4"
              style={{
                background: 'linear-gradient(to right, #0A84FF, #0070E0)',
                boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3)'
              }}
            >
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-transparent opacity-10 pointer-events-none rounded-t-xl"></div>
              <span className="relative z-10">Create Account</span>
            </button>
          </form>
          
          <div className="my-7 flex items-center">
            <div className="flex-1 border-t border-gray-800"></div>
            <span className="px-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-800"></div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-800/60 text-white rounded-xl py-3.5 font-medium flex items-center justify-center space-x-3 transition-all duration-200 border border-gray-700/30 active:bg-gray-700/70"
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
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-500 font-medium hover:text-blue-400 transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      
      {/* iOS-style home indicator */}
      <div className="absolute bottom-4 w-full flex flex-col items-center space-y-3">
        <p className="text-gray-500 text-xs font-medium">Apple Pay Prank v1.0</p>
      </div>
    </div>
  );
};

export default SignUpScreen;