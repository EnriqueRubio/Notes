import React, { useContext } from 'react';
import NavBar from './NavBar/NavBar';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthContext';
import AuthService from "../services/auth.service";

const MainLayout = ({ onLogout }) => {
  let { currentUser, setCurrentUser } = useContext(AuthContext);
  if (!currentUser) {
    currentUser = AuthService.getCurrentUser();
    if(!currentUser){
      return <Navigate to="/login" />;
    }
  }
  return (
    <div>
      <NavBar currentUser={currentUser} onLogout={onLogout} />
      <Outlet />
    </div>
  );
};

export default MainLayout;