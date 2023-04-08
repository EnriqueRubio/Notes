import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col, Form, ListGroup } from 'react-bootstrap';
import './ShareNoteModal.css';
import AuthService from '../../services/auth.service';

const API_URL = "http://localhost:3000"

const ShareNoteModal = ({ show, onHide, friends, sharedFriends, updateSharedItem, item, itemType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [localFriends, setLocalFriends] = useState(friends);
    const [localSharedFriends, setLocalSharedFriends] = useState(sharedFriends);
    const user = AuthService.getCurrentUser();
    let author = null;

    if (item) {
        author = friends.find((friend) => friend._id.$oid === item.author_id.$oid);
    }

    useEffect(() => {
        setLocalFriends(friends);
        setLocalSharedFriends(sharedFriends);
    }, [friends, sharedFriends]);

    const filteredFriends = localFriends
        .filter((friend) => !localSharedFriends.some((sharedFriend) => sharedFriend._id.$oid === friend._id.$oid))
        .filter((friend) => friend.username.toLowerCase().includes(searchTerm.toLowerCase()));


    const handleAccept = () => {
        updateSharedItem(localSharedFriends);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>

            <Modal.Header closeButton>
                <Modal.Title>Compartir {itemType} "<strong>{item ? item.title : ""}</strong>"</Modal.Title>
            </Modal.Header>

            {item ? (
                item.author_id.$oid !== user._id.$oid ? (
                    <div>
                        <Modal.Body>
                            <Row className="mt-3">
                                <h5 className="shared-by-message">
                                    Compartido contigo por{" "}
                                    {author ? author.username : "Nombre del amigo no disponible"}
                                </h5>
                            </Row>
                            <Row className="mt-3">
                                <div style={{ textAlign: "center" }} >
                                    Sólo {author.username} puede compartir esta {itemType}.
                                </div>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={onHide}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </div>
                ) : (
                    <div>
                        <Modal.Body>
                            <Form.Control
                                type="text"
                                placeholder="Buscar amigos"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <Row className="mt-3">
                                <Col style={{ minWidth: '10rem', maxWidth: '15rem' }}>
                                    <h5>Amigos</h5>
                                    <div style={{ minHeight: '15rem', maxHeight: '25rem', overflowY: 'auto' }}>
                                        <ListGroup className="scrollbar-primary">
                                            {filteredFriends.map((friend) => {
                                                // Verificar si el amigo es el autor y si el autor es diferente del usuario actual
                                                if (author && author._id.$oid === friend._id.$oid && author._id.$oid !== user.id) {
                                                    return null;
                                                }

                                                return (
                                                    <ListGroup.Item
                                                        key={friend._id.$oid}
                                                        className="list-group-item-hover"
                                                        onClick={() => {
                                                            setLocalFriends(localFriends.filter((f) => f._id.$oid !== friend._id.$oid));
                                                            setLocalSharedFriends([...localSharedFriends, friend]);
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <img
                                                            src={friend.avatar.url ? API_URL + friend.avatar.url : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg'}
                                                            alt={friend.username}
                                                            style={{ width: '30px', height: '30px', borderRadius: '50%', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', marginRight: '10px', marginTop: '5px', marginBottom: '5px' }}
                                                        />
                                                        {friend.username}
                                                    </ListGroup.Item>
                                                );
                                            })}
                                        </ListGroup>
                                    </div>
                                </Col>
                                <Col>
                                    <h5>Compartido con</h5>
                                    <div style={{ minHeight: '15rem', maxHeight: '25rem', overflowY: 'auto' }}>
                                        <ListGroup>
                                            {localSharedFriends.map((friend) => (
                                                <ListGroup.Item
                                                    key={friend._id.$oid}
                                                    className="list-group-item-hover"
                                                    onClick={() => {
                                                        setLocalSharedFriends(localSharedFriends.filter((f) => f._id.$oid !== friend._id.$oid));
                                                        setLocalFriends([...localFriends, friend]);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <img
                                                        src={friend.avatar.url ? API_URL + friend.avatar.url : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg'}
                                                        alt={friend.username}
                                                        style={{ width: '30px', height: '30px', borderRadius: '50%', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', marginRight: '10px', marginTop: '5px', marginBottom: '5px' }}
                                                    />
                                                    {friend.username}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={() => handleAccept()}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </div>
                )
            ) : (
                ""
            )}
        </Modal>
    );
};

export default ShareNoteModal;