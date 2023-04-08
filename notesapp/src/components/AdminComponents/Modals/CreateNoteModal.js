import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import QuillEditor from '../../Editor/editor.component'; // Asegúrate de importar el componente QuillEditor que tienes en tu proyecto

const CreateNoteModal = ({ show, handleClose, handleNoteCreate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [quillInstance, setQuillInstance] = useState(null);

    const handleEditorChange = (value) => {
        setContent(value);
    };

    const handleSubmit = () => {
        handleNoteCreate(title, content);
        setTitle('');
        setContent('');
        handleClose();
    };

    const handleEditorReady = (quill) => {
        setQuillInstance(quill);
    };

    const getCurrentEditingNoteContent = () => {
        return '';
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear nueva nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Título de la nota"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contenido</Form.Label>
                        <QuillEditor
                            onEditorReady={handleEditorReady}
                            getCurrentContent={getCurrentEditingNoteContent}
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
        </Modal>
    );
};

export default CreateNoteModal;
