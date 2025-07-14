import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../config/api';
// import '../../styles/Users.css';
import { useUser } from '../../components/UserContext.jsx';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination.jsx';
import {Purchase} from "../../validator.js";
import PurchaseForm from "../../components/PurchaseForm.jsx";

const Purchases = () => {
    const { t } = useTranslation();
    const { role, loggedInId } = useUser();
    const [formErrors, setFormErrors] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalPurchases: 0,
        pageSize: 7,
    });
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const initialData = {
        gameId: '',
        userId: '',
        purchaseDate: '',
        currency: '',
    };

    useEffect(() => {
        fetchPurchases(pagination.currentPage);
    }, [pagination.currentPage]);

    const closeModal = () => {
        setIsDetailsModalOpen(false);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedPurchase(null);
    };


    //
    // C
    //

    const handleCreate =  () => {
        setFormErrors(null);
        setIsCreateModalOpen(true);
    };

    const createPurchase = async (formData) => {

        let purchase = new Purchase(formData);
        let validationErrors = purchase.validate();
        const url = `purchases/`;

        if (validationErrors.length > 0) {
            const mappedErrors = {};
            validationErrors.forEach((error) => {
                if (error.includes('userId')) mappedErrors.userId = error;
                if (error.includes('gameId')) mappedErrors.gameId = error;
                if (error.includes('purchaseDate')) mappedErrors.purchaseDate = error;
                if (error.includes('currency')) mappedErrors.currency = error;
            });
            setFormErrors(mappedErrors);
            return mappedErrors;
        }

        try {
            const response = await apiClient.post(url, formData);

            if (response.status === 200) {
                setFormErrors(null);
                closeModal()
                await fetchPurchases(pagination.currentPage);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('userId')) mappedErrors.userId = error;
                    if (error.includes('gameId')) mappedErrors.gameId = error;
                    if (error.includes('purchaseDate')) mappedErrors.purchaseDate = error;
                    if (error.includes('currency')) mappedErrors.currency = error;
                });
                setFormErrors(mappedErrors);
                return mappedErrors;
            }
        }
    };
    //
    // R
    //
    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
            }));
        }
    };

    const fetchPurchaseDetails = async (purchaseId) => {
        return apiClient.get(`/purchases/${purchaseId}`);
    };
    const fetchPurchases = async (page) => {
        try {
            const response = await apiClient.get(`/purchases?page=${page}&limit=${pagination.pageSize}`);
            const { data, pagination: newPagination } = response.data;

            setPurchases(data);
            setPagination((prev) => ({
                ...prev,
                ...newPagination,
            }));
        } catch (err) {
            console.error('Error fetching purchases:', err);
        }
    };

    const handleViewDetails = async (purchaseId) => {
        try {
            const response = await fetchPurchaseDetails(purchaseId);
            if (response.status === 200) {
                setSelectedPurchase(response.data);
                setIsDetailsModalOpen(true);
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };


    //
    // U
    //

    const handleEdit = async (userId) => {
        try {
            const response = await fetchPurchaseDetails(userId);
            if (response.status === 200) {
                setSelectedPurchase(response.data);
                setIsEditModalOpen(true);
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };
    const editPurchase = async (formData) => {
        const id = selectedPurchase.id;
        let purchase = new Purchase(formData);
        let validationErrors = purchase.validate();
        const url = `purchases/${id}`;

        if (validationErrors.length > 0) {
            const mappedErrors = {};
            validationErrors.forEach((error) => {
                if (error.includes('userId')) mappedErrors.userId = error;
                if (error.includes('gameId')) mappedErrors.gameId = error;
                if (error.includes('purchaseDate')) mappedErrors.purchaseDate = error;
                if (error.includes('currency')) mappedErrors.currency = error;
            });
            setFormErrors(mappedErrors);
            return mappedErrors;
        }

        try {
            const response = await apiClient.patch(url, formData);

            if (response.status === 200) {
                setFormErrors(null);
                closeModal()
                await fetchPurchases(pagination.currentPage);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('userId')) mappedErrors.userId = error;
                    if (error.includes('gameId')) mappedErrors.gameId = error;
                    if (error.includes('purchaseDate')) mappedErrors.purchaseDate = error;
                    if (error.includes('currency')) mappedErrors.currency = error;
                });
                setFormErrors(mappedErrors);
                return mappedErrors;
            }
        }
    };


    //
    // D
    //

    const handleDelete = async (purchaseId) => {
        if (window.confirm(t('delete_purchase_confirmation'))) {
            try {
                await apiClient.delete(`/purchases/${purchaseId}`);
                fetchPurchases(pagination.currentPage);
            } catch (err) {
                alert(t(err.response.data.errors.at(0)));
            }
        }
    };



    return (
        <div className="users-page">
            <h1>{t('purchases')}</h1>
            <button onClick={handleCreate}
                    disabled={(role !== "Admin") && (role !== "Manager")}>
                {t('create')}</button>
            <table className="users-table">
                <thead>
                <tr>
                    <th>{t('id')}</th>
                    <th>{t('user_id')}</th>
                    <th>{t('game_id')}</th>
                    <th>{t('purchase_date')}</th>
                    <th>{t('currency')}</th>
                    <th>{t('actions')}</th>
                </tr>
                </thead>
                <tbody>
                {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                        <td>{purchase.id}</td>
                        <td>{purchase.userId}</td>
                        <td>{purchase.gameId}</td>
                        <td>{purchase.purchaseDate}</td>
                        <td>{purchase.currency}</td>
                        <td>
                            <button onClick={() => handleEdit(purchase.id)}
                                    disabled={role !== "Admin" && role !== "Manager"}
                            >
                                {t('edit')}</button>
                            <button onClick={() => handleViewDetails(purchase.id)}
                                    disabled={(purchase.userId !== loggedInId) && ((role !== "Admin") && (role !== "Manager"))}>
                                {t('view_details')}</button>
                            <button
                                onClick={() => handleDelete(purchase.id)}
                                disabled={(purchase.userId !== loggedInId) && ((role !== "Admin") && (role !== "Manager"))}>
                                {t('delete')}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
                totalRecords={pagination.totalPurchases}
            />

            {selectedPurchase && (
                <Modal isOpen={isDetailsModalOpen} onClose={closeModal}>
                    <h2>{t('purchase_details')}</h2>
                    <p><strong>{t('id')}:</strong> {selectedPurchase.id}</p>
                    <p><strong>{t('user_id')}:</strong> {selectedPurchase.userId}</p>
                    <p>
                        <strong>{t('buyer_name')}:</strong> {selectedPurchase.userFirstName + " " + selectedPurchase.userLastName}
                    </p>
                    <p>
                        <strong>{t('birthdate')}:</strong> {selectedPurchase.userBirthdate}
                    </p>
                    <p>
                        <strong>{t('gender')}:</strong> {selectedPurchase.userGender}
                    </p>
                    <p><strong>{t('game_id')}:</strong> {selectedPurchase.gameId}</p>
                    <p><strong>{t('game_name')}:</strong> {selectedPurchase.gameName}</p>
                    <p><strong>{t('game_author')}:</strong> {selectedPurchase.gameAuthor}</p>
                    <p><strong>{t('purchase_date')}:</strong> {selectedPurchase.purchaseDate}</p>
                    <p><strong>{t('game_price')}:</strong> {selectedPurchase.gamePrice}</p>
                    <p><strong>{t('currency')}:</strong> {selectedPurchase.currency}</p>
                </Modal>


            )}
            <Modal isOpen={isEditModalOpen  && (role ==="Admin"||role ==="Manager" ) } onClose={closeModal}>

                <PurchaseForm
                    initialData={selectedPurchase}
                    onSubmit={editPurchase}
                    buttonLabel={'edit'}
                    externalErrors={formErrors}
                    role={ role}
                />

            </Modal>

            <Modal isOpen={isCreateModalOpen && (role ==="Admin"||role ==="Manager" )} onClose={closeModal}>

                <PurchaseForm
                    initialData={initialData}
                    onSubmit={createPurchase}
                    buttonLabel={"create"}
                    externalErrors={formErrors}
                    role={ role}
                />

            </Modal>
        </div>
    );
};

export default Purchases;
