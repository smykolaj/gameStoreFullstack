import React, {createContext, useContext, useEffect, useState} from 'react';
import apiClient from "../config/api.js";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [loggedInEmail, setLoggedInEmail] = useState(null);
    const [loggedInId, setLoggedInId] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('users/me');
                if (response.status === 200) {
                    setLoggedInEmail(response.data.email);
                    setLoggedInId(response.data.id);
                    setRole(response.data.role);
                }
            } catch {
                setLoggedInEmail(null);
                setLoggedInId(null);
                setRole(null);
            }
        };

        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={{ loggedInEmail, setLoggedInEmail, role, setRole,  loggedInId, setLoggedInId }}>
            {children}
        </UserContext.Provider>
    );
};
