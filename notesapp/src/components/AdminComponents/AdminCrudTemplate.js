import React, { useMemo, useState, useCallback } from 'react';
import { Container, Col, Row, Form, FormControl, Button, Table, Pagination } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import './AdminCrud.css';

const AdminCrudTemplate = ({ items, renderHeader, renderRow, handleCreateModal, page, searchFunction, renderFilterOptions, filterFunction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');

    const applyFilters = useCallback((item) => {
        if (filter === '') return true;
        return filterFunction(item, filter);
    }, [filter, filterFunction]);

    const filteredItems = useMemo(() => items.filter(item => searchFunction(item, searchTerm) && filterFunction(item)), [items, searchTerm, searchFunction, filterFunction]);

    const itemsPerPage = 12;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = filteredItems.slice(startIndex, endIndex);

    // const handleSearchChange = (event) => {
    //     setSearchTerm(event.target.value);
    // };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // Lógica de búsqueda aquí
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Container fluid className="d-flex">
                <Col className="custom-border" md={2} style={{ marginRight: "0.2rem" }}>
                    <Row className="mx-1">
                        <h3 style={{ textAlign: "center" }} >FILTROS</h3>
                        <hr/>
                        {renderFilterOptions()}
                    </Row>
                </Col>
                <Col className="custom-border" style={{ marginLeft: "0.2rem" }}>
                    <Row className="mx-1 my-1">
                        <Col className="px-0">
                            <Form onSubmit={handleSearchSubmit} className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder={page ? "Buscar " + page : "Buscar"}
                                    value={searchTerm}
                                    onChange={event => setSearchTerm(event.target.value)}
                                />
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