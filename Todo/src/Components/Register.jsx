// src/components/Auth/Register.jsx (or src/pages/RegisterPage.jsx)
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./Register.module.css";
import task5a from '../assets/task5a.webp'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Stack } from '@mui/material';

function Register() {
    // State to hold form input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For password confirmation
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Get the register function from AuthContext
    const { register } = useContext(AuthContext);
    const navigate = useNavigate(); // For redirection after successful registration

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError('');      // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        // Basic client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) { // Example: minimum password length
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError('All fields are required.');
            return;
        }

        try {
            // Call the register function from AuthContext, passing the user data
            await register({ username, email, password });
            setSuccessMessage('Registration successful! Please log in.');
            // Optionally redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Display error messages coming from the AuthContext or network issues
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <Stack width='100%' height='1200px' justifyContent='center' alignItems='center' sx={{backgroundImage:`url(${task5a})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                            backgroundPosition: 'center'}}>
            <Stack  className={styles.card} width={{xs:"90%", sm:"60%", md:'40%'}} justifyContent='center' alignItems='center'  borderRadius={5}  height='600px' >
                <form onSubmit={handleSubmit} style={{ width:'100%', height:"auto",
                    justifySelf:'center', alignSelf:'center'}}>
                    <Typography color='white' variant='h5' textAlign='center'>Register for Todo App</Typography>

                    {/* Display error messages */}
                    {error && <Typography color='white' >{error}</Typography>}
                    {/* Display success messages */}
                    {successMessage && <Typography color='white'>{successMessage}</Typography>}

                    <Stack my={3} width='80%' justifySelf='center' alignItems='center' >
                        <label style={{alignSelf:'self-start', color:'white'}} htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            style={{width:'100%', height:'30px',color:'black'}}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        
                        />
                    </Stack>

                    <Stack my={3} width='80%' justifySelf='center' alignItems='center'>
                        <label style={{alignSelf:'self-start',color:'white' }} htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            style={{width:'100%', height:'30px',color:'black'}}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        
                        />
                    </Stack>

                    <Stack my={3} width='80%' justifySelf='center' alignItems='center'>
                        <label style={{alignSelf:'self-start',color:'white'}} htmlFor="password">Password:</label>
                        <input
                            type="password"
                            style={{width:'100%', height:'30px',color:'black'}}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                        
                        />
                    </Stack>

                    <Stack my={3} width='80%' justifySelf='center' alignItems='center'>
                        <label style={{alignSelf:'self-start',color:'white'}} htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            style={{width:'100%', height:'30px',color:'black'}}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            required
                        
                        />
                    </Stack>
                    <Stack width='100%'>
                        <button style={{justifySelf:'center', alignSelf:'center', textAlign:'center', 
                            width:'150px', height:'30px', borderRadius:'10px'}} type="submit">Register</button>
                    </Stack>
                    

                    <Typography color='white' my={3} textAlign='center'>
                        Already have an account? <Link style={{color:'white'}} to="/login">Login here</Link>
                    </Typography>
                </form>
            </Stack>
        </Stack>
    );
}

export default Register;