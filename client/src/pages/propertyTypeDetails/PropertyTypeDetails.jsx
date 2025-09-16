import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./propertyTypeDetails.css";

const PropertyTypeDetails = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');

    const propertyTypeInfo = {
        hotel: {
            title: "Hotels",
            description: "Discover comfortable accommodations with premium amenities and exceptional service",
            icon: "🏨",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        apartment: {
            title: "Apartments",
            description: "Spacious and fully furnished apartments perfect for extended stays and family vacations",
            icon: "🏢",
            bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        },
        resort: {
            title: "Resorts",
            description: "Luxurious resorts with world-class facilities, stunning views, and unforgettable experiences",
            icon: "🏖️",
            bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
        },
        villa: {
            title: "Villas",
            description: "Private villas offering ultimate luxury, privacy, and personalized service",
            icon: "🏡",
            bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
        },
        cabin: {
            title: "Cabins",
            description: "Cozy cabins nestled in nature, perfect for peaceful retreats and outdoor adventures",
            icon: "🏕️",
            bgGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        }
    };

    const currentTypeInfo = propertyTypeInfo[type] || propertyTypeInfo.hotel;

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("/api/hotels/properties/" + type);
                if (!response.ok) {
                    throw new Error(`Failed to fetch properties: ${response.statusText}`);
                }
                const data = await response.json();
                setProperties(data);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [type]);

    const handleHotelClick = (hotelId) => {
        navigate(`/hotels/${hotelId}`);
    };

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        let sortedProperties = [...properties];
        switch(newSortBy) {
            case 'price_low':
                sortedProperties.sort((a, b) => a.prices - b.prices);
                break;
            case 'price_high':
                sortedProperties.sort((a, b) => b.prices - a.prices);
                break;
            case 'rating':
                sortedProperties.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
            default:
                sortedProperties.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        setProperties(sortedProperties);
    };

    const filteredProperties = properties.filter(property => {
        if (filterBy === 'all') return true;
        if (filterBy === 'featured') return property.featured;
        if (filterBy === 'budget') return property.prices < 3000;
        if (filterBy === 'luxury') return property.prices > 10000;
        return true;
    });

    if (loading) {
        return (
            <div className="propertyTypeDetailsContainer">
                <Navbar />
                <motion.div 
                    className="loading-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="loading-content">
                        <div className="loading-spinner"></div>
                        <h2>Loading {currentTypeInfo.title}...</h2>
                        <p>Discovering amazing properties for you</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="propertyTypeDetailsContainer">
                <Navbar />
                <motion.div 
                    className="error-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="error-content">
                        <div className="error-icon">😔</div>
                        <h2>Oops! Something went wrong</h2>
                        <p>We couldn't load the {currentTypeInfo.title.toLowerCase()}. Please check your connection and try again.</p>
                        <div className="error-details">
                            <small>Error: {error}</small>
                        </div>
                        <div className="error-actions">
                            <button 
                                className="retry-button"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                            <button 
                                className="back-button"
                                onClick={() => navigate('/')}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    if (!loading && !error && filteredProperties.length === 0) {
        return (
            <div className="propertyTypeDetailsContainer">
                <Navbar />
                <motion.div 
                    className="no-results-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="no-results-content">
                        <div className="no-results-icon">{currentTypeInfo.icon}</div>
                        <h2>No {currentTypeInfo.title} Found</h2>
                        <p>We don't have any {currentTypeInfo.title.toLowerCase()} available at the moment.</p>
                        <p>But don't worry! We're constantly adding new properties.</p>
                        <div className="suggestions">
                            <h4>Meanwhile, you can:</h4>
                            <ul>
                                <li>Check out other property types</li>
                                <li>Browse our featured properties</li>
                                <li>Sign up for notifications when new {currentTypeInfo.title.toLowerCase()} are added</li>
                            </ul>
                        </div>
                        <button 
                            className="explore-button"
                            onClick={() => navigate('/')}
                        >
                            Explore Other Properties
                        </button>
                    </div>
                </motion.div>
                <Footer />
            </div>
        );
    }
    return (
        <div className="propertyTypeDetailsContainer">
            <Navbar />
            
            {/* Hero Section */}
            <motion.div 
                className="property-hero"
                style={{ background: currentTypeInfo.bgGradient }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="hero-content">
                    <motion.div 
                        className="hero-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {currentTypeInfo.icon}
                    </motion.div>
                    <motion.h1 
                        className="hero-title"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Explore {currentTypeInfo.title}
                    </motion.h1>
                    <motion.p 
                        className="hero-description"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {currentTypeInfo.description}
                    </motion.p>
                    <motion.div 
                        className="hero-stats"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <span className="stats-count">{filteredProperties.length}</span>
                        <span className="stats-text">{filteredProperties.length === 1 ? 'Property' : 'Properties'} Available</span>
                    </motion.div>
                </div>
                <div className="hero-overlay"></div>
            </motion.div>

            {/* Controls Section */}
            <motion.div 
                className="controls-section"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <div className="controls-container">
                    <div className="view-controls">
                        <button 
                            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            🔴 Grid
                        </button>
                        <button 
                            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            📋 List
                        </button>
                    </div>
                    
                    <div className="filter-controls">
                        <select 
                            className="filter-select"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="all">All Properties</option>
                            <option value="featured">Featured Only</option>
                            <option value="budget">Budget Friendly</option>
                            <option value="luxury">Luxury Properties</option>
                        </select>
                        
                        <select 
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Properties Grid/List */}
            <motion.div 
                className="properties-section"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <div className={`properties-container ${viewMode}`}>
                    {filteredProperties.map((property, index) => (
                        <motion.div 
                            key={property._id} 
                            className={`property-card ${viewMode}`}
                            onClick={() => handleHotelClick(property._id)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="property-image-container">
                                <img 
                                    src={property.photos?.[0] || property.image || '/api/placeholder/400/250'} 
                                    alt={property.name} 
                                    className="property-image"
                                    onError={(e) => {
                                        e.target.src = '/api/placeholder/400/250';
                                    }}
                                />
                                {property.featured && (
                                    <div className="featured-badge">
                                        ⭐ Featured
                                    </div>
                                )}
                                <div className="property-overlay">
                                    <span>View Details</span>
                                </div>
                            </div>
                            
                            <div className="property-content">
                                <div className="property-header">
                                    <h3 className="property-name">{property.name}</h3>
                                    {property.rating && (
                                        <div className="property-rating">
                                            <span className="rating-stars">
                                                {'⭐'.repeat(Math.floor(property.rating))}
                                            </span>
                                            <span className="rating-number">{property.rating}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="property-location">
                                    📍 {property.city}, {property.address}
                                </p>
                                
                                <p className="property-description">
                                    {property.description?.substring(0, 120)}
                                    {property.description?.length > 120 && '...'}
                                </p>
                                
                                <div className="property-amenities">
                                    {property.distance && (
                                        <span className="amenity">
                                            🚶 {property.distance} from center
                                        </span>
                                    )}
                                    {property.rooms && property.rooms.length > 0 && (
                                        <span className="amenity">
                                            🛏️ {property.rooms.length} room types
                                        </span>
                                    )}
                                </div>
                                
                                <div className="property-footer">
                                    <div className="property-price">
                                        <span className="price-label">Starting from</span>
                                        <span className="price-amount">₹{property.prices?.toLocaleString()}</span>
                                        <span className="price-period">/night</span>
                                    </div>
                                    <button className="book-button">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            
            <Footer />
        </div>
    );
};

export default PropertyTypeDetails;