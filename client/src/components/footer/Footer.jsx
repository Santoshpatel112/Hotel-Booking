import { motion } from "framer-motion";
import "./footer.css";

const Footer = () => {
  const footerSections = [
    {
      title: "Destinations",
      items: ["Countries", "Regions", "Cities", "Districts", "Airports", "Hotels"]
    },
    {
      title: "Accommodation",
      items: ["Homes", "Apartments", "Resorts", "Villas", "Hostels", "Guest houses"]
    },
    {
      title: "Discover",
      items: ["Unique places to stay", "Reviews", "Travel articles", "Travel communities", "Holiday deals"]
    },
    {
      title: "Services",
      items: ["Car rental", "Flight Finder", "Restaurant reservations", "Travel Agents"]
    },
    {
      title: "Support",
      items: ["Customer Service", "Partner Help", "Careers", "Sustainability", "Press center", "Safety Resource", "Investor relations", "Terms & conditions"]
    }
  ];

  return (
    <motion.div 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="footerContent">
        <motion.div 
          className="footerBrand"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footerLogo">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a7f3d0" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path d="M50 5 L85 25 L70 40 L50 30 L30 40 L15 25 Z" fill="url(#footerLogoGradient)" />
              <path d="M15 25 L30 40 L30 70 L50 80 L70 70 L70 40 L85 25 L85 55 L70 70 L50 80 L30 70 L15 55 Z" fill="url(#footerLogoGradient)" opacity="0.8" />
              <rect x="20" y="60" width="25" height="25" fill="url(#footerLogoGradient)" rx="2" />
              <rect x="55" y="60" width="25" height="25" fill="url(#footerLogoGradient)" rx="2" />
              <rect x="25" y="65" width="6" height="6" fill="white" rx="1" />
              <rect x="34" y="65" width="6" height="6" fill="white" rx="1" />
              <rect x="60" y="65" width="6" height="6" fill="white" rx="1" />
              <rect x="69" y="65" width="6" height="6" fill="white" rx="1" />
              <rect x="28" y="75" width="8" height="10" fill="white" rx="1" />
              <rect x="63" y="75" width="8" height="10" fill="white" rx="1" />
            </svg>
          </div>
          <h3 className="footerBrandName">EasyStay</h3>
          <p className="footerBrandDesc">
            Your trusted partner for comfortable and memorable stays worldwide.
          </p>
        </motion.div>

        <div className="fLists">
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="fListContainer"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="fListTitle">{section.title}</h4>
              <ul className="fList">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item}
                    className="fListItem"
                    whileHover={{ x: 5, color: "#10b981" }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="footerBottom"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="footerBottomContent">
          <div className="fText">
            <span>© 2025 EasyStay. All rights reserved.</span>
          </div>
          <div className="footerCredit">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="creditText"
            >
              Made with ❤️ by <strong>Santosh Patel</strong>
            </motion.span>
          </div>
          <div className="footerSocial">
            <motion.a 
              href="#" 
              className="socialLink"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              📘
            </motion.a>
            <motion.a 
              href="#" 
              className="socialLink"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              🐦
            </motion.a>
            <motion.a 
              href="#" 
              className="socialLink"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              📷
            </motion.a>
            <motion.a 
              href="#" 
              className="socialLink"
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              💼
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Footer;
