import React from 'react';
import NavBar from './NavBar/NavBar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children, onColorChange }) => {
  return (
    <div>
      <NavBar />
      {children}
      <Outlet onColorChange={onColorChange} />
    </div>
  );
};

export default MainLayout;