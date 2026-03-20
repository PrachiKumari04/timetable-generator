import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Admin() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated || !userData || userData.role !== "admin") {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, userData, navigate]);

  if (!isAuthenticated || !userData || userData.role !== "admin") {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
}

export default Admin;
