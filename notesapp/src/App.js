import "./App.css";
import React from "react";
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

import NotFound from "./components/NotFound";
import MainLayout from "./components/MainLayout";

function App(){
  const [backgroundColor, setBackgroundColor] = useState('#F1F1F1');
  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  return (
    <div className="full-height" style={{ backgroundColor: backgroundColor, heigth: "100%" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainLayout onColorChange={handleColorChange} />}>
            <Route index element={<NotesContainer />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings onColorChange={handleColorChange} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    );
  
}

export default App;