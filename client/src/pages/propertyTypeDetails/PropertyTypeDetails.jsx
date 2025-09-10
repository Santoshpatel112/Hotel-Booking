import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./propertyTypeDetails.css";

const PropertyTypeDetails = () => {
    const { type } = useParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/hotel/properties/${type}`); // Ensure correct URL
                if (!response.ok) {
                    throw new Error(`Failed to fetch properties: ${response.statusText}`);
                }
                const data = await response.json();
                setProperties(data);
            } catch (err) {
                console.error("Error fetching properties:", err.message); // Log error for debugging
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [type]);

    if (loading) return <div>Loading properties...</div>;
    if (error) return <div>Error loading properties: {error}</div>;
    if (!loading && !error && properties.length === 0) {
        return <div>No properties found for {type}.</div>;
    }
    return (
        <div className="propertyTypeDetailsContainer">
            <header className="header">Explore {type} Properties</header>
            <div className="propertiesGrid">
                {properties.map((property) => (
                    <div key={property._id} className="propertyCard">
                        <img src={property.image} alt={property.name} className="propertyImage" />
                        <h3>{property.name}</h3>
                        <p>{property.description}</p>
                        <button className="bookNowButton">Book Now</button>
                    </div>
                ))}
            </div>
            <footer className="footer">© 2023 BookingApp. All rights reserved.</footer>
        </div>
    );
};

export default PropertyTypeDetails;