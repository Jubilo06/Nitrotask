// Navbar.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Stack } from '@mui/material';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigate = (path) => {
    handleMenuClose();
    navigate(path);
  };
  const loggedInLinks = [
    <MenuItem key="home" onClick={() => handleNavigate('/')}>Home</MenuItem>,
    <MenuItem key="profile" onClick={() => handleNavigate('/profile')}>Profile</MenuItem>,
    <MenuItem key="logout" onClick={logout}>Logout</MenuItem>,
  ];

  const guestLinks = [
    <MenuItem key="register" onClick={() => handleNavigate('/register')}>Register</MenuItem>,
    <MenuItem key="login" onClick={() => handleNavigate('/login')}>Login</MenuItem>,
  ];

    return (
        <AppBar position="static" sx={{bgcolor:'white'}}>
            <Toolbar>
                <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ flexGrow: 1, textDecoration: 'none', color:'#060010' }}
                >
                NitroTask
                </Typography>

                {/* --- DESKTOP VIEW (Visible on `md` screens and up) --- */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {user ? (
                    // Desktop links for logged-in users
                    <Stack direction='row' spacing={1}>  
                        <Button sx={{textDecoration: 'none',  backgroundColor:'#0D1A26', border:'1px solid gold', color:'white', borderRadius:2}}  component={Link} to="/">Home</Button>              
                        <Button sx={{textDecoration: 'none', backgroundColor:'#0D1A26', border:'1px solid old', color:'white',borderRadius:2}} component={Link} to="/profile">Profile</Button>
                        <Button sx={{textDecoration: 'none', backgroundColor:'#0D1A26', border:'1px solid gold', color:'white',borderRadius:2}} onClick={logout}>Logout</Button>
                    </Stack>
                ) : (
                    // Desktop links for guests
                    <Stack direction='row' spacing={1} >
                        <Button sx={{textDecoration: 'none', backgroundColor:'#0D1A26', border:'1px solid gold', color:'white', borderRadius:2}}  component={Link} to="/">Home</Button>              
                        <Button sx={{textDecoration: 'none', color:'white', backgroundColor:'#0D1A26', border:'1px solid gold',borderRadius:2}} component={Link} to="/register">Register</Button>
                        <Button sx={{textDecoration: 'none', color:'white', backgroundColor:'#0D1A26', border:'1px solid gold',borderRadius:2}} component={Link} to="/login">Login</Button>
                    </Stack>
                )}
                </Box>

                {/* --- MOBILE VIEW (Visible on `xs` and `sm` screens) --- */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="#060010"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                >
                    {user ? loggedInLinks : guestLinks}
                </Menu>
                </Box>

            </Toolbar>
        </AppBar>
    );
}
export default Navbar;