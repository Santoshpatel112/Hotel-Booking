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
        // Redirect admin to /admin, others to previous page
        if (result.user?.isAdmin) {
  navigate('/admin', { replace: true });
} else {
  navigate(from, { replace: true });
}
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
                {/* SVG logo */}
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