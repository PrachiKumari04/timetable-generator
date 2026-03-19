import React from 'react'

function Header() {
  return (
     <div className="min-h-screen p-6">
      <div className="flex items-center justify-between bg-amber-500 mb-4">
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

      {/* <div className="bg-white rounded-2xl shadow-xl p-8">
        {role === "student" && <Student />}
        {role === "faculty" && <Faculty />}
        {role === "admin" && <Admin />}
      </div> */}
    </div>
  )
}

export default Header