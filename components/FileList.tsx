
import React, { useState } from 'react';
import { 
  File, Download, Trash2, ShieldCheck, ShieldAlert, ShieldX, 
  Clock, User as UserIcon, AlertCircle, Folder, ChevronRight, 
  ArrowLeft, Search
} from 'lucide-react';
import { FileMetadata, User, UserRole } from '../types';
import { deleteFile, addLog } from '../services/storageService';

interface FileListProps {
  files: FileMetadata[];
  user: User;
  onRefresh: () => void;
  currentFolderId?: string;
  onNavigate: (id?: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, user, onRefresh, currentFolderId, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (file: FileMetadata) => {
    const message = file.isFolder 
      ? `Deleting this container will hide all files inside it. Proceed?` 
      : `Permanently delete ${file.name}?`;
      
    if (confirm(message)) {
      deleteFile(file.id);
      addLog({
        userId: user.id,
        username: user.username,
        action: file.isFolder ? 'FOLDER_DELETE' : 'FILE_DELETE',
        details: `Deleted ${file.isFolder ? 'container' : 'file'}: ${file.name}`,
        severity: 'INFO'
      });
      onRefresh();
    }
  };

  const handleDownload = (file: FileMetadata) => {
    if (file.securityStatus === 'INFECTED') {
      alert("BLOCK: Security integrity check failed. Source file blocked.");
      return;
    }
    addLog({
      userId: user.id,
      username: user.username,
      action: 'FILE_DOWNLOAD',
      details: `Downloaded ${file.name}`,
      severity: 'INFO'
    });
    alert(`Downloading ${file.name}... (Simulated)`);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '--';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CLEAN': return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'WARNING': return <ShieldAlert className="text-amber-500" size={16} />;
      case 'INFECTED': return <ShieldX className="text-rose-600" size={16} />;
      default: return <Clock className="text-slate-400 animate-pulse" size={16} />;
    }
  };

  const currentFolder = files.find(f => f.id === currentFolderId);
  
  // Filtering logic
  const filteredFiles = files.filter(file => {
    const matchesFolder = file.parentFolderId === currentFolderId;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isVisibleToUser = user.role === UserRole.ADMIN || file.uploaderId === user.id || user.role === UserRole.VIEWER;
    return matchesFolder && matchesSearch && isVisibleToUser;
  });

  // Sort: Folders first, then name
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (a.isFolder && !b.isFolder) return -1;
    if (!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <button 
            onClick={() => onNavigate(undefined)}
            className={`flex items-center gap-1 text-sm font-bold ${!currentFolderId ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Vault
          </button>
          {currentFolderId && (
            <>
              <ChevronRight size={14} className="text-slate-300" />
              <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 truncate">
                <Folder size={14} />
                {currentFolder?.name}
              </div>
            </>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search container..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-48"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {currentFolderId && (
          <button 
            onClick={() => onNavigate(currentFolder?.parentFolderId)}
            className="w-full flex items-center gap-3 px-6 py-3 border-b border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to parent
          </button>
        )}

        {sortedFiles.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
              <Folder className="text-slate-200" size={32} />
            </div>
            <p className="text-slate-400 text-sm font-medium">This secure container is empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-6 py-3">Resource Name</th>
                  <th className="px-6 py-3">Integrity</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Owner</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFiles.map(file => (
                  <tr 
                    key={file.id} 
                    className={`hover:bg-slate-50/80 transition-colors group ${file.securityStatus === 'INFECTED' ? 'bg-rose-50/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div 
                        className={`flex items-center gap-3 ${file.isFolder ? 'cursor-pointer' : ''}`}
                        onClick={() => file.isFolder && onNavigate(file.id)}
                      >
                        <div className={`p-2 rounded-lg ${
                          file.securityStatus === 'INFECTED' ? 'bg-rose-100 text-rose-600' : 
                          file.isFolder ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {file.isFolder ? <Folder size={20} /> : <File size={20} />}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${file.securityStatus === 'INFECTED' ? 'text-rose-700' : 'text-slate-900'} ${file.isFolder ? 'hover:underline' : ''}`}>
                            {file.name}
                          </span>
                          {file.isSanitized && (
                            <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                              <AlertCircle size={10} /> Name sanitized
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.securityStatus)}
                        <span className={`text-[10px] font-black uppercase tracking-tight ${
                          file.securityStatus === 'CLEAN' ? 'text-emerald-600' :
                          file.securityStatus === 'WARNING' ? 'text-amber-600' :
                          file.securityStatus === 'INFECTED' ? 'text-rose-600' :
                          'text-slate-400'
                        }`}>
                          {file.securityStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {file.isFolder ? '--' : formatSize(file.size)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <UserIcon size={10} />
                        </div>
                        {file.uploaderName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!file.isFolder && (
                          <button 
                            onClick={() => handleDownload(file)}
                            className={`p-2 rounded-lg transition-colors ${
                              file.securityStatus === 'INFECTED' 
                              ? 'text-slate-300 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-50'
                            }`}
                          >
                            <Download size={16} />
                          </button>
                        )}
                        {(user.role === UserRole.ADMIN || file.uploaderId === user.id) && (
                          <button 
                            onClick={() => handleDelete(file)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;
