import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { UserPlus, Users, Settings, Trash2, Edit } from 'lucide-react'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    assignedVMs: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchUsers()
  }, [user, navigate])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
    } catch (err) {
      setError('사용자 목록을 불러오는데 실패했습니다.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const vmIds = formData.assignedVMs
        ? formData.assignedVMs.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : []

      const userData = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        assignedVMs: vmIds,
        role: formData.role
      }

      if (editingUser) {
        // 업데이트
        if (formData.password) {
          userData.password = formData.password
        }
        await axios.put(`/api/admin/users/${editingUser.id}`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('사용자가 업데이트되었습니다.')
      } else {
        // 생성
        userData.password = formData.password
        await axios.post('/api/admin/users', userData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('사용자가 생성되었습니다.')
      }

      setFormData({
        username: '',
        email: '',
        password: '',
        fullName: '',
        assignedVMs: '',
        role: 'student'
      })
      setShowCreateForm(false)
      setEditingUser(null)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.error || '작업에 실패했습니다.')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      fullName: user.fullName || '',
      assignedVMs: user.assignedVMs?.join(', ') || '',
      role: user.role
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm('정말 이 사용자를 삭제하시겠습니까?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('사용자가 삭제되었습니다.')
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.error || '삭제에 실패했습니다.')
    }
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      assignedVMs: '',
      role: 'student'
    })
    setError('')
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold text-white">관리자 패널</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-300 hover:text-white"
              >
                대시보드
              </button>
              <button
                onClick={logout}
                className="text-slate-300 hover:text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="h-8 w-8" />
            사용자 관리
          </h1>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              새 사용자 생성
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingUser ? '사용자 수정' : '새 사용자 생성'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      사용자명
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      비밀번호 {editingUser && '(변경시만 입력)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required={!editingUser}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      할당된 VM (쉼표로 구분, 예: 100, 101, 102)
                    </label>
                    <input
                      type="text"
                      value={formData.assignedVMs}
                      onChange={(e) => setFormData({ ...formData, assignedVMs: e.target.value })}
                      placeholder="100, 101, 102"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      역할
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="student">학생</option>
                      <option value="admin">관리자</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {editingUser ? '수정' : '생성'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>전체 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300">사용자명</th>
                    <th className="text-left py-3 px-4 text-slate-300">이메일</th>
                    <th className="text-left py-3 px-4 text-slate-300">이름</th>
                    <th className="text-left py-3 px-4 text-slate-300">역할</th>
                    <th className="text-left py-3 px-4 text-slate-300">할당된 VM</th>
                    <th className="text-left py-3 px-4 text-slate-300">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{u.username}</td>
                      <td className="py-3 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3 px-4 text-slate-300">{u.fullName || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {u.role === 'admin' ? '관리자' : '학생'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {u.assignedVMs?.length > 0 ? u.assignedVMs.join(', ') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                            title="수정"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
