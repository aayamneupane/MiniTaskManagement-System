import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/tickets', icon: '✓', label: 'Tickets' },
  { to: '/tickets/new', icon: '+', label: 'Create Ticket' },
  { to: '/users', icon: '♙', label: 'Users' },
]

function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div>
            <strong>MiniTask</strong>
            <small>Team workspace</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">WORKSPACE</p>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="avatar">A</span>
          <div>
            <strong>Admin User</strong>
            <small>ADMIN</small>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <strong>Mini Task Management System</strong>
            <span> / Workspace</span>
          </div>
          <button className="notification-button" aria-label="Notifications">●</button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
