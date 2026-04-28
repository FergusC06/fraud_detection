import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

// The Dashboard layout component already handles the "logout" button in the sidebar,
// so we don't even need the useAuth hook inside this specific component anymore!

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <div className="p-8 text-white min-h-screen flex justify-center items-center">Loading Dashboard Data...</div>;

  // 1. Calculate the Pie Chart Data
  const approvedCount = data.statistics.total_transactions - data.statistics.total_blocked - data.statistics.total_flagged_for_review;
  
  const pieData = [
    { name: 'Approved', value: approvedCount > 0 ? approvedCount : 0, color: '#10b981' }, // Tailwind emerald-500
    { name: 'Review', value: data.statistics.total_flagged_for_review, color: '#f59e0b' },     // Tailwind amber-500
    { name: 'Blocked', value: data.statistics.total_blocked, color: '#ef4444' }               // Tailwind red-500
  ];

  // 2. Helper function for row colors
  const getRowStyle = (decision) => {
    if (decision === 'BLOCK') return 'bg-red-900/20 hover:bg-red-900/40 border-l-4 border-red-500';
    if (decision === 'REVIEW') return 'bg-amber-900/20 hover:bg-amber-900/40 border-l-4 border-amber-500';
    return 'hover:bg-slate-800/80 border-l-4 border-transparent'; // Default Approved styling
  };

  return (
    <div className="p-8">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Merchant: {data.merchant_name}</h1>
        <p className="text-slate-400 mt-1">Real-time Fraud Monitoring</p>
      </div>

      {/* Top Row: Stats & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Left Side: Number Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <Activity className="text-blue-500 mb-2 h-8 w-8" />
            <p className="text-slate-400 text-sm">Total Transactions</p>
            <p className="text-4xl font-bold">{data.statistics.total_transactions}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <ShieldAlert className="text-red-500 mb-2 h-8 w-8" />
            <p className="text-slate-400 text-sm">Total Blocked</p>
            <p className="text-4xl font-bold">{data.statistics.total_blocked}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <ShieldCheck className="text-amber-500 mb-2 h-8 w-8" />
            <p className="text-slate-400 text-sm">Requires Review</p>
            <p className="text-4xl font-bold">{data.statistics.total_flagged_for_review}</p>
          </div>
        </div>

        {/* Right Side: The Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-[250px] flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Decision Breakdown</h3>
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
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
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
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      txn.decision === 'BLOCK' ? 'bg-red-500/20 text-red-400' : 
                      txn.decision === 'REVIEW' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {txn.decision}
                    </span>
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
  );
};

export default Dashboard;