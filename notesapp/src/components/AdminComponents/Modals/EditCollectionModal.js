import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Modal, Button, Form } from 'react-bootstrap';

const EditCollectionModal = ({ show, handleClose, handleCollectionUpdate, handleCollectionDelete, collection, users }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
    const [selectedTheme, setSelectedTheme] = useState(predefinedThemes[0]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setSelectedTheme({ bgColor: collection?.bgColor, borderColor: collection?.borderColor, textColor: collection?.textColor });
        setTitle(collection?.title);
        setDescription(collection?.description);
    }, [collection]);

    const handleSubmit = () => {
        handleCollectionUpdate(collection, title, description, selectedTheme);
        setTitle('');
        setDescription('');
        handleClose();
    };

    const handleInputChange = (field) => (e) => {
        if (field === 'title') {
            setTitle(e.target.value);
        } else if (field === 'description') {
            setDescription(e.target.value);
        }
    };

    const handleThemeChange = (index) => {
        setSelectedTheme(predefinedThemes[index]);
    };

    const handleDeleteNote = () => {
        handleCollectionDelete(collection);
        setShowDeleteModal(false);
        handleClose();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar colección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={collection ? collection.title : ''}
                                            onChange={handleInputChange('title')}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={collection ? collection.description : ''}
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
                                        <Card.Title>{title ? title : 'Título'}</Card.Title>
                                        <Card.Text>{description ? description : 'Descripción'}</Card.Text>
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
                    </Container >
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} style={{ marginRight: 'auto' }} >
                        Eliminar
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal >

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
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
                    <Button variant="danger" onClick={() => handleDeleteNote()}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditCollectionModal;