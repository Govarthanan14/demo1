import  { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import RecruiterDashboard from './pages/RecruiterDashboard'
import RequestorDashboard from './pages/RequestorDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import { useAuth } from './context/AuthContext'

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={
        user ? (
          user.role === 'recruiter' ? <RecruiterDashboard /> :
          user.role === 'requestor' ? <RequestorDashboard /> :
          <CandidateDashboard />
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
 