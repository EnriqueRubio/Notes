import './App.css';
import React from 'react'
import axios from "axios";
import Note from "./components/Note/Note"
import NoteContainer from "./components/NotesContainer/NotesContainer";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => {
  return (

    <div>
      <h1>My Notes App</h1>

      <NoteContainer />

    </div>
  );
};

export default App;
