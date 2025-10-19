// API 기본 URL 설정
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// API 엔드포인트
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VERIFY: '/api/auth/verify',
  
  // VM
  VMS: '/api/vm',
  VM_DETAIL: (vmid) => `/api/vm/${vmid}`,
  VM_START: (vmid) => `/api/vm/${vmid}/start`,
  VM_STOP: (vmid) => `/api/vm/${vmid}/stop`,
  VM_VNC: (vmid) => `/api/vm/${vmid}/vnc`,
  
  // Proxmox
  RESOURCES: '/api/proxmox/resources',
  STORAGES: '/api/proxmox/storages'
}

// Axios 기본 설정을 위한 헬퍼
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
