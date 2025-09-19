import { motion } from "framer-motion";
import "./footer.css";

const Footer = () => {
  const footerSections = [
    {
      title: "Destinations",
      icon: "🌍",
      items: [
        { name: "Popular Countries", link: "#" },
        { name: "Trending Regions", link: "#" },
        { name: "Top Cities", link: "#" },
        { name: "Hidden Gems", link: "#" },
        { name: "Airport Hotels", link: "#" },
        { name: "Business Districts", link: "#" }
      ]
    },
    {
      title: "Accommodation",
      icon: "🏨",
      items: [
        { name: "Luxury Hotels", link: "#" },
        { name: "Budget Apartments", link: "#" },
        { name: "Beach Resorts", link: "#" },
        { name: "Private Villas", link: "#" },
        { name: "Mountain Cabins", link: "#" },
        { name: "City Hostels", link: "#" }
      ]
    },
    {
      title: "Discover",
      icon: "🔍",
      items: [
        { name: "Unique Experiences", link: "#" },
        { name: "Guest Reviews", link: "#" },
        { name: "Travel Guides", link: "#" },
        { name: "Local Communities", link: "#" },
        { name: "Special Offers", link: "#" },
        { name: "Last Minute Deals", link: "#" }
      ]
    },
    {
      title: "Services",
      icon: "🛠️",
      items: [
        { name: "Car Rentals", link: "#" },
        { name: "Flight Booking", link: "#" },
        { name: "Restaurant Reservations", link: "#" },
        { name: "Airport Transfers", link: "#" },
        { name: "Travel Insurance", link: "#" },
        { name: "Currency Exchange", link: "#" }
      ]
    }
  ];

  const socialLinks = [
    { name: "GitHub", icon: "💻", url: "https://github.com/Santoshpatel112", color: "#333333" },
    { name: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/santosh-patel112/", color: "#0077b5" },
    { name: "Email", icon: "📧", url: "mailto:santoshpatelvns5@gmail.com", color: "#ea4335" },
    { name: "X (Twitter)", icon: "🔗", url: "https://x.com/Santoshp3259330", color: "#000000" }
  ];

  const quickStats = [
    { number: "10M+", label: "Happy Travelers" },
    { number: "50K+", label: "Properties" },
    { number: "200+", label: "Countries" },
    { number: "4.8★", label: "Average Rating" }
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
        {/* Brand Section */}
        <motion.div 
          className="footerBrand"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="footerLogo">
            <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <p className="footerBrandTagline">
            ✨ Your Gateway to Extraordinary Stays ✨
          </p>
          <p className="footerBrandDesc">
            Discover amazing accommodations worldwide with unbeatable prices, verified reviews, and seamless booking experience. 
            Your perfect stay is just a click away!
          </p>
          
          {/* Quick Stats */}
          <div className="footerStats">
            {quickStats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="statItem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="statNumber">{stat.number}</div>
                <div className="statLabel">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Links Section */}
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
              <h4 className="fListTitle">
                <span className="titleIcon">{section.icon}</span>
                {section.title}
              </h4>
              <ul className="fList">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.name}
                    className="fListItem"
                    whileHover={{ x: 5, color: "#10b981" }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={item.link} className="footerLink">
                      {item.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <motion.div 
        className="footerBottom"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="footerBottomContent">
          <div className="footerBottomLeft">
            <div className="fText">
              <span>© 2025 EasyStay. All rights reserved.</span>
            </div>
            <div className="legalLinks">
              <a href="#" className="legalLink">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="#" className="legalLink">Terms of Service</a>
              <span className="separator">|</span>
              <a href="#" className="legalLink">Cookie Policy</a>
              <span className="separator">|</span>
              <a href="#" className="legalLink">Accessibility</a>
            </div>
          </div>
          
          <div className="footerBottomCenter">
            <div className="footerCredit">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="creditText"
              >
                Crafted with ❤️ by <strong>Santosh Patel</strong>
              </motion.span>
            </div>
          </div>
          
          <div className="footerBottomRight">
            <div className="socialSection">
              <span className="socialTitle">Follow Us:</span>
              <div className="footerSocial">
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={social.name}
                    href={social.url} 
                    className="socialLink"
                    style={{ '--hover-color': social.color }}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
        

      </motion.div>
    </motion.div>
  );
};

export default Footer;
