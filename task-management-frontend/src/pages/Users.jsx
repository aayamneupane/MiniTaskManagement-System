import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  useEffect(() => { api.get('/users').then(({ data }) => setUsers(data)).catch(() => setError('Could not load users. Start the Spring Boot backend.')) }, [])

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return
    setError('')
    try {
      await api.delete(`/users/${user.id}`)
      setUsers((existingUsers) => existingUsers.filter(({ id }) => id !== user.id))
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.response?.data?.detail || 'Could not delete this user.')
    }
  }

  return <><div className="page-heading"><div><p className="eyebrow">TEAM</p><h1>Users</h1><p>People available for ticket assignment.</p></div><Link className="primary-button" to="/register">+ Register User</Link></div>{error && <div className="notice error">{error}</div>}<section className="user-grid">{users.map((user) => <article className="user-card" key={user.id}><span className="large-avatar">{user.name?.[0]?.toUpperCase()}</span><div className="user-card-info"><h2>{user.name}</h2><p>{user.email}</p><span className="role-chip">{user.role}</span>{user.role?.toUpperCase() === 'USER' && user.id !== currentUser?.id && <button className="delete-user-button" onClick={() => deleteUser(user)}>Delete User</button>}</div></article>)}{!users.length && !error && <div className="empty-state">No users registered yet.</div>}</section></>
}

export default Users
