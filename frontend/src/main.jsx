import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Set global base URL targeting the deployed backend
axios.defaults.baseURL = 'https://notes-backend-pr3k.onrender.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
