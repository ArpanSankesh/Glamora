import React from 'react'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx' // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AuthProvider> 
          <App />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)
