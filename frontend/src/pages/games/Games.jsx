import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import apiClient from '../../config/api';
// import '../../styles/Users.css';
import {useUser} from '../../components/UserContext.jsx';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination.jsx';
import {Game, Purchase} from "../../validator.js";
import GameForm from "../../components/GameForm.jsx";
import PurchaseForm from "../../components/PurchaseForm.jsx";

const Games = () => {
    const {t} = useTranslation();
    const {role, loggedInId} = useUser();
    const [formErrors, setFormErrors] = useState({});
    const [games, setGames] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalGames: 0,
        pageSize: 7,
    });
    const [selectedGame, setSelectedGame] = useState(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const [initialPurchaseData, setInitialPurchaseData] = useState(null);


    const initialData = {
        name: '',
        author: '',
        releaseDate: '',
        price: '',
        genre: '',
    };


    useEffect(() => {
        fetchGames(pagination.currentPage);
    }, [pagination.currentPage]);

    const closeModal = () => {
        setIsDetailsModalOpen(false);
        setIsBuyModalOpen(false);
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setIsBuyModalOpen(false)
        setSelectedGame(null);
    };


    //
    // C
    //
    const handleBuy = async (gameId) => {
        const date = new Date();
        const realDate = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        let PurchaseData = {
            gameId: gameId,
            userId: loggedInId,
            purchaseDate: realDate,
            currency: ''
        };
        setInitialPurchaseData(PurchaseData);
        setFormErrors(null);
        setIsBuyModalOpen(true)

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
                await fetchGames(pagination.currentPage);
            }
        } catch (err) {
            console.log(err)
            if (err.response && err.response.data) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('userId')) mappedErrors.userId = error;
                    if (error.includes('gameId')) mappedErrors.gameId = error;
                    if (error.includes('purchaseDate')) mappedErrors.purchaseDate = error;
                    if (error.includes('currency')) mappedErrors.currency = error;
                });
                setFormErrors(mappedErrors); // Update formErrors
                return mappedErrors; // Return errors to UserForm
            }
        }
    };

    const handleCreate = () => {
        setFormErrors(null);

        setIsCreateModalOpen(true);
    };

    const createGame = async (formData) => {
        setFormErrors(null);

        let game = new Game(formData);
        let validationErrors = game.validate();
        const url = `games/`;

        if (validationErrors.length > 0) {
            const mappedErrors = {};
            validationErrors.forEach((error) => {
                if (error.includes('name')) mappedErrors.name = error;
                if (error.includes('author')) mappedErrors.author = error;
                if (error.includes('releaseDate')) mappedErrors.releaseDate = error;
                if (error.includes('price')) mappedErrors.price = error;
                if (error.includes('genre')) mappedErrors.genre = error;
            });
            setFormErrors(mappedErrors);
            return mappedErrors;
        }

        try {
            const response = await apiClient.post(url, formData);

            if (response.status === 200) {
                setFormErrors(null);
                closeModal();
                await fetchGames(pagination.currentPage);
            }

        } catch (err) {

            if (err.response && err.response.data) {
                if( err.response.data.errors.length === 1 ) {
                    alert(t(err.response.data.errors.at(0)));
                    closeModal();
                }
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('name')) mappedErrors.name = error;
                    if (error.includes('author')) mappedErrors.author = error;
                    if (error.includes('releaseDate')) mappedErrors.releaseDate = error;
                    if (error.includes('price')) mappedErrors.price = error;
                    if (error.includes('genre')) mappedErrors.genre = error;
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
    const fetchGames = async (page) => {
        try {
            const response = await apiClient.get(`/games?page=${page}&limit=${pagination.pageSize}`);
            const {data, pagination: newPagination} = response.data;

            setGames(data);
            setPagination((prev) => ({
                ...prev,
                ...newPagination,
            }));
        } catch (err) {
            console.error('Error fetching games:', err);
        }
    };

    const handleViewDetails = async (gameId) => {
        try {
            const response = await fetchGameDetails(gameId);
            if (response.status === 200) {
                setSelectedGame(response.data); // Set the fetched game details
                setIsDetailsModalOpen(true); // Open the modal
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };

    const fetchGameDetails = async (gameId) => {
        return apiClient.get(`/games/${gameId}`);
    };
    //
    // U
    //
    const handleEdit = async (gameId) => {
        try {
            const response = await fetchGameDetails(gameId);
            if (response.status === 200) {
                setSelectedGame(response.data); // Set the fetched game details
                setIsEditModalOpen(true); // Open the modal
            }
        } catch (err) {
            alert(t(err.response.data.errors.at(0)));
        }
    };

    const editGame = async (formData) => {
        const id = selectedGame.id;
        let game = new Game(formData);
        let validationErrors = game.validate();
        const url = `games/${id}`;

        if (validationErrors.length > 0) {
            const mappedErrors = {};
            validationErrors.forEach((error) => {
                if (error.includes('name')) mappedErrors.name = error;
                if (error.includes('author')) mappedErrors.author = error;
                if (error.includes('releaseDate')) mappedErrors.releaseDate = error;
                if (error.includes('price')) mappedErrors.price = error;
                if (error.includes('genre')) mappedErrors.genre = error;
            });
            setFormErrors(mappedErrors);
            return mappedErrors;
        }

        try {
            const response = await apiClient.patch(url, formData);

            if (response.status === 200) {
                setFormErrors(null);
                closeModal();
                await fetchGames(pagination.currentPage);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    if (error.includes('name')) mappedErrors.name = error;
                    if (error.includes('author')) mappedErrors.author = error;
                    if (error.includes('releaseDate')) mappedErrors.releaseDate = error;
                    if (error.includes('price')) mappedErrors.price = error;
                    if (error.includes('genre')) mappedErrors.genre = error;
                });
                setFormErrors(mappedErrors);
                return mappedErrors;
            }
        }
    };


    //
    // D
    //


    const handleDelete = async (gameId) => {
        if (window.confirm(t('delete_game_confirmation'))) {
            try {
                await apiClient.delete(`/games/${gameId}`);
                fetchGames(pagination.currentPage);
            } catch (err) {
                alert(t(err.response.data.errors.at(0)));
            }
        }
    };


    return (
        <div className="users-page">
            <h1>{t('games')}</h1>
            <button onClick={handleCreate}
                    disabled={(role !== "Admin") && (role !== "Manager")}>
                {t('create')}</button>
            <table className="users-table">
                <thead>
                <tr>
                    <th>{t('id')}</th>
                    <th>{t('name')}</th>
                    <th>{t('author')}</th>
                    <th>{t('price')}</th>
                    <th>{t('actions')}</th>
                </tr>
                </thead>
                <tbody>
                {games.map((game) => (
                    <tr key={game.id}>
                        <td>{game.id}</td>
                        <td>{game.name}</td>
                        <td>{game.author}</td>
                        <td>{game.price}</td>
                        <td>
                            <button onClick={() => handleEdit(game.id)}
                                    disabled={(role !== "Admin") && (role !== "Manager")}>
                                {t('edit')}</button>
                            <button onClick={() => handleViewDetails(game.id)}>
                                {t('view_details')}</button>
                            <button
                                onClick={() => handleDelete(game.id)}
                                disabled={(role !== "Admin") && (role !== "Manager")}>
                                {t('delete')}</button>
                            <button
                                onClick={() => handleBuy(game.id)}
                                disabled={!role}>
                                {t('buy')}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={goToPage}
                totalRecords={pagination.totalGames}
            />

            {selectedGame && (
                <Modal isOpen={isDetailsModalOpen} onClose={closeModal}>
                    <h2>{t('game_details')}</h2>
                    <p><strong>{t('id')}:</strong> {selectedGame.id}</p>
                    <p><strong>{t('name')}:</strong> {selectedGame.name}</p>
                    <p><strong>{t('author')}:</strong> {selectedGame.author}</p>
                    <p><strong>{t('release_date')}:</strong> {selectedGame.releaseDate}</p>
                    <p><strong>{t('price')}:</strong> {selectedGame.price}</p>
                    <p><strong>{t('genre')}:</strong> {selectedGame.genre}</p>
                    <p><strong>{t('latest_purchase')}:</strong> {selectedGame.buyersData.latestPurchase}</p>
                    <p><strong>{t('total_purchases')}:</strong> {selectedGame.buyersData.totalPurchases}</p>
                    <p><strong>{t('most_frequent_gender')}:</strong> {selectedGame.buyersData.mostFrequentGender}</p>

                </Modal>
            )}

            <Modal isOpen={isEditModalOpen} onClose={closeModal}>
                <GameForm
                    initialData={selectedGame}
                    onSubmit={editGame}
                    buttonLabel={'edit'}
                    externalErrors={formErrors}
                />
            </Modal>

            <Modal isOpen={isCreateModalOpen} onClose={closeModal}>
                <GameForm
                    initialData={initialData}
                    onSubmit={createGame}
                    buttonLabel={'create'}
                    externalErrors={formErrors}
                />
            </Modal>

            <Modal isOpen={isBuyModalOpen} onClose={closeModal}>

                <PurchaseForm
                    initialData={initialPurchaseData}
                    onSubmit={createPurchase}
                    buttonLabel={"create"}
                    externalErrors={formErrors}
                    role={role}
                />

            </Modal>
        </div>
    )
        ;
};

export default Games;
