import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../static/styles.css'; 
import logo from '../static/images/db.png'; 
import config from '../config';
import Login from '../components/LoginScreen'; // Import your Login component

const Layout = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchCurrentUser = async () => {
                try {
                    const response = await axios.get(`${config.AUTH_URL}/current_user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser(response.data.username);
                    localStorage.setItem('user', response.data.username);
                } catch (error) {
                    console.error("Error fetching current user:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            };
            fetchCurrentUser();
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Check if children is the Login component
    const isLoginPage = React.Children.toArray(children).some(
        child => child.type === Login
    );
    console.log(isLoginPage)
    return (
        <div className="layout-container">
            <header>
                <div className="header-left">
                    <img src={logo} alt="Database Logo" className="header-logo" />
                    <h1>DB BASE</h1>
                </div>
                <div className="auth-buttons">
                    {user ? (
                        <>
                            <span className='user-intro'>Welcome, {user}!</span>
                            <button onClick={handleLogout} className="auth-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="auth-button">Login</Link>
                            <Link to="/signup" className="auth-button">Sign Up</Link>
                        </>
                    )}
                </div>
            </header>
            <main>{children}</main>
            
            {/* Conditionally render the footer only when not on the login page */}
            {}
            {/* {!isLoginPage && (
                <footer>
                    <p>&copy; 2024 DB BASE. All rights reserved.</p>
                </footer>
            )} */}
        </div>
    );
};

export default Layout;
