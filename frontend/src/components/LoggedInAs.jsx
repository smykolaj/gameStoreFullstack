import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from './UserContext';
const LoggedInAs = () => {
    const { t } = useTranslation();
    const { loggedInEmail } = useUser();

    return (
        <div className="logged-in-as">
            {loggedInEmail ? (
                <p>{t('logged_in_as')} <strong>{loggedInEmail}</strong></p>
            ) : (
                <p>{t('not_logged_in')}</p>
            )}
        </div>
    );
};

export default LoggedInAs;
