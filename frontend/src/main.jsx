import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = "250441239388-ldget7kv1v1hvf6vm1r6b0p48fassv43.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
