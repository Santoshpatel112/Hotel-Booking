import "./propertyList.css";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PropertyList = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const propertyImages = {
    hotel: "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    apartment: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    resort: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    villa: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    cabin: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
  };

  const propertyDescriptions = {
    hotel: "Comfortable accommodations with premium amenities and services",
    apartment: "Spacious and fully furnished apartments for extended stays",
    resort: "Luxurious resorts with world-class facilities and breathtaking views",
    villa: "Private villas offering ultimate privacy and luxury",
    cabin: "Cozy cabins perfect for nature lovers and peaceful retreats"
  };

  const propertyIcons = {
    hotel: "🏨",
    apartment: "🏢",
    resort: "🏖️",
    villa: "🏡",
    cabin: "🏕️"
  };

  const { data, error, loading } = useFetch("/hotels/countByType");

  const handlePropertyClick = (type) => {
    navigate(`/properties/${type}`, { state: { propertyType: type } });
  };

  if (loading) {
    return (
      <div className="pList">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div 
            key={i} 
            className="pListItem loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="pListImg skeleton"></div>
            <div className="pListTitles">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-text skeleton-subtitle"></div>
              <div className="skeleton-text skeleton-description"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="pList">
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="error-icon">😔</div>
          <h3>Unable to load property types</h3>
          <p>We're having trouble connecting to our servers. Please check your internet connection and try again.</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pList">
      {data && data.length > 0 ? (
        data.map((property, index) => {
          const image = propertyImages[property.type] || propertyImages.hotel;
          const icon = propertyIcons[property.type] || propertyIcons.hotel;
          const description = propertyDescriptions[property.type] || propertyDescriptions.hotel;
          const capitalizedType = property.type.charAt(0).toUpperCase() + property.type.slice(1);
          
          return (
            <motion.div 
              className={`pListItem ${hoveredItem === property.type ? 'hovered' : ''}`}
              key={property.type}
              onClick={() => handlePropertyClick(property.type)}
              onMouseEnter={() => setHoveredItem(property.type)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="pListImageContainer">
                <img src={image} alt={capitalizedType} className="pListImg" />
                <div className="pListIcon">{icon}</div>
                <div className="pListOverlay">
                  <span>Explore {capitalizedType}s</span>
                  <div className="arrow-icon">→</div>
                </div>
              </div>
              <div className="pListContent">
                <div className="pListTitles">
                  <h1>{capitalizedType}s</h1>
                  <h2>{property.count} {property.count === 1 ? 'property' : 'properties'}</h2>
                </div>
                <p className="pListDescription">{description}</p>
                <div className="pListBadge">
                  <span className="badge-text">View All</span>
                </div>
              </div>
            </motion.div>
          );
        })
      ) : (
        <motion.div 
          className="no-data-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="no-data-icon">🏨</div>
          <h3>No properties available</h3>
          <p>We're working on adding amazing properties for you. Check back soon!</p>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyList;
