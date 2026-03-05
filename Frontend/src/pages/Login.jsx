import React from "react";

export default function login({ setRole, role }) {
  const [data, setData] = React.useState({
    userId: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", data);

    // Dummy role assignment based on userId for demonstration
    if (data.userId.startsWith("s")) {
      setRole("student");
    } else if (data.userId.startsWith("f")) {
      setRole("faculty");
    } else if (data.userId.startsWith("a")) {
      setRole("admin");
    } else {
      alert("Invalid User ID");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* <!-- Header --> */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-2">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Timetable Generator
            </h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>

          {/* <!-- Login Form --> */}
          <form className="space-y-4 flex flex-col">
            {/* <!-- User ID --> */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium  text-gray-700">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter your user ID/email"
                name="userId"
                value={data.userId}
                onChange={(e) => setData({ ...data, userId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* <!-- Email --> */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div> */}

            {/* <!-- Role --> */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="">Select your role</option>
                <option>Student</option>
                <option>Teacher</option>
                <option>Admin</option>
              </select>
            </div> */}

            {/* <!-- Password --> */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {/* <!-- Remember & Forgot --> */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>

            {/* <!-- Button --> */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Timetable Generator
        </p>
      </div>
    </div>
  );
}
