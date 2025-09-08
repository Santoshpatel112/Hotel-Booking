import {
  faBed,
  faCalendarDays,
  faCar,
  faPlane,
  faTaxi,
  faMapMarkerAlt,
  faChild,
  faUsers,
  faDoorOpen,
  faTimes,
  faChevronDown,
  faPlus,
  faMinus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useScroll, useTransform } from "framer-motion";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useRef, useEffect } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 2,
    children: 0,
    room: 1,
  });
  const [focusedInput, setFocusedInput] = useState(null);

  const navigate = useNavigate();
  const dateRef = useRef(null);
  const optionsRef = useRef(null);
  const destinationRef = useRef(null);
  const headerRef = useRef(null);

  // Advanced scroll animations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setOpenDate(false);
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openDate, openOptions]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      const newValue = operation === "i" ? prev[name] + 1 : prev[name] - 1;
      const minValues = { adult: 1, children: 0, room: 1 };
      const maxValues = { adult: 10, children: 8, room: 5 };

      return {
        ...prev,
        [name]: Math.max(minValues[name], Math.min(maxValues[name], newValue)),
      };
    });
  };

  const handleSearch = () => {
    if (!destination.trim()) {
      destinationRef.current?.focus();
      return;
    }
    
    navigate("/hotels", { state: { destination, date, options } });
  };

  const handleDestinationFocus = () => {
    setFocusedInput("destination");
    setOpenDate(false);
    setOpenOptions(false);
  };

  const handleDateClick = () => {
    setOpenDate(!openDate);
    setOpenOptions(false);
    setFocusedInput("date");
  };

  const handleOptionsClick = () => {
    setOpenOptions(!openOptions);
    setOpenDate(false);
    setFocusedInput("options");
  };

  const getGuestText = () => {
    const guestCount = options.adult + options.children;
    const guestText = guestCount === 1 ? "guest" : "guests";
    const roomText = options.room === 1 ? "room" : "rooms";
    return `${guestCount} ${guestText} • ${options.room} ${roomText}`;
  };

  // Animation variants for sophisticated effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const searchVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      ref={headerRef}
      className="header"
      style={{ opacity: headerOpacity, scale: headerScale }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background elements */}
      <div className="headerBackground">
        <motion.div
          className="backgroundOrb orb1"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="backgroundOrb orb2"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <motion.div
          className="headerList"
          variants={itemVariants}
        >
          {[
            { icon: faBed, text: "Stays", active: true, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
            { icon: faPlane, text: "Flights", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
            { icon: faCar, text: "Car rentals", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
            { icon: faBed, text: "Attractions", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
            { icon: faTaxi, text: "Airport taxis", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
          ].map((item, index) => (
            <motion.div
              key={item.text}
              className={`headerListItem ${item.active ? "active" : ""}`}
              style={{ "--item-gradient": item.gradient }}
              whileHover={{ 
                scale: 1.08, 
                y: -4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: { 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FontAwesomeIcon icon={item.icon} />
              </motion.div>
              <span>{item.text}</span>
              {item.active && (
                <motion.div
                  className="activeIndicator"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        {type !== "list" && (
          <>
            <motion.div 
              className="headerContent"
              variants={itemVariants}
            >
              <motion.h1
                className="headerTitle"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 1,
                  delay: 0.4,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
              >
                <motion.span
                  initial={{ display: "inline-block" }}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="gradientText"
                >
                  Find your perfect stay
                </motion.span>
                <motion.div
                  className="titleSparkle"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FontAwesomeIcon icon={faStar} />
                </motion.div>
              </motion.h1>
              <motion.p
                className="headerDesc"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.6,
                  ease: [0.6, -0.05, 0.01, 0.99],
                }}
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1 }}
                  className="typewriterEffect"
                >
                  Discover amazing places at exclusive prices
                </motion.span>
              </motion.p>
            </motion.div>

            <motion.div
              className="headerSearch"
              variants={searchVariants}
            >
              {/* Destination Input */}
              <motion.div
                className={`headerSearchItem ${
                  focusedInput === "destination" ? "focused" : ""
                }`}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
                whileFocus={{ scale: 1.02 }}
                layout
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="headerIcon" />
                </motion.div>
                <div className="searchInputContainer">
                  <motion.label 
                    className="searchLabel"
                    animate={{ 
                      color: focusedInput === "destination" ? "#0066cc" : "#6b7280" 
                    }}
                  >
                    Destination
                  </motion.label>
                  <input
                    ref={destinationRef}
                    type="text"
                    placeholder="Where are you going?"
                    className="headerSearchInput"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={handleDestinationFocus}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
                <motion.div
                  className="inputRipple"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: focusedInput === "destination" ? 1 : 0,
                    opacity: focusedInput === "destination" ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Date Range Picker */}
              <motion.div
                className={`headerSearchItem dateItem ${
                  focusedInput === "date" ? "focused" : ""
                } ${openDate ? "active" : ""}`}
                whileHover={{ scale: 1.02 }}
                ref={dateRef}
              >
                <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                <div className="searchInputContainer" onClick={handleDateClick}>
                  <label className="searchLabel">Check-in • Check-out</label>
                  <span className="headerSearchText">
                    {`${format(date[0].startDate, "MMM dd")} - ${format(
                      date[0].endDate,
                      "MMM dd, yyyy"
                    )}`}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`dropdownIcon ${openDate ? "rotated" : ""}`}
                />

                {openDate && (
                  <div className="datePickerDropdown">
                    <div className="datePickerHeader">
                      <h3>Select your dates</h3>
                      <button
                        className="closeButton"
                        onClick={() => setOpenDate(false)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDate([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={date}
                      className="cleanDateRange"
                      minDate={new Date()}
                      rangeColors={["#0066cc"]}
                      showDateDisplay={false}
                    />
                    <div className="datePickerFooter">
                      <button
                        className="doneButton"
                        onClick={() => setOpenDate(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Guests and Rooms Selector */}
              <motion.div
                className={`headerSearchItem guestItem ${
                  focusedInput === "options" ? "focused" : ""
                } ${openOptions ? "active" : ""}`}
                whileHover={{ scale: 1.02 }}
                ref={optionsRef}
              >
                <FontAwesomeIcon icon={faUsers} className="headerIcon" />
                <div
                  className="searchInputContainer"
                  onClick={handleOptionsClick}
                >
                  <label className="searchLabel">Guests • Rooms</label>
                  <span className="headerSearchText">{getGuestText()}</span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`dropdownIcon ${openOptions ? "rotated" : ""}`}
                />

                {openOptions && (
                  <div className="guestSelectorDropdown">
                    <div className="guestSelectorHeader">
                      <h3>Guests and rooms</h3>
                      <button
                        className="closeButton"
                        onClick={() => setOpenOptions(false)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>

                    <div className="guestOptions">
                      {[
                        {
                          key: "adult",
                          text: "Adults",
                          desc: "Ages 13 or above",
                          icon: faUsers,
                          min: 1,
                          max: 10,
                        },
                        {
                          key: "children",
                          text: "Children",
                          desc: "Ages 2-12",
                          icon: faChild,
                          min: 0,
                          max: 8,
                        },
                        {
                          key: "room",
                          text: "Rooms",
                          desc: "Separate rooms",
                          icon: faDoorOpen,
                          min: 1,
                          max: 5,
                        },
                      ].map((option) => (
                        <div key={option.key} className="guestOptionItem">
                          <div className="guestOptionInfo">
                            <FontAwesomeIcon
                              icon={option.icon}
                              className="guestOptionIcon"
                            />
                            <div className="guestOptionText">
                              <span className="guestOptionTitle">
                                {option.text}
                              </span>
                              <span className="guestOptionDesc">
                                {option.desc}
                              </span>
                            </div>
                          </div>
                          <div className="guestOptionCounter">
                            <button
                              disabled={options[option.key] <= option.min}
                              className="counterButton"
                              onClick={() => handleOption(option.key, "d")}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="counterNumber">
                              {options[option.key]}
                            </span>
                            <button
                              disabled={options[option.key] >= option.max}
                              className="counterButton"
                              onClick={() => handleOption(option.key, "i")}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="guestSelectorFooter">
                      <button
                        className="doneButton"
                        onClick={() => setOpenOptions(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Search Button */}
              <motion.div className="headerSearchItem searchButtonContainer">
                <motion.button
                  className="headerBtn headerBtnSearch"
                  onClick={handleSearch}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 12px 30px rgba(16, 185, 129, 0.4)",
                    y: -2,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Search</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Header;
