import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UserForm = ({ initialData, onSubmit, buttonLabel, externalErrors }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (externalErrors) {
            setErrors(externalErrors);
        }
    }, [externalErrors]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const validationErrors = await onSubmit(formData);
        if (validationErrors) {
            setErrors(validationErrors);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '10px auto', textAlign: 'center' }}>
            <h1>{t(buttonLabel)}</h1>
            <div >
                <label>
                    {t('first_name')}
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>
                {errors.firstName && <p style={{ color: 'red' }}>{t(errors.firstName)}</p>}
            </div>
            <div >
                <label>
                    {t('last_name')}
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.lastName && <p style={{ color: 'red' }}>{t(errors.lastName)}</p>}
            </div>
            <div >
                <label>
                    {t('birthdate')}
                    <input
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.birthdate && <p style={{ color: 'red' }}>{t(errors.birthdate)}</p>}
            </div>
            <div >
                <label>
                    {t('email')}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>
                {errors.email && <p style={{ color: 'red' }}>{t(errors.email)}</p>}
            </div>
            <div >
                <label>
                    {t('password')}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%' }}
                    />
                </label>
                {errors.password && <p style={{ color: 'red' }}>{t(errors.password)}</p>}
            </div>
            <div >
                <label>
                    {t('repeat_password')}
                    <input
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.repeatPassword && <p style={{ color: 'red' }}>{t(errors.repeatPassword)}</p>}
            </div>
            <div >
                <label>
                    {t('gender')}
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    >
                        <option value="">{t('select_gender')}</option>
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                        <option value="Other">{t('other')}</option>
                    </select>
                </label>
                {errors.gender && <p style={{ color: 'red' }}>{t(errors.gender)}</p>}
            </div>
            <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
                {t(buttonLabel)}
            </button>
        </div>
    );
};

export default UserForm;
