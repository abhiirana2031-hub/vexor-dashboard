import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboardPage from '@/components/pages/AdminDashboardPage'
import { MemberProvider } from '@/integrations'

function App() {
  return (
    <MemberProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </Router>
    </MemberProvider>
  )
}

export default App
