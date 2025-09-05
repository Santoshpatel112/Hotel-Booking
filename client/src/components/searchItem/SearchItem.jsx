import "./searchItem.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import BookingModal from "../booking/BookingModal";

const SearchItem = ({ item }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  if (!item) {
    return (
      <div className="searchItem">
        <div className="siDesc">
          <h1 className="siTitle">No hotel data available</h1>
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

  return (
    <div className="searchItem">
      <img
        src={item.photos?.[0] || "https://via.placeholder.com/300x200"}
        alt={item.name}
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">{item.distance || '500m'} from center</span>
        <span className="siTaxiOp">{item.freeAirportTaxi ? 'Free airport taxi' : 'Airport taxi available'}</span>
        <span className="siSubtitle">
          {item.desc || item.title || 'Comfortable accommodation with modern amenities'}
        </span>
        <span className="siFeatures">
          {item.type} • {item.city}
        </span>
        <span className="siCancelOp">Free cancellation</span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>{getRatingText(item.rating)}</span>
          <button>{item.rating || 'N/A'}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">₹{item.cheapestPrice || item.cheapestprice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <div className="siButtonGroup">
            <Link to={`/hotels/${item._id}`}>
              <button className="siCheckButton secondary">See details</button>
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
