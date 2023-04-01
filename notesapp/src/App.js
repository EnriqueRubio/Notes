import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import NoteContainer from "./components/NotesContainer/NotesContainer";
import { useEffect, useState } from "react";

import NotesContainer from "./components/NotesContainer/NotesContainer";
import Collections from "./components/Collections/collections.component";
import NavBar from "./components/NavBar/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Informacion from "./components/Informacion/Informacion";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Friends from "./components/Friends/friends.component";
import Profile from "./components/Profile/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/board-admin.component";
import NotFound from "./components/NotFound";
import MainLayout from "./components/MainLayout";

class App extends Component {
  // ... (constructor, componentDidMount, logOut)

  render() {
    return (
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<NotesContainer />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    );
  }
}

export default App;