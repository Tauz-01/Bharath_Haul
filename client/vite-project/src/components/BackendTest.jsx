import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendTest = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/test');
                setMessage(response.data);
                setError('');
            } catch (err) {
                console.error("Backend connection error:", err);
                setError('Failed to connect to backend. Is it running?');
                setMessage('');
            }
        };

        checkConnection();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
            <h3 className="font-bold text-sm mb-2">Backend Status:</h3>
            {message && <p className="text-green-600 font-semibold">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {!message && !error && <p className="text-gray-500 text-sm">Connecting...</p>}
        </div>
    );
};

export default BackendTest;
