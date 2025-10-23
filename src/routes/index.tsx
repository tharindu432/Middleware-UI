import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AdminDashboard from '@/pages/admin/Dashboard'
import AgentDashboard from '@/pages/agent/Dashboard'
import EmployeeDashboard from '@/pages/employee/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from '@/layouts/AdminLayout'
import AgentLayout from '@/layouts/AgentLayout'
import EmployeeLayout from '@/layouts/EmployeeLayout'

// Admin Pages
import AgentsManagement from '@/pages/admin/AgentsManagement'
import CreditApprovals from '@/pages/admin/CreditApprovals'
import SystemSettings from '@/pages/admin/SystemSettings'
import AuditLogs from '@/pages/admin/AuditLogs'
import Reports from '@/pages/admin/Reports'
import AdminBookingsManagement from '@/pages/admin/BookingsManagement'
import AdminTicketsManagement from '@/pages/admin/TicketsManagement'

// Agent Pages
import FlightSearch from '@/pages/agent/FlightSearch'
import BookFlight from '@/pages/agent/BookFlight'
import MyBookings from '@/pages/agent/MyBookings'
import IssueTicket from '@/pages/agent/IssueTicket'
import MyTickets from '@/pages/agent/MyTickets'
import BookingsManagement from '@/pages/agent/BookingsManagement'
import TicketsManagement from '@/pages/agent/TicketsManagement'
import CreditManagement from '@/pages/agent/CreditManagement'
import InvoicesManagement from '@/pages/agent/InvoicesManagement'
import PaymentsManagement from '@/pages/agent/PaymentsManagement'
import EmployeesManagement from '@/pages/agent/EmployeesManagement'
import AgentProfile from '@/pages/agent/Profile'

// Employee Pages
import EmployeeFlightSearch from '@/pages/employee/FlightSearch'
import EmployeeBookFlight from '@/pages/employee/BookFlight'
// @ts-ignore
import EmployeeBookings from '@/pages/employee/Bookings'
// @ts-ignore
import EmployeeTickets from '@/pages/employee/Tickets'

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Route based on user role
  const getDefaultRoute = () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      return '/admin/dashboard'
    } else if (user?.role === 'AGENT_MANAGER' || user?.role === 'AGENT_USER') {
      return '/agent/dashboard'
    } else if (user?.role === 'EMPLOYEE') {
      return '/employee/dashboard'
    }
    return '/login'
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="agents" element={<AgentsManagement />} />
        <Route path="bookings" element={<AdminBookingsManagement />} />
        <Route path="tickets" element={<AdminTicketsManagement />} />
        <Route path="credit-approvals" element={<CreditApprovals />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Agent Routes */}
      <Route
        path="/agent/*"
        element={
          <ProtectedRoute allowedRoles={['AGENT_MANAGER', 'AGENT_USER']}>
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="flights" element={<FlightSearch />} />
        <Route path="book-flight" element={<BookFlight />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="issue-ticket" element={<IssueTicket />} />
        <Route path="my-tickets" element={<MyTickets />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="tickets" element={<TicketsManagement />} />
        <Route path="credit" element={<CreditManagement />} />
        <Route path="invoices" element={<InvoicesManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="employees" element={<EmployeesManagement />} />
        <Route path="profile" element={<AgentProfile />} />
      </Route>

      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={['EMPLOYEE', 'AGENT_USER', 'AGENT_MANAGER']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="flights" element={<EmployeeFlightSearch />} />
        <Route path="book-flight" element={<EmployeeBookFlight />} />
        <Route path="bookings" element={<EmployeeBookings />} />
        <Route path="tickets" element={<EmployeeTickets />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  )
}

export default AppRoutes
