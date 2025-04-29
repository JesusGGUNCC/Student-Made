import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); //clearing message
        setError(''); //clearing message
        try {
            const response = await axios.post(API_URLS.forgotPassword, { email });
            setMessage(response.data.message);
            setError('');
            
        } catch (err) {
            if (err.response && err.response.status === 404){
                setError("No account found with this email address")
            }else{
                setError(err.response?.data?.error || "An unexpected error occurred ");

            }
            setMessage(''); //Clearing previous message 
            
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="bg-white p-8 shadow-md rounded-md w-96">
                <h2 className="text-lg font-bold text-center mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    {message && (<div className = "p-3 bg-green-50 text-green-70 rounded-md">
                        {message}
                        </div>
                    )}


                    {error && (<div className = "p-3 bg-red-50 text-red-700 rounded-mb">
                        {error}
                    </div>
                    
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition"
                    >
                        Send Reset Link
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link to="/login" className="text-green-700 hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;