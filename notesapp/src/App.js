import './App.css';
import axios from "axios";
import Notes from "./components/notes";
import { useEffect, useState } from "react";


const API_URL = "http://localhost:3000/api/notes"

function getAPIData() {
  return axios.get(API_URL).then((response) => response.data)
}

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let mounted = true;
    getAPIData().then((items) => {
      if(mounted) {
        setNotes(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="App">
      <h1>Notas</h1>
      <Notes notes={notes}/>
    </div>
  );
}

export default App;
