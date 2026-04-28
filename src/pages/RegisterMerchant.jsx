import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Building2, Copy, CheckCircle } from 'lucide-react';

const RegisterMerchant = () => {
  const [name, setName] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Assuming your backend expects { "name": "Platform A" }
      const response = await api.post('/register-merchant', { name });
      setSuccessData(response.data);
      toast.success('Merchant Organization created!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register merchant');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-10">
      <div className="max-w-md w-full space-y-8 p-10 glass-card shadow-2xl">
        
        {!successData ? (
          <>
            <div className="text-center">
              <Building2 className="h-12 w-12 text-cyan-400 mx-auto" />
              <h2 className="mt-6 text-3xl font-extrabold text-white">Create Organization</h2>
              <p className="mt-2 text-sm text-slate-400">Step 1: Register your Merchant profile</p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Company Name (e.g., Shopee)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Register Merchant
              </button>
            </form>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-cyan-400 hover:text-cyan-300">
                Already have an account? Sign in
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>

            <Link
              to="/register-user"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              Proceed to Step 2: Create Admin Account
            </Link>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-left space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Your Merchant ID (Keep this for Step 2):</p>
                <div className="font-mono text-lg text-white">{successData.merchant_id}</div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Your API Key (Save this now!):</p>
                <div className="flex items-center justify-between bg-slate-800 p-2 rounded">
                  <code className="text-sm text-emerald-400 break-all">{successData.api_key}</code>
                  <button onClick={() => copyToClipboard(successData.api_key)} className="ml-2 text-slate-400 hover:text-white">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterMerchant;