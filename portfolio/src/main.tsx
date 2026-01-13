import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './style/about.css'
import './style/header.css'
import './style/home.css'
import './style/loading.css'
import './style/projects.css'
import './style/animation.css'
import './style/about1.css'
import './style/achivements.css'
import './style/contact.css'
import './style/service.css'
import "./style/dashboard.css"
import './style/login.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)