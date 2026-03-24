

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Faculty from './pages/dashboard/Faculty';
import Student from './pages/dashboard/Student';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/dashboard/Admin';

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

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
