import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const location = useLocation()
  const currentUser = localStorage.getItem('currentUser')

  return currentUser
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

export default ProtectedRoute
