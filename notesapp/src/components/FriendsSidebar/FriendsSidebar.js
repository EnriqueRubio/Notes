import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, ListGroup, Form, Button, Offcanvas, Accordion } from 'react-bootstrap';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { BsTrash, BsFillPlusSquareFill, BsXSquare, BsCheckSquare } from 'react-icons/bs';
import { Toast } from 'bootstrap'
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import './FriendsSidebar.css';

const API_URL_FRIENDS = "http://localhost:3000/api/friends";
const API_URL_USERS_SEARCH = "http://localhost:3000/api/users/search";

let friend_data;
let notification_title;
let notification_content;

function dateFormat(fecha, formato) {
    const map = {
        dd: fecha.getDate(),
        mm: fecha.getMonth() + 1,
        yy: fecha.getFullYear().toString().slice(-2),
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
}

function notification(action, user) {
    switch (action) {
        case 1:
            notification_title = "Amigo Añadido"
            notification_content = user + " y tú ahora sois amigos."
            break;
        case 2:
            notification_title = "Amigo elminado"
            notification_content = "Ya no eres amigo de " + user + "."
            break;
        case 3:
            notification_title = "Solicitud de amistad enviada"
            notification_content = "La solicitud de amistad ha sido enviada a " + user + "."
            break;
        case 4:
            notification_title = "Solicitud de amistad cancelada"
            notification_content = "La solicitud de amistad a " + user + " ha sido cancelada."
            break;
        case 5:
            notification_title = "Solicitud de amistad rechazada"
            notification_content = "La solicitud de amistad de " + user + " ha sido rechazada."
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

const FriendsSidebar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [friends, setFriends] = useState([]);
    const [iFriends, setIFriends] = useState([]);
    const [oFriends, setOFriends] = useState([]);
    const [ShowDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [show, setShow] = useState(false);
    const [showDeleteButtonFriend, setShowDeleteButtonFriend] = useState(null);
    const [showDeleteButtonIFriend, setShowDeleteButtonIFriend] = useState(null);
    const [showDeleteButtonOFriend, setShowDeleteButtonOFriend] = useState(null);
    const [showAddButtonSearch, setShowAddButtonSearch] = useState(null);


    const [showAddFriendButton, setShowAddFriendButton] = useState(null);

    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const reloadData = async () => {
        try {
            axios.get(API_URL_FRIENDS, { headers: AuthHeader() }).then(response => {
                friend_data = response.data;
                setFriends(friend_data);
                let friends_array = [];
                let iFriends_array = [];
                let oFriends_array = [];
                for (let i = 0; i < friend_data.length; i++) {
                    if (friend_data[i].status == "accepted") {
                        friends_array.push(friend_data[i]);
                    } else if (friend_data[i].status == "received") {
                        iFriends_array.push(friend_data[i]);
                    } else if (friend_data[i].status == "sent") {
                        oFriends_array.push(friend_data[i]);
                    }
                }
                setFriends(friends_array);
                setIFriends(iFriends_array);
                setOFriends(oFriends_array);
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

    // Modal handlers
    // Show Delete Modal
    const handleShowDeleteModal = (friend) => {
        setSelectedFriend(friend);
        setShowDeleteModal(true);
    };
    // Close Delete Modal
    const handleCloseDeleteModal = () => {
        setSelectedFriend(null);
        setShowDeleteModal(false);
    };

    const handleDeleteFriend = (action, friendToRemove) => {

        axios.delete(`${API_URL_FRIENDS}/${friendToRemove.relationship_id.$oid}`,
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(() => {
                handleCloseDeleteModal();
                reloadData();
                switch (action) {
                    case "deleteFriend":
                        notification(2, friendToRemove.user.username);
                        break;
                    case "cancelFriendRequest":
                        notification(4, friendToRemove.user.username);
                        break;
                    case "rejectFriendRequest":
                        notification(5, friendToRemove.user.username);
                        break;
                }
            });
    };

    const handleAddFriend = (friendToAdd) => {
        axios.put(`${API_URL_FRIENDS}/${friendToAdd.relationship_id.$oid}`,
            {
                "friendship": {
                    "status": "accepted"
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
                reloadData();
                notification(1, friendToAdd.user.username);
            });
    }

    const handleSendFriendRequest = (friendToAdd) => {
        const user = AuthService.getCurrentUser();

        axios.post(`${API_URL_FRIENDS}`,
            {
                "friendship": {
                    "status": "pending",
                    "sender": user._id.$oid,
                    "receiver": friendToAdd._id.$oid
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
                handleSearch();
                reloadData();
                notification(3, friendToAdd.username);
            });
    }

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        // Realiza la búsqueda cuando searchValue cambie y no esté vacío
        if (searchValue) {
            handleSearch();
        } else {
            // Limpia los resultados de búsqueda cuando el input esté vacío
            setSearchResults([]);
        }
    }, [searchValue]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(API_URL_USERS_SEARCH, {
                headers: AuthHeader(),
                params: {
                    q: searchValue,
                },
            });

            if (response.data.message === "User does not exist.") {
                setSearchResults([]); // Actualiza el estado con un array vacío si no se encuentra el usuario
            } else {
                setSearchResults(response.data); // Asegura que searchResults sea un array
            }
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
        }
    };


    return (
        <>
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
            <Button variant="info" className="toggle-sidebar" onClick={handleShow}>

                <span className="vertical-text">Amigos</span>
            </Button>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Amigos</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>

                    <div className="border-bottom my-3"></div>

                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header><b>Amigos</b></Accordion.Header>
                            <Accordion.Body>
                                {friends.map((friend, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setShowDeleteButtonFriend(index)}
                                        onMouseLeave={() => setShowDeleteButtonFriend(null)}
                                    >
                                        {friend.user.username}
                                        {showDeleteButtonFriend === index && (
                                            <Button
                                                variant="danger"
                                                className="float-end"
                                                onClick={() => handleShowDeleteModal(friend)}
                                                size="sm"
                                            >
                                                <BsTrash />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header><b>Peticiones entrantes</b></Accordion.Header>
                            <Accordion.Body>
                                {iFriends.map((iFriend, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => {
                                            setShowDeleteButtonIFriend(index);
                                            setShowAddFriendButton(index);
                                        }}
                                        onMouseLeave={() => {
                                            setShowDeleteButtonIFriend(null);
                                            setShowAddFriendButton(null);
                                        }}
                                    >
                                        {iFriend.user.username}

                                        {showDeleteButtonIFriend === index && (
                                            <Button
                                                variant="warning"
                                                className="float-end"
                                                onClick={() => handleDeleteFriend("rejectFriendRequest", iFriend)}
                                                size="sm"
                                            >
                                                <BsXSquare />
                                            </Button>
                                        )}

                                        {showAddFriendButton === index && (
                                            <Button
                                                variant="primary"
                                                className="float-end"
                                                onClick={() => handleAddFriend(iFriend)}
                                                size="sm"
                                            >
                                                <BsCheckSquare />
                                            </Button>
                                        )}

                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header><b>Peticiones salientes</b></Accordion.Header>
                            <Accordion.Body>
                                {oFriends.map((oFriend, index) => (
                                    <div
                                        key={index}
                                        onMouseEnter={() => setShowDeleteButtonOFriend(index)}
                                        onMouseLeave={() => setShowDeleteButtonOFriend(null)}
                                    >
                                        {oFriend.user.username}
                                        {showDeleteButtonOFriend === index && (
                                            <Button
                                                variant="warning"
                                                className="float-end"
                                                onClick={() => handleDeleteFriend("cancelFriendRequest", oFriend)}
                                                size="sm"
                                            >
                                                <BsXSquare />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <div className="border-bottom my-3"></div>
                    <Form>
                        <Form.Group className="mb-3" controlId="userSearch">
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar usuarios"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                                <div className="input-group-append">
                                    <Button variant="primary" onClick={handleSearch}>
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </Form.Group>
                    </Form>

                    <div className="scrollbar scrollbar-primary" style={{ marginTop: '10px' }}>
                        <ListGroup>
                            {searchResults.length > 0 && (
                                <div className="search-results-container">
                                    {searchResults.map((user, index) => (
                                        <div
                                            key={index}
                                            onMouseEnter={() => setShowAddButtonSearch(index)}
                                            onMouseLeave={() => setShowAddButtonSearch(null)}
                                        >
                                            {user.username}
                                            {showAddButtonSearch === index && (
                                                <Button
                                                    variant="primary"
                                                    className="float-end"
                                                    onClick={() => handleSendFriendRequest(user)}
                                                    size="sm"
                                                >
                                                    <BsFillPlusSquareFill />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ListGroup>
                    </div>

                    <Modal show={ShowDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Eliminar amigo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Seguro que deseas eliminar a <b>{selectedFriend?.user.username}</b> de tus amigos?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteFriend("deleteFriend", selectedFriend)}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default FriendsSidebar;
