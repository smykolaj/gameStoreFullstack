import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/api';
import UserForm from '../../components/UserForm';
import { User } from '../../validator';

const Register = () => {
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        let user = new User(formData);
        let validationErrors = user.validate();

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
            const response = await apiClient.post('/users', formData);

            if (response.status === 200) {
                navigate('/login');
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

    const initialData = {
        firstName: '',
        lastName: '',
        birthdate: '',
        email: '',
        password: '',
        repeatPassword: '',
        gender: '',
    };

    return (
        <UserForm
            initialData={initialData}
            onSubmit={handleRegister}
            buttonLabel="register"
            externalErrors={formErrors}
        />
    );
};

export default Register;
