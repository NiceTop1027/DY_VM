import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function getStatusColor(status) {
  switch (status) {
    case 'running':
      return 'bg-green-500'
    case 'stopped':
      return 'bg-red-500'
    case 'paused':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

export function getStatusText(status) {
  switch (status) {
    case 'running':
      return '실행 중'
    case 'stopped':
      return '정지됨'
    case 'paused':
      return '일시정지'
    default:
      return '알 수 없음'
  }
}
