import React, { createContext, useState, useEffect } from 'react';
import { API_URLS } from '../common/urls';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check localStorage on initial load
        const username = localStorage.getItem('username');
        setIsLoggedIn(!!username);
    }, []);

    
    useEffect(() => {
        const checkRememberedSession = async () => {
            try {
                const response = await axios.get(API_URLS.checkRemembered);
                if (response.data.remembered) {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error("Error checking remembered session:", err);
            }
        };
        
        checkRememberedSession();
    }, []);

    const login = (username) => {
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('username');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};