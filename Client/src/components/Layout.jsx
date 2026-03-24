import React, { useEffect } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Container from './Container';
import { useSelector } from 'react-redux';

function Layout() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className={theme}>
      <Header />
      <main className="py-10">
        <Container className={`flex items-center justify-around `}>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default Layout;