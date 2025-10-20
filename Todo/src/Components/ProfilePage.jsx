// src/pages/ProfilePage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TodoContext } from './TodoProvider';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Stack, Typography } from '@mui/material';
import styles from './ProfilePage.module.css'

function ProfilePage() {
    const { user, fetchUserProfile, updateUserProfile, 
        deleteAccount, logout } = useContext(AuthContext);
    const {todos,setTodos, completedtodo, totaltodo, todo, setTodo, error, setError, 
        sortedTodo,loadUserTodos, loading}=useContext(TodoContext)
    const navigate = useNavigate();

    // Local state for form fields to allow editing
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // For password verification
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true); // For loading profile data

    // Effect to populate form fields when user data is available or on component mount
    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setError('');
            if (user) {
                setUsername(user.username);
                setEmail(user.email);
                setIsLoading(false);
            } else {
                // If user context is null, try fetching (e.g., on direct page load after refresh)
                try {
                    await fetchUserProfile(); // This will update AuthContext's user state
                } catch (err) {
                    setError('Failed to load profile. Please log in again.');
                    logout(); // Force logout if fetching fails
                    navigate('/login');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();
    }, [user, fetchUserProfile, logout, navigate]); // Depend on user, and the functions


    useEffect(() => {
        if (user &&loadUserTodos ) { // Load todos only if user is authenticated
            loadUserTodos();
        } else {
            setTodos([]); // Clear todos if no user is logged in
        }
    }, [user,loadUserTodos]);

    // Handle form submission for updating profile details
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Prepare data for update
        const updatedData = { username, email };

        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                setError('New passwords do not match.');
                return;
            }
            if (newPassword.length < 6) { // Example: minimum password length
                setError('New password must be at least 6 characters long.');
                return;
            }
            // You might need currentPassword for backend verification before changing password
            updatedData.currentPassword = currentPassword;
            updatedData.newPassword = newPassword;
        }

        try {
            await updateUserProfile(updatedData);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false); // Exit edit mode
            // Clear password fields after successful update
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
            return; // User cancelled
        }
        try {
            await deleteAccount();
            alert('Your account has been deleted.');
            navigate('/register'); // Redirect to register or welcome page
        } catch (err) {
            setError(err.message || 'Failed to delete account.');
        }
    };

    if (isLoading) {
        return  
                <div >
                    Loading...
                </div>

    }

    if (!user) { // Fallback if user somehow becomes null after loading
        return (
            <div>
                <p>You need to be logged in to view this page.</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    return (
        <div style={{height:'100%', backgroundColor:'#086252'}} >
            {user && <Typography mt={10} pl={2} variant='h6' sx={{color:'white'}}> Hi, {user.username} welcome to your profile  </Typography>}

            {error && <p >{error}</p>}
            {successMessage && <p>{successMessage}</p>}
            
            <Stack pt={10}>
                <Typography variant='h6' pl={5} sx={{color:'white'}}>Your Tasks</Typography>
                {loading && <p>Loading tasks...</p>}
                {!loading && !error && todos.length === 0 && (
                    <p>You haven't added any task yet!</p>
                )}

                {!loading && !error && todos.length  > 0 && (
                <Stack direction={{xs:'column', sm:"row"}}  alignItems="center" justifySelf='center' alignSelf='center' justifyContent={{xs:'center', sm:'space-between'}} width="96%" flexWrap='wrap' mt={2} >
                    {console.log(todos)}
                    {todos.map(todo => (
                        <Stack direction='column' pl={2} pr={2} borderRadius={5} mt={2}  width={{xs:'80%', sm:"42%", md:'43%'}} key={todo._id} sx={{border:'1px solid white', color:'white', textWrap:'wrap'}} justifyContent='center' alignItems='center'>
                            
                            <h3>{todo.name && <p>Title:&nbsp;{todo.description}</p>}</h3>
                            {todo.description && <p>Description: &nbsp;{todo.description}</p>}
                            {todo.category && <p>Category:&nbsp;{todo.category}</p>}
                            <p>Status: {todo.done ? 'Done' : 'Pending'}</p>
                            <p>Priority: {todo.priority === 0 ? 'Low' : todo.priority === 1 ? 'Medium' : 'High'}</p>
                            {todo.dueDate && <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}

                            {todo.isMeeting && (
                                <Stack pb={3} >
                                    <h5 style={{textAlign:'center'}}>Meeting Details:</h5>
                                    {todo.meetingMembers.length > 0 ? (
                                        <Stack sx={{width:'100%', textWrap:'wrap'}}>
                                            {todo.meetingMembers.map((member, index) => (
                                                <Stack sx={{width:'100%', textWrap:'wrap', textAlign:'left'}} key={index}>
                                                    🔳 &nbsp;{member.name} ({member.email || member.phoneNumber})
                                                </Stack>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <p>No members for this meeting.</p>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    ))}
                </Stack>
            )}
            </Stack>

            {!isEditing ? (
                // Display mode
                <Stack pl={4} pb={4} >
                    <p style={{color:'white'}}><strong>Username:</strong> {user.username}</p>
                    <p style={{color:'white'}}><strong>Email:</strong> {user.email}</p>
                    <p style={{color:'white'}}><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <Stack direction="row" spacing={1}>
                        <button onClick={() => setIsEditing(true)} >Edit Profile</button>
                        <button onClick={handleDeleteAccount} >Delete Account</button>
                    </Stack>
                    
                </Stack>
            ) : (
                // Edit mode
                <form onSubmit={handleProfileUpdate} >
                    <hr  />
                    <Stack pl={4} spacing={2} my={3}>
                        <Stack direction='row' spacing={1}>
                            <label style={{color:'white'}} htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            
                            />
                        </Stack>

                        <Stack direction='row' spacing={1} >
                            <label style={{color:'white'}} htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            
                            />
                        </Stack>

                        {/* Password change fields */}
                        
                        <h3 style={{color:'white'}}>Change Password (Optional)</h3>
                        <Stack direction='row' spacing={2} >
                            <label style={{color:'white'}} htmlFor="currentPassword">Current Password:</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Required to change password"
                                
                            />
                        </Stack>
                        <Stack direction='row' spacing={2} >
                            <label style={{color:'white'}} htmlFor="newPassword">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                
                            />
                        </Stack>
                        <Stack direction='row' spacing={2} >
                            <label style={{color:'white'}} htmlFor="confirmNewPassword">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirm new password"
                                
                            />
                        </Stack>

                        <Stack direction='row' spacing={1} >
                            <button type="submit" >Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} >Cancel</button>
                        </Stack>
                    </Stack>
                </form>
            )}
        </div>
    );
}

export default ProfilePage;