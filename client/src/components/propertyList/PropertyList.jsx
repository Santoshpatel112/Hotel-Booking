import "./propertyList.css";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PropertyList = () => {
  const navigate = useNavigate();
  
  // Property type images mapping
  const propertyImages = {
    hotel: "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    apartment: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    resort: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    villa: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    cabin: "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg"
  };

  const { data, error, loading } = useFetch("/hotels/countByType");

  const handlePropertyClick = (type) => {
    navigate("/hotels", { 
      state: { 
        destination: "", 
        propertyType: type,
        date: [{
          startDate: new Date(),
          endDate: new Date(),
          key: "selection"
        }],
        options: { adult: 1, children: 0, room: 1 } 
      } 
    });
  };

  if (loading) {
    return (
      <div className="pList">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pListItem loading">
            <div className="pListImg skeleton"></div>
            <div className="pListTitles">
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
      <div className="pList">
        <div className="error-message">
          <h3>Unable to load property types</h3>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pList">
      {data && data.map((property, index) => {
        const image = propertyImages[property.type] || propertyImages.hotel;
        const capitalizedType = property.type.charAt(0).toUpperCase() + property.type.slice(1);
        
        return (
          <motion.div 
            className="pListItem" 
            key={property.type}
            onClick={() => handlePropertyClick(property.type)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <img src={image} alt={capitalizedType} className="pListImg" />
            <div className="pListTitles">
              <h1>{capitalizedType}s</h1>
              <h2>{property.count} {property.count === 1 ? 'property' : 'properties'}</h2>
            </div>
            <div className="pListOverlay">
              <span>Browse {capitalizedType}s</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PropertyList;
