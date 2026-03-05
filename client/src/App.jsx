import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';  // Changed from './pages/auth/Login'
import Register from './pages/Register';  // Changed from './pages/auth/Register'
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';
import Report from './pages/Report';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;