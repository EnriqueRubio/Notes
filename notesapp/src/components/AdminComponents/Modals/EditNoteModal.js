import React, { useEffect, useState } from 'react';
import { Dropdown, Col, Row, Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import QuillEditor from '../../Editor/editor.component';

const NoteEditModal = ({ show, handleClose, note, users, collections, handleNoteUpdate, handleNoteDelete }) => {
    const [title, setTitle] = useState(note?.title);
    const [content, setContent] = useState(note?.content);
    const [authorId, setAuthorId] = useState(note?.author_id.$oid);
    const [searchedEmail, setSearchedEmail] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCollections, setSelectedCollections] = useState(
        note
            ? note.parent_collection_ids
            : collections.map((collection) => ({ $oid: collection._id.$oid }))
    );
    const [selectedSharedUsers, setSelectedSharedUsers] = useState(
        note
            ? note.shared_to_ids
            : users.map((user) => ({ $oid: user._id.$oid }))
    );
    const [quillInstance, setQuillInstance] = useState(null);

    useEffect(() => {
        if (note) {
            setSelectedCollections(note.parent_collection_ids.map(idObj => idObj.$oid));
            setSelectedSharedUsers(note.shared_to_ids.map(idObj => idObj.$oid));
        } else {
            setSelectedCollections(collections);
        }
    }, [note]);

    const handleEditorReady = (quill) => {
        setQuillInstance(quill);
    };

    const getCurrentEditingNoteContent = () => {
        return note?.content;
    };

    const handleAuthorSearch = (email) => {
        const user = users.find((user) => user.email === email);
        if (user) {
            setAuthorId(user._id.$oid);
        } else {
            alert('User not found');
        }
    };

    const handleCollectionToggle = (idObj) => {
        if (selectedCollections.some((collection) => collection.$oid === idObj.$oid)) {
            setSelectedCollections(
                selectedCollections.filter((collection) => collection.$oid !== idObj.$oid)
            );
        } else {
            setSelectedCollections([...selectedCollections, idObj.$oid]);
        }
    };

    const handleSharedUserToggle = (idObj) => {
        if (selectedSharedUsers.some((user) => user.$oid === idObj.$oid)) {
            setSelectedSharedUsers(
                selectedSharedUsers.filter((user) => user.$oid !== idObj.$oid)
            );
        } else {
            setSelectedSharedUsers([...selectedSharedUsers, idObj.$oid]);
        }
    };

    const handleSubmit = () => {
        const quillContent = quillInstance.editor.delta;
        handleNoteUpdate({
            ...note,
            title,
            content: quillContent,
            author_id: { $oid: authorId },
            parent_collection_ids: selectedCollections.map((id) => (typeof id === 'string' ? { $oid: id } : id)),
            shared_to_ids: selectedSharedUsers.map((id) => (typeof id === 'string' ? { $oid: id } : id)),
        });
        handleClose();
    };

    const handleDeleteNote = () => {
        handleNoteDelete(note);
        setShowDeleteModal(false);
        handleClose();
    };

    const renderCollectionsDropdown = () => (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-collections">
                Collections
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {collections.map((collection) => (
                    <Dropdown.Item key={collection._id.$oid} onClick={() => handleCollectionToggle(collection._id)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Check
                                type="checkbox"
                                label={collection.title}
                                checked={collection ? selectedCollections.includes(collection._id.$oid) : false}
                                readOnly
                            />
                        </div>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

    const renderSharedUsersDropdown = () => (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-shared-users">
                Share
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {users.map((user) => (
                    <Dropdown.Item key={user._id.$oid} onClick={() => handleSharedUserToggle(user._id)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Check
                                type="checkbox"
                                label={user.username}
                                checked={selectedSharedUsers.includes(user._id.$oid)}
                                readOnly
                            />
                        </div>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={note ? note.title : ''}
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
                        <Form.Group className="mb-3">
                            <Form.Label>Change author</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="email"
                                    placeholder="Author email"
                                    value={searchedEmail}
                                    onChange={(e) => setSearchedEmail(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={() => handleAuthorSearch(searchedEmail)}>
                                    Search
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Row>
                            <Col className="text-center">
                                {renderCollectionsDropdown()}
                            </Col>
                            <Col className="text-center">
                                {renderSharedUsersDropdown()}
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} style={{ marginRight: 'auto' }} >
                        Remove
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this note?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteNote()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NoteEditModal;
