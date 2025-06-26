import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { Eye, EyeOff, LogIn, Shield, Mail, Lock, User } from 'lucide-react';

// Tournapp Logo Component with theme switching
const TournappLogo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      {/* Light mode logo */}
      <img 
        src="/assets/light-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-8 w-auto dark:hidden"
      />
      {/* Dark mode logo */}
      <img 
        src="/assets/dark-tournapp-logo.svg" 
        alt="Tournapp" 
        className="h-8 w-auto hidden dark:block"
      />
    </div>
  );
};

export default function Login() {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'id'>('email');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Tennis court images for slideshow - using uploaded images
  const tennisImages = [
    '/assets/braden-egli-k_H7OSg_fUs-unsplash.jpg',
    '/assets/rodrigo-kugnharski-DnaofMNz0HM-unsplash.jpg',
    '/assets/jeffery-erhunse-6D2Lmtv_X8A-unsplash.jpg',
    '/assets/guilherme-maggieri-OH5g9IgcMWs-unsplash.jpg'
  ];

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % tennisImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [tennisImages.length]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(emailOrId, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email/ID or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmailOrId('harry.potter@tournapp.com');
    setPassword('admin123');
    setLoginType('email');
  };

  const detectInputType = (value: string) => {
    if (value.includes('@')) {
      setLoginType('email');
    } else if (value.length > 0) {
      setLoginType('id');
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-inter">
      {/* Left Side - Login Form (50%) */}
      <div className="w-1/2 relative">
        {/* Logo - Top Left with Padding */}
        <div className="absolute top-8 left-8 z-10">
          <TournappLogo />
        </div>

        {/* Centered Content - Moved Lower */}
        <div className="flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-20 xl:px-24 pt-24">
          <div className="w-full max-w-md mt-16">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Login to your account
              </h1>
              <p className="text-gray-600">
                Welcome back, please enter your details
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={emailOrId}
                    onChange={(e) => {
                      setEmailOrId(e.target.value);
                      detectInputType(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="name@website.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-500"
                    placeholder="••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Keep me logged in */}
              <div className="flex items-center">
                <input
                  id="keep-logged-in"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="keep-logged-in" className="ml-2 text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                loading={isLoading}
                className="w-full py-3 text-base font-medium bg-primary-600 hover:bg-primary-700"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </Button>
            </form>

            {/* Demo Login Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-4">Demo Account</p>
              <button
                onClick={handleDemoLogin}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2" />
                Use Demo Account
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © TournApp 2025. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Tennis Court Images Animation (50%) */}
      <div className="w-1/2 bg-gray-900 relative overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          {tennisImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image}
                alt={`Tennis court ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Subtle Gradient Overlay for Visual Appeal */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
            </div>
          ))}
        </div>
        
        {/* Minimal Content Overlay - Only Image Indicators */}
        <div className="relative z-10 flex flex-col justify-end h-full">
          {/* Image Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {tennisImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}