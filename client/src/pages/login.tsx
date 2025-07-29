import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Phone, Lock, User, Shield, Crown, Building2 } from 'lucide-react';

const Login: React.FC = () => {
  const { language } = useLanguage();
  const { enableMockUser } = useAuth();
  const [, setLocation] = useLocation();
  
  const [loginType, setLoginType] = useState<'member' | 'leader' | 'admin'>('member');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Enable mock user and redirect to hero page
      enableMockUser();
      setLocation('/');
    }, 1500);
  };

  const handleDemoLogin = () => {
    console.log('Demo login clicked'); // Debug log
    setIsLoading(true);
    
    // Enable mock user immediately
    enableMockUser();
    
    // Use a more reliable approach with multiple checks
    const checkAndNavigate = () => {
      const mockUserEnabled = localStorage.getItem('showMockUser') === 'true';
      console.log('Mock user enabled:', mockUserEnabled); // Debug log
      
      if (mockUserEnabled) {
        setIsLoading(false);
        console.log('Navigating to hero page'); // Debug log
        setLocation('/');
        console.log('Navigation completed'); // Debug log
      } else {
        // Retry after a short delay
        setTimeout(checkAndNavigate, 100);
      }
    };
    
    // Start checking after a short delay
    setTimeout(checkAndNavigate, 500);
    
    // Fallback timeout to ensure navigation happens
    setTimeout(() => {
      if (isLoading) {
        console.log('Fallback navigation triggered'); // Debug log
        setIsLoading(false);
        setLocation('/');
      }
    }, 3000);
  };

  const getLoginTypeInfo = () => {
    switch (loginType) {
      case 'member':
        return {
          title: language === 'mr' ? 'सदस्य लॉगिन' : 'Member Login',
          description: language === 'mr' ? 'सामान्य सदस्य लॉगिन' : 'Default member login',
          icon: <User className="w-4 h-4" />,
          color: 'bg-gradient-to-br from-blue-500 to-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800',
          cardColor: 'from-blue-50 to-blue-100'
        };
      case 'leader':
        return {
          title: language === 'mr' ? 'नेते लॉगिन' : 'Leader Login',
          description: language === 'mr' ? 'पार्टी नेते लॉगिन' : 'Party leader login',
          icon: <Crown className="w-4 h-4" />,
          color: 'bg-gradient-to-br from-orange-500 to-orange-600',
          badgeColor: 'bg-orange-100 text-orange-800',
          cardColor: 'from-orange-50 to-orange-100'
        };
      case 'admin':
        return {
          title: language === 'mr' ? 'प्रशासक लॉगिन' : 'Admin Login',
          description: language === 'mr' ? 'सिस्टम प्रशासक लॉगिन' : 'System administrator login',
          icon: <Shield className="w-4 h-4" />,
          color: 'bg-gradient-to-br from-red-500 to-red-600',
          badgeColor: 'bg-red-100 text-red-800',
          cardColor: 'from-red-50 to-red-100'
        };
    }
  };

  const loginInfo = getLoginTypeInfo();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic 3D Saffron Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Saffron Circles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300/30 rounded-full animate-float blur-sm"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-300/40 rounded-full animate-bounce-gentle blur-sm"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-amber-300/25 rounded-full animate-pulse-slow blur-sm"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-300/35 rounded-full animate-float blur-sm"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-orange-400/40 rounded-lg rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-yellow-400/30 rounded-xl rotate-12 animate-pulse-slower"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-400/25 rounded-2xl rotate-90 animate-spin-reverse"></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-400/15 to-yellow-500/20"></div>
        
        {/* 3D Depth Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* BJP Logo with Compact Styling */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-full p-2 border-4 border-orange-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 mb-3">
              <img 
                src="/assets/bjp-symbol.png" 
                alt="BJP Symbol" 
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide">
              {language === 'mr' ? 'भारतीय जनता पार्टी' : 'Bharatiya Janata Party'}
            </h1>
            <p className="text-sm text-white/90 font-medium drop-shadow-lg">
              {language === 'mr' ? 'महाराष्ट्र' : 'Maharashtra'}
            </p>
          </div>

          {/* Compact Login Card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${loginInfo.color} text-white shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                  {loginInfo.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800 mb-1">
                    {loginInfo.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 font-medium">
                    {loginInfo.description}
                  </CardDescription>
                </div>
              </div>
              
              {/* Compact Login Type Selector */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant={loginType === 'member' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginType('member')}
                  className={`text-xs font-semibold rounded-lg transition-all duration-300 ${
                    loginType === 'member' 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                      : 'border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <User className="w-3 h-3 mr-1" />
                  {language === 'mr' ? 'सदस्य' : 'Member'}
                </Button>
                <Button
                  variant={loginType === 'leader' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginType('leader')}
                  className={`text-xs font-semibold rounded-lg transition-all duration-300 ${
                    loginType === 'leader' 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg' 
                      : 'border-2 border-orange-200 text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {language === 'mr' ? 'नेते' : 'Leader'}
                </Button>
                <Button
                  variant={loginType === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLoginType('admin')}
                  className={`text-xs font-semibold rounded-lg transition-all duration-300 ${
                    loginType === 'admin' 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                      : 'border-2 border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {language === 'mr' ? 'प्रशासक' : 'Admin'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Compact Mobile Number Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors duration-300" />
                    <Input
                      type="tel"
                      placeholder={language === 'mr' ? 'मोबाईल नंबर टाका' : 'Enter mobile number'}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="pl-9 pr-3 py-2 text-sm font-medium rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                {/* Compact Password Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    {language === 'mr' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors duration-300" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={language === 'mr' ? 'पासवर्ड टाका' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 py-2 text-sm font-medium rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-orange-100 rounded"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3 text-gray-500" /> : <Eye className="w-3 h-3 text-gray-500" />}
                    </Button>
                  </div>
                </div>

                {/* Compact Error Message */}
                {error && (
                  <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                    {error}
                  </div>
                )}

                {/* Compact Login Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-2 text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold text-xs">
                        {language === 'mr' ? 'लॉगिन होत आहे...' : 'Logging in...'}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-sm">
                      {language === 'mr' ? 'लॉगिन करा' : 'Login'}
                    </span>
                  )}
                </Button>
              </form>

              {/* Compact Demo Login Section */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-semibold tracking-wide">
                    {language === 'mr' ? 'किंवा' : 'OR'}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {language === 'mr' ? 'डेमो लॉगिन' : 'Login for Demo Purpose'}
              </Button>

              {/* Compact Forgot Password Link */}
              <div className="text-center">
                <Link href="/forgot-password" className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-300">
                  {language === 'mr' ? 'पासवर्ड विसरलात?' : 'Forgot Password?'}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Compact Footer */}
          <div className="text-center mt-4 text-xs text-white/80 font-medium drop-shadow-lg">
            <p>
              {language === 'mr' 
                ? '© 2024 भारतीय जनता पार्टी - महाराष्ट्र. सर्व हक्क राखीव.' 
                : '© 2024 Bharatiya Janata Party - Maharashtra. All rights reserved.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 