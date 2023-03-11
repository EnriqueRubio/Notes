import './App.css';
import React from 'react'
import axios from "axios";
import Note from "./components/Note/Note"
import NoteContainer from "./components/NotesContainer/NotesContainer";
import { useEffect, useState } from "react";




const App = () => {
    return (
        
      <div>
        <h1>My Notes App</h1>
        <body>
            <NoteContainer/>
        </body>
        
      </div>
    );
  };

export default App;
