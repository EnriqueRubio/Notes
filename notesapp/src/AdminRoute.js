import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AuthService from './services/auth.service';
import AdminDashboard from './components/AdminComponents/AdminDashboard';

function AdminRoute({ isAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.admin) {
        isAdmin = currentUser.admin;
      } else {
        navigate('/');
      }
    }
  }, [isAdmin, navigate]);

  return (
    <>
      <AdminDashboard />
      <Outlet />
    </>
  );
}
export default AdminRoute;
