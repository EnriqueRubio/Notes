import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./notesContainer.css";
import { Toast } from 'bootstrap'
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { BiListPlus, BiShareAlt, BiEdit, BiTrash } from 'react-icons/bi';
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import FriendsSidebar from '../FriendsSidebar/FriendsSidebar';

const API_URL_NOTES = "http://localhost:3000/api/notes";
const API_URL_COLLECTIONS = "http://localhost:3000/api/collections";

let estado = 0;
let titulo_estado;
let contenido_estado;
let note_data;

let notification_title;
let notification_content;

function changeBackground() {
  let R = Math.floor((Math.random() * 127) + 127);
  let G = Math.floor((Math.random() * 127) + 127);
  let B = Math.floor((Math.random() * 127) + 127);

  let rgb = (R << 16) + (G << 8) + B;
  return `#${rgb.toString(16)}`;
}

function formatoFecha(fecha, formato) {
  const map = {
    dd: fecha.getDate(),
    mm: fecha.getMonth() + 1,
    yy: fecha.getFullYear().toString().slice(-2),
    yyyy: fecha.getFullYear()
  }

  return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
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
  title_n.innerHTML = titulo_estado;
  content_n.innerHTML = contenido_estado;
}

function cargarModalActu() {
  reinicioValidaciones();
  const title_n = document.getElementById("updateNoteTitle");
  const content_n = document.getElementById("updateNoteContent");
  title_n.value = titulo_estado;
  content_n.value = contenido_estado;
}

function limpiarCrear() {
  reinicioValidaciones();
  const createNoteTitle = document.getElementById('createNoteTitle');
  const createNoteContent = document.getElementById('createNoteContent');

  if (createNoteTitle) {
    createNoteTitle.value ="";
  }

  if (createNoteContent) {
    createNoteContent.value ="";
  }
}

function reinicioValidaciones() {
  const validacionCrear = document.getElementById('validacionCrear');
  const validacionEdit = document.getElementById('validacionEdit');

  if (validacionCrear) {
    validacionCrear.style.display = "none";
  }

  if (validacionEdit) {
    validacionEdit.style.display = "none";
  }
}


function notification(action) {
  switch (action) {
    case 1:
      notification_title = "Nota Creada"
      notification_content = "La nota se ha creado correctamente."
      break;
    case 2:
      notification_title = "Nota Actualizada"
      notification_content = "La nota se ha actualizado correctamente."
      break;
    case 3:
      notification_title = "Nota Borrada"
      notification_content = "La nota se ha borrado correctamente."
      break;
    default:
    //Nothing
  }

  var toastElList = [].slice.call(document.querySelectorAll('.toast'))
  var toastList = toastElList.map(function (toastEl) {
    let tempt_toast = new Toast(toastEl);
    return tempt_toast
  })
  toastList.forEach(toast => toast.show());
}

const NoteContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  const reloadData = async () => {
    try {
      axios.get(API_URL_NOTES, { headers: AuthHeader() }).then(response => {
          note_data = response.data;
          setNotes(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    
    if (user) {
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
    reloadData();
  }, [navigate]);

  useEffect(() => {
    // Llama a la función fetchCollections para obtener la lista de colecciones
    // y actualiza el estado 'collections' cuando el componente se monta
    try {
      axios.get(API_URL_COLLECTIONS, { headers: AuthHeader() }).then(response => {
        setCollections(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  }, []);

  const handlerEditNote = function () {

    let new_title = document.getElementById('updateNoteTitle').value;
    let new_content = document.getElementById('updateNoteContent').value;
    let note_id;

    if (new_title === "" || new_content === "") {
      document.getElementById('validacionEdit').style.display = "block";
    } else {

      for (var element in note_data) {
        if (element === estado) {
          note_id = note_data[element]._id.$oid;
        }

      }

      //Actualizamos
      axios.put(`${API_URL_NOTES}/${note_id}`, 
        {
          "note": {
            "title": new_title,
            "content": new_content
          }
        },
        {
          headers: {
            ...AuthHeader(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      .then(() => {
          document.getElementById("btnUpdateClose").click();
          reloadData();
          notification(2);
        });
    }

  }

  const handlerCreateNote = function () {

    const fecha_actual = new Date();
    let creation_date = formatoFecha(fecha_actual, 'yy-mm-dd');
    let create_title = document.getElementById('createNoteTitle').value;
    let create_content = document.getElementById('createNoteContent').value;

    if (create_title === "" || create_content === "") {
      document.getElementById('validacionCrear').style.display = "block";
    } else {
      //Creamos
      axios.post(`${API_URL_NOTES}`, 
        {
          "note": {
            "title": create_title,
            "creation_date": creation_date,
            "content": create_content
          }
        },
        {
          headers: {
            ...AuthHeader(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
      .then(() => {
          document.getElementById("btnCreateClose").click();
          reloadData();
          document.getElementById('createNoteTitle').value = "";
          document.getElementById('createNoteContent').value = "";
          notification(1);
        });

    }
  }

  const handlerDeleteNote = function () {
    let note_id;

    for (var element in note_data) {
      if (element === estado) {
        note_id = note_data[element]._id.$oid;
      }

    }
    //Borramos
    axios.delete(`${API_URL_NOTES}/${note_id}`,
      {
        headers: {
          ...AuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(() => {
        document.getElementById("btnDeleteClose").click();
        reloadData();
        notification(3);
      });

  }
  
  async function addNoteToCollection(collectionId, noteId) {
    axios.post(`${API_URL_COLLECTIONS}/${collectionId}/add_note`, 
    {
      "note_id": noteId
    },
    {
      headers: {
        ...AuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  .then(() => {
      // Mostrar mensaje de éxito y marcar la colección como seleccionada
    });
  }
  
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </span>
  ));
  

  return (
    <>
      {isLoggedIn ? (
    <div>

    <div id="toast" role="alert" style={{ position: "absolute", top: 0, right: 0 }} aria-live="assertive"
      aria-atomic="true" class="toast" >
      <div class="toast-header">
        <strong class="me-auto">{notification_title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {notification_content}
      </div>
    </div>
    <FriendsSidebar />
    <div class="card-deck">

      {/* Modal para crear la nota */}

        <div class="modal fade" id="createModal" aria-labelledby="createModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                <h1 class="modal-title fs-5" id="createModalLabel">
                  Título:
                  <input id="createNoteTitle" type="text" defaultValue="" />
                </h1>

                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
                <textarea id="createNoteContent" defaultValue="" rows="4" cols="60" />
              </div>

              <div id="validacionCrear" style={{ display: "none" }} class="alert alert-warning" role="alert">
                Debes rellenar todos los campos.
              </div>

              <div class="modal-footer">
                <button id="btnCreateClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-outline-success" onClick={handlerCreateNote}>Crear Nota</button>
              </div>

            </div>
          </div>
        </div>

      {notes.map((note, i) => {
        const bgColor = changeBackground();
        return (


          <div>
            <div class="card" style={{ padding: "10px 20px 0px", margin: "5px 5px 5px 5px", width: "18rem", height: "15rem", backgroundColor: bgColor }}>

              <div class="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
                <div data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#showModal" id={[i, note.title, note.content]} onMouseEnter={guardarEstado} onClick={cargarModalVer}>
                  <h5 class="card-title"><strong>{note.title}</strong></h5>

                  <p class="card-text"><strong>{note.content}</strong></p>

                </div>

                <div class="class-icons" id={[i, note.title, note.content]} onMouseEnter={guardarEstado}>

                <div class="class-icon">
                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                      <BiListPlus size="1.7rem" cursor="pointer" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {collections.map((collection) => (
                        <Dropdown.Item
                          key={collection._id.$oid}
                          onClick={() => addNoteToCollection(collection._id.$oid, note._id.$oid)}
                        >
                          {collection.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div class="class-icon" >
                    <BiShareAlt size="1.5rem" />
                </div>

                <div class="class-icon" onClick={cargarModalActu}>
                  <BiEdit size="1.5rem" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#editModal" cursor="pointer" />
                </div>

                <div class="class-icon">
                  <BiTrash size="1.5rem" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#deleteModal" cursor="pointer" />
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

                    <div id="validacionEdit" style={{ display: "none" }} class="alert alert-warning" role="alert">
                      Debes rellenar todos los campos.
                    </div>

                    <div class="modal-footer">
                      <button id="btnUpdateClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
                      <button type="button" class="btn btn-outline-success" onClick={handlerEditNote}>Actualizar Nota</button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Modal para borrar la nota */}

              <div class="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">

                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="deleteNoteTitle">¡Cuidado!</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body" id="deleteNoteContent">Estas a punto de borrar tu nota, ¿Estás seguro de hacerlo?</div>

                    <div class="modal-footer">
                      <button id="btnDeleteClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                      <button type="button" class="btn btn-danger" onClick={handlerDeleteNote}>Borrar Nota</button>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

        );

      })}

    </div>
    <Button className="floating-button" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#createModal" onClick={limpiarCrear}>
        <FaPlus />
    </Button>
  </div>
      ) : (
        // Renderiza un mensaje de error o redirecciona al usuario
        <h1>
          No tienes permiso para ver esta página, por favor inicia sesión.
        </h1>
      )}
    </>
  );

};


export default NoteContainer;

