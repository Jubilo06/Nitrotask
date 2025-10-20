import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import api from "./Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
   const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await fetchUserProfile();
      }
      setIsLoading(false);
    };
    initializeAuth();
    }, []); 

   const register = async (userData) => {
    console.log("3. Inside the context's register function."); 
    try {
      await api.post('/api/register', userData);
    } catch (error) {
      // console.error("Error from API call in context:", error); 
      // throw new Error(error.response?.data || 'An unknown error occurred.');
      console.error('Full Registration Error on Device:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: { url: error.config?.url, method: error.config?.method },
        origin: window.location.origin,
        userAgent: navigator.userAgent
      });
      let errorMessage = 'An unknown error occurred.';
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.response?.status === 0) {
        errorMessage = 'Network/CORS error: Request blocked. Check connection or browser settings.';
      } else if (error.response?.status === 403 || error.message.includes('CORS')) {
        errorMessage = 'CORS blocked: Origin not allowed. Update server config.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Access denied. Try incognito mode.';
      } else if (error.response?.status >= 400 && error.response?.status < 500) {
        errorMessage = error.response.data?.error || 'Invalid data. Check form.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Check Vercel logs.';
      } else {
        errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      throw new Error(errorMessage);  // Now shows specific cause
    
    }
  };
  
  const login = async (credentials) => {
    console.log("Data being sent to /login API:", credentials);
    try {
      const config = {
         headers: {
           'Content-Type': 'application/json'
         }
       }

      const response = await api.post('/api/login', credentials, config);
      const { token, user: userFromServer } = response.data;
      
      if (!token || !userFromServer) {
        throw new Error("Invalid response from server on login.");
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userFromServer);
      return userFromServer; 
      
    } catch (error) {
      console.error("AuthContext: Error during login process:", error);
      let message = 'Login failed. Please check your credentials.';
        if (error.code === 'ERR_NETWORK') {
          message = 'Network error: Check API URL (localhost on deployed site?).';
        } else if (error.response?.status === 401) {
          message = 'Invalid username or password.';
        }
      throw error; 
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false); 
      return;
    }

    try {
      const response = await api.get('/api/profile');
      setUser(response.data);

      } catch (error) {
        console.error("Failed to fetch user profile, likely an invalid token.", error);
        logout(); 
      }
  };
  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/api/profile', profileData);
      setUser(response.data.user);
      return response.data.user;
    }  
    catch (error) {
      console.error("Failed to update profile:", error);
      throw new Error(error.response?.data?.message || 'Could not update profile.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  const deleteAccount = async () => {
    try {
      await api.delete('/api/me');
      logout();
      
    } catch (error) {
      console.error("Failed to delete account:", error);
        throw new Error(error.response?.data?.message || 'Could not delete your account.');
    }
  };


  const value = { user, token, register, login, logout, fetchUserProfile, 
    updateUserProfile, deleteAccount, isLoading };
  if (isLoading) {
    return <div>Loading Application...</div>;
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>);
};
