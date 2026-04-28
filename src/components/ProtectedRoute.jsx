import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. HOLDING PATTERN (Checking the token)
  // While the context is decoding the JWT token, show a clean loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-medium">Verifying session...</p>
      </div>
    );
  }

  // 2. ACCESS DENIED (No valid token)
  // If they aren't logged in, redirect to login. 
  // We save their 'location' so they could potentially be redirected back after logging in.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. ACCESS GRANTED
  // The user is valid, render the protected component (e.g., Dashboard)
  return children;
};

export default ProtectedRoute;