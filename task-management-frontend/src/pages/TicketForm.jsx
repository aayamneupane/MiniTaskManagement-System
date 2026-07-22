import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

const emptyTicket = { title: '', description: '', priority: 'Medium', status: 'Open', dueDate: '', assignedUserId: '' }

function TicketForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(emptyTicket)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(() => setError('Could not load users. Start the Spring Boot backend.'))
    if (id) api.get(`/tickets/${id}`).then(({ data }) => setTicket({ ...emptyTicket, ...data, assignedUserId: data.assignedUserId ?? '' })).catch(() => setError('Could not load this ticket.'))
  }, [id])

  function update(event) { setTicket({ ...ticket, [event.target.name]: event.target.value }) }
  async function submit(event) {
    event.preventDefault(); setSaving(true); setError('')
    const payload = { ...ticket, assignedUserId: ticket.assignedUserId ? Number(ticket.assignedUserId) : null }
    try { if (id) await api.put(`/tickets/${id}`, payload); else await api.post('/tickets', payload); navigate('/tickets') } catch { setError('Could not save the ticket. Check the backend and form values.') } finally { setSaving(false) }
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">{id ? 'UPDATE ITEM' : 'NEW ITEM'}</p><h1>{id ? 'Edit Ticket' : 'Create Ticket'}</h1><p>{id ? 'Update the selected ticket details.' : 'Create a ticket and notify the assigned user by email.'}</p></div></div>
      {error && <div className="notice error">{error}</div>}
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid"><label className="full">Title<span>*</span><input name="title" value={ticket.title} onChange={update} required placeholder="Example: Fix login page error" /></label>
          <label className="full">Description<textarea name="description" value={ticket.description} onChange={update} rows="5" placeholder="Explain what needs to be done..." /></label>
          <label>Priority<select name="priority" value={ticket.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <label>Status<select name="status" value={ticket.status} onChange={update}><option>Open</option><option>In Progress</option><option>Closed</option></select></label>
          <label>Due date<input type="date" name="dueDate" value={ticket.dueDate || ''} onChange={update} onInput={update} /></label>
          <label>Assign to<select name="assignedUserId" value={ticket.assignedUserId} onChange={update}><option value="">Unassigned</option>{users.map((user) => <option value={user.id} key={user.id}>{user.name} ({user.email})</option>)}</select></label>
        </div>
        <div className="form-actions"><Link className="secondary-button" to="/tickets">Cancel</Link><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : id ? 'Save Changes' : 'Create Ticket'}</button></div>
      </form>
    </>
  )
}

export default TicketForm
