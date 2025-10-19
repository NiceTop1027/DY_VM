import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ArrowLeft, Monitor, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function VMConsole() {
  const { vmid } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const rfbRef = useRef(null)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(true)
  const [vmInfo, setVmInfo] = useState(null)

  useEffect(() => {
    connectToConsole()
    
    return () => {
      if (rfbRef.current) {
        rfbRef.current.disconnect()
      }
    }
  }, [vmid])

  const connectToConsole = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Get VM info
      const vmResponse = await axios.get(`/api/vm/${vmid}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVmInfo(vmResponse.data)

      // Get VNC connection info
      const vncResponse = await axios.get(`/api/vm/${vmid}/vnc`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const { host, port, ticket } = vncResponse.data

      // Connect to VNC via WebSocket
      const wsUrl = `wss://${host}:${port}/?vncticket=${encodeURIComponent(ticket)}`
      
      // Dynamically import noVNC to avoid build issues
      const { default: RFB } = await import('@novnc/novnc/lib/rfb.js')
      
      // Initialize noVNC
      const rfb = new RFB(canvasRef.current, wsUrl, {
        credentials: { password: ticket },
        wsProtocols: ['binary']
      })

      rfb.addEventListener('connect', () => {
        console.log('Connected to VNC')
        setConnecting(false)
      })

      rfb.addEventListener('disconnect', (e) => {
        console.log('Disconnected from VNC:', e.detail)
        setError('연결이 끊어졌습니다.')
        setConnecting(false)
      })

      rfb.addEventListener('securityfailure', (e) => {
        console.error('Security failure:', e.detail)
        setError('인증 실패: ' + e.detail.status)
        setConnecting(false)
      })

      rfb.scaleViewport = true
      rfb.resizeSession = true

      rfbRef.current = rfb

    } catch (err) {
      console.error('Failed to connect to console:', err)
      setError(err.response?.data?.error || '콘솔 연결에 실패했습니다.')
      setConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              대시보드로
            </Button>
            <div className="flex items-center space-x-2 text-white">
              <Monitor className="w-5 h-5" />
              <span className="font-medium">VM {vmid}</span>
              {vmInfo && <span className="text-gray-400">- {vmInfo.name}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {connecting && (
              <span className="text-sm text-gray-400">연결 중...</span>
            )}
            <div className={`w-2 h-2 rounded-full ${connecting ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
          </div>
        </div>
      </header>

      {/* Console Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        {error ? (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">연결 오류</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={connectToConsole}>다시 연결</Button>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {connecting && (
              <div className="absolute z-10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">VM 콘솔에 연결 중...</p>
              </div>
            )}
            <div 
              ref={canvasRef} 
              className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Proxmox VNC Console</span>
          <span>Ctrl+Alt+Del을 보내려면 우클릭 메뉴를 사용하세요</span>
        </div>
      </footer>
    </div>
  )
}
