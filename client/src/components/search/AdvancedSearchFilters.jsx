import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faBed,
  faRupeeSign,
  faWifi,
  faParking,
  faSwimmingPool,
  faDumbbell,
  faUtensils,
  faConciergeBell,
  faSpa,
  faCocktail,
  faBusinessTime,
  faTimes,
  faChevronDown,
  faChevronUp,
  faSliders,
  faStar,
  faAward,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import './advancedSearchFilters.css';

const AdvancedSearchFilters = ({ 
  onSearch, 
  onFilterChange, 
  initialFilters = {},
  className = '' 
}) => {
  // Search state
  const [searchData, setSearchData] = useState({
    destination: initialFilters.destination || '',
    checkIn: initialFilters.checkIn || new Date(),
    checkOut: initialFilters.checkOut || new Date(Date.now() + 86400000), // Tomorrow
    guests: {
      adults: initialFilters.guests?.adults || 1,
      children: initialFilters.guests?.children || 0
    },
    rooms: initialFilters.rooms || 1
  });

  // Filter state
  const [filters, setFilters] = useState({
    priceRange: initialFilters.priceRange || [1000, 20000],
    propertyTypes: initialFilters.propertyTypes || [],
    amenities: initialFilters.amenities || [],
    starRating: initialFilters.starRating || [],
    mealPlans: initialFilters.mealPlans || [],
    sortBy: initialFilters.sortBy || 'relevance',
    guestRating: initialFilters.guestRating || 0,
    distanceFromCenter: initialFilters.distanceFromCenter || 50,
    paymentOptions: initialFilters.paymentOptions || []
  });

  // UI state
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Predefined options
  const propertyTypes = [
    { id: 'hotel', label: 'Hotels', icon: faBed },
    { id: 'resort', label: 'Resorts', icon: faSpa },
    { id: 'apartment', label: 'Apartments', icon: faBusinessTime },
    { id: 'villa', label: 'Villas', icon: faAward },
    { id: 'guesthouse', label: 'Guest Houses', icon: faConciergeBell }
  ];

  const amenities = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: faWifi },
    { id: 'parking', label: 'Free Parking', icon: faParking },
    { id: 'pool', label: 'Swimming Pool', icon: faSwimmingPool },
    { id: 'gym', label: 'Fitness Center', icon: faDumbbell },
    { id: 'restaurant', label: 'Restaurant', icon: faUtensils },
    { id: 'room_service', label: 'Room Service', icon: faConciergeBell },
    { id: 'spa', label: 'Spa', icon: faSpa },
    { id: 'bar', label: 'Bar/Lounge', icon: faCocktail },
    { id: 'business_center', label: 'Business Center', icon: faBusinessTime }
  ];

  const mealPlans = [
    { id: 'room_only', label: 'Room Only' },
    { id: 'breakfast', label: 'Breakfast Included' },
    { id: 'half_board', label: 'Half Board' },
    { id: 'full_board', label: 'Full Board' },
    { id: 'all_inclusive', label: 'All Inclusive' }
  ];

  const paymentOptions = [
    { id: 'pay_at_hotel', label: 'Pay at Hotel' },
    { id: 'free_cancellation', label: 'Free Cancellation' },
    { id: 'no_prepayment', label: 'No Prepayment' },
    { id: 'instant_confirmation', label: 'Instant Confirmation' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Guest Rating' },
    { value: 'distance', label: 'Distance from Center' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Mock destinations for autocomplete
  const destinations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Kerala', 'Agra', 'Chennai',
    'Kolkata', 'Hyderabad', 'Pune', 'Udaipur', 'Manali', 'Shimla', 'Rishikesh',
    'Varanasi', 'Mysore', 'Ooty', 'Darjeeling', 'Amritsar'
  ];

  // Search suggestions based on input
  useEffect(() => {
    if (searchData.destination.length > 0) {
      const suggestions = destinations.filter(dest =>
        dest.toLowerCase().includes(searchData.destination.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchData.destination]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange && onFilterChange({ ...searchData, ...filters });
  }, [searchData, filters, onFilterChange]);

  const handleSearchInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGuestChange = (type, delta) => {
    setSearchData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(type === 'adults' ? 1 : 0, prev.guests[type] + delta)
      }
    }));
  };

  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSearchData(prev => ({
      ...prev,
      checkIn: startDate,
      checkOut: endDate
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (Array.isArray(prev[filterType])) {
        if (prev[filterType].includes(value)) {
          newFilters[filterType] = prev[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...prev[filterType], value];
        }
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
  };

  const handlePriceRangeChange = (newRange) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newRange
    }));
  };

  const handleSearch = () => {
    const searchParams = {
      ...searchData,
      ...filters
    };
    onSearch && onSearch(searchParams);
    setDatePickerOpen(false);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [1000, 20000],
      propertyTypes: [],
      amenities: [],
      starRating: [],
      mealPlans: [],
      sortBy: 'relevance',
      guestRating: 0,
      distanceFromCenter: 50,
      paymentOptions: []
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.starRating.length > 0) count++;
    if (filters.mealPlans.length > 0) count++;
    if (filters.guestRating > 0) count++;
    if (filters.paymentOptions.length > 0) count++;
    if (filters.priceRange[0] !== 1000 || filters.priceRange[1] !== 20000) count++;
    if (filters.distanceFromCenter !== 50) count++;
    return count;
  };

  const toggleFilterSection = (section) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  return (
    <div className={`advanced-search-filters ${className}`}>
      {/* Main Search Bar */}
      <div className="search-main">
        <div className="search-fields">
          {/* Destination */}
          <div className="search-field destination-field">
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Where</span>
            </label>
            <div className="destination-input">
              <input
                type="text"
                placeholder="City, hotel, or destination"
                value={searchData.destination}
                onChange={(e) => handleSearchInputChange('destination', e.target.value)}
                onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              
              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    className="search-suggestions"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          handleSearchInputChange('destination', suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Dates */}
          <div className="search-field date-field">
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>When</span>
            </label>
            <div
              className="date-selector"
              onClick={() => setDatePickerOpen(!datePickerOpen)}
            >
              <span>
                {format(searchData.checkIn, 'MMM dd')} - {format(searchData.checkOut, 'MMM dd')}
              </span>
            </div>
            
            <AnimatePresence>
              {datePickerOpen && (
                <motion.div
                  className="date-picker-overlay"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <DateRange
                    ranges={[{
                      startDate: searchData.checkIn,
                      endDate: searchData.checkOut,
                      key: 'selection'
                    }]}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    rangeColors={['#667eea']}
                    className="date-range-picker"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guests */}
          <div className="search-field guests-field">
            <label>
              <FontAwesomeIcon icon={faUsers} />
              <span>Who</span>
            </label>
            <div className="guests-rooms-selector">
              <div className="guest-counter">
                <span>Adults</span>
                <div className="counter-controls">
                  <button
                    onClick={() => handleGuestChange('adults', -1)}
                    disabled={searchData.guests.adults <= 1}
                  >
                    -
                  </button>
                  <span>{searchData.guests.adults}</span>
                  <button onClick={() => handleGuestChange('adults', 1)}>+</button>
                </div>
              </div>
              
              <div className="guest-counter">
                <span>Children</span>
                <div className="counter-controls">
                  <button
                    onClick={() => handleGuestChange('children', -1)}
                    disabled={searchData.guests.children <= 0}
                  >
                    -
                  </button>
                  <span>{searchData.guests.children}</span>
                  <button onClick={() => handleGuestChange('children', 1)}>+</button>
                </div>
              </div>
              
              <div className="guest-counter">
                <span>Rooms</span>
                <div className="counter-controls">
                  <button
                    onClick={() => handleSearchInputChange('rooms', Math.max(1, searchData.rooms - 1))}
                    disabled={searchData.rooms <= 1}
                  >
                    -
                  </button>
                  <span>{searchData.rooms}</span>
                  <button onClick={() => handleSearchInputChange('rooms', searchData.rooms + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
          Search
        </button>
      </div>

      {/* Filters Toggle */}
      <div className="filters-toggle">
        <button
          className={`filters-toggle-btn ${isFiltersExpanded ? 'active' : ''}`}
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
        >
          <FontAwesomeIcon icon={faSliders} />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="filter-count">{getActiveFiltersCount()}</span>
          )}
          <FontAwesomeIcon
            icon={isFiltersExpanded ? faChevronUp : faChevronDown}
            className="toggle-icon"
          />
        </button>
        
        {getActiveFiltersCount() > 0 && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <FontAwesomeIcon icon={faTimes} />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isFiltersExpanded && (
          <motion.div
            className="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filters-grid">
              {/* Sort By */}
              <div className="filter-section">
                <h4>Sort By</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range (per night)</h4>
                <div className="price-range">
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), filters.priceRange[1]])}
                    className="price-slider"
                  />
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([filters.priceRange[0], parseInt(e.target.value)])}
                    className="price-slider"
                  />
                  <div className="price-labels">
                    <span>₹{filters.priceRange[0].toLocaleString()}</span>
                    <span>₹{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="filter-section">
                <h4>Star Rating</h4>
                <div className="star-rating-filters">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <label key={stars} className="checkbox-filter">
                      <input
                        type="checkbox"
                        checked={filters.starRating.includes(stars)}
                        onChange={() => handleFilterChange('starRating', stars)}
                      />
                      <span className="checkmark"></span>
                      <div className="stars">
                        {[...Array(stars)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ))}
                      </div>
                      <span>{stars} star{stars > 1 ? 's' : ''}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div className="filter-section">
                <h4>Property Type</h4>
                <div className="property-type-filters">
                  {propertyTypes.map(type => (
                    <label key={type.id} className="checkbox-filter">
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type.id)}
                        onChange={() => handleFilterChange('propertyTypes', type.id)}
                      />
                      <span className="checkmark"></span>
                      <FontAwesomeIcon icon={type.icon} />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="filter-section">
                <h4>Amenities</h4>
                <div className="amenities-filters">
                  {amenities.map(amenity => (
                    <label key={amenity.id} className="checkbox-filter">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => handleFilterChange('amenities', amenity.id)}
                      />
                      <span className="checkmark"></span>
                      <FontAwesomeIcon icon={amenity.icon} />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meal Plans */}
              <div className="filter-section">
                <h4>Meal Plans</h4>
                <div className="meal-plan-filters">
                  {mealPlans.map(meal => (
                    <label key={meal.id} className="checkbox-filter">
                      <input
                        type="checkbox"
                        checked={filters.mealPlans.includes(meal.id)}
                        onChange={() => handleFilterChange('mealPlans', meal.id)}
                      />
                      <span className="checkmark"></span>
                      <span>{meal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guest Rating */}
              <div className="filter-section">
                <h4>Minimum Guest Rating</h4>
                <div className="rating-slider">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.guestRating}
                    onChange={(e) => handleFilterChange('guestRating', parseFloat(e.target.value))}
                    className="slider"
                  />
                  <div className="rating-value">
                    {filters.guestRating > 0 ? `${filters.guestRating}+` : 'Any'}
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="filter-section">
                <h4>Booking Options</h4>
                <div className="payment-options-filters">
                  {paymentOptions.map(option => (
                    <label key={option.id} className="checkbox-filter">
                      <input
                        type="checkbox"
                        checked={filters.paymentOptions.includes(option.id)}
                        onChange={() => handleFilterChange('paymentOptions', option.id)}
                      />
                      <span className="checkmark"></span>
                      <FontAwesomeIcon icon={faCheck} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filters-actions">
              <button className="apply-filters-btn" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearchFilters;
