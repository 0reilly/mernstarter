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
        <div className="App">
            <h1>MERN Stack SaaS Boilerplate</h1>
            <p>Message from backend: {message}</p>
        </div>
    );
}

export default App;
