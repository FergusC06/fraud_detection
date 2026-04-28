import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Key, Copy, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';

const ApiKeyManagement = () => {
  const [newKey, setNewKey] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calls your Flask /manage-api-key route
  const generateNewKey = async () => {
    setLoading(true);
    try {
      // Depending on your Flask setup, this might be a POST or PUT request
      const response = await api.post('/manage-api-key'); 
      setNewKey(response.data.api_key);
      setIsConfirming(false);
      toast.success('New API Key generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      toast.success('API Key copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Key className="text-cyan-400" /> Developer Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage your organization's API credentials.</p>
      </div>

      <div className="max-w-3xl space-y-8">
        
        {/* Warning Banner */}
        <div className="bg-amber-900/30 border border-amber-700/50 p-4 rounded-xl flex items-start gap-4">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-500 font-semibold">Security Warning</h3>
            <p className="text-sm text-amber-200/70 mt-1">
              Your API key grants full access to the FraudShield prediction engine. Never expose it in client-side code (like frontend React or mobile apps). Only use it on your secure backend server.
            </p>
          </div>
        </div>

        {/* API Key Panel */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Production API Key</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {!newKey ? (
              // State 1: Before generating a new key
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Current Key Status</label>
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/20 px-3 py-2 rounded border border-emerald-800/30 w-fit">
                    <CheckCircle size={16} /> Active & Secured
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    For security reasons, we do not display your active API key. If you have lost it, you must generate a new one.
                  </p>
                </div>

                {!isConfirming ? (
                  <button
                    onClick={() => setIsConfirming(true)}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    <RefreshCw size={18} /> Roll API Key
                  </button>
                ) : (
                  <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
                    <p className="text-red-400 text-sm mb-4">
                      Are you sure? This will immediately invalidate your old key. Any integrations using the old key will break until updated.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={generateNewKey}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
                      >
                        {loading ? 'Generating...' : 'Yes, Generate New Key'}
                      </button>
                      <button
                        onClick={() => setIsConfirming(false)}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // State 2: New Key Generated
              <div className="space-y-4">
                <div className="bg-emerald-900/20 border border-emerald-900/50 p-4 rounded-lg">
                  <h3 className="text-emerald-500 font-semibold flex items-center gap-2 mb-2">
                    <CheckCircle size={18} /> New Key Generated
                  </h3>
                  <p className="text-sm text-emerald-200/70 mb-4">
                    Please copy this key immediately. You will not be able to see it again once you leave this page.
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-slate-900 text-emerald-400 p-3 rounded border border-slate-700 break-all">
                      {newKey}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded transition shadow-lg shadow-cyan-500/20"
                      title="Copy to clipboard"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setNewKey(null)}
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  I have saved my key securely
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  </div>
  );
};

export default ApiKeyManagement;