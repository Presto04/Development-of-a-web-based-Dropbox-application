
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertCircle, FileCheck, HardDrive, Terminal } from 'lucide-react';
import { FileMetadata, SystemLog } from '../types';

interface AdminDashboardProps {
  files: FileMetadata[];
  logs: SystemLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ files, logs }) => {
  const stats = [
    { label: 'Total Files', value: files.length, icon: <HardDrive />, color: 'bg-indigo-500' },
    { label: 'Cleaned', value: files.filter(f => f.securityStatus === 'CLEAN').length, icon: <FileCheck />, color: 'bg-emerald-500' },
    { label: 'Threats Blocked', value: files.filter(f => f.securityStatus === 'INFECTED').length, icon: <Shield />, color: 'bg-rose-500' },
    { label: 'Warnings', value: files.filter(f => f.securityStatus === 'WARNING').length, icon: <AlertCircle />, color: 'bg-amber-500' },
  ];

  const statusData = [
    { name: 'Clean', value: files.filter(f => f.securityStatus === 'CLEAN').length, color: '#10b981' },
    { name: 'Warning', value: files.filter(f => f.securityStatus === 'WARNING').length, color: '#f59e0b' },
    { name: 'Infected', value: files.filter(f => f.securityStatus === 'INFECTED').length, color: '#ef4444' },
    { name: 'Pending', value: files.filter(f => f.securityStatus === 'PENDING').length, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/10`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Threat Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-2 bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 shadow-xl font-mono text-[11px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Terminal size={14} />
              <h3 className="font-bold uppercase tracking-widest">System Audit Logs</h3>
            </div>
            <span className="text-[9px] bg-slate-800 px-2 py-1 rounded">Real-time Stream</span>
          </div>
          <div className="h-64 overflow-y-auto space-y-2 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">No logs available...</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex gap-4 p-2 hover:bg-white/5 rounded transition-colors group">
                  <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className={`shrink-0 font-bold ${
                    log.severity === 'CRITICAL' ? 'text-rose-500' :
                    log.severity === 'WARNING' ? 'text-amber-500' :
                    'text-emerald-500'
                  }`}>
                    {log.action}
                  </span>
                  <span className="shrink-0 text-slate-400">{log.username}</span>
                  <span className="flex-1 text-slate-500 truncate group-hover:text-slate-300">
                    {log.details}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
