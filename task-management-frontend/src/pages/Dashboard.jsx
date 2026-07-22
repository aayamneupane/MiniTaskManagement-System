const stats = [
  { label: 'Total Tickets', value: '0', color: 'purple' },
  { label: 'Open', value: '0', color: 'blue' },
  { label: 'In Progress', value: '0', color: 'orange' },
  { label: 'Closed', value: '0', color: 'green' },
]

function Dashboard() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p>Track your team's ticket activity at a glance.</p>
        </div>
      </div>

      <section className="stat-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-dot ${stat.color}`} />
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-heading">
            <div><h2>Tickets by status</h2><p>Current workflow distribution</p></div>
          </div>
          <div className="empty-chart">Chart will appear after API integration</div>
        </article>
        <article className="panel">
          <div className="panel-heading">
            <div><h2>Tickets by priority</h2><p>Low, medium, and high priority</p></div>
          </div>
          <div className="empty-chart">Chart will appear after API integration</div>
        </article>
      </section>
    </>
  )
}

export default Dashboard
