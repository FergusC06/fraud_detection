import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, Building } from 'lucide-react';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register-user', { 
        email, 
        password, 
        merchant_id: parseInt(merchantId) 
      });
      toast.success('Admin account created! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="text-center">
          <UserPlus className="h-12 w-12 text-blue-500 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create Admin</h2>
          <p className="mt-2 text-sm text-slate-400">Step 2: Create your dashboard login</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="number"
              required
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Merchant ID (from Step 1)"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
            <input
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-12 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors mt-6"
          >
            Create Account
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;