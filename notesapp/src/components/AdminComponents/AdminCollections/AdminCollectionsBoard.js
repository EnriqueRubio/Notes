import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import CreateCollectionModal from '../Modals/CreateCollectionModal';
import AuthHeader from "../../../services/auth-header";
import EditCollectionModal from '../Modals/EditCollectionModal';

const API_URL_COLLECTIONS = "http://localhost:3000/api/collections/";

const AdminCollectionsBoard = ({ notes, collections, users }) => {
    const [localCollections, setLocalCollections] = useState(collections);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        setLocalCollections(collections);
    }, [collections]);

    const renderChildNotesDropdown = (noteIds) => (
        noteIds.length > 0 ? (
            <DropdownButton id="childNotesDropdown" title={"Notas (" + noteIds.length + ")"}>
                {noteIds.map((idObj) => {
                    const id = idObj.$oid;
                    const title = getNoteTitleById(id);
                    return <Dropdown.Item key={id}>{title}</Dropdown.Item>;
                })}
            </DropdownButton>
        ) : (
            <DropdownButton id="childNotesDropdown" title={"Notas (0)"} disabled>
                <Dropdown.Item>Ninguna nota</Dropdown.Item>
            </DropdownButton>
        )
    );

    const renderSharedToDropdown = (sharedToIds) => (
        sharedToIds.length > 0 ? (
            <DropdownButton id="sharedToDropdown" title={"Compartidos (" + sharedToIds.length + ")"}>
                {sharedToIds.map((idObj) => {
                    const id = idObj.$oid;
                    const username = getUsernameById(id);
                    return <Dropdown.Item key={id}>{username}</Dropdown.Item>;
                })}
            </DropdownButton>
        ) : (
            <DropdownButton id="sharedToDropdown" title={"Compartidos (0)"} disabled>
                <Dropdown.Item>Ningún compartido</Dropdown.Item>
            </DropdownButton>
        )
    );


    const getNoteTitleById = (id) => {
        const note = notes.find((note) => note._id.$oid === id);
        return note ? note.title : '';
    };

    const getUsernameById = (id) => {
        const user = users.find((user) => user._id.$oid === id);
        return user ? user.username : '';
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedCollections = [...localCollections].sort((a, b) => {
        if (sortConfig.key === null) {
            return 0;
        }

        let valueA, valueB;
        if (sortConfig.key === 'author_id') {
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

    const deleteCollections = (deletedCollection) => {
        const updatedCollections = localCollections.filter((collection) => collection._id.$oid !== deletedCollection._id.$oid);
        setLocalCollections(updatedCollections);
    };

    const updateCollections = (updatedCollection) => {
        const updatedCollections = localCollections.map((collection) =>
        collection._id.$oid === updatedCollection._id.$oid ? updatedCollection : collection
        );
        setLocalCollections(updatedCollections);
    };

    const handleCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleEditModal = (collection) => {
        setSelectedCollection(collection);
        setShowEditModal(true);
    };

    const handleCollectionUpdate = (updatedCollection, newTitle, newDescription, newTheme) => {
        let collection_id = updatedCollection._id.$oid;

        if (newTitle === selectedCollection.title &&
            newDescription === selectedCollection.description &&
            newTheme.textColor === selectedCollection.textColor &&
            newTheme.bgColor === selectedCollection.bgColor &&
            newTheme.borderColor === selectedCollection.borderColor
        ) {
            setSelectedCollection(null);
            setShowEditModal(false);
        } else {
            if (newTitle.title === "") newTitle = selectedCollection.title;
            updatedCollection.title = newTitle;
            updatedCollection.description = newDescription;
            updatedCollection.textColor = newTheme.textColor;
            updatedCollection.bgColor = newTheme.bgColor;
            updatedCollection.borderColor = newTheme.borderColor;
            axios.put(`${API_URL_COLLECTIONS}/${collection_id}`,
                {
                    "collection": {
                        "title": updatedCollection.title,
                        "description": updatedCollection.description,
                        "textColor": updatedCollection.textColor,
                        "bgColor": updatedCollection.bgColor,
                        "borderColor": updatedCollection.borderColor
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
                .then(() => {
                    updateCollections(updatedCollection);
                    setSelectedCollection(null);
                    setShowEditModal(false);
                });
        }
    };

    const handleCollectionDelete = (collection) => {
        let collection_id = collection._id.$oid;
        axios.delete(`${API_URL_COLLECTIONS}/${collection_id}`,
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(() => {
                deleteCollections(collection);
                setSelectedCollection(null);
                setShowEditModal(false);
            });
    };

    const handleCreateCollection = (title, description, selectedTheme) => {
        axios.post(`${API_URL_COLLECTIONS}`,
            {
                "collection": {
                    "title": title,
                    "description": description,
                    "textColor": selectedTheme.textColor,
                    "bgColor": selectedTheme.bgColor,
                    "borderColor": selectedTheme.borderColor
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
                const newCollection = response.data;
                setLocalCollections([...localCollections, newCollection]);
                setShowCreateModal(false);
            });
    };

    const renderHeader = () => (
        <tr>
            <th className="custom-th sortable-th" onClick={() => handleSort('title')}>
                Título {renderSortIcon('title')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('description')}>
                Descripción {renderSortIcon('description')}
            </th>
            <th className="custom-th">Color text</th>
            <th className="custom-th">Color fondo</th>
            <th className="custom-th">Color borde</th>
            <th className="custom-th sortable-th" onClick={() => handleSort('author_id')}>
                Autor {renderSortIcon('author_id')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('created_at')}>
                Fecha creación {renderSortIcon('created_at')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('updated_at')}>
                Fecha modif. {renderSortIcon('updated_at')}
            </th>
            <th className="custom-th"> Notas</th>
            <th className="custom-th">Compartidos</th>
        </tr>
    );

    const renderRow = (collection, index) => (
        <tr className="custom-tr" key={index} onClick={() => handleEditModal(collection)}>
            <td className="custom-td">{collection.title}</td>
            <td className="custom-td">{collection.description}</td>
            <td className="custom-td">{collection.textColor}</td>
            <td className="custom-td">{collection.bgColor}</td>
            <td className="custom-td">{collection.borderColor}</td>
            <td className="custom-td">{getUsernameById(collection.author_id.$oid)}</td>
            <td className="custom-td">{formatDate(collection.created_at)}</td>
            <td className="custom-td">{formatDate(collection.updated_at)}</td>
            <td className="custom-td">{collection.note_ids ? renderChildNotesDropdown(collection.note_ids) : ""}</td>
            <td className="custom-td">{collection.shared_to_ids ? renderSharedToDropdown(collection.shared_to_ids) : ""}</td>
        </tr>
    );


    return (
        <>
            <CreateCollectionModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleCollectionCreate={handleCreateCollection}
            />
            <EditCollectionModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                collection={selectedCollection}
                users={users}
                collections={collections}
                handleCollectionUpdate={handleCollectionUpdate}
                handleCollectionDelete={handleCollectionDelete}
            />
            <AdminCrudTemplate
                items={sortedCollections}
                renderHeader={renderHeader}
                renderRow={renderRow}
                handleCreateModal={handleCreateModal}
            />
        </>
    );
};

export default AdminCollectionsBoard;
