import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Lock,
  Phone,
  Smartphone,
  ChevronRight,
  X,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(mode);
  const [forgotStep, setForgotStep] = useState('initial');
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    phone: '',
    profileType: 'Regular',
    otp: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setAuthMode(mode);
    setForgotStep('initial');
    setError('');
    if (isOpen) {
      setFormData({
        name: '',
        password: '',
        phone: '',
        profileType: 'Regular',
        otp: '',
        newPassword: ''
      });
    }
  }, [mode, isOpen]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let authResult;
      if (authMode === 'signup') {
        const phoneDigits = String(formData.phone || '').replace(/\D/g, '');
        const emailLocal = phoneDigits || formData.name.replace(/\s/g, '.');
        authResult = await register({
          name: formData.name,
          email: `${emailLocal}@printhub.local`,
          password: formData.password,
          phone: formData.phone?.trim?.() || formData.phone,
          profileType: formData.profileType
        });
      } else {
        // Login: check if input is email or phone
        const identifier = formData.phone?.trim();
        if (!identifier) throw new Error('Mobile number or Email is required');
        
        const isEmail = identifier.includes('@');
        let loginPayload = {};
        
        if (isEmail) {
          loginPayload = { email: identifier, password: formData.password };
        } else {
          // If phone, treat as digits-only phone logic
          const phoneDigits = identifier.replace(/\D/g, '');
          if (!phoneDigits.length) throw new Error('Please enter a valid mobile number/email');
          // Send both to let backend handle it, or just email if that's the current backend expectation
          loginPayload = { phone: identifier, password: formData.password };
        }
        
        authResult = await login(loginPayload.email || null, formData.password, loginPayload.phone || null);
      }
      
      onClose();
      
      const role = authResult?.user?.role;
      const roleStr = role && String(role).toLowerCase().trim();
      if (roleStr === 'admin') navigate('/admin');
      else if (roleStr === 'employee') navigate('/employee');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotFlow = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (forgotStep === 'initial') {
        if (!formData.phone) throw new Error('Mobile number is required');
        await new Promise(r => setTimeout(r, 1000));
        setForgotStep('otp');
        setTimer(60);
      } else if (forgotStep === 'otp') {
        if (formData.otp.length !== 4) throw new Error('Enter valid 4-digit OTP');
        await new Promise(r => setTimeout(r, 800));
        setForgotStep('reset');
      } else if (forgotStep === 'reset') {
        if (formData.newPassword.length < 6) throw new Error('Password must be at least 6 characters');
        await new Promise(r => setTimeout(r, 1000));
        setForgotStep('success');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-content">
          <div className="auth-header">
            <div className="logo-section">
              <img src="/Printhub_logo.png" alt="Logo" className="auth-logo-img" />
            </div>
            <h2>
              {authMode === 'forgot' ? 'Reset Account' :
                authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p>
              {authMode === 'forgot' ? 'Recover your access quickly' :
                authMode === 'login' ? 'Login to continue your printing journey' : 'Join PrintHub for premium features'}
            </p>
          </div>

          {(error || authError) && (
            <div className="auth-alert error animate-fadeIn">
              <AlertCircle size={18} />
              <span>{error || authError}</span>
            </div>
          )}

          {authMode === 'forgot' ? (
            <form onSubmit={handleForgotFlow} className="auth-form">
              {forgotStep === 'initial' && (
                <div className="input-group-saas">
                  <label>Mobile Number</label>
                  <div className="input-wrapper-saas">
                    <Smartphone size={18} className="input-icon-saas" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter registered mobile"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 'otp' && (
                <div className="input-group-saas animate-fadeIn">
                  <div className="otp-context">OTP sent to {formData.phone}</div>
                  <label>Verification Code</label>
                  <div className="input-wrapper-saas">
                    <ShieldCheck size={18} className="input-icon-saas" />
                    <input
                      type="text"
                      name="otp"
                      placeholder="4-digit OTP"
                      maxLength="4"
                      className="otp-input"
                      value={formData.otp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="resend-timer">
                    {timer > 0 ? `Resend code in ${timer}s` : <button type="button" onClick={() => setTimer(60)}>Resend now</button>}
                  </div>
                </div>
              )}

              {forgotStep === 'reset' && (
                <div className="input-group-saas animate-fadeIn">
                  <label>New Password</label>
                  <div className="input-wrapper-saas">
                    <Lock size={18} className="input-icon-saas" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="Min. 6 characters"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 'success' ? (
                <div className="success-view animate-scaleIn">
                  <div className="check-circle-saas">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Success!</h3>
                  <p>Your password has been reset successfully.</p>
                  <button type="button" className="btn-primary-saas w-full" onClick={() => setAuthMode('login')}>
                    Go to Login
                  </button>
                </div>
              ) : (
                <div className="form-actions-saas">
                  <button type="submit" className="btn-primary-saas w-full" disabled={isLoading}>
                    {isLoading ? <span className="loader-saas"></span> :
                      forgotStep === 'initial' ? 'Send OTP' :
                        forgotStep === 'otp' ? 'Verify' : 'Update Password'}
                  </button>
                  <button type="button" className="btn-ghost-saas w-full mt-2" onClick={() => setAuthMode('login')}>
                    <ArrowLeft size={16} /> Back to login
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {authMode === 'login' ? (
                <div className="input-group-saas">
                  <label>Mobile / Email</label>
                  <div className="input-wrapper-saas">
                    <User size={18} className="input-icon-saas" />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Mobile number or Email"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="input-group-saas">
                  <label>Full Name</label>
                  <div className="input-wrapper-saas">
                    <User size={18} className="input-icon-saas" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              )}

              {authMode === 'signup' && (
                <>
                  <div className="input-group-saas">
                    <label>Profile Type</label>
                    <div className="input-wrapper-saas">
                      <Users size={18} className="input-icon-saas" />
                      <select
                        name="profileType"
                        value={formData.profileType}
                        onChange={handleInputChange}
                        className="select-saas"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Student">Student</option>
                        <option value="Institute">Institute</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group-saas">
                    <label>Mobile Number</label>
                    <div className="input-wrapper-saas">
                      <Phone size={18} className="input-icon-saas" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="input-group-saas">
                <div className="label-with-action">
                  <label>Password</label>
                  {authMode === 'login' && (
                    <button type="button" className="forgot-trigger" onClick={() => setAuthMode('forgot')}>
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="input-wrapper-saas">
                  <Lock size={18} className="input-icon-saas" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>



              <button type="submit" className="btn-primary-saas w-full" disabled={isLoading}>
                {isLoading ? <span className="loader-saas"></span> :
                  authMode === 'login' ? 'Sign In' : 'Get Started'}
              </button>

              <div className="auth-footer-saas">
                <p>
                  {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                    {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
