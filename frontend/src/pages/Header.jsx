import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoggedInAs from '../components/LoggedInAs'; // Import the LoggedInAs component
// import '../styles/MainPage.css';
import {useUser} from '../components/UserContext.jsx';
import apiClient from "../config/api.js"; // Import CSS

const Header = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { setLoggedInEmail, setRole, setLoggedInId, loggedInEmail } = useUser();


    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="main-page-wrapper">
            <header className="main-header">
                <LoggedInAs/>
                <div className="language-select">
                    <img
                        src="../../assets/gb.png"
                        alt="English"
                        className="flag"
                        onClick={() => changeLanguage('en')}
                    />
                    <img
                        src="../../assets/pl.png"
                        alt="Polish"
                        className="flag"
                        onClick={() => changeLanguage('pl')}
                    />
                </div>
                <button onClick={async () => {
                    await apiClient.post('/users/logout')
                    setLoggedInEmail(null);
                    setRole(null);
                    setLoggedInId(null);

                }
                } className="main-button"
                        disabled={!loggedInEmail}
                >
                    {t('logout')}
                </button>
                <button onClick={() => navigate('/')} className="main-button">
                    {t('go_to_main')}
                </button>
            </header>

            <main className="main-content">
                <Outlet/>
            </main>
        </div>
    );
};

export default Header;
