
import React, { useState, useRef } from 'react';
import { Upload, FolderPlus, AlertTriangle, ShieldAlert, Loader2, Plus, X } from 'lucide-react';
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from '../constants';
import { User, FileMetadata } from '../types';
import { saveFile, updateFile, addLog } from '../services/storageService';
import { scanFileMetadata } from '../services/geminiService';

interface FileUploaderProps {
  user: User;
  onUploadSuccess: () => void;
  currentFolderId?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ user, onUploadSuccess, currentFolderId }) => {
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sanitizeFileName = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9.-]/g, '_');
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const sanitizedName = sanitizeFileName(folderName);
    const newFolder: FileMetadata = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      size: 0,
      type: 'folder',
      uploadDate: new Date().toISOString(),
      uploaderId: user.id,
      uploaderName: user.username,
      isSanitized: sanitizedName !== folderName,
      securityStatus: 'CLEAN',
      isFolder: true,
      parentFolderId: currentFolderId
    };

    saveFile(newFolder);
    addLog({
      userId: user.id,
      username: user.username,
      action: 'FOLDER_CREATE',
      details: `Created container: ${sanitizedName}`,
      severity: 'INFO'
    });

    setFolderName('');
    setShowFolderInput(false);
    onUploadSuccess();
  };

  const processFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit.`);
      return;
    }
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type.`);
      return;
    }

    setUploading(true);
    setError(null);
    setScanning(true);

    const sanitizedName = sanitizeFileName(file.name);
    const newFile: FileMetadata = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      size: file.size,
      type: file.type || 'application/octet-stream',
      uploadDate: new Date().toISOString(),
      uploaderId: user.id,
      uploaderName: user.username,
      isSanitized: sanitizedName !== file.name,
      securityStatus: 'PENDING',
      parentFolderId: currentFolderId,
      isFolder: false
    };

    saveFile(newFile);
    addLog({
      userId: user.id,
      username: user.username,
      action: 'FILE_UPLOAD',
      details: `Uploaded ${sanitizedName} to ${currentFolderId ? 'subfolder' : 'root'}`,
      severity: 'INFO'
    });

    try {
      const scanResult = await scanFileMetadata(newFile);
      updateFile({
        ...newFile,
        securityStatus: scanResult.status,
        threatScore: scanResult.score,
        aiAnalysis: scanResult.analysis
      });
    } finally {
      setScanning(false);
      setUploading(false);
      onUploadSuccess();
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
        >
          <Upload size={16} />
          Upload Securely
        </button>
        
        <button 
          onClick={() => setShowFolderInput(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all"
        >
          <FolderPlus size={16} className="text-indigo-600" />
          New Container
        </button>
      </div>

      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
      />

      {showFolderInput && (
        <form onSubmit={handleCreateFolder} className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                autoFocus
                type="text"
                placeholder="Name your container..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="button"
                onClick={() => setShowFolderInput(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {uploading && (
        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-center gap-3 animate-pulse">
          <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          <span className="text-sm font-bold text-indigo-700">
            {scanning ? 'Running AI Security Scan...' : 'Preparing Secure Upload...'}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
