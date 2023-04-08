// components/AdminRoute.js
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { isAdmin } from './services/helpers';
import AuthService from './services/auth.service';

const AdminRoute = ({ user, ...props }) => {
  if(!user) {
    user = AuthService.getCurrentUser();
  }
  console.log(user);
  if (!user) {
    // Si el usuario no ha iniciado sesión, redirigir al inicio de sesión
    //return <Navigate to="/login" />;
  }

  if (isAdmin(user)) {
    // Si el usuario es administrador, permitir el acceso
    return <Route {...props} />;
  }

  // Si el usuario no es administrador, redirigir a la página de acceso denegado
  //return <Navigate to="./access_denied" />;
};

export default AdminRoute;
