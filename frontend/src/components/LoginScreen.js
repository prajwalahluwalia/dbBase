import React, { useState } from 'react';
import axios from 'axios';
import '../static/styles.css';
import '../static/styles/loginScreen.css';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${config.AUTH_URL}/login`, {
                username,
                password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', response.data.username);
            onLogin(response.data.username);

            setError('');
            navigate('/app');
        } catch (err) {
            console.error('Error during login:', err);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    className="login-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
        
    );
};

export default Login;
