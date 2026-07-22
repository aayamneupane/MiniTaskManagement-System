import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function submit(event) { event.preventDefault(); setError(''); try { const { data } = await api.post('/users/login', form); if (!data) return setError('Incorrect email or password.'); localStorage.setItem('currentUser', JSON.stringify(data)); navigate('/dashboard') } catch { setError('Login failed. Make sure Spring Boot is running.') } }
  return <div className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-mark">M</span><strong>MiniTask</strong></div><p className="eyebrow">WELCOME BACK</p><h1>Sign in to your workspace</h1><p className="auth-subtitle">Manage tickets and track your team's progress.</p>{error && <div className="notice error">{error}</div>}<form onSubmit={submit}><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" /></label><label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Enter your password" /></label><button className="primary-button auth-submit">Sign In</button></form><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></section></div>
}

export default Login
