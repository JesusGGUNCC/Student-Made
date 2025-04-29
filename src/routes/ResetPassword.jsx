import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URLS } from '../common/urls';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        // Validate token when component mounts
        const validateToken = async () => {
            try {
                const response = await axios.post(API_URLS.validateResetToken, { token });
                setTokenValid(response.data.valid);
                if (!response.data.valid) {
                    setError("Invalid or expired reset link");
                }
            } catch (err) {
                setError("Error validating token");
                setTokenValid(false);
            }
        };

        if (token) {
            validateToken();
        } else {
            setTokenValid(false);
            setError("No reset token provided");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!tokenValid) {
            setError("Invalid or expired reset link");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }


        try {
            const response = await axios.post(API_URLS.resetPassword, {
                token,
                password
            });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "An unexpected error occurred");
        
        }
    };

    if (tokenValid === null) {
        return <div className="flex items-center justify-center min-h-screen">Validating token...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-lg font-bold text-center mb-4">Reset Password</h2>
                {tokenValid ? (
                    <form onSubmit={handleSubmit} className="space-y-4">


                        <div className = "relative">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type = {showPassword ? "text" : "password"}
                                value = {password}
                                onChange = {(e) => setPassword(e.target.value)}
                                className = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                                placeholder = "Enter new password"
                                required
                                
                            />
                            <button
                            type = "button"
                            className = "absolute right-3 top-8 text-gray-500"
                            onClick = {() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                            

                        </div>
    
                        <div className = "relative">
                            <label className ="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type = {showPassword ? "text" : "password"}
                                value = {confirmPassword}
                                onChange = {(e) => setConfirmPassword(e.target.value)}
                                className = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                                placeholder = "Confirm new password"
                                required
                             
                            />

                            <button
                            type = "button"
                            className = "absolute right-3 top-8 text-gray-500"
                            onClick = {() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                        </div>


                        {message && <p className="text-green-500 text-sm">{message}</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
                        >
                            Reset Password
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Link to="/forgot-password" className="text-green-700 hover:underline">
                            Request new reset link
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;