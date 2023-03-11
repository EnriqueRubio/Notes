import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./notesContainer.css"

const API_URL = "http://localhost:3000/api/notes";

const NoteContainer = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    
    <div class="card-deck">
        {notes.map(note => (
          
            <div key={note.id} class="card">
              
                <div class="card-header">
                  <h5 class="card-title">{note.title}</h5>
                </div>
                <div class="card-body">
                  <p class="card-text">{note.content}</p>
                </div>
                <div class="card-footer">
                  <small class="text-muted">{note.creation_date}</small>
                </div>
              
            </div>
         
        ))};
      
    </div>
  );
};

export default NoteContainer;