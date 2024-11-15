import React, { useState } from 'react';
import axios from 'axios';
import '../static/styles.css'; // Import styles
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(config.AUTH_URL+'/signup', {
                firstName,
                lastName,
                email,
                username,
                password
            });
            setSuccess('Signup successful! Please log in.');
            setError('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setUsername('');
            setPassword('');
            
            localStorage.setItem('token', response.data.token);
            navigate('/app')

        } catch (err) {
            console.error('Error during signup:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.error); // Adjust based on your backend response
            } else {
                setError('An error occurred during signup.'); 
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
