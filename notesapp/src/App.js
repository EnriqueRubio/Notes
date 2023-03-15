import './App.css';
import React from 'react'
import NotesContainer from "./components/NotesContainer/NotesContainer";
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Informacion from './components/Informacion/Informacion';

const App = () => {
  return (

    <div>
      <header><NavBar /></header>
      <Router>
        <Routes >
          <Route path="/" element={<NotesContainer />}></Route>
          <Route path="/informacion" element={<Informacion />}></Route>
          <Route path="/ajustes"></Route>
        </Routes>
      </Router>
      <body>
      </body>

    </div>
  );
};

export default App;
