import React, { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    // Implement OTP sending logic here
    setIsOtpSent(true);
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here
    onClose();
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic here
    setIsForgotPassword(true);
    setIsOtpSent(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isForgotPassword ? 'Reset Password' : isOtpSent ? 'Enter OTP' : 'Sign Up'}
          </h2>
          
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isOtpSent ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One Time Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  OTP has been sent to {phoneNumber}
                </p>
              </div>
            )}
            
            <button
              type="submit"
              onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isOtpSent ? 'Verify OTP' : isForgotPassword ? 'Reset Password' : 'Send OTP'}
            </button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            {isOtpSent && (
              <button
                onClick={() => setIsOtpSent(false)}
                className="text-purple-600 hover:text-purple-700 text-sm block w-full"
              >
                Change Phone Number
              </button>
            )}
            {!isOtpSent && !isForgotPassword && (
              <button
                onClick={handleForgotPassword}
                className="text-purple-600 hover:text-purple-700 text-sm block w-full"
              >
                Forgot Password?
              </button>
            )}
            {isForgotPassword && (
              <button
                onClick={() => setIsForgotPassword(false)}
                className="text-purple-600 hover:text-purple-700 text-sm block w-full"
              >
                Back to Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;