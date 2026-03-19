

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Faculty from './pages/dashboard/Faculty';
import Student from './pages/dashboard/Student';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/dashboard/Admin';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}  >
        <Route index element={<Home />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

    </Routes>
  );
}

export default App;
