import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// REMOVED: import { BrowserRouter } from 'react-router-dom' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* REMOVED: <BrowserRouter> wrapper */}
      <App />
    {/* REMOVED: </BrowserRouter> wrapper */}
  </StrictMode>,
)