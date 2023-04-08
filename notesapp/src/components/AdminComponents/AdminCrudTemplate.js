import React, { useState } from 'react';
import { Container, Col, Row, Form, FormControl, Button, Table, ButtonGroup, Pagination } from 'react-bootstrap';
import { FaPlus, FaSortAlphaUp, FaSortAlphaDown } from 'react-icons/fa';
import './AdminCrud.css';

const AdminCrudTemplate = ({ items, renderHeader, renderRow, handleCreateModal }) => {
    const [sortAscending, setSortAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = items.slice(startIndex, endIndex);

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Datos de ejemplo para las notas
    const sampleNotes = ['Nota 1', 'Nota 2', 'Nota 3'];


    return (
        <>
            <Container fluid className="d-flex">
                <Col className="custom-border" md={2} style={{ marginRight: "0.2rem" }}>
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
                            <Table responsive striped>
                                <thead>
                                    {renderHeader()}
                                </thead>
                                <tbody>
                                    {displayedItems.map((item, index) => renderRow(item, index))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className="mx-1 my-2">
                        <Col className="px-0 d-flex justify-content-center">
                            <Pagination>
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <Pagination.Item
                                            key={pageNumber}
                                            active={pageNumber === currentPage}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Pagination.Item>
                                    );
                                })}
                            </Pagination>
                        </Col>
                    </Row>
                </Col>
            </Container>


            <Button className="floating-button" onClick={handleCreateModal}>
                <FaPlus />
            </Button>
        </>
    );
};

export default AdminCrudTemplate;