import { useState } from "react";
// import "./App.css";
import Login from "./pages/login";
import Student from "./dashboard/Student";
import Faculty from "./dashboard/Faculty";
import Admin from "./dashboard/Admin";

function App() {
  const [role, setRole] = useState("");

  if (!role) {
    return <Login setRole={setRole} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {role.toUpperCase()} Dashboard
        </h2>
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded"
          onClick={() => setRole("")}
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {role === "student" && <Student />}
        {role === "faculty" && <Faculty />}
        {role === "admin" && <Admin />}
      </div>
    </div>
  );
}

export default App;
