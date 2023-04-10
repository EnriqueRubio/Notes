import "./App.css";
import {useMemo, React} from "react";
import { useState } from "react";
import './custom.css';
import NotesContainer from "./components/NotesContainer/NotesContainer";
import Collections from "./components/Collections/collections.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Friends from "./components/Friends/friends.component";
import Profile from "./components/Profile/profile.component";
import Settings from "./components/Settings/settings.component";
import AuthContext from './AuthContext';
import NotFound from "./components/NotFound";
//import AdminBoard from "./components/AdminComponents/AdminBoard/admin_board.component"
import ProtectedRoutes from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";
import MainLayout from "./components/MainLayout";
import AuthService from "./services/auth.service";
import AdminDashboard from "./components/AdminComponents/AdminDashboard";
import AdminCollectionsBoard from "./components/AdminComponents/AdminCollections/AdminCollectionsBoard"
import AdminNotesBoard from "./components/AdminComponents/AdminNotes/AdminNotesBoard"
import AdminUsersBoard from "./components/AdminComponents/AdminUsers/AdminUsersBoard"
import AdminRelationsBoard from "./components/AdminComponents/AdminRelations/AdminRelationsBoard"

function App(){
  // Estados
  const [currentUser, setCurrentUser] = useState(null);

  // Funciones
  const handleLogin = (loggedInUser) => {
    setCurrentUser(loggedInUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const mainLayoutElement = useMemo(() => <MainLayout onLogout={handleLogout} />, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
    <div className="full-height">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={mainLayoutElement}>
          <Route index element={<NotesContainer />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route
          path="/admin/*"
          element={
            <AdminRoute isAdmin={currentUser?.admin}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/collections" element={<AdminCollectionsBoard />} />
              <Route path="/notes" element={<AdminNotesBoard />} />
              <Route path="/users" element={<AdminUsersBoard />} />
              <Route path="/relations" element={<AdminRelationsBoard />} />
            </AdminRoute>
          }
        />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
    </AuthContext.Provider>
  );
}

export default App;