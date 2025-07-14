import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h1>{t('main_menu_title')}</h1>

            <div style={{ margin: '10px' }}>
                <button onClick={() => navigate('/login')}>{t('login')}</button>
            </div>
            <div style={{ margin: '10px' }}>
                <button onClick={() => navigate('/register')}>{t('register')}</button>
            </div>
            <div style={{ margin: '10px' }}>
                <button onClick={() => navigate('/users')}>{t('view_users')}</button>
            </div>
            <div style={{ margin: '10px' }}>
                <button onClick={() => navigate('/purchases')}>{t('view_purchases')}</button>
            </div>
            <div style={{ margin: '10px' }}>
                <button onClick={() => navigate('/games')}>{t('view_games')}</button>
            </div>
        </div>
    );
};

export default Home;
