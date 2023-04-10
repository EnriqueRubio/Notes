import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
import { Form } from 'react-bootstrap';
import "../AdminCrud.css";
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import AuthHeader from "../../../services/auth-header";
import CreateRelationModal from '../Modals/CreateRelationModal';
import EditRelationModal from '../Modals/EditRelationModal';

const API_URL_RELATIONS = "http://localhost:3000/api/friends/";

const AdminRelationsBoard = ({ users, relations }) => {
    const [localRelations, setLocalRelations] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'sender_id', direction: 'asc' });
    const [selectedRelation, setSelectedRelation] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        setLocalRelations(relations);
    }, [relations]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getUsernameById = (id) => {
        const user = users.find((user) => user._id.$oid === id);
        return user ? user.username : '';
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedRelations = [...localRelations].sort((a, b) => {
        if (sortConfig.key === null) {
            return 0;
        }

        let valueA, valueB;
        if (sortConfig.key === 'sender_id' || sortConfig.key === 'receiver_id') {
            valueA = getUsernameById(a[sortConfig.key].$oid);
            valueB = getUsernameById(b[sortConfig.key].$oid);
        } else if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
            valueA = new Date(a[sortConfig.key]);
            valueB = new Date(b[sortConfig.key]);
        } else {
            valueA = a[sortConfig.key];
            valueB = b[sortConfig.key];
        }

        if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const renderSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
        }
        return null;
    };

    const renderHeader = () => (
        <tr>
            <th className="custom-th sortable-th" onClick={() => handleSort('sender_id')}>
                Emisor {renderSortIcon('sender_id')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('receiver_id')}>
                Receptor {renderSortIcon('receiver_id')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('status')}>
                Estado {renderSortIcon('status')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('created_at')}>
                Fecha de petición {renderSortIcon('created_at')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('updated_at')}>
                Última modificación {renderSortIcon('updated_at')}
            </th>
        </tr>
    );

    const renderRow = (relation, index) => (
        <tr className="custom-tr" key={index} onClick={() => handleEditModal(relation)}>
            <td className="custom-td">{getUsernameById(relation.sender_id.$oid)}</td>
            <td className="custom-td">{getUsernameById(relation.receiver_id.$oid)}</td>
            <td className="custom-td">{relation.status}</td>
            <td className="custom-td">{formatDate(relation.created_at)}</td>
            <td className="custom-td">{formatDate(relation.updated_at)}</td>
        </tr>
    );

    const handleCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleEditModal = (relation) => {
        setSelectedRelation(relation);
        setShowEditModal(true);
    };

    const handleRelationUpdate = (updatedRelation, newStatus, newSender, newReceiver) => {
        let newSenderId = typeof newSender === 'string' ? { $oid: newSender } : newSender;
        let newReceiverId = typeof newReceiver === 'string' ? { $oid: newReceiver } : newReceiver;
        let relation_id = updatedRelation._id.$oid;
        let old_status = selectedRelation.status;
        let old_sender = selectedRelation.sender_id;
        let old_receiver = selectedRelation.receiver_id;

        if (newStatus === old_status &&
            newSender === old_sender.$oid &&
            newReceiver === old_receiver.$oid
        ) {
            setSelectedRelation(null);
            setShowEditModal(false);
        } else {
            if (newStatus === "") newStatus = old_status;
            if (newSender === "") newSender = old_sender.$oid;
            if (newReceiver === "") newReceiver = old_receiver.$oid;
            updatedRelation.status = newStatus;
            updatedRelation.sender_id = newSender;
            updatedRelation.receiver_id = newReceiver;
            axios.put(`${API_URL_RELATIONS}/${relation_id}`,
                {
                    "friendship": {
                        "status": updatedRelation.status,
                        "sender": updatedRelation.sender_id,
                        "receiver": updatedRelation.receiver_id
                    }
                },
                {
                    headers: {
                        ...AuthHeader(),
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )
                .then((response) => {
                    updateRelations(response.data);
                    setSelectedRelation(null);
                    setShowEditModal(false);
                });
        }
    };

    const handleRelationDelete = (relation) => {
        let relation_id = relation._id.$oid;
        axios.delete(`${API_URL_RELATIONS}/${relation_id}`,
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(() => {
                deleteRelations(relation);
                setSelectedRelation(null);
                setShowEditModal(false);
            });
    };

    const handleCreateRelation = (status, sender_id, receiver_id) => {
        axios.post(`${API_URL_RELATIONS}`,
            {
                "friendship": {
                    "status": status,
                    "sender": sender_id,
                    "receiver": receiver_id
                }
            },
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then((response) => {
                const newRelation = response.data;
                setLocalRelations([...localRelations, newRelation]);
                setShowCreateModal(false);
            });
    };

    const deleteRelations = (deletedRelation) => {
        const updatedRelations = localRelations.filter((relation) => relation._id.$oid !== deletedRelation._id.$oid);
        setLocalRelations(updatedRelations);
    };

    const updateRelations = (updatedRelation) => {
        const updatedRelations = localRelations.map((relation) =>
            relation._id.$oid === updatedRelation._id.$oid ? updatedRelation : relation
        );
        setLocalRelations(updatedRelations);
    };

    const searchFunction = (relation, searchTerm) => {
        return getUsernameById(relation.sender_id.$oid).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getUsernameById(relation.receiver_id.$oid).toLowerCase().includes(searchTerm.toLowerCase());
    };

    //FILTERS
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedCreated, setSelectedCreated] = useState('');
    const [selectedModified, setSelectedModified] = useState('');

    const handleCreatedSelect = (event) => {
        setSelectedCreated(event.target.value);
    };

    const handleModifiedSelect = (event) => {
        setSelectedModified(event.target.value);
    };

    const handleStatusSelect = (event) => {
        setSelectedStatus(event.target.value);
    };

    const renderFilterOptions = () => {
        return (
            <>
                <Form.Group controlId="filter">
                    <Form.Label><strong>Fecha de creación:</strong></Form.Label>
                    <Form.Select onChange={handleCreatedSelect}>
                        <option value="">Selecciona un rango</option>
                        <option value="created_recently">Reciente</option>
                        <option value="created_today">Hoy</option>
                        <option value="created_this_week">Esta semana</option>
                        <option value="created_this_month">Este mes</option>
                        <option value="created_this_year">Este año</option>
                        <option value="created_older">Más antigua</option>
                    </Form.Select>
                    <hr />
                    <Form.Label><strong>Fecha de modif.:</strong></Form.Label>
                    <Form.Select onChange={handleModifiedSelect}>
                        <option value="">Selecciona un rango</option>
                        <option value="created_recently">Reciente</option>
                        <option value="created_today">Hoy</option>
                        <option value="created_this_week">Esta semana</option>
                        <option value="created_this_month">Este mes</option>
                        <option value="created_this_year">Este año</option>
                        <option value="created_older">Más antigua</option>
                    </Form.Select>
                    <hr />
                    <Form.Label><strong>Estado:</strong></Form.Label>
                    <Form.Select onChange={handleStatusSelect}>
                        <option value="">Selecciona un estado</option>
                        <option value="accepted">Aceptada</option>
                        <option value="pending">Pendiente</option>
                    </Form.Select>
                </Form.Group>
            </>
        );
    };

    const dateFilter = (date, filter) => {
        const currentDate = new Date();
        const providedDate = new Date(date);
        const timeDifference = currentDate - providedDate;

        // Convertir la diferencia de tiempo a horas, días, meses y años
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        const daysDifference = hoursDifference / 24;
        const monthsDifference = daysDifference / 30.44; // Promedio de días por mes
        const yearsDifference = daysDifference / 365.25; // Promedio de días por año

        switch (filter) {
            case 'created_recently':
                return hoursDifference <= 1;
            case 'created_today':
                return daysDifference < 1;
            case 'created_this_week':
                return daysDifference < 7;
            case 'created_this_month':
                return monthsDifference < 1;
            case 'created_this_year':
                return yearsDifference < 1;
            case 'created_older':
                return yearsDifference >= 1;
            default:
                return true;
        }
    };


    const filterFunction = (relation) => {
        // Aplica el filtro de fecha de creación
        if (!dateFilter(relation.created_at, selectedCreated)) {
            return false;
        }

        // Aplica el filtro de fecha de modificación
        if (!dateFilter(relation.updated_at, selectedModified)) {
            return false;
        }

        // Aplica el filtro de autor
        switch (selectedStatus) {
            case 'pending':
                if (relation.status === 'accepted') {
                    return false;
                }
                break;
            case 'accepted':
                if (relation.status === 'pending') {
                    return false;
                }
                break;
            default:
                break;
        }

        // Si todos los filtros se aplican correctamente, devuelve verdadero
        return true;
    };

    return (
        <>
            <CreateRelationModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleRelationCreate={handleCreateRelation}
                relations={relations}
                users={users}
            />
            <EditRelationModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                relation={selectedRelation}
                relations={relations}
                users={users}
                handleRelationUpdate={handleRelationUpdate}
                handleRelationDelete={handleRelationDelete}
            />
            <AdminCrudTemplate
                items={sortedRelations}
                renderHeader={renderHeader}
                renderRow={renderRow}
                handleCreateModal={handleCreateModal}
                page={"relaciones"}
                searchFunction={searchFunction}
                renderFilterOptions={renderFilterOptions}
                filterFunction={filterFunction}
            />
        </>
    );
};

export default AdminRelationsBoard;
