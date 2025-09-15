import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faMapMarkerAlt, 
  faSearch, 
  faFilter,
  faSort,
  faThLarge,
  faList,
  faWifi,
  faParking,
  faSwimmingPool,
  faDumbbell,
  faUtensils,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import SearchItem from "../../components/searchItem/SearchItem";
import AdvancedSearchFilters from "../../components/search/AdvancedSearchFilters";
import { hotelAPI } from "../../services/api";
import "./list.css";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(location.state?.dates || [
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600 * 1000 * 24),
      key: "selection",
    },
  ]);
  const [options, setOptions] = useState(location.state?.options || {
    adult: 1,
    children: 0,
    room: 1,
  });
  
  // Enhanced state management
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    minPrice: undefined,
    maxPrice: undefined,
    propertyTypes: [],
    amenities: [],
    starRating: [],
    guestRating: 0,
  });
  const [searchParams, setSearchParams] = useState({
    destination: destination,
    checkIn: dates[0]?.startDate,
    checkOut: dates[0]?.endDate,
    guests: { adults: options.adult, children: options.children },
    rooms: options.room
  });

  // Fetch hotels function
  const fetchHotels = async (searchData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        city: searchData.destination || destination,
        min: searchData.minPrice || filters.minPrice || 0,
        max: searchData.maxPrice || filters.maxPrice || 99999,
        sortBy: searchData.sortBy || sortBy,
        ...searchData
      };
      
      const response = await hotelAPI.getAllHotels(params);
      setFilteredHotels(response.data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err.response?.data?.message || 'Failed to fetch hotels');
      setFilteredHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (destination) {
      fetchHotels();
    }
  }, [destination, filters.minPrice, filters.maxPrice, sortBy]);

  // Handle advanced search
  const handleAdvancedSearch = (searchData) => {
    setDestination(searchData.destination);
    setDates([{
      startDate: searchData.checkIn,
      endDate: searchData.checkOut,
      key: 'selection'
    }]);
    setOptions({
      adult: searchData.guests.adults,
      children: searchData.guests.children,
      room: searchData.rooms
    });
    setSearchParams(searchData);
    fetchHotels(searchData);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="list">
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          {/* Enhanced Search Section */}
          <div className="search-section">
            <AdvancedSearchFilters
              onSearch={handleAdvancedSearch}
              onFilterChange={handleFilterChange}
              initialFilters={{
                destination: destination,
                checkIn: dates[0]?.startDate,
                checkOut: dates[0]?.endDate,
                guests: { adults: options.adult, children: options.children },
                rooms: options.room,
                priceRange: [filters.minPrice || 1000, filters.maxPrice || 20000],
                ...filters
              }}
              className="list-search-filters"
            />
          </div>

          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              <h2>
                {destination ? `Hotels in ${destination}` : 'Search Results'}
                {filteredHotels.length > 0 && (
                  <span className="count"> ({filteredHotels.length} properties)</span>
                )}
              </h2>
              {searchParams.checkIn && searchParams.checkOut && (
                <p className="search-dates">
                  {format(searchParams.checkIn, 'MMM dd')} - {format(searchParams.checkOut, 'MMM dd')} • 
                  {searchParams.guests.adults + searchParams.guests.children} guests • 
                  {searchParams.rooms} {searchParams.rooms === 1 ? 'room' : 'rooms'}
                </p>
              )}
            </div>
            
            <div className="results-controls">
              <div className="sort-controls">
                <FontAwesomeIcon icon={faSort} />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="relevance">Best Match</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Guest Rating</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              
              <div className="view-controls">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <FontAwesomeIcon icon={faThLarge} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="listResult">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Searching for the best properties...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => fetchHotels()} className="retry-button">
                  <FontAwesomeIcon icon={faSearch} /> Try Again
                </button>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className={`hotel-${viewMode === 'grid' ? 'grid' : 'list'}`}>
                {filteredHotels.map((item) => (
                  <div className={`hotel-card ${viewMode}`} key={item._id}>
                    <div className="hotel-card-inner">
                      <div className="hotel-image">
                        <img
                          src={item.photos?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={item.name}
                          loading="lazy"
                        />
                        {item.featured && <span className="featured-badge">Featured</span>}
                        <div className="image-overlay">
                          <button 
                            className="quick-view-btn"
                            onClick={() => navigate(`/hotels/${item._id}`)}
                          >
                            Quick View
                          </button>
                        </div>
                      </div>
                      
                      <div className="hotel-details">
                        <div className="hotel-header">
                          <h3 className="hotel-name">{item.name}</h3>
                          <div className="hotel-rating">
                            <div className="rating-badge">
                              <span>{item.rating?.toFixed(1) || '4.5'}</span>
                              <FontAwesomeIcon icon={faStar} className="star-icon" />
                            </div>
                            <span className="rating-text">
                              {item.rating >= 4.5 ? 'Excellent' : 
                               item.rating >= 4.0 ? 'Very Good' : 
                               item.rating >= 3.0 ? 'Good' : 'Average'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="hotel-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>{item.city}, {item.country}</span>
                        </div>
                        
                        <div className="hotel-type">{item.type}</div>
                        
                        {item.amenities && (
                          <div className="hotel-amenities">
                            {item.amenities.slice(0, 4).map((amenity, index) => (
                              <span key={index} className="amenity-tag">
                                {amenity === 'wifi' && <FontAwesomeIcon icon={faWifi} />}
                                {amenity === 'parking' && <FontAwesomeIcon icon={faParking} />}
                                {amenity === 'pool' && <FontAwesomeIcon icon={faSwimmingPool} />}
                                {amenity === 'gym' && <FontAwesomeIcon icon={faDumbbell} />}
                                {amenity === 'restaurant' && <FontAwesomeIcon icon={faUtensils} />}
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                              </span>
                            ))}
                            {item.amenities.length > 4 && (
                              <span className="amenity-more">+{item.amenities.length - 4} more</span>
                            )}
                          </div>
                        )}
                        
                        <div className="hotel-footer">
                          <div className="hotel-price">
                            <span className="price">₹{item.cheapestPrice || item.cheapestprice}</span>
                            <span className="period">per night</span>
                          </div>
                          
                          <button 
                            className="view-details-btn"
                            onClick={() => navigate(`/hotels/${item._id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <h2>No properties found</h2>
                <p>We couldn't find any properties matching your search criteria.</p>
                <div className="suggestions">
                  <h4>Try:</h4>
                  <ul>
                    <li>Adjusting your price range</li>
                    <li>Changing your dates</li>
                    <li>Reducing the number of guests</li>
                    <li>Removing some filters</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
