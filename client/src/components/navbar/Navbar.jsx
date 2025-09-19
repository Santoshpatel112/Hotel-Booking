// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import "./navbar.css"

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);

//   const openAuth = (mode) => {
//     setAuthMode(mode);
//     setShowAuthModal(true);
//     setIsMenuOpen(false);
//   };

//   const closeAuth = () => {
//     setShowAuthModal(false);
//   };

//   const handleLogin = (userData) => {
//     setUser(userData);
//     setIsLoggedIn(true);
//     setShowAuthModal(false);
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setIsLoggedIn(false);
//   };

//   return (
//     <>
//       <motion.div 
//         className="navbar"
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         <div className="navContainer">
//           <motion.div 
//             className="logo"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <div className="logoIcon">
//               <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <defs>
//                   <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#a7f3d0" />
//                     <stop offset="50%" stopColor="#34d399" />
//                     <stop offset="100%" stopColor="#10b981" />
//                   </linearGradient>
//                 </defs>
//                 {/* Main diamond/house shape inspired by your logo */}
//                 <path d="M50 5 L85 25 L70 40 L50 30 L30 40 L15 25 Z" fill="url(#logoGradient)" />
//                 <path d="M15 25 L30 40 L30 70 L50 80 L70 70 L70 40 L85 25 L85 55 L70 70 L50 80 L30 70 L15 55 Z" fill="url(#logoGradient)" opacity="0.8" />
//                 {/* House elements */}
//                 <rect x="20" y="60" width="25" height="25" fill="url(#logoGradient)" rx="2" />
//                 <rect x="55" y="60" width="25" height="25" fill="url(#logoGradient)" rx="2" />
//                 {/* Windows */}
//                 <rect x="25" y="65" width="6" height="6" fill="white" rx="1" />
//                 <rect x="34" y="65" width="6" height="6" fill="white" rx="1" />
//                 <rect x="60" y="65" width="6" height="6" fill="white" rx="1" />
//                 <rect x="69" y="65" width="6" height="6" fill="white" rx="1" />
//                 {/* Doors */}
//                 <rect x="28" y="75" width="8" height="10" fill="white" rx="1" />
//                 <rect x="63" y="75" width="8" height="10" fill="white" rx="1" />
//               </svg>
//             </div>
//             <span className="logoText">EasyStay</span>
//           </motion.div>
          
//           {/* Mobile menu button */}
//           <motion.div 
//             className={`mobileMenuButton ${isMenuOpen ? 'open' : ''}`}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             whileTap={{ scale: 0.9 }}
//           >
//             <span></span>
//             <span></span>
//             <span></span>
//           </motion.div>

//           <motion.div 
//             className={`navItems ${isMenuOpen ? 'navItemsOpen' : ''}`}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             {!isLoggedIn ? (
//               <>
//                 <motion.button 
//                   className="navButton navButtonSecondary"
//                   whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                   onClick={() => openAuth('register')}
//                 >
//                   Register
//                 </motion.button>
//                 <motion.button 
//                   className="navButton navButtonPrimary"
//                   whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                   onClick={() => openAuth('login')}
//                 >
//                   Login
//                 </motion.button>
//               </>
//             ) : (
//               <div className="userMenu">
//                 <motion.div 
//                   className="userProfile"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <div className="userAvatar">
//                     {user?.name?.charAt(0) || 'U'}
//                   </div>
//                   <span className="userName">{user?.name || 'User'}</span>
//                 </motion.div>
//                 <motion.button 
//                   className="navButton navButtonSecondary"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </motion.button>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Auth Modal */}
//       <AnimatePresence>
//         {showAuthModal && (
//           <AuthModal 
//             mode={authMode}
//             onClose={closeAuth}
//             onLogin={handleLogin}
//             onSwitchMode={setAuthMode}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// // Auth Modal Component
// const AuthModal = ({ mode, onClose, onLogin, onSwitchMode }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       onLogin({ name: formData.name || 'User', email: formData.email });
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <motion.div
//       className="authModalOverlay"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//     >
//       <motion.div
//         className="authModal"
//         initial={{ scale: 0.8, opacity: 0, y: 50 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.8, opacity: 0, y: 50 }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="authModalHeader">
//           <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
//           <motion.button
//             className="closeButton"
//             whileHover={{ scale: 1.1, rotate: 90 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={onClose}
//           >
//             ×
//           </motion.button>
//         </div>

//         <form onSubmit={handleSubmit} className="authForm">
//           {mode === 'register' && (
//             <motion.div
//               className="inputGroup"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//             >
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//               />
//             </motion.div>
//           )}

//           <motion.div
//             className="inputGroup"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: mode === 'register' ? 0.2 : 0.1 }}
//           >
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />
//           </motion.div>

//           <motion.div
//             className="inputGroup"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: mode === 'register' ? 0.3 : 0.2 }}
//           >
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleInputChange}
//               required
//             />
//           </motion.div>

//           {mode === 'register' && (
//             <motion.div
//               className="inputGroup"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 required
//               />
//             </motion.div>
//           )}

//           <motion.button
//             type="submit"
//             className="authSubmitButton"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <div className="loadingSpinner"></div>
//             ) : (
//               mode === 'login' ? 'Sign In' : 'Create Account'
//             )}
//           </motion.button>
//         </form>

//         <div className="authFooter">
//           <p>
//             {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
//             <motion.button
//               className="switchModeButton"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
//             >
//               {mode === 'login' ? 'Sign Up' : 'Sign In'}
//             </motion.button>
//           </p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Navbar



import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      // User is authenticated
      console.log('User is authenticated:', user);
    }
  }, [user, isAuthenticated]);



  const closeAuth = () => {
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <motion.div 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="navContainer">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <span className="logoText">EasyStay</span>
          </motion.div>
          
          {/* Mobile menu button */}
          <motion.div 
            className={`mobileMenuButton ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.div>

          <motion.div 
            className={`navItems ${isMenuOpen ? 'navItemsOpen' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {!user ? (
              <>
                <motion.button 
                  className="navButton navButtonSecondary"
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </motion.button>
                <motion.button 
                  className="navButton navButtonPrimary"
                  whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </motion.button>
              </>
            ) : (
              <div className="userMenu">
                {/* Admin Dashboard Button */}
                {user?.isAdmin && (
                  <motion.button 
                    className="navButton adminDashboardBtn"
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(139, 69, 19, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => navigate('/admin')}
                  >
                    🏢 Admin Dashboard
                  </motion.button>
                )}
                <motion.div 
                  className="userProfile"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/profile')}
                >
                  <div className="userAvatar">
                    {user?.username?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="userName">{user?.username || user?.name || 'User'}</span>
                  {user?.isAdmin && <span className="adminBadge">ADMIN</span>}
                </motion.div>
                <motion.button 
                  className="navButton navButtonSecondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            mode={authMode}
            onClose={closeAuth}
            onSuccess={() => closeAuth()}
            onSwitchMode={setAuthMode}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Auth Modal Component
const AuthModal = ({ mode, onClose, onSuccess, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register, login, loading, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      clearError(); // Clear any previous errors
      
      let result;
      if (mode === 'login') {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        alert(mode === 'login' ? 'Login successful!' : 'Registration successful!');
        onSuccess();
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        alert(result.error || 'An error occurred');
      }
    } catch (err) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      className="authModalOverlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="authModal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="authModalHeader">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <motion.button
            className="closeButton"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="authForm">
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={mode === 'register'}
                placeholder="Enter your username"
              />
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </motion.div>
          
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={mode === 'register'}
                placeholder="Confirm your password"
              />
            </motion.div>
          )}
          
          <motion.button
            type="submit"
            className="authSubmitButton"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </motion.button>
        </form>
        
        <div className="authFooter">
          <p>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="authSwitchButton"
              onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Navbar;