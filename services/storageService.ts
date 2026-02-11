
import { FileMetadata, SystemLog } from "../types";

const FILES_KEY = 'defender_files';
const LOGS_KEY = 'defender_logs';

export const getFiles = (): FileMetadata[] => {
  const data = localStorage.getItem(FILES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFile = (file: FileMetadata) => {
  const files = getFiles();
  files.push(file);
  localStorage.setItem(FILES_KEY, JSON.stringify(files));
};

export const updateFile = (file: FileMetadata) => {
  const files = getFiles();
  const index = files.findIndex(f => f.id === file.id);
  if (index !== -1) {
    files[index] = file;
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  }
};

export const deleteFile = (id: string) => {
  const files = getFiles();
  const filtered = files.filter(f => f.id !== id);
  localStorage.setItem(FILES_KEY, JSON.stringify(filtered));
};

export const getLogs = (): SystemLog[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addLog = (log: Omit<SystemLog, 'id' | 'timestamp'>) => {
  const logs = getLogs();
  const newLog: SystemLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog); // Newest first
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 200))); // Keep last 200
};
