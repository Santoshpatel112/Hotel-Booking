import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingChart from "../charts/BookingChart";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await axios.get(`${BASE_URL}/api/dashboard/admin-dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
        setIsAdmin(true);
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
      }
    };
    fetchData();
  }, []);

  if (!isAdmin) {
    return <div>You do not have admin access. Please log in as an admin.</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <BookingChart data={dashboardData} />
      <ul>
        {dashboardData.map((booking) => (
          <li key={booking._id}>{booking.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;