import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context & Wrappers
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import Login from './pages/Login';
import RegisterMerchant from './pages/RegisterMerchant';
import RegisterUser from './pages/RegisterUser';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ApiKeyManagement from './pages/ApiKeyManagement';
import ApiGuide from './pages/ApiGuide';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global Toast Notifications Configured for Dark Mode */}
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } 
          }} 
        />
        
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-merchant" element={<RegisterMerchant />} />
          <Route path="/register-user" element={<RegisterUser />} />
          
          {/* --- PROTECTED ROUTES --- */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/manage-api-key" element={
            <ProtectedRoute>
              <Layout><ApiKeyManagement /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/api-integration" element={
            <ProtectedRoute>
              <Layout><ApiGuide /></Layout>
            </ProtectedRoute>
          } />
          
          {/* --- FALLBACK ROUTE --- */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;