import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import { OverlayTrigger, Tooltip, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import AuthService from '../../../services/auth.service';
import AuthHeader from "../../../services/auth-header";

const BASE_URL = "http://localhost:3000";
const API_URL_USERS = BASE_URL + "/api/users/";

const EditUserModal = ({ show, handleClose, handleUserUpdate, handleUserDelete, user }) => {
    const [email, setEmail] = useState(user ? user.email : '');
    const [username, setUsername] = useState(user ? user.username : '');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(user ? user.admin : false);
    const [avatarUrl, setAvatarUrl] = useState(user ? BASE_URL + user.avatar.url : "");
    const [message, setMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setAdmin(user.admin);
            setAvatarUrl(BASE_URL + user.avatar.url);
        }
    }, [user]);

    const AvatarOverlay = () => (
        <div className="avatar-overlay rounded-circle">
            <MdEdit style={{ color: "white" }} size="2rem" />
        </div>
    );

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);
        axios.patch(API_URL_USERS + user._id.$oid + "/avatar", formData, {
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

    const handleSubmit = () => {
        const updatedEmail = email === '' ? user.email : email;
        const updatedUsername = username === '' ? user.username : username;
        const updatedPassword = password === '' ? user.password : password;
    
        handleUserUpdate(user, updatedEmail, updatedUsername, updatedPassword, admin);
    
        setEmail('');
        setUsername('');
        setPassword('');
        setAdmin(false);
        handleClose();
    };
    

    const handleDeleteUser = () => {
        handleUserDelete(user);
        setShowDeleteModal(false);
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
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit user {user ? "(" + user.username + ")" : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="avatar" className="d-flex justify-content-center">
                            <div className="avatar-container" onClick={() => fileInputRef.current.click()}>
                                <img
                                    src={user ? (user.avatar.url ? avatarUrl : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg') : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg'}
                                    alt="avatar"
                                    className="rounded-circle mb-2 avatar-image"
                                />
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="avatar-tooltip">Click to change avatar</Tooltip>}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                className='form-control'
                                placeholder={user ? user.email : ''}
                                name='email'
                                onChange={(e) => setEmail(e.target.value)}
                                validations={[required]}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className='form-control'
                                        name='username'
                                        placeholder={user ? user.username : ''}
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
                                        checked={admin}
                                        onChange={(e) => setAdmin(e.target.checked)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
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
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} style={{ marginRight: 'auto' }} >
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
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

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteUser()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditUserModal;
