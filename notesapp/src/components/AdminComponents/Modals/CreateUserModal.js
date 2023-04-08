import React, { useState } from 'react';
import { Col, Row, Modal, Button, Form } from 'react-bootstrap';

const CreateUserModal = ({ show, handleClose, handleUserCreate }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const [message, setMessage] = useState('');


    const handleSubmit = () => {
        handleUserCreate(email, username, password, admin);
        setEmail('');
        setUsername('');
        setPassword('');
        setAdmin(false);
        handleClose();
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

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear nuevo usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            className='form-control'
                            placeholder="Email"
                            value={email}
                            name='email'
                            onChange={(e) => setEmail(e.target.value)}
                            validations={[required]}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    className='form-control'
                                    value={username}
                                    name='username'
                                    placeholder="Nombre de usuario"
                                    onChange={(e) => setUsername(e.target.value)}
                                    validations={[required]}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Admin</Form.Label>
                                <Form.Check
                                    type='switch'
                                    name='admin'
                                    value={admin}
                                    onChange={(e) => setAdmin(e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type='password'
                            name='password'
                            placeholder='********'
                            value={password}
                            onChange={onChangePassword}
                            validations={[required]}
                        />
                    </Form.Group>
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
            {message && (
                <div className='form-group'>
                    <div className='alert alert-danger' role='alert'>
                        {message}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CreateUserModal;
