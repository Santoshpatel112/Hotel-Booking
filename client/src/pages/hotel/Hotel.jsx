import "./hotel.css";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import BookingModal from "../../components/booking/BookingModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../../hooks/useFetch";

const Hotel = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { id } = useParams();
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  
  const { data: hotel, loading, error } = useFetch(`/hotels/get/${id}`);
  
  // Default photos as fallback
  const defaultPhotos = [
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707778.jpg?k=56ba0babbcbbfeb3d3e911728831dcbc390ed2cb16c51d88159f82bf751d04c6&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261707367.jpg?k=cbacfdeb8404af56a1a94812575d96f6b80f6740fd491d02c6fc3912a16d8757&o=&hp=1",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/261708745.jpg?k=1aae4678d645c63e0d90cdae8127b15f1e3232d4739bdf387a6578dc3b14bdfd&o=&hp=1",
    },
  ];
  
  // Use hotel photos if available, otherwise use default photos
  const photos = hotel?.hotel?.photos?.length ? 
    hotel.hotel.photos.map(photo => ({ src: photo })) : defaultPhotos;

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    const maxSlides = photos.length - 1;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? maxSlides : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === maxSlides ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };
  
  useEffect(() => {
    if (open) {
      document.body.classList.add('slider-open');
    } else {
      document.body.classList.remove('slider-open');
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('slider-open');
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handleMove('l');
      } else if (e.key === 'ArrowRight') {
        handleMove('r');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, slideNumber, photos.length]);

  if (loading) return <div>Loading hotel details...</div>;
  if (error) return <div>Error loading hotel details</div>;
  if (!hotel?.hotel) return <div>Hotel not found</div>;
  
  const hotelData = hotel.hotel;

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <AnimatePresence>
            <motion.div 
              className="slider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => {
                // Close when clicking on the dark background
                if (e.target === e.currentTarget) {
                  setOpen(false);
                }
              }}
            >
              <div className="sliderWrapper">
                {/* Modern Close Button */}
                <motion.button
                  className="modernClose"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  aria-label="Close gallery"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </motion.button>

                {/* Left Arrow - Outside Image */}
                <motion.button
                  className="modernArrow modernArrowLeft"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove("l");
                  }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  aria-label="Previous image"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </motion.button>

                {/* Image Container with Fade Transition */}
                <motion.div 
                  className="imageContainer"
                  key={slideNumber}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <img 
                    src={photos[slideNumber].src} 
                    alt={`${hotelData.name} - ${slideNumber + 1} of ${photos.length}`} 
                    className="sliderImg" 
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>

                {/* Right Arrow - Outside Image */}
                <motion.button
                  className="modernArrow modernArrowRight"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMove("r");
                  }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  aria-label="Next image"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </motion.button>

                {/* Image Counter */}
                <motion.div 
                  className="imageCounter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slideNumber + 1} / {photos.length}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        <div className="hotelWrapper">
          <div className="hotelHeader">
            <div className="hotelHeaderLeft">
              <h1 className="hotelTitle">{hotelData.name}</h1>
              <div className="hotelAddress">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{hotelData.address || `${hotelData.city}, ${hotelData.country || 'India'}`}</span>
              </div>
              <span className="hotelDistance">
                {hotelData.distance || 'Convenient location'} – {hotelData.distance || '500m'} from center
              </span>
              <span className="hotelPriceHighlight">
                Book a stay over ₹{hotelData.cheapestPrice || hotelData.cheapestprice} at this property {hotelData.freeAirportTaxi && 'and get a free airport taxi'}
              </span>
            </div>
            <button 
              className="bookNow"
              onClick={() => setShowBookingModal(true)}
            >
              Reserve or Book Now!
            </button>
          </div>
          
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div 
                className="hotelImgWrapper" 
                key={i}
                onClick={() => handleOpen(i)}
              >
                <img
                  src={photo.src}
                  alt={`${hotelData.name} - ${i + 1}`}
                  className="hotelImg"
                  loading="lazy"
                />
                <div className="imageOverlay">
                  <span>View Gallery</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1>Stay in the heart of {hotelData.city}</h1>
              <p className="hotelDesc">
                {hotelData.desc || hotelData.description || 
                `Experience comfortable accommodation at ${hotelData.name} in ${hotelData.city}. 
                This ${hotelData.type} offers modern amenities and convenient location. 
                Perfect for both business and leisure travelers looking for quality accommodation.`}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for your stay!</h1>
              <span>
                {hotelData.title || `Located in ${hotelData.city}, this property offers great value!`}
              </span>
              <h2>
                <span className="currency">₹</span>
                <b>{hotelData.cheapestPrice || hotelData.cheapestprice}</b>
                <span className="currency">per night</span>
              </h2>
              {hotelData.rating && (
                <div className="hotelRating">
                  <span>★ {hotelData.rating}/5 Rating</span>
                </div>
              )}
              <button onClick={() => setShowBookingModal(true)}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      
      <BookingModal
        hotel={{
          ...hotelData,
          prices: hotelData.cheapestPrice || hotelData.cheapestprice
        }}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={(bookingDetails) => {
          fetch("/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingDetails),
          })
          .then(response => response.json())
          .then(data => {
            console.log("Booking successful:", data);
            setShowBookingModal(false);
          })
          .catch(error => {
            console.error("Error booking hotel:", error);
          });
        }}
      />
    </div>
  );
};

export default Hotel;