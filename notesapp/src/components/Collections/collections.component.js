import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { BsPersonFill } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { BiShareAlt, BiEdit, BiTrash } from 'react-icons/bi';
import { Toast } from 'bootstrap'
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import FriendsSidebar from '../FriendsSidebar/FriendsSidebar';
import QuillEditor from '../Editor/editor.component';
import ShareNoteModal from '../ShareNoteModal/ShareNoteModal';
import Toolbar from '../Toolbar/collections_toolbar.component';

const BASE_API_URL = "http://localhost:3000/api/";
const API_URL_COLLECTIONS = BASE_API_URL + "collections/";
const API_URL_NOTES = BASE_API_URL + "notes/";
const API_URL_FRIENDS = BASE_API_URL + 'friends/only_accepted';

const Collections = () => {
    const currentUser = AuthService.getCurrentUser();
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
    // Filtering and sorting states
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedDate, setSelectedDate] = useState('ever');
    const [sortCriteria, setSortCriteria] = useState('created');
    const [sortAscending, setSortAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
    const handleNoteClick = (note, collection) => {
        setCurrentEditingNote(note);
        setIsEditModalOpen(true);
        setSelectedNote(note);
        setShowNoteModal(true);
        setEditingCollection(collection);
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

    const updateNoteInCollection = (updatedNote) => {
        const collectionId = editingCollection._id.$oid;
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
                updateNoteInCollection(response.data);
                //loadCollections();
                //notification(3, friendToAdd.username);
            });

        // Cierra el modal después de guardar los cambios
        setShowModal(false);
    };

    // Filtering and sorting functions

    const applyFilters = () => {
        let filteredCollections = collections;

        if (selectedFriends.length > 0) {
            // Aplica el filtro de amigos
            filteredCollections = filteredCollections.filter((note) => {
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
            filteredCollections = filteredCollections.filter((note) => {
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

        setFilteredCollections(filteredCollections);
    };

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCollections(collections);
        } else {
            const searchLower = searchTerm.toLowerCase();
            setFilteredCollections(
                collections.filter((collection) =>
                    collection.title.toLowerCase().includes(searchLower)
                )
            );
        }
    }, [searchTerm, collections]);

    const sortCollections = () => {
        const sortedCollections = [...filteredCollections];

        sortedCollections.sort((a, b) => {
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
        setFilteredCollections(sortedCollections);
    };

    useEffect(() => {
        applyFilters();
    }, [selectedFriends, selectedDate]);

    useEffect(() => {
        sortCollections();
    }, [sortCriteria, sortAscending]);

    return (
        <>
            {isLoggedIn ? (
                <Container fluid="xxl">
                    <FriendsSidebar />

                    <Toolbar
                        setSelectedFriends={setSelectedFriends}
                        setSelectedDate={setSelectedDate}
                        setSortCriteria={setSortCriteria}
                        setSortAscending={setSortAscending}
                        setSearchTerm={setSearchTerm}
                        sortAscending={sortAscending}
                        friends={friends}
                        sortCriteria={sortCriteria}
                        selectedDate={selectedDate}
                        selectedFriends={selectedFriends}
                        searchTerm={searchTerm}
                    />

                    <Row>
                        {filteredCollections.map((collection) => (
                            <Col key={collection.id} style={{ maxWidth: "20rem" }} >
                                <Card className="card-container custom-card"
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
                                    {collection.author_id.$oid !== currentUser._id.$oid && (
                                        <div class="shared-collection-icon">
                                            <div class="shared-collection-icon-inner">
                                                <BsPersonFill color="white" size="1.5rem" />
                                            </div>
                                        </div>
                                    )}
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
                                                    handleNoteClick={handleNoteClick}
                                                    removeNoteFromCollection={removeNoteFromCollectionDb}
                                                />
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: '#e2e3e5', color: '#6c757d', fontStyle: 'italic', height: '100%' }}>
                                                This collection is empty
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
                        item={collectionToShare}
                        itemType='collection'
                    />

                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{editingCollection ? "Edit collection" : "Create collection"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col md={6}>
                                        <Form>
                                            <Form.Group controlId="formBasicTitle">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter title"
                                                    value={title ? title : (editingCollection ? editingCollection.title : 'Title')}
                                                    onChange={handleInputChange('title')}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formBasicDescription">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter description"
                                                    value={description ? description : (editingCollection ? editingCollection.description : 'Description')}
                                                    onChange={handleInputChange('description')}
                                                />
                                            </Form.Group>

                                            <Row>
                                                <Col>
                                                    <Form.Label>Choose a theme:</Form.Label>
                                                    <div>
                                                        {predefinedThemes.map((theme, index) => (
                                                            <Button
                                                                key={index}
                                                                style={{
                                                                    width: '96px',
                                                                    backgroundColor: theme.bgColor,
                                                                    borderColor: theme.borderColor,
                                                                    color: theme.textColor,
                                                                    marginRight: '5px',
                                                                    marginBottom: '5px',
                                                                }}
                                                                onClick={() => handleThemeChange(index)}
                                                            >
                                                                Theme {index + 1}
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
                                                <Card.Title>{title ? title : (editingCollection ? editingCollection.title : 'Title')}</Card.Title>
                                                <Card.Text>{description ? description : (editingCollection ? editingCollection.description : 'Description')}</Card.Text>
                                            </Card.Body>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>Note 1</ListGroup.Item>
                                                <ListGroup.Item>Note 2</ListGroup.Item>
                                                <ListGroup.Item>Note 3</ListGroup.Item>
                                            </ListGroup>
                                            <Card.Body>
                                                <Button className="btn btn-outline-success" style={{ marginRight: '40px' }} disabled>
                                                    Share
                                                </Button>
                                                <Button className="btn btn-outline-primary mr-2" disabled>
                                                    Edit
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleCreateOrUpdateCollection}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this collection?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteCollection(collectionToDelete)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal dialogClassName="custom-modal-dialog" show={showNoteModal} onHide={() => setShowNoteModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit note</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="noteTitle"
                                        placeholder="Note title"
                                        defaultValue={selectedNote?.title || ''}
                                        onChange={handleNoteInputChange('noteTitle')}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Content</Form.Label>
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
                                Close
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteNoteModal(selectedNote)}>
                                Delete
                            </Button>
                            <Button variant="success" onClick={() => handleSaveChanges(selectedNote)}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showDeleteNoteModal} onHide={() => setShowDeleteNoteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to remove this note?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteNoteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteNote(noteToDelete)}>
                                Delete
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
                    You have no permission to access this page.
                </h1>
            )}
        </>
    );
}

export default Collections;