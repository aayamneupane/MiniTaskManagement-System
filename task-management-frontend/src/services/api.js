import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  if (currentUser?.id) config.headers['X-User-Id'] = currentUser.id
  return config
})

export default api
