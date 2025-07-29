import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { Phone, ArrowLeft, Mail, Lock } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { language } = useLanguage();
  const { enableMockUser } = useAuth();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<'mobile' | 'otp' | 'new-password'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('new-password');
    }, 1500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError(language === 'mr' ? 'पासवर्ड जुळत नाही' : 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate password reset and enable mock user
    setTimeout(() => {
      setIsLoading(false);
      enableMockUser();
      setLocation('/');
    }, 1500);
  };

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
                src="/src/assets/bjp-symbol.png" 
                alt="BJP Symbol" 
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide">
              {language === 'mr' ? 'पासवर्ड रीसेट' : 'Password Reset'}
            </h1>
          </div>

          {/* Compact Card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800 mb-1">
                    {step === 'mobile' && (language === 'mr' ? 'मोबाईल नंबर टाका' : 'Enter Mobile Number')}
                    {step === 'otp' && (language === 'mr' ? 'OTP टाका' : 'Enter OTP')}
                    {step === 'new-password' && (language === 'mr' ? 'नवीन पासवर्ड' : 'New Password')}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 font-medium">
                    {step === 'mobile' && (language === 'mr' ? 'आपल्या मोबाईल नंबरवर OTP पाठवला जाईल' : 'OTP will be sent to your mobile number')}
                    {step === 'otp' && (language === 'mr' ? 'आपल्या मोबाईलवर आलेला OTP टाका' : 'Enter the OTP sent to your mobile')}
                    {step === 'new-password' && (language === 'mr' ? 'आपला नवीन पासवर्ड सेट करा' : 'Set your new password')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {/* Step 1: Mobile Number */}
              {step === 'mobile' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
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

                  {error && (
                    <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-2 text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold text-xs">
                          {language === 'mr' ? 'OTP पाठवत आहे...' : 'Sending OTP...'}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm">
                        {language === 'mr' ? 'OTP पाठवा' : 'Send OTP'}
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {language === 'mr' ? 'OTP कोड' : 'OTP Code'}
                    </label>
                    <Input
                      type="text"
                      placeholder={language === 'mr' ? '6 अंकी OTP टाका' : 'Enter 6-digit OTP'}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="py-2 text-sm font-medium rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-center tracking-widest"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-2 text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold text-xs">
                          {language === 'mr' ? 'सत्यापन करत आहे...' : 'Verifying...'}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm">
                        {language === 'mr' ? 'सत्यापन करा' : 'Verify OTP'}
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'new-password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {language === 'mr' ? 'नवीन पासवर्ड' : 'New Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'mr' ? 'नवीन पासवर्ड टाका' : 'Enter new password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="py-2 text-sm font-medium rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {language === 'mr' ? 'पासवर्ड पुन्हा टाका' : 'Confirm Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'mr' ? 'पासवर्ड पुन्हा टाका' : 'Confirm password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-2 text-sm font-medium rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-200 font-medium">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-2 text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold text-xs">
                          {language === 'mr' ? 'पासवर्ड बदलत आहे...' : 'Resetting password...'}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-sm">
                        {language === 'mr' ? 'पासवर्ड बदला' : 'Reset Password'}
                      </span>
                    )}
                  </Button>
                </form>
              )}

              {/* Compact Back to Login */}
              <div className="text-center">
                <Link href="/login" className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline decoration-2 underline-offset-4 transition-colors duration-300 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-3 h-3" />
                  {language === 'mr' ? 'लॉगिन पेजवर परत जा' : 'Back to Login'}
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

export default ForgotPassword; 