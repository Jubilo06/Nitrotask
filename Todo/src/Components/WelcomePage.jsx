// src/pages/WelcomePage.jsx (or src/components/WelcomePage.jsx)
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';
import LiquidEther from './LiquidEther';
import task3 from '../assets/task3.webp'
import task5 from '../assets/task5.webp'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Stack } from '@mui/material';

function WelcomePage() {
    // Access user and isLoading from AuthContext
    const { user, isLoading } = useContext(AuthContext);

    // If the authentication process is still ongoing, show a loading state
    if (isLoading) {
        return (
            <div>
                <p>Loading user session...</p>
            </div>
        );
    }

    return (
        <Stack pt={10} width='100%' minHeight='1200px' spacing={4} height="auto" sx={{backgroundColor:'#DEE6EA'}}>
            
            <Typography width="100%" fontWeight={800} variant={{xs:'h5', sm:'h5', md:'h1'}} textAlign="center" >Welcome to NitroTask App!</Typography>

            {user ? (
                // If user is logged in
                <Stack height="600px" pt={20} width={{xs:"98%", sm:"60%", md:'40%'}}  alignSelf="center" justifySelf='center'
                sx={{backgroundColor:'#0D1A26'}}>
                    <Stack justifyContent='center' alignItems='center'  width='100%' height='auto' spacing={4}>
                        <Typography color='white' fontWeight={800} >Hello, {user.username}!</Typography>
                        <Typography color='white' textAlign='center'>You are currently logged in. Ready to tackle your tasks?</Typography>
                        <Stack direction='row' spacing={1} color='white'>
                            <Link to="/todos" style={{color:"white"}} >Go to My Tasks</Link> &nbsp;&nbsp;|
                            <Link to="/profile" style={{color:"white"}}>Manage Profile</Link>
                        </Stack>
                    </Stack>
                </Stack>
            ) : (
                // If user is NOT logged in
                <Stack spacing={6} width='100%' pt={6}>
                    <Stack direction={{xs:'column', sm:'column', md:'row'}} width='100%' justifyContent={{xs:'center', md:"space-around"}} spacing={{xs:4, sm:4, md:0}} alignItems={{xs:'center', md:"center"}}>
                        <Stack width={{xs:'100%', sm:'80%', md:'45%'}} spacing={2} justifyContent="center" alignItems='center'>
                            <Typography lineHeight={2}  textAlign='center' sx={{width:'100%', height:'auto'}} >
                                Welcome to NitroTask app! In a world full of distractions, 
                                staying on top of your tasks has never been easier. Our app is designed for anyone who wants to turn 
                                chaos into clarity – from busy professionals hitting deadlines to students managing study schedules. 
                            </Typography>
                            <Typography>
                                ✔ Task Creation & Organization: "Quickly add tasks with due dates, tags, and subtasks. 
                                Use folders to categorize work, personal, or shopping lists for ultimate organization."
                            </Typography>
                            <Typography>
                                ✔ Reminders & Notifications: "Never miss a deadline with customizable alerts via email, 
                                push notifications, or in-app pop-ups."
                            </Typography>
                            <Typography>
                                ✔ Collaboration Tools: "Share lists with colleagues or family, assign tasks, 
                                and track progress together in real-time."
                            </Typography>
                            <Typography>
                                ✔ Productivity Insights: "Get daily reports on your habits, completion rates, 
                                and goal progress to stay motivated and improve over time."
                            </Typography>
                            <Typography>
                                ✔ Security & Customization: "Your data is safe with encrypted storage, 
                                and personalize your experience with themes and priority settings."
                            </Typography>
                        </Stack>
                        <Stack borderRadius={2} width={{xs:'100%', sm:'80%', md:'45%'}} height='500px' sx={{backgroundImage:`url(${task3})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                    backgroundPosition: 'center'}} ></Stack>
                    </Stack>
                    <Typography sx={{width:'100%'}} fontWeight={700} variant='h4' textAlign='center'>Organize your life and boost your productivity.</Typography>
                    <Stack width='100%' height='auto' direction='column' spacing={4} >
                       
                        <Typography textAlign={{xs:'center', sm:'left'}} pl={{xs:0, sm:2, md:4}} > Join over 1 million users who have completed more tasks with NitroTask</Typography>
                        <Stack direction={{xs:'column', md:'column'}} height='auto' alignItems={{xs:'center', md:"center"}}
                        justifyContent={{xs:'center', md:"space-around"}}>
                            <Stack  borderRadius={5} width={{xs:'100%', sm:'96%', md:'96%'}} height='600px' sx={{backgroundImage:`url(${task5})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover',
                    backgroundPosition: 'center'}}></Stack>
                            <Typography justifyContent="center" fontWeight={700} alignContent={{xs:'start', md:'start'}} textAlign='center' sx={{width:{xs:'100%',sm:'80%', md:'80%'}, height:'50px'}} > “NitroTask transformed how I handle my daily to-do list. 
                                It's simple, reliable, and keeps me focused!“ – Sarah K., Marketing Manager
                            </Typography>
                        </Stack>
                        
                    
                        <Typography width='100%' textAlign='center'>
                            Sign up or log in to start managing your tasks efficiently.
                        </Typography>
                        <Stack direction={{xs:'column', sm:'row'}} pb={4} spacing={2} width='100%' alignItems="center" justifyContent={{xs:'center', sm:'center'}}>
                            <Link  to="/register" >Get Started - Register</Link>
                            <Link to="/login">Already have an account? Login</Link>
                        </Stack>
                    </Stack>
                </Stack>
            )}

            
        </Stack>
    );
}

export default WelcomePage;