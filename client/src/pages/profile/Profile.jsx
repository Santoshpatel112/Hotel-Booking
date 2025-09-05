import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faEdit, 
  faSave, 
  faTimes,
  faHeart,
  faHistory,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './profile.css';

const Profile = () => {
  const { user, updateUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
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
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    try {
      await updateUser(formData);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: faUser },
    { id: 'bookings', label: 'My Bookings', icon: faHistory },
    { id: 'favorites', label: 'Favorites', icon: faHeart },
    { id: 'security', label: 'Security', icon: faKey }
  ];

  return (
    <div className="profilePage">
      <Navbar />
      
      <div className="profileContainer">
        <motion.div 
          className="profileHeader"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profileHeaderContent">
            <div className="profileAvatar">
              <div className="avatarCircle">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="avatarEditBtn">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
            <div className="profileHeaderInfo">
              <h1>{user?.username || 'User'}</h1>
              <p>{user?.email}</p>
              <div className="profileStats">
                <div className="stat">
                  <span className="statNumber">0</span>
                  <span className="statLabel">Bookings</span>
                </div>
                <div className="stat">
                  <span className="statNumber">0</span>
                  <span className="statLabel">Reviews</span>
                </div>
                <div className="stat">
                  <span className="statNumber">0</span>
                  <span className="statLabel">Favorites</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="profileContent">
          <motion.div 
            className="profileTabs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`profileTab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          <motion.div 
            className="profileTabContent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {activeTab === 'profile' && (
              <div className="profileInfoCard">
                <div className="cardHeader">
                  <h2>Profile Information</h2>
                  {!isEditing ? (
                    <button 
                      className="editBtn"
                      onClick={() => setIsEditing(true)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="editActions">
                      <button 
                        className="saveBtn"
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faSave} />
                        Save
                      </button>
                      <button 
                        className="cancelBtn"
                        onClick={handleCancelEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="profileForm">
                  <div className="formRow">
                    <div className="formGroup">
                      <label>Username</label>
                      <div className="inputWrapper">
                        <FontAwesomeIcon icon={faUser} className="inputIcon" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={errors.username ? 'error' : ''}
                        />
                      </div>
                      {errors.username && <span className="fieldError">{errors.username}</span>}
                    </div>

                    <div className="formGroup">
                      <label>Email</label>
                      <div className="inputWrapper">
                        <FontAwesomeIcon icon={faEnvelope} className="inputIcon" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={errors.email ? 'error' : ''}
                        />
                      </div>
                      {errors.email && <span className="fieldError">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="formRow">
                    <div className="formGroup">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="formGroup">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <div className="formGroup">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="profileInfoCard">
                <div className="cardHeader">
                  <h2>My Bookings</h2>
                </div>
                <div className="emptyState">
                  <FontAwesomeIcon icon={faHistory} className="emptyIcon" />
                  <h3>No Bookings Yet</h3>
                  <p>When you book accommodations, they'll appear here</p>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="profileInfoCard">
                <div className="cardHeader">
                  <h2>Favorite Properties</h2>
                </div>
                <div className="emptyState">
                  <FontAwesomeIcon icon={faHeart} className="emptyIcon" />
                  <h3>No Favorites Yet</h3>
                  <p>Save properties you love to find them easily later</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profileInfoCard">
                <div className="cardHeader">
                  <h2>Security Settings</h2>
                </div>
                <div className="securitySettings">
                  <div className="securityItem">
                    <div className="securityInfo">
                      <h4>Password</h4>
                      <p>Change your password to keep your account secure</p>
                    </div>
                    <button className="securityBtn">
                      Change Password
                    </button>
                  </div>
                  <div className="securityItem">
                    <div className="securityInfo">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="securityBtn">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="securityItem">
                    <div className="securityInfo">
                      <h4>Login Activity</h4>
                      <p>View recent login activity on your account</p>
                    </div>
                    <button className="securityBtn">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
