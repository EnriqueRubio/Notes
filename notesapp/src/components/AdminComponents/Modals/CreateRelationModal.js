import React, { useEffect, useState } from 'react';
import { Dropdown, Col, Row, Modal, Button, Form } from 'react-bootstrap';

const errorStyle = {
    color: "red",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
};

const CreateRelationModal = ({ show, handleClose, handleRelationCreate, relations, users }) => {
    const [localUsers, setLocalUsers] = useState(users);
    const [status, setStatus] = useState('pending');
    const [sender_id, setSender_id] = useState('');
    const [receiver_id, setReceiver_id] = useState('');
    const [senderSelected, setSenderSelected] = useState(false);
    const [receiverSelected, setReceiverSelected] = useState(false);
    const [error, setError] = useState('');

    const relationExists = () => {
        return relations.some(
            (relation) =>
                (relation.sender_id.$oid === sender_id.id &&
                    relation.receiver_id.$oid === receiver_id.id) ||
                (relation.sender_id.$oid === receiver_id.id &&
                    relation.receiver_id.$oid === sender_id.id)
        );
    };

    const handleSenderSelect = (user) => {
        setSender_id({ id: user._id.$oid, username: user.username });
        setSenderSelected(true);
    };

    const handleReceiverSelect = (user) => {
        setReceiver_id({ id: user._id.$oid, username: user.username });
        setReceiverSelected(true);
    };

    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    const handleSubmit = () => {
        if (
            sender_id.id &&
            receiver_id.id &&
            sender_id.id !== receiver_id.id &&
            !relationExists()
        ) {
            handleRelationCreate(status, sender_id.id, receiver_id.id);
            setStatus('');
            setSender_id({ id: '', username: '' });
            setReceiver_id({ id: '', username: '' });
            handleClose();
        } else {
            // Muestra un mensaje de error o realiza otra acción si no se cumplen las condiciones
            console.log("Emisor y receptor deben ser diferentes y no tener una relación existente");
            setError("Emisor y receptor deben ser diferentes y no tener una relación existente");
        }
    };


    const required = (value) => {
        if (!value) {
            return (
                <div className='alert alert-danger' role='alert'>
                    This field is required!
                </div>
            );
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear nueva amistad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div style={errorStyle}>{error}</div>}
                <Form>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <Form.Label>Estado</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-shared-users">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setStatus('pending')}>Pendiente</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setStatus('accepted')}>Aceptada</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <Form.Label>Emisor</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-shared-users">
                                        {sender_id.username ? sender_id.username : 'Elegir emisor'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ maxHeight: '200px', overflow: 'auto' }}>
                                        {localUsers?.map((user) => (
                                            !receiverSelected || receiver_id.id !== user._id.$oid ? (
                                                <Dropdown.Item
                                                    key={user._id.$oid}
                                                    active={user._id.$oid === sender_id.id}
                                                    onClick={() => handleSenderSelect(user)}
                                                >
                                                    {user.username}
                                                </Dropdown.Item>
                                            ) : null
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <Form.Label>Receptor</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-shared-users">
                                        {receiver_id.username ? receiver_id.username : 'Elegir receptor'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ maxHeight: '200px', overflow: 'auto' }}>
                                        {localUsers?.map((user) => (
                                            !senderSelected || sender_id.id !== user._id.$oid ? (
                                                <Dropdown.Item
                                                    key={user._id.$oid}
                                                    active={user._id.$oid === receiver_id.id}
                                                    onClick={() => handleReceiverSelect(user)}
                                                >
                                                    {user.username}
                                                </Dropdown.Item>
                                            ) : null
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateRelationModal;
