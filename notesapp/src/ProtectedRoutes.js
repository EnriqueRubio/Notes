import React from 'react';
import AdminRoute from './AdminRoute(OLD)';
import AdminCollectionsBoard from "./components/AdminComponents/AdminCollections/AdminCollectionsBoard"
import AdminNotesBoard from "./components/AdminComponents/AdminNotes/AdminNotesBoard"
import AdminUsersBoard from "./components/AdminComponents/AdminUsers/AdminUsersBoard"
import AdminRelationsBoard from "./components/AdminComponents/AdminRelations/AdminRelationsBoard"
import AuthService from './services/auth.service';

const ProtectedRoutes = ({user}) => {
    if(!user) {
        user = AuthService.getCurrentUser();
    }
    console.log(user);
    return (
        <>
            <AdminRoute path="/admin/notes" element={<AdminNotesBoard user={user}/>} />
            <AdminRoute path="/admin/collections" element={<AdminCollectionsBoard user={user} />} />
            <AdminRoute path="/admin/users" element={<AdminUsersBoard user={user} />} />
            <AdminRoute path="/admin/relations" element={<AdminRelationsBoard user={user} />} />
        </>
    );
}

export default ProtectedRoutes;