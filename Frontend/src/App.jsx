import { useState } from "react";
// import { Routes, Route } from "react-router";
import Login from "./pages/login";
import Student from "./dashboard/Student";
import Faculty from "./dashboard/Faculty";
import Admin from "./dashboard/Admin";
import Layout from "./componens/Layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import About from "./pages/About";

function App() {
  const [role, setRole] = useState("");

  if (!role) {
    return <Login setRole={setRole} />;
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path:'/about',
      element:<About/>

    },
    {
      path: "/dashboard",
      element: <Layout />,
      children: [
        {
          path: "/dashboard/student",
          element: <Student />,
        },
        {
          path: "/dashboard/faculty",
          element: <Faculty />,
        },
        {
          path: "/admin",
          element: <Admin />,
        },
      ],
    },
  ]);

  return (
    <>
      {/* <Routes>
        <Route path="/login" element={<Login />} />
        <Route index element={<Layout />}>
          <Route path="student" element={<Student />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
