import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        axios.get(`${backendUrl}`)
            .then(response => setMessage(response.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">MERN Stack SaaS Boilerplate</h1>
                <p className="text-center text-gray-600">Message from backend: <span className="font-semibold">{message}</span></p>
            </div>
        </div>
    );
}

export default App;