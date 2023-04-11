import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./notesContainer.css";
import ShareNoteModal from '../ShareNoteModal/ShareNoteModal';
import { Toast } from 'bootstrap'
import { Button, Dropdown } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { BiListPlus, BiShareAlt, BiEdit, BiTrash } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import FriendsSidebar from '../FriendsSidebar/FriendsSidebar';
import Toolbar from '../Toolbar/toolbar.component';
import QuillEditor from '../Editor/editor.component';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const BASE_API_URL = "http://localhost:3000/api/";
const API_URL_NOTES = BASE_API_URL + "notes";
const API_URL_COLLECTIONS = BASE_API_URL + "collections";
const API_URL_FRIENDS = BASE_API_URL + 'friends/only_accepted';

let estado = 0;
let titulo_estado;
let contenido_estado;

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
      notification_title = "Note Created"
      notification_content = "The note has been successfully created."
      break;
    case 2:
      notification_title = "Nota Updated"
      notification_content = "The note has been successfully updated."
      break;
    case 3:
      notification_title = "Nota Deleted"
      notification_content = "The note has been successfully deleted."
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
  const currentUser = AuthService.getCurrentUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [noteToShare, setNoteToShare] = useState(null);
  const [friends, setFriends] = useState([]);
  const [sharedFriends, setSharedFriends] = useState([]);
  const [quillCreateNoteInstance, setQuillCreateNoteInstance] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentViewingNote, setCurrentViewingNote] = useState('');
  const [currentEditingNote, setCurrentEditingNote] = useState('');
  const [currentDeletingNote, setCurrentDeletingNote] = useState('');
  // Filtering and sorting states
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedDate, setSelectedDate] = useState('ever');
  const [sortCriteria, setSortCriteria] = useState('created');
  const [sortAscending, setSortAscending] = useState(true);

  const navigate = useNavigate();

  const handleCreatorReady = (quill) => {
    setQuillCreateNoteInstance(quill);
  };

  const handleEditorReady = (quill) => {
    setQuillInstance(quill);
  };

  const getCurrentEditingNoteContent = () => {
    return currentEditingNote.content;
  };

  const cargarModalVer = (note) => {
    setCurrentViewingNote(note);
    setIsViewModalOpen(true);
    const title_n = document.getElementById("viewNoteTitle");
    const content_n = document.getElementById("viewNoteContent");
    title_n.innerHTML = note.title;
    if (typeof note.content === 'object') {
      content_n.innerHTML = note.contentPreview;
    } else content_n.innerHTML = note.content;
    //content_n.value = contenido_estado;
  }

  const cargarModalActu = (note) => {
    setCurrentEditingNote(note);
    setIsEditModalOpen(true);
    reinicioValidaciones();
    const title_n = document.getElementById("updateNoteTitle");
    //const content_n = document.getElementById("updateNoteContent");
    title_n.value = note.title;
    //content_n.value = contenido_estado;
  }

  const cargarModalDelete = (note) => {
    setCurrentDeletingNote(note);
  }

  const reloadData = async () => {
    try {
      axios.get(API_URL_NOTES, { headers: AuthHeader() }).then(response => {
        const notes = response.data.map(note => {
          // Si el contenido de la nota es un objeto Delta, lo convertimos a HTML
          if (typeof note.content === 'object' && note.content.ops) {
            const converter = new QuillDeltaToHtmlConverter(note.content.ops, {});
            const noteHTML = converter.convert();

            // Creamos una nueva nota con el contenido convertido a HTML
            return { ...note, contentPreview: noteHTML };
          } else {
            // Si el contenido de la nota no es un objeto Delta, lo mantenemos sin cambios
            return note;
          }
        });
        setNotes(notes);
        setFilteredNotes(notes);
        //setNotes(response.data);
      })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching notes data:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setIsLoggedIn(true);
    } else {
      navigate('/login');
    }
    reloadData();

    // Cargamos las colecciones
    try {
      axios.get(API_URL_COLLECTIONS, { headers: AuthHeader() }).then(response => {
        setCollections(response.data);
      })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching collections data:', error);
    }

    // Cargamos los amigos
    try {
      axios.get(API_URL_FRIENDS, { headers: AuthHeader() }).then(response => {
        let friendUsers = [];
        response.data.forEach(relationship => {
          friendUsers.push(relationship.user);
        });
        setFriends(friendUsers);
      })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  }, [navigate]);

  const handleShareModal = (note) => {
    if (note.shared_to_ids) {
      const shared = friends.filter((friend) => note.shared_to_ids.some(sharedId => sharedId.$oid === friend._id.$oid));
      setSharedFriends(shared);
    }
    setNoteToShare(note);
    setShowShareModal(true);
  }

  // Función para mostrar el modal de compartir
  const updateSharedNote = (updatedSharedFriends) => {
    try {
      axios.put(API_URL_NOTES + "/" + noteToShare._id.$oid + "/update_shared",
        {
          'shared_to': updatedSharedFriends.map(friend => friend._id)
        },
        { headers: AuthHeader() })
        .then(response => {
          noteToShare.shared_to_ids = updatedSharedFriends.map(friend => friend._id);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handlerEditNote = function () {
    let new_title = document.getElementById('updateNoteTitle').value;
    //let quillEditor = document.getElementById('quill-editor');
    //let new_content = quillInstance.getHTML();
    let new_content = quillInstance.editor.delta;
    let note_id;

    if (new_title === "" || new_content === "") {
      document.getElementById('validacionEdit').style.display = "block";
    } else {
      note_id = currentEditingNote._id.$oid;
      setCurrentEditingNote('');
      /*
            for (var element in note_data) {
              if (element === estado) {
                note_id = note_data[element]._id.$oid;
              }
      
            }*/

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

  function limpiarCrear() {
    setCurrentEditingNote('');
    setIsEditModalOpen(true);
    reinicioValidaciones();
    const createNoteTitle = document.getElementById('createNoteTitle');
    const createNoteContent = document.getElementById('createNoteContent');

    if (createNoteTitle) {
      createNoteTitle.value = "";
    }

    if (createNoteContent) {
      createNoteContent.value = "";
    }
  }

  const handlerCreateNote = function () {

    const fecha_actual = new Date();
    let creation_date = formatoFecha(fecha_actual, 'yy-mm-dd');
    let create_title = document.getElementById('createNoteTitle').value;
    let create_content = quillCreateNoteInstance.editor.delta;

    if (create_title === "" || create_content === "") {
      document.getElementById('validacionCrear').style.display = "block";
    } else {
      //Creamos
      axios.post(`${API_URL_NOTES}`,
        {
          "note": {
            "title": create_title,
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
    let note_id = currentDeletingNote._id.$oid;
    /*
    for (var element in note_data) {
      if (element === estado) {
        note_id = note_data[element]._id.$oid;
      }

    }*/
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

  const addNoteToCollection = (collectionId, note) => {
    let collectionIndex = -1;
    console.log(note);
    if (note.parent_collection_ids) {
      collectionIndex = note.parent_collection_ids.findIndex(
        parentCollection => parentCollection.$oid === collectionId
      );
    }

    console.log(collectionIndex);

    if (collectionIndex !== -1) {
      //note.parent_collections.splice(collectionIndex, 1);
      axios.put(`${API_URL_COLLECTIONS}/${collectionId}/remove_note`,
        {
          "note_id": note._id.$oid
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
          const updatedNotes = filteredNotes.map((n) =>
            n._id.$oid === note._id.$oid
              ? { ...n, parent_collection_ids: n.parent_collection_ids.filter((idObj) => idObj.$oid !== collectionId) }
              : n
          );
          setFilteredNotes(updatedNotes);
          setNotes(updatedNotes);
        });
    } else {
      //note.parent_collections.push({ $oid: collectionId });
      axios.put(`${API_URL_COLLECTIONS}/${collectionId}/add_note`,
        {
          "note_id": note._id.$oid
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
          const updatedNotes = filteredNotes.map((n) =>
            n._id.$oid === note._id.$oid
              ? { ...n, parent_collection_ids: [...n.parent_collection_ids, { $oid: collectionId }] }
              : n
          );
          setFilteredNotes(updatedNotes);
          setNotes(updatedNotes);
        });
    }

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

  // Filtering and sorting functions

  const applyFilters = () => {
    let filteredNotes = notes;

    if (selectedCollections.length > 0) {
      // Aplica el filtro de amigos
      filteredNotes = filteredNotes.filter((note) => {
        return note.parent_collection_ids.some((idObj) =>
          selectedCollections.some((collection) => collection._id.$oid === idObj.$oid)
        );
      });
    }

    if (selectedFriends.length > 0) {
      // Aplica el filtro de amigos
      filteredNotes = filteredNotes.filter((note) => {
        return (
          // Notas compartidas por el usuario actual con amigos seleccionados
          note.shared_to_ids.some((idObj) =>
            selectedFriends.some((friend) => friend._id.$oid === idObj.$oid)
          ) ||
          // Notas compartidas por amigos con el usuario actual y donde el autor es alguno de los amigos seleccionados
          selectedFriends.some((friend) => friend._id.$oid === note.author_id.$oid) &&
          note.shared_to_ids.some((idObj) => idObj.$oid === currentUser._id.$oid)
        );
      });
    }


    if (selectedDate !== null) {
      // Aplica el filtro de fecha
      const now = new Date();
      filteredNotes = filteredNotes.filter((note) => {
        const createdAt = new Date(note.created_at);
        const timeDiff = now - createdAt;

        switch (selectedDate) {
          case 'recently':
            return timeDiff <= 60 * 60 * 1000; // Menos de una hora
          case 'today':
            return timeDiff <= 24 * 60 * 60 * 1000; // Menos de un día
          case 'this_week':
            return timeDiff <= 7 * 24 * 60 * 60 * 1000; // Menos de una semana
          case 'this_month':
            return timeDiff <= 30 * 24 * 60 * 60 * 1000; // Menos de un mes
          case 'this_year':
            return timeDiff <= 365 * 24 * 60 * 60 * 1000; // Menos de un año
          case 'older':
            return timeDiff > 365 * 24 * 60 * 60 * 1000; // Más de un año
          default:
            return true;
        }
      });
    }

    setFilteredNotes(filteredNotes);
  };

  const sortNotes = () => {
    const sortedNotes = [...filteredNotes];

    sortedNotes.sort((a, b) => {
      let comparison = 0;

      // Ordena según el criterio seleccionado
      switch (sortCriteria) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "created":
          comparison = new Date(a.created_at) - new Date(b.created_at);
          break;
        case "modified":
          comparison = new Date(a.updated_at) - new Date(b.updated_at);
          break;
        default:
          break;
      }

      return sortAscending ? comparison : -comparison;
    });
    setFilteredNotes(sortedNotes);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCollections, selectedFriends, selectedDate]);

  useEffect(() => {
    sortNotes();
  }, [sortCriteria, sortAscending]);

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

          <Toolbar
            setSelectedCollections={setSelectedCollections}
            setSelectedFriends={setSelectedFriends}
            setSelectedDate={setSelectedDate}
            setSortCriteria={setSortCriteria}
            setSortAscending={setSortAscending}
            sortAscending={sortAscending}
            friends={friends}
            collections={collections}
            sortCriteria={sortCriteria}
            selectedDate={selectedDate}
            selectedFriends={selectedFriends}
            selectedCollections={selectedCollections}
          />


          <div class="card-deck">

            {/* Modal para crear la nota */}

            <div class="modal fade" id="createModal" aria-labelledby="createModalLabel" aria-hidden="true">
              <div class="modal-dialog custom-modal-dialog modal-dialog-centered">
                <div class="modal-content">

                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="createModalLabel">
                      Title:
                      <input id="createNoteTitle" type="text" defaultValue="" placeholder='Titulo' style={{ marginLeft: "5px", borderTop: "none", borderLeft: "none", borderRight: "none", width: "400px" }} />
                    </h1>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="modal-body">
                    <QuillEditor
                      onEditorReady={handleCreatorReady}
                      getCurrentContent={getCurrentEditingNoteContent}
                    />
                  </div>

                  <div id="validacionCrear" style={{ display: "none" }} class="alert alert-warning" role="alert">
                    You must fill all the fields.
                  </div>

                  <div class="modal-footer">
                    <button id="btnCreateClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-outline-success" onClick={handlerCreateNote}>Create note</button>
                  </div>

                </div>
              </div>
            </div>

            {filteredNotes.map((note, i) => {
              const bgColor = changeBackground();
              return (


                <div class="card custom-card" style={{ padding: "3px 3px 3px 3px", margin: "5px 5px 5px 5px", width: "18rem", height: "15rem", backgroundColor: bgColor, overflow: "visible" }}>
                  {note.author_id.$oid !== currentUser._id.$oid && (
                    <div class="shared-note-icon">
                      <div class="shared-note-icon-inner">
                        <BsPersonFill color="white" size="1.5rem" />
                      </div>
                    </div>
                  )}
                  <div class="card-body" style={{ flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }} data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#showModal" id={i} onClick={() => cargarModalVer(note)} >
                    {/*<div data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#showModal" id={[i, note.title, note.content]} onMouseEnter={guardarEstado} onClick={cargarModalVer}>*/}

                    <h5 class="card-title"><strong>{note.title}</strong></h5>

                    <div class="card-text-preview scrollbar-primary" dangerouslySetInnerHTML={{ __html: note.contentPreview ? note.contentPreview : note.content }} />

                  </div>

                  <div class="card-expand" style={{ overflow: "visible" }} >
                    <div class="card-expand-content">
                      {/* Aquí va el contenido adicional que deseas mostrar en la animación */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="class-icons" id={[i, note.title]}>

                          <div class="class-icon">
                            <Dropdown>
                              <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                <BiListPlus className="custom-note-icon" size="1.7rem" cursor="pointer" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {collections.length > 0 ? collections.map((collection) => (
                                  <Dropdown.Item
                                    key={collection._id.$oid}
                                    onClick={() => addNoteToCollection(collection._id.$oid, note)}
                                    active={
                                      note.parent_collection_ids
                                        ? note.parent_collection_ids.some((idObj) => idObj.$oid === collection._id.$oid)
                                        : false
                                    }
                                  >
                                    {collection.title}
                                  </Dropdown.Item>
                                )) : <Dropdown.Item
                                  onClick={(e) => e.preventDefault()}
                                  style={{
                                    cursor: "default",
                                    backgroundColor: "transparent",
                                    pointerEvents: "none",
                                  }}
                                >There are no collections</Dropdown.Item>}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>

                          <div class="class-icon" >
                            <BiShareAlt className="custom-note-icon" onClick={() => handleShareModal(note)} size="1.5rem" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#shareModal" cursor="pointer" />
                          </div>

                          <div class="class-icon">
                            <BiEdit className="custom-note-icon" onClick={() => cargarModalActu(note)} size="1.5rem" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#editModal" cursor="pointer" />
                          </div>

                          <div class="class-icon">
                            <BiTrash className="custom-note-icon" onClick={() => cargarModalDelete(note)} size="1.5rem" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#deleteModal" cursor="pointer" />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              );

            })}

            {/* Modal para ver la nota */}

            <div class="modal fade" id="showModal" aria-labelledby="showModalLabel" aria-hidden="true">
              <div class="custom-modal-dialog modal-dialog modal-dialog-centered">
                <div class="modal-content">

                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="viewNoteTitle" style={{ textAlign: "center", width: "100%" }} ></h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="modal-body card-text" id="viewNoteContent"></div>

                  <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                  </div>

                </div>
              </div>
            </div>

            {/* Modal para editar la nota */}

            <div class="modal fade" id="editModal" aria-labelledby="editModalLabel" aria-hidden="true">
              <div class="custom-modal-dialog modal-dialog modal-dialog-centered">
                <div class="modal-content">

                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="editModalLabel">
                      Edit Note:
                      <input id="updateNoteTitle" type="text" defaultValue="test" style={{ marginLeft: "5px", borderTop: "none", borderLeft: "none", borderRight: "none", width: "400px" }} />
                    </h1>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="modal-body">
                    {/*<textarea id="updateNoteContent" defaultValue="test" rows="4" cols="60" />*/}
                    <div>
                      <QuillEditor
                        onEditorReady={handleEditorReady}
                        getCurrentContent={getCurrentEditingNoteContent}
                      />
                    </div>
                  </div>

                  <div id="validacionEdit" style={{ display: "none" }} class="alert alert-warning" role="alert">
                    You must fill all the fields.
                  </div>

                  <div class="modal-footer">
                    <button id="btnUpdateClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-outline-success" onClick={handlerEditNote}>Update Note</button>
                  </div>

                </div>
              </div>
            </div>

            {/* Modal para compartir la nota*/}

            <ShareNoteModal
              show={showShareModal}
              onHide={() => setShowShareModal(false)}
              friends={friends}
              sharedFriends={sharedFriends}
              updateSharedItem={updateSharedNote}
              item={noteToShare}
              itemType='note'
            />

            {/* Modal para borrar la nota */}

            <div class="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
              <div class="custom-modal-dialog modal-dialog modal-dialog-centered">
                <div class="modal-content">

                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteNoteTitle">Watch out!</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="modal-body" id="deleteNoteContent">The note will be deleted, are you sure you want to do it?</div>

                  <div class="modal-footer">
                    <button id="btnDeleteClose" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onClick={handlerDeleteNote}>Delete Note</button>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <Button className="floating-button" data-backdrop="static" data-keyboard="false" data-bs-toggle="modal" data-bs-target="#createModal" onClick={limpiarCrear}>
            <FaPlus />
          </Button>
        </div>
      ) : (
        // Renderiza un mensaje de error o redirecciona al usuario
        <h1>
          You don't have permission to view this page. Please log in or sign up.
        </h1>
      )}
    </>
  );

};


export default NoteContainer;

