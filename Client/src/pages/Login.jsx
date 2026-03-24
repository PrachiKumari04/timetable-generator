import React from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { login } from "../store/auth/authSlice";
import { toggleTheme } from "../store/theme/themeSlice";

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData.entries());
    console.log(data);

    // API calling
    const url = "/api/v1/users/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const user = await response.json();


    //role based login 
    if (user.success === true) {
      if (user.data.role === "admin") navigate("/admin");
      else if (user.data.role === "student") navigate("/student");
      else if (user.data.role === "faculty") navigate("/faculty");
      else navigate("/");

      dispatch(login(user.data));
    }
  };

  return (
    <div className="relative h-screen bg-background transition-colors duration-200">
      {/* Theme Toggle Button */}
      <button 
        onClick={() => dispatch(toggleTheme())}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-hover text-text transition-colors"
        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>

      <Container className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-lg shadow-xl border border-border">
          <h2 className="text-2xl font-bold text-center text-text">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text/80"
              >
                Username
              </label>
              <input
              id="username"
              name="username"
              type="text"
                required
                className="w-full px-3 py-2 mt-1 border border-border bg-background text-text rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text/80"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 border border-border bg-background text-text rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-200"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
