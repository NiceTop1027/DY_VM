import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import axios from 'axios'
import { 
  Server, 
  Play, 
  Square, 
  Monitor, 
  LogOut,
  Cpu,
  HardDrive,
  RefreshCw
} from 'lucide-react'
import { getStatusColor, getStatusText, formatBytes } from '../lib/utils'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [vms, setVms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVMs()
  }, [])

  const fetchVMs = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/vm', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVms(response.data)
    } catch (error) {
      console.error('Failed to fetch VMs:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleStartVM = async (vmid) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/vm/${vmid}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTimeout(fetchVMs, 1000)
    } catch (error) {
      alert('VM 시작 실패: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleStopVM = async (vmid) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/vm/${vmid}/stop`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTimeout(fetchVMs, 1000)
    } catch (error) {
      alert('VM 정지 실패: ' + (error.response?.data?.error || error.message))
    }
  }


  const handleOpenConsole = (vmid) => {
    navigate(`/vm/${vmid}/console`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">가상 서버 플랫폼</h1>
                <p className="text-sm text-gray-500">사용 가능한 VM 목록</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">사용 가능한 가상 서버</h2>
          <Button variant="outline" onClick={fetchVMs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : vms.length === 0 ? (
          <Card className="p-12 text-center">
            <Server className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">사용 가능한 VM이 없습니다</h3>
            <p className="text-gray-500">관리자에게 문의하세요</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vms.map((vm) => (
              <Card key={vm.vmid} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{vm.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">VMID: {vm.vmid}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(vm.status)}`}></span>
                      <span className="text-sm font-medium">{getStatusText(vm.status)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <Cpu className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">CPU:</span>
                      <span className="ml-auto font-medium">{vm.cpus || vm.cores || 'N/A'} 코어</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <HardDrive className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">메모리:</span>
                      <span className="ml-auto font-medium">{formatBytes(vm.maxmem || 0)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <HardDrive className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">디스크:</span>
                      <span className="ml-auto font-medium">{formatBytes(vm.maxdisk || 0)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {vm.status === 'running' ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenConsole(vm.vmid)}
                          className="flex-1"
                        >
                          <Monitor className="w-4 h-4 mr-1" />
                          접속하기
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleStopVM(vm.vmid)}
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartVM(vm.vmid)}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        시작하기
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
