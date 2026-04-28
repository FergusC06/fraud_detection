import { useState } from 'react';
import { Terminal, Code2, FileJson, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ApiGuide = () => {
  const [activeTab, setActiveTab] = useState('curl');
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!');
  };

  const snippets = {
    curl: `curl -X POST ${apiUrl}/predict \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: your_live_api_key_here" \\
  -d '{
    "customer_id": "CUST-9876",
    "amount": 150.00,
    "currency": "USD",
    "device_ip": "192.168.1.1",
    "items_count": 2
  }'`,
    
    node: `const axios = require('axios');

const checkFraud = async () => {
  try {
    const response = await axios.post('${apiUrl}/predict', {
      customer_id: "CUST-9876",
      amount: 150.00,
      currency: "USD",
      device_ip: "192.168.1.1",
      items_count: 2
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'your_live_api_key_here'
      }
    });
    
    console.log(response.data);
    // { risk_score: 0.12, decision: "APPROVE" }
  } catch (error) {
    console.error(error);
  }
};`,

    python: `import requests

url = "${apiUrl}/predict"
headers = {
    "Content-Type": "application/json",
    "X-API-KEY": "your_live_api_key_here"
}
payload = {
    "customer_id": "CUST-9876",
    "amount": 150.00,
    "currency": "USD",
    "device_ip": "192.168.1.1",
    "items_count": 2
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
# {'risk_score': 0.12, 'decision': 'APPROVE'}`
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Code2 className="text-blue-500" /> API Integration Guide
        </h1>
        <p className="text-slate-400 mt-2">Learn how to connect your backend to the FraudShield AI Engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Explanations */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Terminal className="text-slate-400" size={20} /> Authentication
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              All requests to the FraudShield API must be authenticated via the <code className="text-blue-400 bg-slate-900 px-1 py-0.5 rounded">X-API-KEY</code> header. You can generate this key in the Developer Settings page.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <FileJson className="text-slate-400" size={20} /> The Response
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              The API will return a JSON object with the AI's calculated risk score and a definitive action to take.
            </p>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 font-mono text-sm">
              <div className="text-emerald-400">"risk_score" <span className="text-slate-300">: 0.12,</span></div>
              <div className="text-emerald-400 mt-2">"decision" <span className="text-slate-300">: "APPROVE"</span></div>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Decisions can be: <span className="text-emerald-500 font-bold">APPROVE</span>, <span className="text-amber-500 font-bold">REVIEW</span>, or <span className="text-red-500 font-bold">BLOCK</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Code Snippets */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <div className="border-b border-slate-700 bg-slate-800/50 p-4 flex gap-2">
            {['curl', 'node', 'python'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
                }`}
              >
                {tab === 'curl' ? 'cURL' : tab === 'node' ? 'Node.js' : 'Python'}
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={() => copyToClipboard(snippets[activeTab])}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-700 px-3 py-2 rounded-lg transition"
              >
                <Copy size={16} /> Copy Code
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-[#0d1117] flex-1 overflow-x-auto">
            <pre className="font-mono text-sm text-slate-300">
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiGuide;