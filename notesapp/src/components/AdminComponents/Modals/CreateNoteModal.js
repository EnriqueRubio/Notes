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
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create new note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <QuillEditor
                            onEditorReady={handleEditorReady}
                            getCurrentContent={getCurrentEditingNoteContent}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateNoteModal;
