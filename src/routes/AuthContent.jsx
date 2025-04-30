// src/routes/AuthContent.jsx - Enhanced with user details
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('customer'); // 'customer', 'vendor', or 'admin'
    const [error, setError] = useState(null);

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                // First check localStorage
                const username = localStorage.getItem('username');
                const storedUserRole = localStorage.getItem('userRole') || 'customer';
                
                if (username) {
                    // Try to fetch user details from backend
                    try {
                        // This would be a real API call in production
                        // const response = await axios.get(`${API_URLS.userDetails}?username=${username}`);
                        // const userData = response.data;
                        
                        // For now, mock the user data
                        const userData = {
                            username,
                            email: `${username}@example.com`,
                            role: storedUserRole
                        };
                        
                        setUser(userData);
                        setUserRole(userData.role);
                        setIsLoggedIn(true);
                        localStorage.setItem('userRole', userData.role);
                    } catch (err) {
                        console.error("Error fetching user details:", err);
                        
                        // Create minimal user object from localStorage
                        setUser({ 
                            username,
                            role: storedUserRole
                        });
                        setUserRole(storedUserRole);
                        setIsLoggedIn(true);
                    }
                }
            } catch (error) {
                console.error("Auth status check error:", error);
                setError("Failed to verify authentication status");
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);

    const login = (username, role = 'customer') => {
        // Save user info to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role);
        
        // Set user state
        setUser({ 
            username,
            email: `${username}@example.com`, // Mock email (would come from API in real app)
            role
        });
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
            // Clear localStorage
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            
            // Reset state
            setUser(null);
            setIsLoggedIn(false);
            setUserRole('customer');
        }
    };

    // Update user info
    const updateUserInfo = (newUserInfo) => {
        // Update local user state
        setUser(prev => ({
            ...prev,
            ...newUserInfo
        }));
        
        // If role is changed, update userRole state and localStorage
        if (newUserInfo.role && newUserInfo.role !== userRole) {
            setUserRole(newUserInfo.role);
            localStorage.setItem('userRole', newUserInfo.role);
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
                error,
                userRole,
                setUserRole,
                updateUserInfo
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};