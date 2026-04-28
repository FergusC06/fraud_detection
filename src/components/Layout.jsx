import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Key, Code2, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  // Define the menu items
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/manage-api-key', name: 'API Keys', icon: Key },
    { path: '/api-integration', name: 'Dev Guide', icon: Code2 },
    { path: '/profile', name: 'Settings', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-10 shadow-xl">
        {/* Branding */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <ShieldCheck className="text-blue-500 h-8 w-8" />
          <h2 className="text-2xl font-bold text-white tracking-tight">FraudShield</h2>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30 w-full px-4 py-3 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - This is where your actual pages render */}
      <main className="flex-1 overflow-y-auto bg-slate-900 relative">
        {children}
      </main>
      
    </div>
  );
};

export default Layout;