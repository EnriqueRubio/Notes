import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import AdminNotesManager from './AdminNotes/AdminNotesBoard';
import AdminCollectionsManager from './AdminCollections/AdminCollectionsBoard';
import AdminUsersManager from './AdminUsers/AdminUsersBoard';
import AdminRelationsManager from './AdminRelations/AdminRelationsBoard';
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";

const BASE_URL = "http://localhost:3000/api/";
const API_NOTES_URL = BASE_URL + "notes/";
const API_COLLECTIONS_URL = BASE_URL + "collections/";
const API_USERS_URL = BASE_URL + "users/";
const API_RELATIONS_URL =  BASE_URL + "friends/";

const AdminDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);
  const [relations, setRelations] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_NOTES_URL, { headers: AuthHeader() });
      return response.data;
    } catch (error) {
      console.error('Error fetching notes data:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get(API_COLLECTIONS_URL, { headers: AuthHeader() });
      return response.data;
    } catch (error) {
      console.error('Error fetching collections data:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_USERS_URL, { headers: AuthHeader() });
      return response.data;
    } catch (error) {
      console.error('Error fetching users data:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const fetchRelations = async () => {
    try {
      const response = await axios.get(API_RELATIONS_URL, { headers: AuthHeader() });
      return response.data;
    } catch (error) {
      console.error('Error fetching relations data:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  const fetchData = async () => {
    try {
      const [fetchedNotes, fetchedCollections, fetchedUsers, fetchedRelations] = await Promise.all([
        fetchNotes(),
        fetchCollections(),
        fetchUsers(),
        fetchRelations()
      ]);
  
      setNotes(fetchedNotes);
      setCollections(fetchedCollections);
      setUsers(fetchedUsers);
      setRelations(fetchedRelations);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Renderiza los componentes de administración y pasa los datos correspondientes
  return (
    <Routes>
      <Route path="/notes" element={<AdminNotesManager notes={notes} collections={collections} users={users} />} />
      <Route path="/collections" element={<AdminCollectionsManager notes={notes} collections={collections} users={users} />} />
      <Route path="/users" element={<AdminUsersManager users={users} />} />
      <Route path="/relations" element={<AdminRelationsManager users={users} relations={relations} />} />
    </Routes>
  );
};

export default AdminDashboard;