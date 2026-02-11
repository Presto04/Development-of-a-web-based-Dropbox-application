
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'txt', 'docx', 'xlsx'];
export const SECURITY_POLICIES = {
  STRICT_MODE: true,
  SCAN_ON_UPLOAD: true,
  ENFORCE_RBAC: true
};

export const MOCK_USERS = [
  { id: '1', username: 'admin', role: 'ADMIN', password: 'password' },
  { id: '2', username: 'uploader_user', role: 'UPLOADER', password: 'password' },
  { id: '3', username: 'viewer_user', role: 'VIEWER', password: 'password' }
];
