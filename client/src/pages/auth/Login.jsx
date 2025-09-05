import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await login(formData);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="authPage">
      <div className="authContainer">
        <motion.div 
          className="authCard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="authHeader">
            <motion.div 
              className="authLogo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="logoIcon">
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a7f3d0" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <path d="M50 5 L85 25 L70 40 L50 30 L30 40 L15 25 Z" fill="url(#logoGradient)" />
                  <path d="M15 25 L30 40 L30 70 L50 80 L70 70 L70 40 L85 25 L85 55 L70 70 L50 80 L30 70 L15 55 Z" fill="url(#logoGradient)" opacity="0.8" />
                  <rect x="20" y="60" width="25" height="25" fill="url(#logoGradient)" rx="2" />
                  <rect x="55" y="60" width="25" height="25" fill="url(#logoGradient)" rx="2" />
                  <rect x="25" y="65" width="6" height="6" fill="white" rx="1" />
                  <rect x="34" y="65" width="6" height="6" fill="white" rx="1" />
                  <rect x="60" y="65" width="6" height="6" fill="white" rx="1" />
                  <rect x="69" y="65" width="6" height="6" fill="white" rx="1" />
                  <rect x="28" y="75" width="8" height="10" fill="white" rx="1" />
                  <rect x="63" y="75" width="8" height="10" fill="white" rx="1" />
                </svg>
              </div>
              <h1>EasyStay</h1>
            </motion.div>
            <motion.div 
              className="authTitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form 
            className="authForm"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {error && (
              <motion.div 
                className="authError"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <div className="inputWrapper">
                <FontAwesomeIcon icon={faEnvelope} className="inputIcon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="fieldError">{errors.email}</span>}
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <div className="inputWrapper">
                <FontAwesomeIcon icon={faLock} className="inputIcon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && <span className="fieldError">{errors.password}</span>}
            </div>

            <div className="formOptions">
              <label className="checkboxWrapper">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgotLink">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              className="authButton"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div 
            className="authFooter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="authLink">
                Sign up
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Background decoration */}
        <div className="authBackground">
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
