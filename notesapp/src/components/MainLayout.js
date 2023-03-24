import React from 'react';
import NavBar from './NavBar/NavBar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
      <Outlet />
    </div>
  );
};

export default MainLayout;