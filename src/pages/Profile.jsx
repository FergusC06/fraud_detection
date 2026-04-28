import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Building, Mail, Lock, Shield, Save, Calendar } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    merchant_name: '',
    email: '',
    password: ''
  });

  // 1. Fetch Profile Data on Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfileData(response.data);
        setFormData({
          merchant_name: response.data.merchant_name,
          email: response.data.user_email,
          password: '' // Keep password empty by default
        });
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle Form Updates
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit Changes to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Only send password if they actually typed something new
      const payload = {
        merchant_name: formData.merchant_name,
        email: formData.email
      };
      
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      await api.put('/profile', payload);
      toast.success('Profile updated successfully!');
      
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
      
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-cyan-400" /> Account Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage your organization and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Left Column: Account Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">System Status</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 flex items-center gap-2 mb-1">
                  <Shield size={16} /> Account Role
                </p>
                <p className="font-medium bg-slate-900 px-3 py-1.5 rounded inline-block text-cyan-400 capitalize">
                  {profileData?.role}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400 flex items-center gap-2 mb-1">
                  <Building size={16} /> Merchant Status
                </p>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${profileData?.merchant_status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  <p className="font-medium">{profileData?.merchant_status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 flex items-center gap-2 mb-1">
                  <Calendar size={16} /> Member Since
                </p>
                <p className="font-medium text-slate-300">
                  {new Date(profileData?.account_created).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold">Update Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    name="merchant_name"
                    required
                    className="appearance-none rounded-lg block w-full px-12 py-3 border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={formData.merchant_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="appearance-none rounded-lg block w-full px-12 py-3 border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Update */}
              <div className="pt-4 border-t border-slate-700 mt-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    className="appearance-none rounded-lg block w-full px-12 py-3 border border-slate-600 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Leave blank to keep current password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Only fill this out if you wish to change your login password.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-cyan-500/20"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
  );
};

export default Profile;