
import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin({ id: user.id, username: user.username, role: user.role as any });
    } else {
      setError('Invalid credentials. Hint: use admin/password, uploader_user/password, or viewer_user/password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-slate-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-6 shadow-lg shadow-indigo-500/20">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Dropbox Prototype</h1>
            <p className="text-slate-400">Secure Access Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              Sign In
            </button>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Available Test Roles</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="text-[10px] text-slate-500 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                  <span className="text-indigo-400 font-bold">Admin:</span> admin / password
                </div>
                <div className="text-[10px] text-slate-500 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                  <span className="text-indigo-400 font-bold">Uploader:</span> uploader_user / password
                </div>
                <div className="text-[10px] text-slate-500 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                  <span className="text-indigo-400 font-bold">Viewer:</span> viewer_user / password
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
