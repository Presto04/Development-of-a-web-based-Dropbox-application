
import React from 'react';
import { Shield, LogOut, FileText, BarChart3, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, setActiveTab, children }) => {
  const navItems = [
    { id: 'files', label: 'Files', icon: <FileText size={18} />, roles: [UserRole.ADMIN, UserRole.UPLOADER, UserRole.VIEWER] },
    { id: 'dashboard', label: 'Admin Dashboard', icon: <BarChart3 size={18} />, roles: [UserRole.ADMIN] },
    { id: 'report', label: 'Security Report', icon: <ShieldCheck size={18} />, roles: [UserRole.ADMIN, UserRole.UPLOADER, UserRole.VIEWER] },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Shield className="text-white" size={24} />
          </div>
          <span className="font-bold text-lg tracking-tight">Dropbox Prototype</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.filter(item => item.roles.includes(user.role)).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
              <UserIcon size={20} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">{user.username}</span>
              <span className="text-xs text-slate-500 uppercase font-bold">{user.role}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
