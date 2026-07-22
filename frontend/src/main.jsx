import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { StyledEngineProvider } from '@mui/material'
import { Provider } from 'react-redux'
import store from './store/store'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </GoogleOAuthProvider>
      </Provider>
    </StyledEngineProvider>
  </StrictMode>,
)
