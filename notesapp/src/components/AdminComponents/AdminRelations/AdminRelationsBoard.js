import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
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
            />
        </>
    );
};

export default AdminRelationsBoard;
