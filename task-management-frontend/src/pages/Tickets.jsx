import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Tickets() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isAdmin = currentUser?.role === 'ADMIN'
  const [tickets, setTickets] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [error, setError] = useState('')

  async function loadData() {
    try {
      if (isAdmin) {
        const [ticketResponse, userResponse] = await Promise.all([api.get('/tickets'), api.get('/users')])
        setTickets(ticketResponse.data)
        setUsers(userResponse.data)
      } else {
        const ticketResponse = await api.get('/tickets')
        setTickets(ticketResponse.data)
        setUsers(currentUser ? [currentUser] : [])
      }
      setError('')
    } catch { setError('Could not load tickets. Make sure Spring Boot is running on port 8080.') }
  }
  useEffect(() => { loadData() }, [])

  async function handleSearch(event) {
    event.preventDefault()
    if (!search.trim()) return loadData()
    try { const { data } = await api.get('/tickets/search', { params: { title: search } }); setTickets(data) } catch { setError('Search failed.') }
  }
  async function removeTicket(id) {
    if (!window.confirm('Delete this ticket?')) return
    try { await api.delete(`/tickets/${id}`); setTickets((current) => current.filter((ticket) => ticket.id !== id)) } catch { setError('Only admins can delete tickets.') }
  }
  async function moveTicket(id, status) {
    try {
      const { data } = await api.patch(`/tickets/${id}/status`, { status })
      setTickets((current) => current.map((ticket) => ticket.id === id ? data : ticket))
    } catch { setError('You can only move tickets assigned to you.') }
  }
  const userName = (id) => users.find((user) => user.id === id)?.name || `User #${id || '—'}`
  const visibleTickets = filter === 'All' ? tickets : tickets.filter((ticket) => ticket.status === filter)

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">WORK</p><h1>{isAdmin ? 'All Tickets' : 'My Tickets'}</h1><p>{isAdmin ? 'Manage all team tickets and assignments.' : 'Create tickets for yourself and update their progress.'}</p></div><Link className="primary-button" to="/tickets/new">+ Create Ticket</Link></div>
      {error && <div className="notice error">{error}</div>}
      <div className="toolbar">
        <form className="search-form" onSubmit={handleSearch}><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets by title..." /><button type="submit">Search</button></form>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Open</option><option>In Progress</option><option>Complete</option></select>
      </div>
      <div className="table-card">
        <table><thead><tr><th>Ticket</th><th>Priority</th><th>Status</th><th>Due date</th><th>Assigned to</th><th>Actions</th></tr></thead>
          <tbody>{visibleTickets.length ? visibleTickets.map((ticket) => <tr key={ticket.id}><td><strong>{ticket.title}</strong><small>#{ticket.id} · {ticket.description || 'No description'}</small></td><td><span className={`badge priority-${ticket.priority?.toLowerCase()}`}>{ticket.priority}</span></td><td><span className={`badge status-${ticket.status?.toLowerCase().replaceAll(' ', '-')}`}>{ticket.status}</span></td><td>{ticket.dueDate || '—'}</td><td>{userName(ticket.assignedUserId)}</td><td><div className="row-actions">{ticket.status === 'Open' && <button className="move-action" onClick={() => moveTicket(ticket.id, 'In Progress')}>Start</button>}{ticket.status === 'In Progress' && <button className="move-action" onClick={() => moveTicket(ticket.id, 'Complete')}>Complete</button>}{isAdmin && <><Link to={`/tickets/${ticket.id}/edit`}>Edit</Link><button onClick={() => removeTicket(ticket.id)}>Delete</button></>}</div></td></tr>) : <tr><td colSpan="6" className="empty-row">No tickets found. Create your first ticket.</td></tr>}</tbody>
        </table>
      </div>
    </>
  )
}

export default Tickets
