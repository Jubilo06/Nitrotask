import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Form from './Components/Form'
import Header from './Components/Header'
import "./Components/App.css"
import Trodo from "./Components/Trodo";
import {Stack} from '@mui/material';
import TodoList from './Components/TodoList'
import TodoFooter from './Components/TodoFooter'
import {Routes,Route} from 'react-router-dom'
import Navbar from './Components/NavBar'
import Register from './Components/Register'
import Login from './Components/Login'
import ProfilePage from './Components/ProfilePage'
import TodosPage from './Components/TodosPage'
import WelcomePage from './Components/WelcomePage'
import TodoEdit from './Components/TodoEdit'
import Footer from './Components/Footer'
function App() {
  return (
    <Stack className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/profile/edit" element={<TodoEdit />} /> 
      </Routes>
      <Footer />
      
    </Stack>
  )
}

export default App
