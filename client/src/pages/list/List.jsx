import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMapMarkerAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
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
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [filteredHotels, setFilteredHotels] = useState([]);

  const { data, loading, error, refetch } = useFetch(
    `/hotels?city=${destination}&min=${min || 0}&max=${max || 99999}`
  );

  useEffect(() => {
    if (data) {
      setFilteredHotels(data);
    }
  }, [data]);

  const handleSearch = () => {
    refetch();
  };

  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
    }));
  };

  return (
    <div className="list">
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                type="text"
                placeholder={destination || "Where are you going?"}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Check-in - Check-out</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                  dates[0].endDate,
                  "MM/dd/yyyy"
                )}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                  className="dateRange"
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min price (per night)</span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMin(e.target.value)}
                    value={min || ""}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Max price (per night)</span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    onChange={(e) => setMax(e.target.value)}
                    value={max || ""}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <div className="lsOptionCounter">
                    <button
                      disabled={options.adult <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.adult}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("adult", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <div className="lsOptionCounter">
                    <button
                      disabled={options.children <= 0}
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.children}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("children", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <div className="lsOptionCounter">
                    <button
                      disabled={options.room <= 1}
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">{options.room}</span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption("room", "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button className="searchButton" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} /> Search
            </button>
          </div>
          <div className="listResult">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading properties...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <h2>Error loading properties</h2>
                <p>{error.message || "Please try again later"}</p>
                <button onClick={refetch} className="retry-button">
                  Retry
                </button>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="hotel-grid">
                {filteredHotels.map((item) => (
                  <div className="hotel-card" key={item._id}>
                    <div className="hotel-card-inner">
                      <div className="hotel-image">
                        <img
                          src={item.photos?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={item.name}
                        />
                        {item.featured && <span className="featured-badge">Featured</span>}
                      </div>
                      <div className="hotel-details">
                        <h3 className="hotel-name">{item.name}</h3>
                        <div className="hotel-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>{item.city}, {item.country}</span>
                        </div>
                        <div className="hotel-type">{item.type}</div>
                        <div className="hotel-price">
                          <span className="price">₹{item.cheapestPrice || item.cheapestprice}</span>
                          <span className="period">per night</span>
                        </div>
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
                        <button 
                          className="view-details-btn"
                          onClick={() => navigate(`/hotels/${item._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h2>No properties found</h2>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
