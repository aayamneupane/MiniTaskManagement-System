import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  async function submit(event) { event.preventDefault(); setError(''); try { const { data } = await api.post('/users/register', form); if (!data) return setError('This email is already registered.'); navigate('/login') } catch { setError('Registration failed. Make sure Spring Boot is running.') } }
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  return <div className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-mark">M</span><strong>MiniTask</strong></div><p className="eyebrow">GET STARTED</p><h1>Create your account</h1><p className="auth-subtitle">Join the workspace and start managing tickets.</p>{error && <div className="notice error">{error}</div>}<form onSubmit={submit}><label>Name<input name="name" value={form.name} onChange={update} required placeholder="Your name" /></label><label>Email<input type="email" name="email" value={form.email} onChange={update} required placeholder="you@example.com" /></label><label>Password<input type="password" name="password" value={form.password} onChange={update} required placeholder="Choose a password" /></label><label>Role<select name="role" value={form.role} onChange={update}><option value="USER">User</option><option value="ADMIN">Admin</option></select></label><button className="primary-button auth-submit">Create Account</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></section></div>
}

export default Register
