import { motion } from 'framer-motion';
import { useState } from 'react';
import "./featured.css";
import useFetch from "../../hooks/useFetch";

const Featured = () => {
  const { data, error, loading } = useFetch(
    "/hotels/countByCity?cities=Lucknow,Delhi,Jaipur,Bangalore"
  );
  const [hoveredItems, setHoveredItems] = useState(new Set());

  console.log("API Response:", data);

  const handleMouseEnter = (cityName) => {
    setHoveredItems(prev => new Set([...prev, cityName]));
  };

  const handleAnimationEnd = (cityName) => {
    // Remove the item from hovered set after animation completes
    setTimeout(() => {
      setHoveredItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cityName);
        return newSet;
      });
    }, 2000); // Keep the effect for 2 seconds after hover ends
  };

  if (loading) {
    return (
      <div className="featured">
        {[1, 2, 3, 4].map((i) => (
          <motion.div 
            key={i}
            className="featuredItem loading"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="loadingSkeleton"></div>
            <div className="featuredTitles">
              <div className="skeletonTitle"></div>
              <div className="skeletonSubtitle"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="featured error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="errorMessage">
          <h3>Unable to load destinations</h3>
          <p>Please try again later</p>
        </div>
      </motion.div>
    );
  }

  const cities = [
    {
      name: "Lucknow",
      image: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
    },
    {
      name: "Delhi", 
      image: "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o="
    },
    {
      name: "Jaipur",
      image: "https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
    },
    {
      name: "Bangalore",
      image: "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o="
    }
  ];

  return (
    <motion.div 
      className="featured"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {cities.map((city, index) => (
        <motion.div 
          className={`featuredItem ${hoveredItems.has(city.name) ? 'post-hover-animate' : ''}`} 
          key={city.name}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.15,
            ease: "easeOut"
          }}
          whileHover={{ 
            y: -8, 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => handleMouseEnter(city.name)}
          onAnimationEnd={() => handleAnimationEnd(city.name)}
        >
          <div className="imageContainer">
            <motion.img
              src={city.image}
              alt={city.name}
              className="featuredImg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <div className="imageOverlay"></div>
          </div>
          <motion.div 
            className="featuredTitles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
          >
            <h1>{city.name}</h1>
            <h2>{data[index] || 0} properties</h2>
          </motion.div>
          <div className="borderGlow"></div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Featured;