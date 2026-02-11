
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Layout from './components/Layout';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import AdminDashboard from './components/AdminDashboard';
import SecurityReport from './components/SecurityReport';
import { User, FileMetadata, SystemLog, UserRole } from './types';
import { getFiles, getLogs, addLog } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('files');
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load initial data
    setFiles(getFiles());
    setLogs(getLogs());
  }, [refreshTrigger]);

  const handleLogin = (u: User) => {
    setUser(u);
    addLog({
      userId: u.id,
      username: u.username,
      action: 'LOGIN',
      details: `User logged in with role ${u.role}`,
      severity: 'INFO'
    });
  };

  const handleLogout = () => {
    if (user) {
      addLog({
        userId: user.id,
        username: user.username,
        action: 'LOGOUT',
        details: 'User logged out',
        severity: 'INFO'
      });
    }
    setUser(null);
    setActiveTab('files');
    setCurrentFolderId(undefined);
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleNavigate = (id?: string) => {
    setCurrentFolderId(id);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'files' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Secure Storage Pool</h1>
              <p className="text-slate-500 text-sm">Organize resources into isolated secure containers.</p>
            </div>
          </div>
          
          {user.role !== UserRole.VIEWER && (
            <FileUploader 
              user={user} 
              onUploadSuccess={refreshData} 
              currentFolderId={currentFolderId} 
            />
          )}
          
          <FileList 
            files={files} 
            user={user} 
            onRefresh={refreshData} 
            currentFolderId={currentFolderId}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      {activeTab === 'dashboard' && user.role === UserRole.ADMIN && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">Security Command Center</h1>
            <p className="text-slate-500">Real-time threat monitoring and system audit trails.</p>
          </div>
          <AdminDashboard files={files} logs={logs} />
        </div>
      )}

      {activeTab === 'report' && (
        <div className="animate-in zoom-in-95 duration-500">
          <SecurityReport />
        </div>
      )}
    </Layout>
  );
};

export default App;
