import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
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
                .then(() => {
                    updateNotes(updatedNote);
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
            <th className="custom-th">Contenido</th>
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
            <td className="custom-td">Contenido</td>
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

    const renderFilterOptions = () => {
        const dateFilterOptions = [
            { value: 'date:recent', label: 'Recientes (última hora)' },
            { value: 'date:today', label: 'Hoy' },
            { value: 'date:this_week', label: 'Esta semana' },
            { value: 'date:this_month', label: 'Este mes' },
            { value: 'date:this_year', label: 'Este año' },
            { value: 'date:older', label: 'Más antiguas' },
        ];

        const authorFilterOptions = localNotes.map((user) => ({
            value: `author:${user._id.$oid}`,
            label: `Autor: ${user.username}`,
        }));

        const collectionFilterOptions = collections.map((collection) => ({
            value: `collections:${collection._id.$oid}`,
            label: `Colección: ${collection.title}`,
        }));

        const sharedFilterOptions = localNotes.map((user) => ({
            value: `shared:${user._id.$oid}`,
            label: `Compartido con: ${user.username}`,
        }));

        return [
            ...dateFilterOptions,
            ...authorFilterOptions,
            ...collectionFilterOptions,
            ...sharedFilterOptions,
        ].map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
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
            />
        </>
    );
};

export default AdminNotesBoard;
