import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); //clearing message
        setError(''); //clearing message
        setIsLoading(true)


        try {
            const response = await axios.post('http://localhost:5000/forgotPassword', { email });
            setMessage(response.data.message);
            setError('');
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setMessage(response.data.message || "Reset link sent successfully");
            }
            
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Failed to send reset link. Please try again later.";
            setError(errorMessage)
            setMessage(''); //Clearing previous message 
            
        } finally {
            setIsLoading(false)
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
                        disabled={isLoading}
                        className={`w-full bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
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