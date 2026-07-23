import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const mainLinks = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/tickets', icon: '✓', label: 'Tickets' },
  { to: '/tickets/new', icon: '+', label: 'Create Ticket' },
]

function AppLayout() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const links = currentUser?.role === 'ADMIN'
    ? [...mainLinks, { to: '/users', icon: '♙', label: 'Users' }]
    : mainLinks

  function logout() {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div><strong>MiniTask</strong><small>Team workspace</small></div>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">WORKSPACE</p>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">{link.icon}</span>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{currentUser?.name?.[0]?.toUpperCase() || 'A'}</span>
          <div><strong>{currentUser?.name || 'Admin User'}</strong><small>{currentUser?.role || 'ADMIN'}</small></div>
          <button className="logout-link" onClick={logout} title="Log out">↪</button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div><strong>Mini Task Management</strong><span> / Workspace</span></div>
          <button className="primary-button compact" onClick={() => navigate('/tickets/new')}>+ New ticket</button>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}

export default AppLayout
