import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Faculty() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !userData || userData.role !== "faculty") {
      navigate("/login");
    }
  }, [isAuthenticated, userData, navigate]);

  if (!isAuthenticated || !userData || userData.role !== "faculty") {
    // Render nothing or a loading spinner while redirecting
    return null;
  }
  return <div>Faculty</div>;
}
