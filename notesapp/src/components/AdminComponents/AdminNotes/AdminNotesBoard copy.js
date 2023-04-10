import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ButtonGroup, Container, Row, Col, Form, FormControl, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import '../AdminCrud.css';
import AuthService from '../../../services/auth.service';
import AuthHeader from "../../../services/auth-header";

const BASE_API_URL = "http://localhost:3000/api/";
const API_URL_NOTES = BASE_API_URL + "notes";

const AdminNotesBoard = ({ notes, collections, users, relations }) => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAscending, setSortAscending] = useState(true);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Lógica de búsqueda aquí
    };

    const handleFilterChange = (event) => {
        // Lógica de filtrado aquí
    };

    const handleSortChange = (event) => {
        // Lógica de ordenación aquí
    };

    const handleSortDirection = () => {
        setSortAscending(!sortAscending);
    };

    // Datos de ejemplo para las notas
    const sampleNotes = ['Nota 1', 'Nota 2', 'Nota 3'];

    return (
        <Container fluid className="d-flex full-height">
            <Col className="custom-border" md={3} style={{ marginRight: "0.2rem" }}>
            <Row className="mx-1">
                <Form.Group controlId="sort">
                    <Form.Label>Ordenar por:</Form.Label>
                    <div className="d-flex">
                    <ButtonGroup>
                    <Button onClick={handleSortDirection} style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}>
                        {sortAscending ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
                    </Button>
                </ButtonGroup>
                    <Form.Select onChange={handleSortChange} style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}>
                        <option value="">Selecciona un orden</option>
                        {/* Añade más opciones de ordenación aquí */}
                    </Form.Select>
                    </div>
                </Form.Group>
                </Row>

                <hr style={{marginBottom: "0"}}/>

                <Row className="mx-1">
                <Form.Group controlId="filter">
                    <Form.Label>Filtrar por:</Form.Label>
                    <Form.Select onChange={handleFilterChange}>
                        <option value="">Selecciona un filtro</option>
                        {/* Añade más opciones de filtro aquí */}
                    </Form.Select>
                </Form.Group>
                </Row>
            </Col>
            <Col className="custom-border" style={{ marginLeft: "0.2rem" }}>
                <Row className="mx-1 my-1">
                    <Col className="px-0">
                        <Form onSubmit={handleSearchSubmit} className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Buscar notas"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{ marginRight: '1rem' }}
                            />
                            <Button className="ml-2" type="submit">Buscar</Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="mx-1 my-2">
                    <Col className="px-0">
                        <ListGroup>
                            {notes.map((note, index) => (
                                <ListGroup.Item className="striped-list-group-item" key={index}>{note.title}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
};

export default AdminNotesBoard;