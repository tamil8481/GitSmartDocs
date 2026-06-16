import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'

function Root() {
  const [page, setPage] = useState('login')
  const [username, setUsername] = useState(localStorage.getItem('gsd_username') || '')
  const isLoggedIn = !!localStorage.getItem('gsd_token')
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  const handleLogin = (name) => {
    setUsername(name)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('gsd_token')
    localStorage.removeItem('gsd_username')
    setLoggedIn(false)
    setPage('login')
  }

  if (!loggedIn) {
    return page === 'login'
      ? <Login onLogin={handleLogin} onSwitch={() => setPage('register')} />
      : <Register onLogin={handleLogin} onSwitch={() => setPage('login')} />
  }

  return <App username={username} onLogout={handleLogout} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
