import { useState } from 'react'
import './Auth.css'

const API_BASE = 'http://localhost:8000/api/webhook'

function Register({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      localStorage.setItem('gsd_token', data.access)
      localStorage.setItem('gsd_username', data.username)
      onLogin(data.username)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark"><span /></div>
          <h1>GitSmart <strong>Docs</strong></h1>
        </div>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" onClick={onSwitch}>Sign In</button>
        </p>
      </div>
    </div>
  )
}

export default Register
