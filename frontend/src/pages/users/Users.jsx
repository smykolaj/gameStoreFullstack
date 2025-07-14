import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import apiClient from '../../config/api';
// import '../../styles/Users.css';
import {useUser} from '../../components/UserContext.jsx';
import UserForm from "../../components/UserForm.jsx";
import {User} from "../../validator.js";
import Modal from '../../components/Modal';
import Pagination from "../../components/Pagination.jsx";


const Users = () => {

    const {t} = useTranslation();
    const [users, setUsers] = useState([]);
    const {setLoggedInEmail, role, setRole, loggedInId, setLoggedInId} = useUser();
    const [formErrors, setFormErrors] = useState({});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0,
        pageSize: 7,
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers(pagination.currentPage);
    }, [pagination.currentPage]);
    const closeModal = () => {
        setIsDetailsModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    //
    // R
    //
    const fetchUsers = async (page) => {
        try {
            const response = await apiClient.get(`/users?page=${page}&limit=${pagination.pageSize}`);
            const {data, pagination: newPagination} = response.data;

            setUsers(data);
            setPagination((prev) => ({
                ...prev,
                ...newPagination,
            }));
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };
    const fetchUserDetails = async (userId) => {
        return apiClient.get(`/users/${userId}`);
    };
    const handleViewDetails = async (userId) => {
        try {
            const response = await fetchUserDetails(userId);
            if (response.status === 200) {
                setSelectedUser(response.data);
                setIsDetailsModalOpen(true);
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
            }));
        }
    };

    //
    // U
    //
    const editUser = async (formData) => {
        const id = selectedUser.id;
        let user = new User(formData);
        let validationErrors = user.validate();
        const url = `users/${id}`;

        if (validationErrors.length > 0) {
            const mappedErrors = {};
            validationErrors.forEach((error) => {
                if (error.includes('firstName')) mappedErrors.firstName = error;
                if (error.includes('lastName')) mappedErrors.lastName = error;
                if (error.includes('birthdate')) mappedErrors.birthdate = error;
                if (error.includes('email')) mappedErrors.email = error;
                if (error.includes('password')) mappedErrors.password = error;
                if (error.includes('repeatPassword')) mappedErrors.repeatPassword = error;
                if (error.includes('gender')) mappedErrors.gender = error;
            });
            setFormErrors(mappedErrors);
            return mappedErrors;
        }

        try {
            const response = await apiClient.patch(url, formData);

            if (response.status === 200) {
                closeModal()
                await fetchUsers(pagination.currentPage);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('firstName')) mappedErrors.firstName = error;
                    if (error.includes('lastName')) mappedErrors.lastName = error;
                    if (error.includes('birthdate')) mappedErrors.birthdate = error;
                    if (error.includes('email')) mappedErrors.email = error;
                    if (error.includes('password')) mappedErrors.password = error;
                    if (error.includes('gender')) mappedErrors.gender = error;
                });
                setFormErrors(mappedErrors);
                return mappedErrors;
            }
        }
    };
    const handleEdit = async (userId) => {
        try {
            const response = await fetchUserDetails(userId);
            if (response.status === 200) {
                setFormErrors(null);
                setSelectedUser(response.data);
                setIsEditModalOpen(true);
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };
    const handlePromote = async (userId, role) => {
        try {
            const response = await apiClient.post(`/users/promote${role}/${userId}`);
            if (response.status === 200) {
                alert(`${t('user_promoted')}${role} ID: ${userId}`);
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };

    //
    // D
    //
    const handleDelete = async (userId) => {
        if (window.confirm(t('delete_user_confirmation'))) {
            await apiClient.delete(`/users/${userId}`);

            if (loggedInId == userId) {
                await apiClient.post('/users/logout')
                setLoggedInEmail(null);
                setRole(null);
                setLoggedInId(null);

            }
            fetchUsers(pagination.currentPage)
        }
    };

    return (
        <div className="users-page">
            <h1>{t('users')}</h1>
            <table className="users-table">
                <thead>
                <tr>
                    <th>{t('id')}</th>
                    <th>{t('first_name')}</th>
                    <th>{t('last_name')}</th>
                    <th>{t('email')}</th>
                    <th>{t('actions')}</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => handleEdit(user.id)}
                                    disabled={(user.id !== loggedInId) && (role !== "Admin")}>{t('edit')}</button>
                            <button onClick={() => handleDelete(user.id)}
                                    disabled={(user.id !== loggedInId) && (role !== "Admin")}>{t('delete')}</button>
                            <button onClick={() => handleViewDetails(user.id)}
                                    disabled={(user.id !== loggedInId) && (role !== "Admin")}>{t('view_details')}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
                totalRecords={pagination.totalUsers}
            />

            {selectedUser && (
                <Modal isOpen={isDetailsModalOpen} onClose={closeModal}>
                    <h2>{t('user_details')}</h2>
                    <p><strong>{t('id')}:</strong> {selectedUser.id}</p>
                    <p><strong>{t('first_name')}:</strong> {selectedUser.firstName}</p>
                    <p><strong>{t('last_name')}:</strong> {selectedUser.lastName}</p>
                    <p><strong>{t('email')}:</strong> {selectedUser.email}</p>
                    <p><strong>{t('birthdate')}:</strong> {selectedUser.birthdate}</p>
                    <p><strong>{t('role')}:</strong> {selectedUser.role}</p>
                    <p><strong>{t('gender')}:</strong> {selectedUser.gender}</p>
                    <h3>{t('purchases')}</h3>
                    {selectedUser.purchases.length > 0 ? (
                        <ul>
                            {selectedUser.purchases.map((purchase, index) => (
                                <li key={index}>
                                    {purchase.gameName} - {purchase.currency} {purchase.gamePrice} ({purchase.purchaseDate})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>{t('no_purchases')}</p>
                    )}
                    <button
                        onClick={() => handlePromote(selectedUser.id, "Admin")}
                        disabled={(role !== "Admin")}
                    >
                        {t('promote_admin')}
                    </button>
                    <button
                        onClick={() => handlePromote(selectedUser.id, "Manager")}
                        disabled={(role !== "Admin")}
                    >
                        {t('promote_manager')}
                    </button>
                </Modal>)}


            <Modal isOpen={isEditModalOpen} onClose={closeModal}>

                <UserForm
                    initialData={selectedUser}
                    onSubmit={editUser}
                    buttonLabel="edit"
                    externalErrors={formErrors}
                />

            </Modal>


        </div>
    );
};

export default Users;
