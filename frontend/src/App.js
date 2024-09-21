import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log('Fetching data from Flask...');
        axios.get('/')
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
                setError('Failed to fetch data.');  // Set error message
            });
    }, []);

    return (
        <div>
            <h1 style={{color: "#000"}}>{message || error}</h1>  {/* Show error if exists */}
        </div>
    );
}

export default App;
