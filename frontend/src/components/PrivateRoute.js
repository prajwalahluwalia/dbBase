import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Named import

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            // Decode token to check for expiration
            const decodedToken = jwtDecode(token); // Use jwtDecode here
            const currentTime = Date.now() / 1000;  // current time in seconds

            if (decodedToken.exp < currentTime) {
                // Token has expired, redirect to login
                localStorage.removeItem('token');
                return <Navigate to="/login" />;
            }

            // If token is valid and not expired, render the protected component
            return children;
        } catch (error) {
            // Handle any decoding errors (e.g., token is malformed)
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }
    }

    // If no token, redirect to login
    return <Navigate to="/login" />;
};

export default PrivateRoute;
