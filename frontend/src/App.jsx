import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Loader2 } from 'lucide-react'

// Pages
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import RestaurantDetails from './pages/RestaurantDetails'
import Cart from './pages/Cart'
import RestaurantDashboard from './pages/RestaurantDashboard'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import AdminPanel from './pages/AdminPanel'
import UserProfile from './pages/UserProfile'
import NotificationsPage from './pages/NotificationsPage'

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/track/:id" element={<OrderTracking />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        <Route element={<ProtectedRoute isManager={true} />}>
          <Route path="/dashboard" element={<RestaurantDashboard />} />
        </Route>

        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App