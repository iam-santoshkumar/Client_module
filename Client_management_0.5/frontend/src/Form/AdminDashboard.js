import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const history = useHistory();
  const user = sessionStorage.getItem("user");

  const handleLogout = () => {
    sessionStorage.clear();
    history.replace("/login");
    window.location.href = "/login"; // Redirect to register page
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", (event) => {
      window.history.pushState(null, null, window.location.href);
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user}!</p>
      <button onClick={() => history.replace("/register")}>
      User Management & Registration
      </button>
      <button onClick={() => history.replace("/")}>Go to Home</button>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <button onClick={() => history.push("/updatedInfo")}>Updated Information Table</button>
    </div>
  );
};

export default AdminDashboard;
