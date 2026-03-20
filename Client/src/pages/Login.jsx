import React from "react";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { login } from "../store/auth/authSlice";
import { useEffect } from "react";

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    //login theough API
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

    if (user.success === true) {
      console.log("Responce data -->", user);

      if (user.data.role === "admin") navigate("/admin");
      else if (user.data.role === "student") navigate("/student");
      else if (user.data.role === "faculty") navigate("/faculty");
      else navigate("/");

      dispatch(login(data));
    }
  };
  console.log("userData from stor --->", user);

  return (
    // <div className="flex items-center justify-center h-screen bg-gray-200">
    <Container className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </Container>
    // </div>
  );
}

export default Login;
