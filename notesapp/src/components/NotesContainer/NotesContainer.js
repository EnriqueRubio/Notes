import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./notesContainer.css"

const API_URL_NOTES = "http://localhost:3000/api/notes";

let estado = 0;
let titulo_estado;
let contenido_estado;
let note_data;

function changeBackground() {
  let R = Math.floor((Math.random() * 127) + 127);
  let G = Math.floor((Math.random() * 127) + 127);
  let B = Math.floor((Math.random() * 127) + 127);

  let rgb = (R << 16) + (G << 8) + B;
  return `#${rgb.toString(16)}`;
}

function guardarEstado(e) {

  const array_estado = e.currentTarget.id.split(",");
  estado = array_estado[0];
  titulo_estado = array_estado[1];
  contenido_estado = array_estado[2];
}

function cargarModalVer() {
  const title_n = document.getElementById("showNoteTitle");
  const content_n = document.getElementById("showNoteContent");
  title_n.innerHTML  = titulo_estado;
  content_n.innerHTML  = contenido_estado;
}

function cargarModalActu() {
  const title_n = document.getElementById("updateNoteTitle");
  const content_n = document.getElementById("updateNoteContent");
  title_n.value = titulo_estado;
  content_n.value = contenido_estado;
}

const NoteContainer = () => {

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(API_URL_NOTES)
      .then(response => {
        note_data = response.data;
        setNotes(response.data);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  const handlerEditNote = function () {

    let new_title = document.getElementById('updateNoteTitle').value;
    let new_content = document.getElementById('updateNoteContent').value;
    let note_id;

    for (var element in note_data) {
      if (element === estado) {
        note_id = note_data[element]._id.$oid;
      }

    }

    //Actualizamos
    axios.put(`${API_URL_NOTES}/${note_id}`, {
      "note":
      {
        "title": new_title,
        "content": new_content
      }
    })
      .then((response) => {
        setNotes(response.data);
      });

    //Recargamos
    window.location.reload();
  }

  const cards = notes.map((note, i) => {
    const bgColor = changeBackground();
    return (

      <div class="card" style={{ width: "18rem", backgroundColor: bgColor }}>

        <div class="card-body">
          <div data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#showModal" id={[i, note.title, note.content]} onMouseEnter={guardarEstado} onClick={cargarModalVer}>
            <h5 class="card-title"><strong>{note.title}</strong></h5>

            <p class="card-text"><strong>{note.content}</strong></p>

          </div>

          <div class="class-icons" id={[i, note.title, note.content]} onMouseEnter={guardarEstado}>

            <div class="class-icon" >
              <svg cursor="pointer"
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16">
                <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
              </svg>
            </div>

            <div class="class-icon" onClick={cargarModalActu}>
              <svg data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#editModal" cursor="pointer"
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
              </svg>
            </div>

            <div class="class-icon">
              <svg cursor="pointer"
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
              </svg>
            </div>

          </div>

        </div>

        {/* Modal para ver la nota */}

        <div class="modal fade" id="showModal" aria-labelledby="showModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                <h1 class="modal-title fs-5" id="showNoteTitle">test</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body" id="showNoteContent"></div>

              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
              </div>

            </div>
          </div>
        </div>

        {/* Modal para editar la nota */}

        <div class="modal fade" id="editModal" aria-labelledby="editModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                <h1 class="modal-title fs-5" id="editModalLabel">
                  Editar Nota:
                  <input id="updateNoteTitle" type="text" defaultValue="test" />
                </h1>

                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
                <textarea id="updateNoteContent" defaultValue="test" rows="4" cols="60" />
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-outline-success" onClick={handlerEditNote}>Actualizar Nota</button>
              </div>

            </div>
          </div>
        </div>


      </div>

    );

  });

  return (

    <div class="card-deck">

      {cards};

    </div>

  );


};


export default NoteContainer;

