import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCrudTemplate from '../AdminCrudTemplate';
import { Form } from 'react-bootstrap';
import { FaUser, FaCrown, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import "../AdminCrud.css";
import AuthHeader from "../../../services/auth-header";
import CreateUserModal from '../Modals/CreateUserModal';
import EditUserModal from '../Modals/EditUserModal';

const API_URL = "http://localhost:3000/";
const API_URL_USERS = API_URL + "api/users/";

const AdminUsersBoard = ({ users }) => {
    const [localUsers, setLocalUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

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

    const sortedUsers = [...localUsers].sort((a, b) => {
        if (sortConfig.key === null) {
            return 0;
        }
        if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
            const dateA = new Date(a[sortConfig.key]);
            const dateB = new Date(b[sortConfig.key]);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }
    });

    const renderSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
        }
        return null;
    };

    const renderHeader = () => (
        <tr>
            <th className="custom-th">Avatar</th>
            <th className="custom-th sortable-th" onClick={() => handleSort('email')}>
                Email {renderSortIcon('email')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('username')}>
                Username {renderSortIcon('username')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('created_at')}>
                Creation date {renderSortIcon('created_at')}
            </th>
            <th className="custom-th sortable-th" onClick={() => handleSort('updated_at')}>
                Update date {renderSortIcon('updated_at')}
            </th>
            <th className="custom-th">Role</th>
        </tr>
    );

    const handleCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleUserUpdate = (updatedUser, newEmail, newUsername, newPassword, newAdmin) => {
        let user_id = updatedUser._id.$oid;
        let old_email = selectedUser.email;
        let old_username = selectedUser.username;
        let old_admin = selectedUser.admin;
        let old_password = selectedUser.password;

        if (newEmail === old_email &&
            newUsername === old_username &&
            newAdmin === old_admin &&
            newPassword === old_password
        ) {
            setSelectedUser(null);
            setShowEditModal(false);
        } else {
            if (newEmail === "") newEmail = old_email;
            if (newUsername === "") newUsername = old_username;
            if (newAdmin === "") newAdmin = old_admin;
            if (newPassword === "") newPassword = old_password;
            updatedUser.email = newEmail;
            updatedUser.username = newUsername;
            updatedUser.admin = newAdmin;
            updatedUser.password = newPassword;
            axios.put(`${API_URL_USERS}/${user_id}`,
                {
                    "user": {
                        "email": updatedUser.email,
                        "username": updatedUser.username,
                        "admin": updatedUser.admin,
                        "password": updatedUser.password
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
                    updateUsers(updatedUser);
                    setSelectedUser(null);
                    setShowEditModal(false);
                });
        }
    };

    const handleUserDelete = (user) => {
        let user_id = user._id.$oid;
        axios.delete(`${API_URL_USERS}/${user_id}`,
            {
                headers: {
                    ...AuthHeader(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
            .then(() => {
                deleteUsers(user);
                setSelectedUser(null);
                setShowEditModal(false);
            });
    };

    const handleCreateUser = (email, username, password, admin) => {
        axios.post(`${API_URL_USERS + "signup"}`,
            {
                "user": {
                    "email": email,
                    "username": username,
                    "password": password,
                    "admin": admin
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
                const newUser = response.data.user;
                setLocalUsers([...localUsers, newUser]);
                setShowCreateModal(false);
            });
    };

    const deleteUsers = (deletedUser) => {
        const updatedUsers = localUsers.filter((user) => user._id.$oid !== deletedUser._id.$oid);
        setLocalUsers(updatedUsers);
    };

    const updateUsers = (updatedUser) => {
        const updatedUsers = localUsers.map((user) =>
        user._id.$oid === updatedUser._id.$oid ? updatedUser : user
        );
        setLocalUsers(updatedUsers);
    };

    const renderRow = (user, index) => (
        <tr className="custom-tr" key={index} onClick={() => handleEditModal(user)}>
            <td className="custom-td">
                <img
                    src={user.avatar.url ? API_URL + user.avatar.url : "https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg"}
                    width="40"
                    height="40"
                    className="rounded-circle"
                    alt="User profile"
                    zIndex="1000"
                />
            </td>
            <td className="custom-td">{user.email}</td>
            <td className="custom-td">{user.username}</td>
            <td className="custom-td">{formatDate(user.created_at)}</td>
            <td className="custom-td">{formatDate(user.updated_at)}</td>
            <td className="custom-td"><UserRole isAdmin={user ? user.admin : false} /></td>
        </tr>
    );

    function UserRole({ isAdmin }) {
        return (
            <div
                className="p-2 rounded"
                style={{
                    backgroundColor: isAdmin ? 'rgba(255, 169, 64, 0.2)' : 'rgba(13, 110, 253, 0.2)',
                    borderColor: isAdmin ? '#FFA940' : '#0d6efd',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: isAdmin ? '#FFA940' : '#0d6efd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isAdmin ? <FaCrown style={{ marginRight: '5px' }} /> : <FaUser style={{ marginRight: '5px' }} />}
                {isAdmin ? 'Admin' : 'User'}
            </div>
        );
    }

    const searchFunction = (user, searchTerm) => {
        return user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    };

    //FILTERS
    const [selectedRole, setSelectedRole] = useState([]);
    const [selectedCreated, setSelectedCreated] = useState('');
    const [selectedModified, setSelectedModified] = useState('');

    const handleCreatedSelect = (event) => {
        setSelectedCreated(event.target.value);
    };

    const handleModifiedSelect = (event) => {
        setSelectedModified(event.target.value);
    };

    const handleRoleSelect = (event) => {
        setSelectedRole(event.target.value);
    };

    const renderFilterOptions = () => {
        return (
            <>
                <Form.Group controlId="filter">
                <Form.Label><strong>Fecha de creación:</strong></Form.Label>
                    <Form.Select onChange={handleCreatedSelect}>
                        <option value="">Select a range</option>
                        <option value="created_recently">Recent</option>
                        <option value="created_today">Today</option>
                        <option value="created_this_week">This week</option>
                        <option value="created_this_month">This month</option>
                        <option value="created_this_year">This year</option>
                        <option value="created_older">Older</option>
                    </Form.Select>
                    <hr />
                    <Form.Label><strong>Fecha de modif.:</strong></Form.Label>
                    <Form.Select onChange={handleModifiedSelect}>
                    <option value="">Select a range</option>
                        <option value="updated_recently">Recent</option>
                        <option value="updated_today">Today</option>
                        <option value="updated_this_week">This week</option>
                        <option value="updated_this_month">This month</option>
                        <option value="updated_this_year">This year</option>
                        <option value="updated_older">Older</option>
                    </Form.Select>
                    <hr />
                    <Form.Label><strong>Role:</strong></Form.Label>
                    <Form.Select onChange={handleRoleSelect}>
                        <option value="">Choose a role</option>
                        <option value="0">User</option>
                        <option value="1">Admin</option>
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
        switch (selectedRole) {
            case '0':
                if (note.admin) {
                    return false;
                }
                break;
            case '1':
                if (!note.admin) {
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
            <CreateUserModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleUserCreate={handleCreateUser}
            />
            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                user={selectedUser}
                users={users}
                handleUserUpdate={handleUserUpdate}
                handleUserDelete={handleUserDelete}
            />
            <AdminCrudTemplate
                items={sortedUsers}
                renderHeader={renderHeader}
                renderRow={renderRow}
                handleCreateModal={handleCreateModal}
                page={"users"}
                searchFunction={searchFunction}
                renderFilterOptions={renderFilterOptions}
                filterFunction={filterFunction}
            />
        </>
    );
};

export default AdminUsersBoard;
