import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import ForensicModal from '../components/ForensicModal'; // <-- Import the new Modal

const Dashboard = () => {
  const [data, setData] = useState(null);
  
  // NEW STATE: Tracks which transaction is currently being inspected
  const [inspectingTxnId, setInspectingTxnId] = useState(null); 

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Handles changing the decision via the dropdown
  const handleDecisionChange = async (transactionId, newDecision) => {
    try {
      await api.patch(`/api/transactions/${transactionId}/status`, { 
        decision: newDecision 
      });

      // Update the local state so the table color changes immediately
      setData(prevData => {
        const updatedTransactions = prevData.recent_transactions.map(txn => 
          txn.transaction_id === transactionId 
            ? { ...txn, decision: newDecision } 
            : txn
        );

        // Refetch to update the Pie Chart stats accurately
        fetchDashboard(); 

        return {
          ...prevData,
          recent_transactions: updatedTransactions
        };
      });

    } catch (error) {
      console.error("Failed to update transaction status", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (!data) return <div className="p-8 text-white min-h-screen flex justify-center items-center bg-slate-950">Loading Dashboard Data...</div>;

  // Calculate the Pie Chart Data
  const approvedCount = data.statistics.total_transactions - data.statistics.total_blocked - data.statistics.total_flagged_for_review;
  
  const pieData = [
    { name: 'Approved', value: approvedCount > 0 ? approvedCount : 0, color: '#10b981' }, 
    { name: 'Review', value: data.statistics.total_flagged_for_review, color: '#f59e0b' },     
    { name: 'Blocked', value: data.statistics.total_blocked, color: '#ef4444' }               
  ];

  // Helper function for row colors
  const getRowStyle = (decision) => {
    if (decision === 'BLOCK') return 'bg-red-900/20 hover:bg-red-900/40 border-l-4 border-red-500';
    if (decision === 'REVIEW') return 'bg-amber-900/20 hover:bg-amber-900/40 border-l-4 border-amber-500';
    return 'hover:bg-slate-800/80 border-l-4 border-transparent'; 
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 relative">
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] p-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Merchant: {data.merchant_name}</h1>
          <p className="text-slate-400 mt-1">Real-time Fraud Monitoring</p>
        </div>

        {/* Top Row: Stats & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">
          
          {/* Left Side: Number Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/95 p-6 rounded-3xl border border-slate-700 flex flex-col justify-center shadow-sm">
              <Activity className="text-cyan-400 mb-2 h-8 w-8" />
              <p className="text-slate-400 text-sm">Total Transactions</p>
              <p className="text-4xl font-bold">{data.statistics.total_transactions}</p>
            </div>
            <div className="bg-slate-800/95 p-6 rounded-3xl border border-slate-700 flex flex-col justify-center shadow-sm">
              <ShieldAlert className="text-rose-400 mb-2 h-8 w-8" />
              <p className="text-slate-400 text-sm">Total Blocked</p>
              <p className="text-4xl font-bold">{data.statistics.total_blocked}</p>
            </div>
            <div className="bg-slate-800/95 p-6 rounded-3xl border border-slate-700 flex flex-col justify-center shadow-sm">
              <ShieldCheck className="text-amber-400 mb-2 h-8 w-8" />
              <p className="text-slate-400 text-sm">Requires Review</p>
              <p className="text-4xl font-bold">{data.statistics.total_flagged_for_review}</p>
            </div>
          </div>

          {/* Right Side: The Pie Chart */}
          <div className="bg-slate-950/90 p-6 rounded-3xl border border-slate-700 h-[280px] flex flex-col shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Decision Breakdown</h3>
            <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row: Transaction Table with Color Coding */}
        <div className="bg-slate-800/95 rounded-3xl border border-slate-700 overflow-hidden mx-auto max-w-full">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/50 text-slate-400 text-sm">
                <tr>
                  <th className="p-4 font-medium">Customer ID</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Risk Score</th>
                  <th className="p-4 font-medium">Decision</th>
                  <th className="p-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {data.recent_transactions.map((txn) => (
                  <tr 
                    key={txn.transaction_id} 
                    className={`transition-colors ${getRowStyle(txn.decision)}`}
                  >
                    <td className="p-4 font-mono text-sm text-slate-300">{txn.customer_id}</td>
                    <td className="p-4 font-semibold text-white">{txn.amount} {txn.currency}</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${txn.risk_score > 0.7 ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-slate-700 text-slate-300'}`}>
                        {(txn.risk_score * 100).toFixed(1)}%
                       </span>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      {/* Dropdown to change status directly from table */}
                      <select
                        value={txn.decision}
                        onChange={(e) => handleDecisionChange(txn.transaction_id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer appearance-none outline-none text-center ${
                          txn.decision === 'BLOCK' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          txn.decision === 'REVIEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        <option value="APPROVE" className="bg-slate-800 text-emerald-400">APPROVE</option>
                        <option value="REVIEW" className="bg-slate-800 text-amber-400">REVIEW</option>
                        <option value="BLOCK" className="bg-slate-800 text-red-400">BLOCK</option>
                      </select>

                      {/* NEW BUTTON: Opens the Forensic Modal */}
                      <button 
                        onClick={() => setInspectingTxnId(txn.transaction_id)}
                        className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-1 rounded text-xs font-bold border border-blue-500/30 transition-colors whitespace-nowrap"
                      >
                        Inspect
                      </button>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(txn.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.recent_transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL IF A TRANSACTION IS SELECTED */}
      {inspectingTxnId && (
        <ForensicModal 
          transactionId={inspectingTxnId} 
          onClose={() => setInspectingTxnId(null)}
          onStatusUpdated={fetchDashboard} // Refresh the dashboard if they override the status inside the modal
        />
      )}
    </div>
  );
};

export default Dashboard;