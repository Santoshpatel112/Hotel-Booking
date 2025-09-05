import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeaturedProperties = () => {
  const { data, error, loading } = useFetch("/hotels/featured?limit=4");
  const navigate = useNavigate();

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Fair";
  };

  if (loading) {
    return (
      <div className="fp">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="fpItem loading">
            <div className="fpImg skeleton"></div>
            <div className="fpContent">
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="fp">
        <div className="fp-error">
          <h3>Unable to load featured properties</h3>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="fp">
        <div className="fp-empty">
          <h3>No featured properties available</h3>
          <p>Check back later for featured accommodations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fp">
      {data.map((hotel, index) => (
        <motion.div 
          className="fpItem" 
          key={hotel._id}
          onClick={() => handleHotelClick(hotel._id)}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="fpImageContainer">
            <img 
              src={hotel.photos?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"} 
              alt={hotel.name}
              className="fpImg"
              loading="lazy"
            />
            {hotel.featured && (
              <div className="fpFeaturedBadge">
                <span>Featured</span>
              </div>
            )}
          </div>
          
          <div className="fpContent">
            <span className="fpName">{hotel.name}</span>
            <span className="fpCity">{hotel.city}</span>
            <span className="fpType">{hotel.type?.charAt(0).toUpperCase() + hotel.type?.slice(1)}</span>
            
            <div className="fpPriceContainer">
              <span className="fpPrice">₹{hotel.cheapestPrice || hotel.prices}</span>
              <span className="fpPriceUnit">per night</span>
            </div>
            
            {hotel.rating && (
              <div className="fpRating">
                <div className="fpRatingScore">{hotel.rating}</div>
                <span className="fpRatingText">
                  {getRatingText(hotel.rating)}
                </span>
              </div>
            )}
          </div>
          
          <div className="fpHoverOverlay">
            <span>View Details</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
