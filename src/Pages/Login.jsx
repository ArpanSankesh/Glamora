// src/pages/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('options'); // 'options', 'phone', 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);
  
  const { currentUser, loginWithGoogle, loginWithPhone, verifyOtp } = useAuth();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const recaptchaRef = useRef(null);
  const otpRefs = useRef([]);

  // Country codes for the dropdown
  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    
  ];

  // Redirect if user already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Clean up reCAPTCHA on unmount or method change
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // Initialize reCAPTCHA when phone method is selected
  useEffect(() => {
    if (loginMethod === 'phone') {
      initializeRecaptcha();
    } else {
      cleanupRecaptcha();
    }
  }, [loginMethod]);

  // Resend timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Clean up reCAPTCHA function
  const cleanupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        console.log('Cleaning up reCAPTCHA verifier');
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setRecaptchaInitialized(false);
    } catch (error) {
      console.warn('Error cleaning up reCAPTCHA:', error);
    }
  };

  // Initialize reCAPTCHA function
  const initializeRecaptcha = async () => {
    try {
      // Clean up any existing verifier first
      cleanupRecaptcha();

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if the container exists
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.error('reCAPTCHA container not found');
        toast.error('reCAPTCHA container not ready. Please try again.');
        return;
      }

      // Clear any existing content in the container
      container.innerHTML = '';

      console.log('Initializing reCAPTCHA verifier...');
      
      // Create new reCAPTCHA verifier with better error handling
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: (response) => {
          console.log('reCAPTCHA solved successfully:', !!response);
          setRecaptchaInitialized(true);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          setRecaptchaInitialized(false);
          toast.error('reCAPTCHA expired. Please solve it again.');
        },
        'error-callback': (error) => {
          console.error('reCAPTCHA error:', error);
          setRecaptchaInitialized(false);
          toast.error('reCAPTCHA error. Please refresh and try again.');
        }
      });

      // Render the reCAPTCHA
      try {
        await window.recaptchaVerifier.render();
        console.log('reCAPTCHA rendered successfully');
      } catch (renderError) {
        console.error('Error rendering reCAPTCHA:', renderError);
        throw new Error('Failed to render reCAPTCHA. Please refresh the page and try again.');
      }

    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      setRecaptchaInitialized(false);
      toast.error('Failed to initialize verification. Please refresh the page and try again.');
      cleanupRecaptcha();
    }
  };

  // Google login handler
  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome back! Login successful.');
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelled. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups for this site and try again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setPhoneNumber(value);
  };

  // Send OTP handler with improved error handling
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!window.recaptchaVerifier) {
      toast.error('Please wait for reCAPTCHA to load, then solve it');
      return;
    }

    // Check if reCAPTCHA is solved (this is a bit tricky, we'll rely on the callback)
    // If not initialized, prompt user to solve it
    if (!recaptchaInitialized) {
      toast.error('Please solve the reCAPTCHA first');
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      console.log('Sending OTP to:', fullPhoneNumber);
      
      const result = await loginWithPhone(fullPhoneNumber);
      setConfirmationResult(result);
      setLoginMethod('otp');
      setResendTimer(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      let errorMessage = 'Failed to send OTP. ';
      
      switch (error.code) {
        case 'auth/invalid-recaptcha-token':
          errorMessage = 'reCAPTCHA verification failed. Please refresh the page and try again.';
          // Force reinitialize reCAPTCHA
          setTimeout(() => {
            initializeRecaptcha();
          }, 1000);
          break;
        case 'auth/recaptcha-not-enabled':
          errorMessage = 'Phone verification is not properly configured. Please contact support.';
          break;
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format. Please check and try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please wait a few minutes before trying again.';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later.';
          break;
        default:
          errorMessage += error.message || 'Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle pasted content
      const pastedCode = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedCode.length && i < 6; i++) {
        newOtp[i] = pastedCode[i];
      }
      setOtp(newOtp);
      
      // Focus on the last filled input or next empty one
      const nextIndex = Math.min(pastedCode.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        otpRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(confirmationResult, otpCode);
      toast.success('Phone verification successful! Welcome!');
      navigate('/');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid verification code. Please try again.');
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setOtp(['', '', '', '', '', '']);
    
    try {
      // Reinitialize reCAPTCHA for resend
      await initializeRecaptcha();
      
      // Wait a bit for reCAPTCHA to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await loginWithPhone(fullPhoneNumber);
      setConfirmationResult(result);
      setResendTimer(60);
      toast.success('New OTP sent successfully!');
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleBackToOptions = () => {
    setLoginMethod('options');
    setPhoneNumber('');
    setOtp(['', '', '', '', '', '']);
    setConfirmationResult(null);
    setResendTimer(0);
    cleanupRecaptcha();
  };

  const handleBackToPhone = () => {
    setLoginMethod('phone');
    setOtp(['', '', '', '', '', '']);
    setConfirmationResult(null);
    setResendTimer(0);
  };

  // Render OTP verification screen
  if (loginMethod === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] via-white to-[var(--color-accent)] px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
              <p className="text-gray-500">
                We sent a 6-digit code to<br />
                <span className="font-medium text-gray-900">{countryCode} {phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input Form */}
            <div className="px-8 pb-8">
              <div className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Verification Code
                  </label>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.some(digit => !digit)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Verify Code</span>
                    </>
                  )}
                </button>

                {/* Resend & Back buttons */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? (
                      `Resend code in ${resendTimer}s`
                    ) : (
                      'Resend verification code'
                    )}
                  </button>
                  
                  <button
                    onClick={handleBackToPhone}
                    className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
                  >
                    ← Change phone number
                  </button>
                </div>
              </div>
            </div>

            {/* reCAPTCHA container for resend */}
            <div id="recaptcha-container" className="flex justify-center pb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render phone input screen
  if (loginMethod === 'phone') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Login</h1>
              <p className="text-gray-500">Enter your phone number to receive a verification code</p>
            </div>

            {/* Phone Input Form */}
            <div className="px-8 pb-8">
              <div className="space-y-6">
                {/* Country Code & Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="flex-shrink-0 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="1234567890"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength="15"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your phone number without the country code
                  </p>
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <div id="recaptcha-container"></div>
                </div>
                
                {/* reCAPTCHA status indicator */}
                {loginMethod === 'phone' && !recaptchaInitialized && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Please solve the reCAPTCHA above to continue
                    </p>
                  </div>
                )}

                {/* Send OTP Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !phoneNumber || phoneNumber.length < 10 || !recaptchaInitialized}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>

                {/* Back to other login options */}
                <button
                  onClick={handleBackToOptions}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-200"
                >
                  ← Back to other login options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main login options screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md mx-4">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Login Section */}
          <div className="px-8 pb-12">
            <div className="space-y-4">
              {/* Google Login Button */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl py-4 px-6 flex items-center justify-center space-x-3 transition-all duration-200 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Signing in...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              {/* Divider */}
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div> */}

              {/* Phone Login Button */}
              {/* <button
                onClick={() => setLoginMethod('phone')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-xl py-4 px-6 flex items-center justify-center space-x-3 transition-all duration-200 hover:shadow-lg group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-medium group-hover:text-white">
                  Continue with Phone
                </span>
              </button> */}
            </div>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Secure authentication
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quick and easy access
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Multiple login options
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;