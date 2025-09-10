import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingChart from "../charts/BookingChart";

const data = [
  { month: "January", bookings: 30 },
  { month: "February", bookings: 45 },
  { month: "March", bookings: 60 },
];

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const res = await axios.get("/api/dashboard/admin-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setIsAdmin(true); // If the request succeeds, user is admin
      } catch (err) {
        console.error(err);
        setIsAdmin(false); // If the request fails, user is not admin
      }
    };
    fetchData();
  }, []);

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {data.map((booking) => (
          <li key={booking._id}>{booking.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;