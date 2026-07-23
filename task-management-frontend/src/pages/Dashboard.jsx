import { useEffect, useState } from 'react'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import api from '../services/api'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const initialData = { totalTickets: 0, openTickets: 0, inProgressTickets: 0, completeTickets: 0, lowPriorityTickets: 0, mediumPriorityTickets: 0, highPriorityTickets: 0 }

function Dashboard() {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setData(data)).catch(() => setError('Start the Spring Boot backend to load live dashboard data.'))
  }, [])

  const stats = [
    { label: 'Total Tickets', value: data.totalTickets, color: 'navy' },
    { label: 'Open', value: data.openTickets, color: 'blue' },
    { label: 'In Progress', value: data.inProgressTickets, color: 'orange' },
    { label: 'Complete', value: data.completeTickets, color: 'green' },
  ]
  const statusChart = { labels: ['Open', 'In Progress', 'Complete'], datasets: [{ data: [data.openTickets, data.inProgressTickets, data.completeTickets], backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e'], borderWidth: 0 }] }
  const priorityChart = { labels: ['Low', 'Medium', 'High'], datasets: [{ label: 'Tickets', data: [data.lowPriorityTickets, data.mediumPriorityTickets, data.highPriorityTickets], backgroundColor: ['#60a5fa', '#2563eb', '#173f8a'], borderRadius: 7 }] }
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p>Track your team's ticket activity at a glance.</p></div></div>
      {error && <div className="notice warning">{error}</div>}
      <section className="stat-grid">{stats.map((stat) => <article className="stat-card" key={stat.label}><span className={`stat-dot ${stat.color}`} /><div><p>{stat.label}</p><strong>{stat.value}</strong></div></article>)}</section>
      <section className="dashboard-grid">
        <article className="panel"><div className="panel-heading"><div><h2>Tickets by status</h2><p>Current workflow distribution</p></div></div><div className="chart-box"><Doughnut data={statusChart} options={chartOptions} /></div></article>
        <article className="panel"><div className="panel-heading"><div><h2>Tickets by priority</h2><p>Low, medium, and high priority</p></div></div><div className="chart-box"><Bar data={priorityChart} options={{ ...chartOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } } }} /></div></article>
      </section>
    </>
  )
}

export default Dashboard
