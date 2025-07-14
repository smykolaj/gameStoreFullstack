import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PurchaseForm = ({ initialData, onSubmit, buttonLabel, externalErrors, role }) => {
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
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h1>{t(buttonLabel)}</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('game_id')}
                    <input
                        type="number"
                        name="gameId"
                        value={formData.gameId}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                        disabled={role !== "Admin" && role !== "Manager"}
                    />
                </label>
                {errors.gameId && <p style={{ color: 'red' }}>{t(errors.gameId)}</p>}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('user_id')}
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                        disabled={role !== "Admin" && role !== "Manager"}

                    />
                </label>
                {errors.userId && <p style={{ color: 'red' }}>{t(errors.userId)}</p>}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('purchase_date')}
                    <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%', marginTop: '5px' }}
                        disabled={role !== "Admin" && role !== "Manager"}

                    />
                </label>
                {errors.purchaseDate && <p style={{ color: 'red' }}>{t(errors.purchaseDate)}</p>}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    {t('currency')}
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        style={{display: 'block', width: '100%', marginTop: '5px'}}
                    >
                        <option value="">{t('select_currency')}</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="PLN">PLN</option>
                        <option value="GBP">GBP</option>
                    </select>
                </label>
                {errors.currency && <p style={{ color: 'red' }}>{t(errors.currency)}</p>}
            </div>
            <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
                {t(buttonLabel)}
            </button>
        </div>
    );
};

export default PurchaseForm;
