import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext.jsx';

const Login = () => {
    const { t } = useTranslation();
    const { setLoggedInEmail, setRole, setLoggedInId } = useUser();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            setErrors({});
            const response = await apiClient.post('users/login', formData);
            if (response.status === 200) {
                setLoggedInEmail(formData.email);
                setLoggedInId(response.data.id);
                setRole(response.data.role);
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const backendErrors = err.response.data.errors;
                const mappedErrors = {};

                if (backendErrors.includes('user_not_found')) {
                    mappedErrors.email = 'user_not_found';
                }
                if (backendErrors.includes('invalid_credentials')) {
                    mappedErrors.password = 'invalid_credentials';
                }

                setErrors(mappedErrors);
            } else {
                alert(t('unexpected_error'));
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h1>{t('login')}</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('email')}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                    />
                </label>
                {errors.email && <p style={{ color: 'red' }}>{t(errors.email)}</p>}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('password')}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                    />
                </label>
                {errors.password && <p style={{ color: 'red' }}>{t(errors.password)}</p>}
            </div>
            <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
                {t('login')}
            </button>
        </div>
    );
};

export default Login;
