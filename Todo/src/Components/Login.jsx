import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import src1 from '../assets/src1.webp'
import styles from "./Register.module.css";
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/todos'); // Redirect to todos page on success
        } catch (err) {
            setError(err.message || 'Login failed.');
        }
    };

    return (
        <Stack width="100%" height='1200px' justifyContent='center' alignItems='center' sx={{backgroundImage:`url(${src1})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                                    backgroundPosition: 'center'}}>
            <Stack width={{xs:"90%", sm:"60%", md:'40%'}} justifyContent='center' alignItems='center'  
            borderRadius={5}  height='600px' className={styles.card} >
                <form onSubmit={handleSubmit} style={{ width:'100%', height:"auto",
                    justifySelf:'center', alignSelf:'center'}}>
                    <Typography color='white' variant='h5' textAlign="center">Login</Typography>
                    {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
                    <Stack my={3} width='80%' justifySelf='center' alignItems='center'>
                        <label style={{alignSelf:'self-start', color:'white'}} htmlFor="username">Email:</label>
                        <input type="email" value={email} 
                        style={{width:'100%', height:'30px',color:'black'}}
                        onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                    </Stack>
                    <Stack my={3} width='80%' justifySelf='center' alignItems='center'>
                        <label style={{alignSelf:'self-start', color:'white'}} htmlFor="username">Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                            style={{width:'100%', height:'30px',color:'black'}}
                            placeholder="Password" required />
                    </Stack>
                    <Stack width='100%' >
                        <button type="submit" style={{justifySelf:'center', alignSelf:'center', textAlign:'center', 
                            width:'150px', height:'30px', borderRadius:'10px'}}>Login</button>
                    </Stack>
                    
                </form>
            </Stack>
        </Stack>
    );
}
export default Login;