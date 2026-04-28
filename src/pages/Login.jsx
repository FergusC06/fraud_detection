import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Using our new custom hook!
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      
      // Pass the token to our global AuthContext
      login(response.data.access_token);
      
      toast.success('Welcome back, Merchant!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="max-w-md w-full space-y-8 p-10 glass-card">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center">
            <ShieldCheck className="h-14 w-14 text-cyan-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">FraudShield</h2>
          <p className="mt-2 text-sm text-slate-400">Merchant Dashboard Access</p>
        </div>
        
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            Sign in
          </button>
        </form>

        {/* Link to Onboarding Flow */}
        <div className="text-center mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            New Organization?{' '}
            <Link to="/register-merchant" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;