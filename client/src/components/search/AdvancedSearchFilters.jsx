// AdvancedSearchFilters Component
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

    // Ensure city filtering logic is applied
    if (!searchData.destination) {
      alert("Please enter a destination to search.");
      return;
    }

    onSearch && onSearch(searchParams);
    setDatePickerOpen(false);
    setShowSuggestions(false);
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
    </div>
  );
};

export default AdvancedSearchFilters;
