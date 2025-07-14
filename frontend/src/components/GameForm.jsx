import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GameForm = ({ initialData, onSubmit, buttonLabel, externalErrors }) => {
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
                    {t('name')}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.name && <p style={{ color: 'red' }}>{t(errors.name)}</p>}
            </div>
            <div >
                <label>
                    {t('author')}
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.author && <p style={{ color: 'red' }}>{t(errors.author)}</p>}
            </div>
            <div >
                <label>
                    {t('release_date')}
                    <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.releaseDate && <p style={{ color: 'red' }}>{t(errors.releaseDate)}</p>}
            </div>
            <div >
                <label>
                    {t('price')}
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={{ display: 'block', width: '100%'}}
                    />
                </label>
                {errors.price && <p style={{ color: 'red' }}>{t(errors.price)}</p>}
            </div>
            <div >
                <label>
                    {t('genre')}
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        style={{display: 'block', width: '100%'}}
                    >
                        <option value="">{t('select_genre')}</option>
                        <option value="Action">{t('action')}</option>
                        <option value="RPG">{t('RPG')}</option>
                        <option value="Puzzle">{t('puzzle')}</option>
                        <option value="Survival">{t('survival')}</option>
                        <option value="Platformer">{t('platformer')}</option>
                        <option value="Other">{t('other')}</option>
                    </select>
                </label>
                {errors.genre && <p style={{color: 'red'}}>{t(errors.genre)}</p>}
            </div>
            <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
                {t(buttonLabel)}
            </button>
        </div>
    );
};

export default GameForm;
