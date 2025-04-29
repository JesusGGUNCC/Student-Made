// src/routes/AuthContent.jsx - Modified
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('customer'); // 'customer', 'vendor', or 'admin'

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                // First check localStorage
                const username = localStorage.getItem('username');
                
                if (username) {
                    // Also check remembered session on backend
                    try {
                        const response = await axios.get(API_URLS.checkRemembered);
                        if (response.data.remembered) {
                            setUser({ username: response.data.username });
                            setIsLoggedIn(true);
                            
                            // TODO: Fetch user role from backend
                            // For now we'll just check if they're a vendor based on username
                            if (username.includes('vendor')) {
                                setUserRole('vendor');
                            }
                        } else {
                            // Session expired on server, clear local storage
                            localStorage.removeItem('username');
                        }
                    } catch (err) {
                        console.error("Error checking remembered session:", err);
                        // Fallback to local storage
                        setUser({ username });
                        setIsLoggedIn(true);
                    }
                }
            } catch (error) {
                console.error("Auth status check error:", error);
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    const login = (username, role = 'customer') => {
        localStorage.setItem('username', username);
        setUser({ username });
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const logout = async () => {
        try {
            // Call logout endpoint if available
            // await axios.post(API_URLS.logout);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('username');
            setUser(null);
            setIsLoggedIn(false);
            setUserRole('customer');
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                isLoggedIn, 
                login, 
                logout, 
                user, 
                loading,
                userRole,
                setUserRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};