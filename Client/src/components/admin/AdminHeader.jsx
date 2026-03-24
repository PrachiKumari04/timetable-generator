import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleTheme } from "../../store/theme/themeSlice";
import { logout } from "../../store/auth/authSlice";

const AdminHeader = ({ title = "Admin Dashboard", actions = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const logoutHandler = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const themeHandler = (e) => {
    e.preventDefault();
    dispatch(toggleTheme());
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-text/10 text-text transition-colors duration-200">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex items-center space-x-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${action.className}`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}

        {/* <button
          onClick={themeHandler}
          className="px-4 py-2 rounded-md font-medium bg-secondary hover:bg-primary text-white transition-colors duration-200"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button> */}

        {/* <button
          onClick={logoutHandler}
          className="px-4 py-2 rounded-md font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default AdminHeader;
