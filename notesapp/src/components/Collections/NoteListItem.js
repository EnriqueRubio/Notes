// NoteListItem.js
import React, { useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { ListGroup, Modal, Button } from 'react-bootstrap';

const NoteListItem = ({
    note,
    collection,
    handleNoteClick,
    removeNoteFromCollection,
  }) => {
    const [showRemoveIcon, setShowRemoveIcon] = useState(false);
    const [iconColor, setIconColor] = useState("orange");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
  
    const handleRemoveNote = () => {
        removeNoteFromCollection(note._id.$oid, collection._id.$oid); // Utiliza la prop aquí
        setShowConfirmModal(false);
    };
  
    return (
      <ListGroup.Item
        key={note._id.$oid}
        onClick={() => handleNoteClick(note, collection)}
        style={{ cursor: "pointer" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e8e8e8";
          e.currentTarget.style.fontWeight = "bold";
          setShowRemoveIcon(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "";
          e.currentTarget.style.fontWeight = "normal";
          setShowRemoveIcon(false);
        }}
      >
        <span>{note.title}</span>
        {showRemoveIcon && (
          <IoIosRemoveCircleOutline
            size="1.2rem"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmModal(true);
            }}
            onMouseEnter={() => setIconColor("red")}
            onMouseLeave={() => setIconColor("orange")}
            style={{
              color: iconColor,
              cursor: "pointer",
              right: "0",
              position: "absolute",
            }}
          />
        )}
        <Modal show={showConfirmModal} onHide={(e) => {e.stopPropagation(); setShowConfirmModal(false)}}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que quieres eliminar la nota "{note.title}" de la colección "{collection.title}"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={(e) => {e.stopPropagation(); setShowConfirmModal(false)}}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={(e) => {e.stopPropagation(); handleRemoveNote();}}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </ListGroup.Item>
    );
  };
  
  export default NoteListItem;