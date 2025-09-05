import "./featuredProperties.css";
import { useFetch } from "../../hooks/useFetch";

const FeaturedProperties = () => {
  const { data, error, loading } = useFetch("/hotels?featured=true&limit=4");

  if (loading) return "Loading...";
  if (error) return "Error loading data";

  return (
    <div className="fp">
      {data && data.map((hotel) => (
        <div className="fpItem" key={hotel._id}>
          <img 
            src={hotel.photos?.[0] || "https://via.placeholder.com/300"} 
            alt={hotel.name}
            className="fpImg"
          />
          <span className="fpName">{hotel.name}</span>
          <span className="fpCity">{hotel.city}</span>
          <span className="fpPrice">Starting from ₹{hotel.cheapestPrice}</span>
          <div className="fpRating">
            <button>{hotel.rating}</button>
            <span>
              {hotel.rating > 4.5 ? "Excellent" : 
               hotel.rating > 4 ? "Very Good" : "Good"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProperties;
