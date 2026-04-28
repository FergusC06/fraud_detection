import { useEffect, useState } from 'react';
import { X, AlertTriangle, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import api from '../api/axios';

const ForensicModal = ({ transactionId, onClose, onStatusUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch the XAI Forensic data when the modal opens
  useEffect(() => {
    const fetchForensics = async () => {
      try {
        const response = await api.get(`/api/transactions/${transactionId}/forensic`);
        setData(response.data);
      } catch (err) {
        setError('Failed to load transaction details.');
      } finally {
        setLoading(false);
      }
    };
    fetchForensics();
  }, [transactionId]);

  // Handle the Admin Override (Approve or Block)
  const handleOverride = async (newDecision) => {
    setUpdating(true);
    try {
      await api.patch(`/api/transactions/${transactionId}/status`, { decision: newDecision });
      // Tell the Dashboard to refresh its data
      onStatusUpdated(); 
      // Close the modal
      onClose();
    } catch (err) {
      alert("Failed to update status.");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="text-blue-400 flex flex-col items-center">
          <Activity className="animate-spin h-10 w-10 mb-4" />
          <p>Running Forensic Analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
          <p className="text-red-400">{error}</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg text-white">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Transaction Details
              <span className={`text-xs px-2 py-1 rounded-full ${
                data.decision === 'BLOCK' ? 'bg-red-500/20 text-red-400' : 
                data.decision === 'REVIEW' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {data.decision}
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 font-mono">ID: {data.transaction_id} | Customer: {data.external_customer_id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Top Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-sm mb-1">Transaction Amount</p>
              <p className="text-3xl font-bold text-white">{data.amount} <span className="text-lg text-slate-500">{data.currency}</span></p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center">
              <p className="text-slate-400 text-sm mb-1">AI Risk Score</p>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${data.risk_score > 0.7 ? 'text-red-400' : data.risk_score > 0.4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {(data.risk_score * 100).toFixed(1)}%
                </p>
                <p className="text-slate-500 text-sm mb-1">Confidence</p>
              </div>
            </div>
          </div>

          {/* Explainable AI (XAI) Section */}
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Primary Risk Drivers
          </h3>
          
          {data.risk_drivers && data.risk_drivers.length > 0 ? (
            <div className="space-y-3 mb-8">
              {data.risk_drivers.map((driver, index) => (
                <div key={index} className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-start gap-4">
                  <div className="bg-red-900/50 text-red-400 p-2 rounded-lg font-bold font-mono text-sm min-w-[60px] text-center">
                    {driver.value}
                  </div>
                  <div>
                    <h4 className="text-red-300 font-semibold">{driver.feature}</h4>
                    <p className="text-slate-400 text-sm mt-1">{driver.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl text-emerald-400 mb-8 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              No significant risk factors detected by the ML ensemble.
            </div>
          )}

        </div>

        {/* Modal Footer - Override Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <p className="text-slate-500 text-sm">Human Override Actions:</p>
          <div className="flex gap-3">
            <button 
              disabled={updating}
              onClick={() => handleOverride('APPROVE')}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/50 rounded-xl font-medium transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              Force Approve
            </button>
            <button 
              disabled={updating}
              onClick={() => handleOverride('BLOCK')}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/50 rounded-xl font-medium transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              Force Block
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForensicModal;