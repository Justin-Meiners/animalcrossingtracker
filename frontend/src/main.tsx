import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/Variables.css'
import { AuthProvider } from './auth/AuthContext'
import { CatchProvider } from './context/CatchContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CatchProvider>
          <App />
        </CatchProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)