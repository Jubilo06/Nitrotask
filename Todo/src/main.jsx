import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TodoProvider } from './Components/TodoProvider'
import { AuthProvider } from './Components/AuthContext'
import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TodoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </TodoProvider>
    </AuthProvider>
  </React.StrictMode>,
)
