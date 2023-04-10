import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
import { Form, FormControl, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import Select from 'react-select';
import { FaPlus, FaSortAlphaUp, FaSortAlphaDown } from 'react-icons/fa';
import CreateNoteModal from '../Modals/CreateNoteModal';
import EditNoteModal from '../Modals/EditNoteModal';
import AuthHeader from "../../../services/auth-header";

const API_URL_NOTES = "http://localhost:3000/api/notes/";

const AdminNotesBoard = ({ notes, collections, users }) => {
    const [localNotes, setLocalNotes] = useState(notes);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
    const [selectedNote, setSelectedNote] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    const renderParentCollectionDropdown = (parentCollectionIds) => (
        parentCollectionIds.length > 0 ? (
            <DropdownButton id="parentCollectionDropdown" title={"Colecciones (" + parentCollectionIds.length + ")"} onClick={handleDropdownClick}>
                {parentCollectionIds.map((idObj) => {
                    const id = idObj.$oid;
                    const title = getNoteTitleById(id);
                    return <Dropdown.Item key={id}>{title}</Dropdown.Item>;
                })}
            </DropdownButton>
        ) : (
            <DropdownButton id="parentCollectionDropdown" title={"Colecciones (0)"} disabled>
                <Dropdown.Item>Ninguna colección</Dropdown.Item>
            </DropdownButton>
        )
    );

    const renderSharedToDropdown = (sharedToIds) => (
        sharedToIds.length > 0 ? (
            <DropdownButton id="sharedToDropdown" title={"Compartidos (" + sharedToIds.length + ")"} onClick={handleDropdownClick}>
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

    const handleDropdownClick = (event) => {
        event.stopPropagation();
    };

    const getNoteTitleById = (id) => {
        const collection = collections.find((collection) => collection._id.$oid === id);
        return collection ? collection.title : '';
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

    const sortedNotes = [...localNotes].sort((a, b) => {
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

    // Edit note

    const handleCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleEditModal = (note) => {
        setSelectedNote(note);
        setShowEditModal(true);
    };

    const handleNoteUpdate = (updatedNote) => {
        console.log(updatedNote);
        /*
        let new_title = selectedNote.title;
        let new_content = selectedNote.content;
        if (updatedNote.title) new_title = updatedNote.title;
        if (updatedNote.content) new_content = updatedNote.content;
        */
        let note_id = updatedNote._id.$oid;
        let old_title = selectedNote.title;
        let old_content = selectedNote.content;
        let old_parent_collection_ids = selectedNote.parent_collection_ids;
        let old_shared_to_ids = selectedNote.shared_to_ids;

        if (updatedNote.title === old_title &&
            updatedNote.content === old_content &&
            updatedNote.parent_collection_ids === old_parent_collection_ids &&
            updatedNote.shared_to_ids === old_shared_to_ids
        ) {
            setSelectedNote(null);
            setShowEditModal(false);
        } else {
            if (updatedNote.title === "") updatedNote.title = old_title;
            axios.put(`${API_URL_NOTES}/${note_id}`,
                {
                    "note": {
                        "title": updatedNote.title,
                        "content": updatedNote.content,
                        "parent_collections": updatedNote.parent_collection_ids,
                        "shared_to": updatedNote.shared_to_ids
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
                    updateNotes(response.data);
                    setSelectedNote(null);
                    setShowEditModal(false);
                });
        }
    };

    const handleNoteDelete = (note) => {
        let note_id = note._id.$oid;
        axios.delete(`${API_URL_NOTES}/${note_id}`,
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(() => {
                deleteNotes(note);
                setSelectedNote(null);
                setShowEditModal(false);
            });
    };

    const handleCreateNote = (title, content) => {
        axios.post(`${API_URL_NOTES}`,
            {
                "note": {
                    "title": title,
                    "content": content
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
                const newNote = response.data;
                setLocalNotes([...localNotes, newNote]);
                setShowCreateModal(false);
            });
    };

    const deleteNotes = (deletedNote) => {
        const updatedNotes = localNotes.filter((note) => note._id.$oid !== deletedNote._id.$oid);
        setLocalNotes(updatedNotes);
    };

    const updateNotes = (updatedNote) => {
        const updatedNotes = localNotes.map((note) =>
            note._id.$oid === updatedNote._id.$oid ? updatedNote : note
        );
        setLocalNotes(updatedNotes);
    };

    const renderHeader = () => (
        <tr>
            <th className="custom-th sortable-th" onClick={() => handleSort('title')}>
                Título {renderSortIcon('title')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('created_at')}>
                Fecha creación {renderSortIcon('created_at')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('updated_at')}>
                Fecha modif. {renderSortIcon('updated_at')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('author_id')}>
                Autor {renderSortIcon('author_id')}
            </th>
            <th className="custom-th">Colecciones</th>
            <th className="custom-th">Compartidos</th>
        </tr>
    );

    const renderRow = (note, index) => (
        <tr className="custom-tr" key={index} onClick={() => handleEditModal(note)}>
            <td className="custom-td">{note.title}</td>
            {/* <td>{note.content}</td> */}
            <td className="custom-td">{formatDate(note.created_at)}</td>
            <td className="custom-td">{formatDate(note.updated_at)}</td>
            <td className="custom-td">{getUsernameById(note.author_id.$oid)}</td>
            <td className="custom-td">{note.parent_collection_ids ? renderParentCollectionDropdown(note.parent_collection_ids) : ""}</td>
            <td className="custom-td">{note.shared_to_ids ? renderSharedToDropdown(note.shared_to_ids) : ""}</td>
        </tr>
    );

    //FILTERS
    const [filter, setFilter] = useState({ type: '', value: '' });

    const handleFilterChange = (event) => {
        const filterType = event.target.value;
        setFilter({ ...filter, type: filterType });
    };

    const filterNotes = (localNotes) => {
        if (filter.type === '') {
            return localNotes;
        }

        let filteredNotes = localNotes;

        // Filtro por fecha
        if (filter.type.startsWith('date:')) {
            const timeRanges = {
                'date:recent': 3600000, // 1 hora
                'date:today': 86400000, // 1 día
                'date:this_week': 604800000, // 1 semana
                'date:this_month': 2592000000, // 30 días
                'date:this_year': 31536000000, // 365 días
            };

            const timeRange = timeRanges[filter.type];
            const currentTime = new Date().getTime();

            filteredNotes = localNotes.filter((note) => {
                const noteCreatedTime = new Date(note.created_at).getTime();
                const noteUpdatedTime = new Date(note.updated_at).getTime();
                return (
                    currentTime - noteCreatedTime <= timeRange ||
                    currentTime - noteUpdatedTime <= timeRange
                );
            });
        }

        // Filtro por autor
        if (filter.type === 'author') {
            filteredNotes = localNotes.filter(
                (note) => note.author_id.$oid === filter.value
            );
        }

        // Filtro por colecciones
        if (filter.type === 'collections') {
            filteredNotes = localNotes.filter((note) =>
                note.parent_collection_ids.some(
                    (collectionId) => collectionId.$oid === filter.value
                )
            );
        }

        // Filtro por compartidos
        if (filter.type === 'shared') {
            filteredNotes = localNotes.filter((note) =>
                note.shared_to_ids.some((userId) => userId.$oid === filter.value)
            );
        }

        return filteredNotes;
    };

    const searchFunction = (note, searchTerm) => {
        return note.title.toLowerCase().includes(searchTerm.toLowerCase());
    };

    //FILTERS
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedShared, setSelectedShared] = useState([]);
    const [selectedCreated, setSelectedCreated] = useState('');
    const [selectedModified, setSelectedModified] = useState('');

    const handleCreatedSelect = (event) => {
        setSelectedCreated(event.target.value);
    };

    const handleModifiedSelect = (event) => {
        setSelectedModified(event.target.value);
    };

    const handleUserSelect = (selected) => {
        setSelectedUsers(selected);
    };

    const handleCollectionSelect = (selected) => {
        setSelectedCollections(selected);
    };

    const handleSharedSelect = (selected) => {
        setSelectedShared(selected);
    };

    const usersOptions = users.map(user => ({
        value: user._id.$oid,
        label: user.username,
    }));

    const collectionOptions = collections.map(collection => ({
        value: collection._id.$oid,
        label: collection.title,
    }));

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
                    <Form.Label><strong>Autor:</strong></Form.Label>
                    <Select
                        options={usersOptions}
                        onChange={handleUserSelect}
                        isMulti
                        isSearchable
                        placeholder="Buscar usuario"
                        className="mb-2"
                    />
                    <hr />
                    <Form.Label><strong>Colección:</strong></Form.Label>
                    <Select
                        options={collectionOptions}
                        onChange={handleCollectionSelect}
                        isMulti
                        isSearchable
                        placeholder="Buscar colec..."
                        className="mb-2"
                    />
                    <hr />
                    <Form.Label><strong>Compartidos:</strong></Form.Label>
                    <Select
                        options={usersOptions}
                        onChange={handleSharedSelect}
                        isMulti
                        isSearchable
                        placeholder="Buscar comp..."
                        className="mb-2"
                    />
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


    const filterFunction = (note) => {
        // Aplica el filtro de fecha de creación
        if (!dateFilter(note.created_at, selectedCreated)) {
            return false;
        }

        // Aplica el filtro de fecha de modificación
        if (!dateFilter(note.updated_at, selectedModified)) {
            return false;
        }

        // Aplica el filtro de autor
        if (selectedUsers.length > 0 && !selectedUsers.some(user => user.value === note.author_id.$oid)) {
            return false;
        }

        // Aplica el filtro de colección
        if (selectedCollections.length > 0 && !selectedCollections.some(collection => note.parent_collection_ids.some(id => id.$oid === collection.value))) {
            return false;
        }

        // Aplica el filtro de notas compartidas
        if (selectedShared.length > 0 && !selectedShared.some(user => note.shared_to_ids.some(id => id.$oid === user.value))) {
            return false;
        }

        // Si todos los filtros se aplican correctamente, devuelve verdadero
        return true;
    };

    return (
        <>
            <CreateNoteModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleNoteCreate={handleCreateNote}
            />
            <EditNoteModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                note={selectedNote}
                users={users}
                collections={collections}
                handleNoteUpdate={handleNoteUpdate}
                handleNoteDelete={handleNoteDelete}
            />
            <AdminCrudTemplate
                items={sortedNotes}
                renderHeader={renderHeader}
                renderRow={renderRow}
                handleCreateModal={handleCreateModal}
                page={"notas"}
                searchFunction={searchFunction}
                renderFilterOptions={renderFilterOptions}
                filterFunction={filterFunction}
            />
        </>
    );
};

export default AdminNotesBoard;
