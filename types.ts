
export enum UserRole {
  ADMIN = 'ADMIN',
  UPLOADER = 'UPLOADER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  uploaderId: string;
  uploaderName: string;
  isSanitized: boolean;
  securityStatus: 'CLEAN' | 'WARNING' | 'INFECTED' | 'PENDING';
  threatScore?: number;
  aiAnalysis?: string;
  isFolder?: boolean;
  parentFolderId?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
