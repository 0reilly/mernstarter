import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                const response = await axios.get(`${backendUrl}`);
                setMessage(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Failed to fetch data from the backend.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">MERN Stack SaaS Boilerplate</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-semibold mb-4">Welcome to Your App</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 border-l-4 border-blue-500 p-4">
                            <p className="text-gray-700">
                                Message from backend: <span className="font-medium">{message}</span>
                            </p>
                        </div>
                    )}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>React frontend with Tailwind CSS</li>
                            <li>Node.js backend</li>
                            <li>MongoDB database integration</li>
                            <li>Docker containerization</li>
                        </ul>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center">&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
