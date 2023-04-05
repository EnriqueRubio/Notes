import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TwitterPicker from 'react-color';
import axios from 'axios';
import "./collections.component.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import NoteListItem from "./NoteListItem";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    ListGroup,
    Modal,
} from 'react-bootstrap';
import { IoIosRemoveCircleOutline, IoIosRemoveCircle } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { BiShareAlt, BiEdit, BiTrash } from 'react-icons/bi';
import { Toast } from 'bootstrap'
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import FriendsSidebar from '../FriendsSidebar/FriendsSidebar';
import QuillEditor from '../Editor/editor.component';
import ShareNoteModal from '../ShareNoteModal/ShareNoteModal';

const BASE_API_URL = "http://localhost:3000/api/";
const API_URL_COLLECTIONS = BASE_API_URL + "collections/";
const API_URL_NOTES = BASE_API_URL + "notes/";
const API_URL_FRIENDS = BASE_API_URL + 'friends/only_accepted';

const Collections = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [collections, setCollections] = useState([]);
    const [collectionNotes, setCollectionNotes] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingCollection, setEditingCollection] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [friends, setFriends] = useState([]);
    const [sharedFriends, setSharedFriends] = useState([]);
    const [collectionToShare, setCollectionToShare] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [quillInstance, setQuillInstance] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditingNote, setCurrentEditingNote] = useState('');

    const handleEditorReady = (quill) => {
        setQuillInstance(quill);
    };

    const getCurrentEditingNoteContent = () => {
        return currentEditingNote.content;
    };

    const predefinedThemes = [
        {
            bgColor: '#ebffdb',
            borderColor: '#8bc34a',
            textColor: 'black',
        },
        {
            bgColor: '#d4edda',
            borderColor: '#28a745',
            textColor: 'black',
        },
        {
            bgColor: '#d0f0fd',
            borderColor: '#17a2b8',
            textColor: 'black',
        },
        {
            bgColor: '#b3d2ff',
            borderColor: '#0d6efd',
            textColor: 'black',
        },
        {
            bgColor: '#e9d7f5',
            borderColor: '#9c27b0',
            textColor: 'black',
        },
        {
            bgColor: '#ffe0f0',
            borderColor: '#e91e63',
            textColor: 'black',
        },
        {
            bgColor: '#f8d7da',
            borderColor: '#dc3545',
            textColor: 'black',
        },
        {
            bgColor: '#ffecd1',
            borderColor: '#ff9800',
            textColor: 'black',
        },
        {
            bgColor: '#fff3cd',
            borderColor: '#ffc107',
            textColor: 'black',
        },
        {
            bgColor: '#f5ebea',
            borderColor: '#795548',
            textColor: 'black',
        },
        {
            bgColor: '#e2e3e5',
            borderColor: '#6c757d',
            textColor: 'black',
        },
        {
            bgColor: '#f7f8f9',
            borderColor: '#d3d3d3',
            textColor: 'black',
        },
    ];
    const navigate = useNavigate();
    const [selectedTheme, setSelectedTheme] = useState(predefinedThemes[0]);
    const handleThemeChange = (index) => {
        setSelectedTheme(predefinedThemes[index]);
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setIsLoggedIn(true);
        } else {
            navigate('/login');
        }
        loadCollections();

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
            console.error('Error fetching data:', error);
        }
    }, [navigate]);

    const handleShareModal = (collection) => {
        if (collection.shared_to_ids) {
          const shared = friends.filter((friend) => collection.shared_to_ids.some(sharedId => sharedId.$oid === friend._id.$oid));
          setSharedFriends(shared);
        }
        setCollectionToShare(collection);
        setShowShareModal(true);
    }

    useEffect(() => {
        if (collections.length > 0) {
            fetchNotes(collections.map(collection => collection._id.$oid));
        }
    }, [collections]);

    const loadCollections = async () => {
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
    };

    const fetchNotes = async (collectionIds) => {
        try {
            axios
              .get(API_URL_NOTES + `by_collections/${collectionIds.join(',')}`, { headers: AuthHeader() })
              .then((response) => {
                console.log(response);
                const notesByCollection = response.data.reduce((acc, note) => {
                  note.parent_collection_ids.forEach((idObj) => {
                    const collectionId = idObj.$oid;
                    if (!acc[collectionId]) {
                      acc[collectionId] = [];
                    }
                    acc[collectionId].push(note);
                  });
                  return acc;
                }, {});
                setCollectionNotes(notesByCollection);
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (error) {
            console.error('Error fetching notes data:', error);
          }
          
    };

    const handleNewCollection = () => {
        setShowModal(true);
    };

    const handleInputChange = (field) => (e) => {
        if (field === 'title') {
            setTitle(e.target.value);
        } else if (field === 'description') {
            setDescription(e.target.value);
        }
    };

    const handleClose = () => {
        resetForm();
        setEditingCollection(null);
        setShowModal(false);
    };

    const handleDeleteCollectionModal = (collectionId) => {
        setCollectionToDelete(collectionId);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedTheme(predefinedThemes[0]);
    };

    const handleShare = (updatedSharedFriends) => {
        try {
            axios.put(API_URL_COLLECTIONS + "/" + collectionToShare._id.$oid + "/update_shared",
              {
                'shared_to': updatedSharedFriends.map(friend => friend._id)
              },
              { headers: AuthHeader() })
              .then(response => {
                collectionToShare.shared_to_ids = updatedSharedFriends.map(friend => friend._id);
              })
              .catch(error => {
                console.log(error);
              });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    };

    const handleEditCollection = (collection) => {
        const currentCollection = JSON.parse(collection.currentTarget.getAttribute('data-collection'));
        setEditingCollection(currentCollection);
        setShowModal(true);
    };

    const handleDeleteCollection = async (collectionId) => {
        axios
            .delete(API_URL_COLLECTIONS + collectionId, {
                headers: AuthHeader(),
            })
            .then(() => {
                loadCollections();
                setShowDeleteModal(false);
            });
    };

    const handleCreateOrUpdateCollection = () => {
        if (editingCollection === null) {
            axios
                .post(
                    API_URL_COLLECTIONS,
                    {
                        collection: {
                            title: title,
                            description: description,
                            textColor: selectedTheme.textColor,
                            bgColor: selectedTheme.bgColor,
                            borderColor: selectedTheme.borderColor
                        },
                    },
                    {
                        headers: {
                            ...AuthHeader(),
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    },
                )
                .then(() => {
                    handleClose();
                    loadCollections();
                    //notification(3, friendToAdd.username);
                });
        } else {
            axios
                .put(
                    API_URL_COLLECTIONS + editingCollection._id.$oid,
                    {
                        collection: {
                            title: title ? title : editingCollection.title,
                            description: description ? description : editingCollection.description,
                            textColor: selectedTheme.textColor,
                            bgColor: selectedTheme.bgColor,
                            borderColor: selectedTheme.borderColor
                        },
                    },
                    {
                        headers: {
                            ...AuthHeader(),
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    },
                )
                .then(() => {
                    handleClose();
                    loadCollections();
                    //notification(3, friendToAdd.username);
                });
        }
    };

    // NOTE HANDLING
    const handleNoteClick = (note) => {
        setCurrentEditingNote(note);
        setIsEditModalOpen(true);
        setSelectedNote(note);
        setShowNoteModal(true);
    };

    const handleDeleteNoteModal = (note) => {
        setNoteToDelete(note);
        setShowDeleteNoteModal(true);
    };

    // Función para eliminar la nota
    const handleDeleteNote = (note) => {

        axios
            .delete(API_URL_NOTES + note._id.$oid, {
                headers: AuthHeader(),
            })
            .then(() => {
                setShowDeleteNoteModal(false);
                removeNoteFromCollection(note._id.$oid, note.parent_collection_id.$oid);
            });
        // Cierra el modal después de eliminar la nota
        setShowNoteModal(false);
    };

    const removeNoteFromCollection = (noteId, collectionId) => {
        console.log(noteId);
        console.log(collectionId);
        setCollectionNotes((prevCollectionNotes) => {
            const updatedCollectionNotes = { ...prevCollectionNotes };
            updatedCollectionNotes[collectionId] = updatedCollectionNotes[collectionId].filter(
                (note) => note._id.$oid !== noteId
            );

            return updatedCollectionNotes;
        });
    };

    const removeNoteFromCollectionDb = (noteId, collectionId) => {
        axios
            .put(API_URL_COLLECTIONS + collectionId + '/remove_note', {
                note_id: noteId
            }, {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
            .then(() => {
                removeNoteFromCollection(noteId, collectionId);
            }
            );
    };


    const handleNoteInputChange = (field) => (e) => {
        if (field === 'noteTitle') {
            setNoteTitle(e.target.value);
        } else if (field === 'noteContent') {
            setNoteContent(e.target.value);
        }
    };

    const resetNoteForm = () => {
        setNoteTitle('');
        setNoteContent('');
    };

    const handleCloseNote = () => {
        resetNoteForm();
        setEditingNote(null);
        setShowNoteModal(false);
    };

    const updateNoteInCollection = (updatedNote, collectionId) => {
        setCollectionNotes((prevCollectionNotes) => {
            const updatedCollectionNotes = { ...prevCollectionNotes };

            const noteIndex = updatedCollectionNotes[collectionId].findIndex(
                (note) => note._id.$oid === updatedNote._id.$oid
            );

            if (noteIndex !== -1) {
                updatedCollectionNotes[collectionId][noteIndex] = updatedNote;
            }

            return updatedCollectionNotes;
        });
    };


    // Función para guardar los cambios en la nota
    const handleSaveChanges = (note) => {
        axios
            .put(
                API_URL_NOTES + note._id.$oid,
                {
                    "note": {
                        title: noteTitle ? noteTitle : note.title,
                        content: noteContent ? noteContent : quillInstance.editor.delta
                    },
                },
                {
                    headers: {
                        ...AuthHeader(),
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            )
            .then((response) => {
                handleCloseNote();
                updateNoteInCollection(response.data, note.parent_collection_id.$oid);
                //loadCollections();
                //notification(3, friendToAdd.username);
            });

        // Cierra el modal después de guardar los cambios
        setShowModal(false);
    };

    return (
        <>
            {isLoggedIn ? (
                <Container fluid="xxl">
                    <FriendsSidebar />
                    <Row>
                        {collections.map((collection) => (
                            <Col key={collection.id} style={{ maxWidth: "20rem" }} >
                                <Card className="card-container"
                                    style={{
                                        width: '18rem',
                                        height: '23rem',
                                        borderWidth: '2px',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = collection.bgColor || '#0d6efd';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.175)";
                                    }}
                                >
                                    <Card.Body
                                        className="form-control font-weight-bold"
                                        style={{
                                            height: '130px',
                                            borderColor: collection.bgColor || '#0d6efd',
                                            borderWidth: '2px',
                                            backgroundColor: collection.bgColor || '#b3d2ff',
                                            color: collection.color || 'black',
                                        }}
                                    >
                                        <Card.Title>{collection.title}</Card.Title>
                                        <Card.Text>{collection.description}</Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush list-group-container notes-list scrollbar-primary"
                                        style={{
                                            height: 'calc(100% - 130px - 1.5rem)',
                                            paddingBottom: '1.5rem',
                                        }}>
                                        {collectionNotes[collection._id.$oid] ? (
                                            collectionNotes[collection._id.$oid].map((note, index) => (
                                                <NoteListItem
                                                    key={note._id.$oid}
                                                    note={note}
                                                    collection={collection}
                                                    index={index}
                                                    handleNoteClick={handleNoteClick}
                                                    removeNoteFromCollection={removeNoteFromCollectionDb}
                                                />
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: '#e2e3e5', color: '#6c757d', fontStyle: 'italic', height: '100%' }}>
                                                Esta colección está vacía
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                    <Card.Body className="card-buttons d-flex justify-content-center align-items-center">
                                        <BiShareAlt className="custom-icon" onClick={() => handleShareModal(collection)} size="1.5rem" cursor="pointer" />
                                        <BiEdit className="custom-icon" data-collection={JSON.stringify(collection)} onClick={handleEditCollection} size="1.5rem" cursor="pointer" />
                                        <BiTrash className="custom-icon" onClick={() => handleDeleteCollectionModal(collection._id.$oid)} size="1.5rem" cursor="pointer" />
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Modal para compartir la nota*/}

                    <ShareNoteModal
                        show={showShareModal}
                        onHide={() => setShowShareModal(false)}
                        friends={friends}
                        sharedFriends={sharedFriends}
                        updateSharedItem={handleShare}
                        itemType='colección'
                    />

                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{editingCollection ? "Editar colección" : "Crear nueva colección"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="formBasicTitle">
                                                <Form.Label>Título</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Introduce el título"
                                                    value={title ? title : (editingCollection ? editingCollection.title : 'Título')}
                                                    onChange={handleInputChange('title')}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formBasicDescription">
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Introduce la descripción"
                                                    value={description ? description : (editingCollection ? editingCollection.description : 'Descripción')}
                                                    onChange={handleInputChange('description')}
                                                />
                                            </Form.Group>

                                            <Row>
                                                <Col>
                                                    <Form.Label>Seleccione un tema:</Form.Label>
                                                    <div>
                                                        {predefinedThemes.map((theme, index) => (
                                                            <Button
                                                                key={index}
                                                                style={{
                                                                    width: '95px',
                                                                    backgroundColor: theme.bgColor,
                                                                    borderColor: theme.borderColor,
                                                                    color: theme.textColor,
                                                                    marginRight: '5px',
                                                                    marginBottom: '5px',
                                                                }}
                                                                onClick={() => handleThemeChange(index)}
                                                            >
                                                                Tema {index + 1}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                    <Col md={6}>
                                        <Card style={{ width: '18rem', marginLeft: '10px' }}>
                                            <Card.Body
                                                className="form-control font-weight-bold"
                                                style={{
                                                    height: '150px',
                                                    borderColor: selectedTheme.borderColor,
                                                    //borderColor: selectedTheme.borderColor,
                                                    borderWidth: '2px',
                                                    backgroundColor: selectedTheme.bgColor,
                                                    //backgroundColor: selectedTheme.bgColor,
                                                    color: selectedTheme.textColor,
                                                }}
                                            >
                                                <Card.Title>{title ? title : (editingCollection ? editingCollection.title : 'Título')}</Card.Title>
                                                <Card.Text>{description ? description : (editingCollection ? editingCollection.description : 'Descripción')}</Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>Nota 1</ListGroup.Item>
                                                <ListGroup.Item>Nota 2</ListGroup.Item>
                                                <ListGroup.Item>Nota 3</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Body>
                                                <Button className="btn btn-outline-success" style={{ marginRight: '40px' }} disabled>
                                                    Compartir
                                                </Button>
                                                <Button className="btn btn-outline-primary mr-2" disabled>
                                                    Editar
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleCreateOrUpdateCollection}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que deseas eliminar esta colección?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteCollection(collectionToDelete)}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal dialogClassName="custom-modal-dialog" show={showNoteModal} onHide={() => setShowNoteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar nota</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="noteTitle"
                                        placeholder="Título de la nota"
                                        defaultValue={selectedNote?.title || ''}
                                        onChange={handleNoteInputChange('noteTitle')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contenido</Form.Label>
                                    <QuillEditor
                                        onEditorReady={handleEditorReady}
                                        getCurrentContent={getCurrentEditingNoteContent}
                                    />
                                    {/*
                            <Form.Control
                            className="scrollbar-primary"
                            as="textarea"
                            rows={20}
                            id="noteContent"
                            placeholder="Contenido de la nota"
                            defaultValue={selectedNote?.content || ''}
                            onChange={handleNoteInputChange('noteContent')}
                            />
                        */}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowNoteModal(false)}>
                                Cerrar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteNoteModal(selectedNote)}>
                                Eliminar
                            </Button>
                            <Button variant="success" onClick={() => handleSaveChanges(selectedNote)}>
                                Guardar cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteNoteModal} onHide={() => setShowDeleteNoteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Estás seguro de que deseas eliminar esta colección?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteNoteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteNote(noteToDelete)}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Button className="floating-button" onClick={handleNewCollection}>
                        <FaPlus />
                    </Button>
                </Container>
            ) : (
                // Renderiza un mensaje de error o redirecciona al usuario
                <h1>
                    No tienes permiso para ver esta página, por favor inicia sesión.
                </h1>
            )}
        </>
    );
}

export default Collections;