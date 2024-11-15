import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/LayoutScreen';
import Home from './components/HomeScreen';
import Login from './components/LoginScreen';
import Signup from './components/SignUpScreen';
import PrivateRoute from './components/PrivateRoute'

import './static/styles.css'; // Import your CSS file

function App() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/');
                setMessage(response.data.message);
                setError('');
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data from the API.');
            }
        };

        fetchData();
    }, []);

    const handleLogin = (username) => {
        setUser(username);
    };

    return (
        <Router>
            <Layout user={user} onLogout={() => setUser(null)}>
                <Routes>
                    <Route 
                        path="/app" 
                        element={
                            <PrivateRoute>
                                <Home message={message} error={error} />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
