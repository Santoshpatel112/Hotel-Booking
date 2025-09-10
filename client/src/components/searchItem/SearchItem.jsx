import "./searchItem.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import BookingModal from "../booking/BookingModal";
import { FaStar, FaMapMarkerAlt, FaTaxi, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaSnowflake } from "react-icons/fa";

const SearchItem = ({ item }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  if (!item) {
    return (
      <div className="searchItem">
        <div className="siDesc">
          <h1 className="siTitle">No property data available</h1>
        </div>
      </div>
    );
  }

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    return "Fair";
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      hotel: { text: 'Hotel', class: 'hotel' },
      apartment: { text: 'Apartment', class: 'apartment' },
      resort: { text: 'Resort', class: 'resort' },
      villa: { text: 'Villa', class: 'villa' },
      cabin: { text: 'Cabin', class: 'cabin' }
    };
    return typeMap[type?.toLowerCase()] || { text: type || 'Property', class: 'default' };
  };

  const typeInfo = getTypeBadge(item.type);

  return (
    <div className="searchItem">
      <div className="siImgContainer">
        <img
          src={item.photos?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}
          alt={item.name}
          className="siImg"
        />
        <div className={`siTypeBadge ${typeInfo.class}`}>
          {typeInfo.text}
        </div>
      </div>
      
      <div className="siDesc">
        <div className="siHeader">
          <h1 className="siTitle">{item.name}</h1>
          <div className="siRating">
            <span className="siRatingText">{getRatingText(item.rating)}</span>
            <button className="siRatingButton">
              <FaStar className="starIcon" /> {item.rating || 'N/A'}
            </button>
          </div>
        </div>
        
        <div className="siLocation">
          <FaMapMarkerAlt className="locationIcon" />
          <span>{item.city || 'Location not specified'}</span>
          {item.distance && <span className="siDistance">• {item.distance}m from center</span>}
        </div>
        
        <p className="siDescription">
          {item.desc || 'Experience comfort and convenience at this beautiful property.'}
        </p>
        
        <div className="siFeatures">
          {item.freeAirportTaxi && (
            <div className="siFeature">
              <FaTaxi className="featureIcon" />
              <span>Free airport taxi</span>
            </div>
          )}
          {item.freeWifi && (
            <div className="siFeature">
              <FaWifi className="featureIcon" />
              <span>Free WiFi</span>
            </div>
          )}
          {item.parking && (
            <div className="siFeature">
              <FaParking className="featureIcon" />
              <span>Free parking</span>
            </div>
          )}
          {item.pool && (
            <div className="siFeature">
              <FaSwimmingPool className="featureIcon" />
              <span>Swimming pool</span>
            </div>
          )}
          {item.restaurant && (
            <div className="siFeature">
              <FaUtensils className="featureIcon" />
              <span>Restaurant</span>
            </div>
          )}
          {item.airConditioning && (
            <div className="siFeature">
              <FaSnowflake className="featureIcon" />
              <span>Air conditioning</span>
            </div>
          )}
        </div>
        
        <div className="siCancelOp">
          <span className="siCancelOpText">Free cancellation</span>
          <span className="siCancelOpSubtitle">
            You can cancel later, so lock in this great price today!
          </span>
        </div>
      </div>
      
      <div className="siDetails">
        <div className="siPriceBox">
          <div className="siPrice">
            <span className="siPriceAmount">₹{item.cheapestPrice || item.cheapestprice || 'N/A'}</span>
            <span className="siPriceText">per night</span>
          </div>
          <span className="siTaxOp">Includes taxes and fees</span>
          <div className="siButtonGroup">
            <Link to={`/hotels/${item._id}`} className="siCheckButton secondary">
              View Details
            </Link>
            <button 
              className="siCheckButton primary" 
              onClick={() => setShowBookingModal(true)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      
      <BookingModal
        hotel={{
          ...item,
          prices: item.cheapestPrice || item.cheapestprice
        }}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => {
          setShowBookingModal(false);
          // You can add success handling here
        }}
      />
    </div>
  );
};

export default SearchItem;
