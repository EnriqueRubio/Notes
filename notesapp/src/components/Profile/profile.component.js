import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import { FaUser, FaCrown } from 'react-icons/fa';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";
import './profile.component.css';
import FriendsSidebar from '../FriendsSidebar/FriendsSidebar';

const BASE_URL = "http://localhost:3000";
const API_URL = "http://localhost:3000/api/users/";
const API_URL_FRIENDS = "http://localhost:3000/api/friends/";


const UserProfile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user? BASE_URL + user.avatar.url : "");
  const [friends, setFriends] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [number_of_notes, setNumber_of_notes] = useState(0);
  const [number_of_collections, setNumber_of_collections] = useState(0);

  // Get user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(API_URL + currentUser._id.$oid, { headers: AuthHeader() })
          .catch((error) => {
            console.error("Error retrieving user data:", error);
          });
        setUser(response.data);
        setAvatarUrl(BASE_URL + response.data.avatar.url);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Get friends data from the backend
  useEffect(() => {
    try {
      axios.get(API_URL_FRIENDS, { headers: AuthHeader() }).then(response => {
        let friend_data = response.data;
        let friends_array = [];
        for (let i = 0; i < friend_data.length; i++) {
            if(friend_data[i].status == "accepted"){
                friends_array.push(friend_data[i]);
            }
        }
        setFriends(friends_array);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  }, []);

  // Get number of notes and collections from the backend
  useEffect(() => {
    fetchNoteData();
    fetchCollectionData();
  }, []);

  const fetchNoteData = async () => {
    try {
      const response = await axios.get(API_URL + currentUser._id.$oid + "/number_of_notes", { headers: AuthHeader() })
        .catch((error) => {
          console.error("Error retrieving user data:", error);
        });
      setNumber_of_notes(response.data.number_of_notes);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const fetchCollectionData = async () => {
    try {
      const response = await axios.get(API_URL + currentUser._id.$oid + "/number_of_collections", { headers: AuthHeader() })
        .catch((error) => {
          console.error("Error retrieving user data:", error);
        });
      setNumber_of_collections(response.data.number_of_collections);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  const AvatarOverlay = () => (
    <div className="avatar-overlay rounded-circle">
      <MdEdit style={{ color: "white" }} size="2rem"/>
    </div>
  );

  const handleEditClick = () => {
    setIsEditing(!isEditing);

    usernameRef.current.value = user.username;
    emailRef.current.value = user.email;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedValues = {};
  
    if (usernameRef.current.value) {
      updatedValues.username = usernameRef.current.value;
    }
  
    if (emailRef.current.value) {
      updatedValues.email = emailRef.current.value;
    }
  
    if (passwordRef.current.value) {
      updatedValues.password = passwordRef.current.value;
    }
  
    console.log("Valores actualizados:", updatedValues);
  
    axios.put(`${API_URL}${currentUser._id.$oid}`, 
      updatedValues,
      {
      headers: {
          ...AuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
      }
    ).then((response) => {
        //reloadData();
        console.log(response.data)
        //notification(1, friendToAdd.user.username);
    });

    setIsEditing(false);
  };
  
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    axios.patch(API_URL + AuthService.getCurrentUser()._id.$oid + "/avatar", formData, {
      headers: {
        ...AuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        //console.log(response.data.avatar_url);
        setAvatarUrl(BASE_URL + response.data.avatar_url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  function UserRole({ isAdmin }) {
    return (
      <div
        className="p-2 rounded"
        style={{
          backgroundColor: isAdmin ? 'rgba(255, 169, 64, 0.2)' : 'rgba(13, 110, 253, 0.2)',
          borderColor: isAdmin ? '#FFA940' : '#0d6efd',
          borderWidth: '1px',
          borderStyle: 'solid',
          color: isAdmin ? '#FFA940' : '#0d6efd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isAdmin ? <FaCrown style={{marginRight: '5px'}} /> : <FaUser style={{marginRight: '5px'}} />}
        {isAdmin ? 'Administrador' : 'Usuario'}
      </div>
    );
  }

  return (
    <Container>
      <FriendsSidebar />
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header className="text-center">
              <h3>Información del perfil</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Avatar */}
                <Form.Group controlId="avatar" className="d-flex justify-content-center">
                  <div className="avatar-container" onClick={() => fileInputRef.current.click()}>
                    <img
                      src={user ? (user.avatar.url ? avatarUrl : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg') : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg' }
                      alt="avatar"
                      className="rounded-circle mb-2 avatar-image"
                    />
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="avatar-tooltip">Click para cambiar avatar</Tooltip>}
                      trigger={['hover', 'focus']}
                    >
                      {({ ref, ...triggerHandler }) => (
                        <AvatarOverlay ref={ref} {...triggerHandler} />
                      )}
                    </OverlayTrigger>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileInputChange}
                    />

                </Form.Group>
                {/* Nombre de usuario */}
                <Form.Group controlId="username">
                  <Form.Label className="text-center" style={{ width: '100%', textAlign: 'center' }}>Nombre de usuario</Form.Label>
                  <Form.Control className="text-center" type="text" placeholder={user ? user.username : 'Cargando...'} disabled={!isEditing} ref={usernameRef} />
                </Form.Group>

                {/* Email */}
                <Form.Group controlId="email">
                  <Form.Label className="text-center" style={{ width: '100%', textAlign: 'center' }}>Email</Form.Label>
                  <Form.Control className="text-center" type="email" placeholder={user ? user.email : 'Cargando...'} disabled={!isEditing} ref={emailRef} />
                </Form.Group>

                {/* Contraseña */}
                {isEditing && (
                  <Form.Group controlId="password">
                    <Form.Label className="text-center" style={{ width: '100%', textAlign: 'center' }}>Contraseña</Form.Label>
                    <Form.Control className="text-center" type="password" placeholder="Contraseña" ref={passwordRef} />
                  </Form.Group>
                )}

                {/* Rol */}
                <Form.Group controlId="rol">
                  <Form.Label className="text-center" style={{ width: '100%', textAlign: 'center' }}>Rol</Form.Label>
                  <Form.Control
                    as="select"
                    value={user ? (user.admin? 'Administrador' : 'Usuario') : "cargando"}
                    disabled={true}
                  >
                    <option className="text-center">Usuario</option>
                    <option className="text-center">Administrador</option>
                  </Form.Control>
                </Form.Group>

                <div className="d-flex justify-content-center mt-2">
                  <Button variant="primary" onClick={handleEditClick} style={{ marginRight: '8px' }}> 
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                  {isEditing && (
                    <Button type="submit" variant="success">
                      Guardar
                    </Button>
                  )}
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
        <Card className="mb-3" style={{ height: '260px' }}>
          <Card.Header className="text-center">
            <h3>Más información</h3>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col className="d-flex flex-column align-items-center justify-content-center">
                <p><strong>Usuario desde</strong> {user ? formatDate(user.created_at) : 'Cargando...'}</p>
                <p style={{marginTop: '50px'}}><strong>Nº de notas:</strong> {number_of_notes ? number_of_notes : '0'}</p>
              </Col>
              <Col className="d-flex flex-column align-items-center justify-content-center">
                <UserRole isAdmin={user ? user.admin : false} />
                <p style={{marginTop: '50px'}} ><strong>Nº de colecciones:</strong> {number_of_collections ? number_of_collections : '0'}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

          <Card className="mt-1">
            <Card.Header className="text-center">
              <h3>Amigos ({friends.length})</h3>
            </Card.Header>
            <Card.Body>
              <ListGroup style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {/* Aquí puedes mapear los amigos del usuario y mostrar cada uno como un elemento de la lista */}
                {friends.map((friend) => (
                  <ListGroup.Item className="text-center">{friend.user.username} ({friend.user.email})</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
