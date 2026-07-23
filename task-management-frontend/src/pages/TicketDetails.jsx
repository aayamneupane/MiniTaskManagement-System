import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const isAdmin = currentUser?.role === 'ADMIN'
  const [ticket, setTicket] = useState(null)
  const [assignedUser, setAssignedUser] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTicket() {
      try {
        const { data } = await api.get(`/tickets/${id}`)
        setTicket(data)
        if (isAdmin) {
          const usersResponse = await api.get('/users')
          setAssignedUser(usersResponse.data.find((user) => user.id === data.assignedUserId) || null)
        } else if (data.assignedUserId === currentUser?.id) {
          setAssignedUser(currentUser)
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load this ticket.')
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [id, isAdmin])

  async function moveTicket(status) {
    try {
      const { data } = await api.patch(`/tickets/${id}/status`, { status })
      setTicket(data)
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update this ticket.')
    }
  }

  async function deleteTicket() {
    if (!window.confirm('Delete this ticket?')) return
    try {
      await api.delete(`/tickets/${id}`)
      navigate('/tickets')
    } catch {
      setError('Only admins can delete tickets.')
    }
  }

  if (loading) return <div className="details-state">Loading ticket details...</div>
  if (error && !ticket) return <><div className="notice error">{error}</div><Link className="secondary-button" to="/tickets">← Back to Tickets</Link></>
  if (!ticket) return null

  return (
    <>
      <div className="details-topbar">
        <Link className="back-link" to="/tickets">← Back to Tickets</Link>
        <div className="details-actions">
          {ticket.status === 'Open' && <button className="primary-button" onClick={() => moveTicket('In Progress')}>Start Ticket</button>}
          {ticket.status === 'In Progress' && <button className="primary-button" onClick={() => moveTicket('Complete')}>Mark Complete</button>}
          {isAdmin && <><Link className="secondary-button" to={`/tickets/${ticket.id}/edit`}>Edit Ticket</Link><button className="danger-button" onClick={deleteTicket}>Delete</button></>}
        </div>
      </div>
      {error && <div className="notice error">{error}</div>}
      <article className="ticket-details-card">
        <header className="details-header">
          <div><p className="eyebrow">TICKET #{ticket.id}</p><h1>{ticket.title}</h1></div>
          <span className={`badge status-${ticket.status?.toLowerCase().replaceAll(' ', '-')}`}>{ticket.status}</span>
        </header>
        <div className="details-grid">
          <section className="description-section"><h2>Description</h2><p>{ticket.description || 'No description was provided for this ticket.'}</p></section>
          <aside className="ticket-metadata">
            <div><span>Priority</span><strong><span className={`badge priority-${ticket.priority?.toLowerCase()}`}>{ticket.priority}</span></strong></div>
            <div><span>Status</span><strong>{ticket.status}</strong></div>
            <div><span>Due date</span><strong>{ticket.dueDate || 'Not set'}</strong></div>
            <div><span>Assigned to</span><strong>{assignedUser?.name || (ticket.assignedUserId ? `User #${ticket.assignedUserId}` : 'Unassigned')}</strong>{assignedUser?.email && <small>{assignedUser.email}</small>}</div>
          </aside>
        </div>
      </article>
    </>
  )
}

export default TicketDetails
