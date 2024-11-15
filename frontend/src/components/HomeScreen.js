import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../static/styles.css';
import '../static/styles/homescreen.css';

function Home() {
    const [databases, setDatabases] = useState([]);
    const [selectedDB, setSelectedDB] = useState('');
    const [tables, setTables] = useState([]);
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState('');
    const [showAddDBForm, setShowAddDBForm] = useState(false);
    const [newDbType, setNewDbType] = useState('');
    const [newDbUrl, setNewDbUrl] = useState('');
    const [newDbUsername, setNewDbUsername] = useState('');
    const [newDbPassword, setNewDbPassword] = useState('');
    const [error, setError] = useState('');
    const [queryHeight, setQueryHeight] = useState('60%');
    const [resultHeight, setResultHeight] = useState('40%');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        fetchDatabases();
    }, []);

    const fetchDatabases = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/getUserDB`);
            setDatabases(response.data);
        } catch (err) {
            console.error('Error fetching databases:', err);
            setError('Failed to fetch databases.');
        }
    };

    const fetchTables = async (dbName) => {
        try {
            const response = await axios.get(`${config.API_URL}/getTables`, {
                params: { db_name: dbName }
            });
            setTables(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching tables:', err);
            setError('Failed to fetch tables.');
            setTables([]);
        }
    };

    const handleAddDatabase = async () => {
        try {
            await axios.post(`${config.API_URL}/addDatabase`, {
                type: newDbType,
                url: newDbUrl,
                username: newDbUsername,
                password: newDbPassword
            });
            fetchDatabases();
            setShowAddDBForm(false);
            setError('');
            setNewDbType('');
            setNewDbUrl('');
            setNewDbUsername('');
            setNewDbPassword('');
        } catch (err) {
            console.error('Error adding database:', err);
            setError('Failed to add database.');
        }
    };

    const handleQuerySubmit = async () => {
        try {
            const response = await axios.post(`${config.API_URL}/runQuery`, {
                db_name: selectedDB,
                query: query
            });
            setQueryResult(response.data);
            setError('');
        } catch (err) {
            console.error('Error running query:', err);
            setError('Failed to run query.');
            setQueryResult('');
        }
    };

    const handleIconClick = async (iconType) => {
        setModalTitle(iconType);
        // Call your API or perform actions based on iconType
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="home-container">
            <div className="left-panel">
                <div className="panel-icons">
                    
                    <div className="icon-container" onClick={() => handleIconClick('Feature1')}>
                        <span className="icon">🏠</span>
                        <span className="icon-text">Home</span>
                    </div>
                    <div className="icon-container" onClick={() => handleIconClick('Feature2')}>
                        <span className="icon">📁</span>
                        <span className="icon-text">Adhoc</span>
                    </div>
                    <div className="icon-container" onClick={() => handleIconClick('Feature3')}>
                        <span className="icon">⚙️</span>
                        <span className="icon-text">Queries</span>
                    </div>
                </div>

                <div className="left-panel-items">
                    <select
                        value={selectedDB}
                        onChange={(e) => {
                            setSelectedDB(e.target.value);
                            fetchTables(e.target.value);
                        }}
                        className="table-dropdown"
                    >
                        <option value="">Select Database</option>
                        {databases.map(db => (
                            <option key={db.id} value={db.name}>
                                {db.name}
                            </option>
                        ))}
                    </select>

                    <div className="tables-list">
                        {tables.map((table, index) => (
                            <div key={index} className="table-item">{table}</div>
                        ))}
                    </div>

                    <div className='button-left'>
                        <button className="add-db-button" onClick={() => setShowAddDBForm(true)}>
                            Add Database
                        </button>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <div className="query-header">
                    <div className="query-db-name">
                        {selectedDB ? `${selectedDB} - ${tables.length ? tables[0] : 'No table selected'}` : 'No database selected'}
                    </div>
                    <button className="run-query-button" onClick={handleQuerySubmit}>
                        Run Query
                    </button>
                </div>

                <textarea
                    placeholder="Enter your SQL query here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="query-textarea"
                    style={{ height: queryHeight }}
                />

                <div className="result-section" style={{ height: resultHeight }}>
                    <h3>Query Result:</h3>
                    <pre>{JSON.stringify(queryResult, null, 2)}</pre>
                    <button className="download-button" onClick={console.log("press download")}>Download as CSV</button>
                </div>
            </div>

            {showAddDBForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Database</h2>
                        <select
                            value={newDbType}
                            onChange={(e) => setNewDbType(e.target.value)}
                            className="db-type-dropdown"
                        >
                            <option value="">Select DB Type</option>
                            <option value="SQL">SQL</option>
                            <option value="POSTGRES">POSTGRES</option>
                            <option value="MONGO">MONGO</option>
                            <option value="CASSANDRA">CASSANDRA</option>
                            <option value="DYNAMO">DYNAMO</option>
                        </select>
                        <input
                            type="text"
                            placeholder="DB URL"
                            value={newDbUrl}
                            onChange={(e) => setNewDbUrl(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="DB Username"
                            value={newDbUsername}
                            onChange={(e) => setNewDbUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="DB Password"
                            value={newDbPassword}
                            onChange={(e) => setNewDbPassword(e.target.value)}
                        />
                        <div className='modal-buttons'>
                            <button className='add-db-button' onClick={handleAddDatabase}>Save</button>
                            <button className='add-db-button' onClick={() => setShowAddDBForm(false)}>Cancel</button> 
                        </div>
                        <div className='modal-error'>
                            {error && <p className="error-message">{error}</p>} 
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
