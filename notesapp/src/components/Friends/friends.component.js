import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ListGroup, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap'
import "./friends.component.css"
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import AuthService from '../../services/auth.service';
import AuthHeader from "../../services/auth-header";

const API_URL_FRIENDS = "http://localhost:3000/api/friends";

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

const Friends = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [friends, setFriends] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const navigate = useNavigate();
  
    const reloadData = async () => {
      try {
        axios.get(API_URL_FRIENDS, { headers: AuthHeader() }).then(response => {
            friend_data = response.data;
            setFriends(response.data);
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

    const handleShowModal = (friend) => {
        setSelectedFriend(friend);
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setSelectedFriend(null);
        setShowModal(false);
      };
    
      const handleRemoveFriend = (friendToRemove) => {
        // Aquí puedes implementar la lógica para eliminar el amigo.
        console.log(`Eliminar amigo: ${friendToRemove.username}`);
        handleCloseModal();
      };

    const handlerAddFriend = function () {
        const user = AuthService.getCurrentUser();
        const current_date = new Date();
        let creation_date = dateFormat(current_date, 'yy-mm-dd');
        let friend_id = "a";
    
        axios.post(`${API_URL_FRIENDS}`, 
            {
            "friendship": {
                "sender": user.id,
                "receiver": friend_id,
                "creation_date": creation_date
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

      return (
        <>
          <ListGroup>
            {friends.map((friend) => (
              <ListGroup.Item
                key={friend.id}
                className="d-flex justify-content-between align-items-center"
                onMouseOver={(e) => (e.currentTarget.style.cursor = 'pointer')}
                onClick={() => handleShowModal(friend)}
              >
                {friend.username}
                <Button
                  variant="danger"
                  size="sm"
                  className="d-none"
                  onMouseEnter={(e) => e.target.classList.remove('d-none')}
                  onMouseLeave={(e) => e.target.classList.add('d-none')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFriend(friend);
                  }}
                >
                  Eliminar amigo
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {selectedFriend && (
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Detalles de {selectedFriend.username}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Nombre:</strong> {selectedFriend.username}</p>
                <p><strong>Email:</strong> {selectedFriend.email}</p>
                <p><strong>Fecha de inicio de amistad:</strong> {selectedFriend.friendshipStartDate}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => handleRemoveFriend(selectedFriend)}>
                  Eliminar amigo
                </Button>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      );

};


export default Friends;
