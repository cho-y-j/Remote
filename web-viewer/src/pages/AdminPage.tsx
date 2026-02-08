import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import api from '../services/api'

interface DashboardStats {
  totalUsers: number
  freeUsers: number
  proUsers: number
  bizUsers: number
  totalDevices: number
  activeSessions: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
}

interface UserSummary {
  id: string
  email: string
  name: string
  plan: string
  role: string
  provider: string
  enabled: boolean
  createdAt: string
}

interface PaymentSummary {
  id: string
  userEmail: string
  orderId: string
  amount: number
  status: string
  orderName: string
  paidAt: string
  createdAt: string
}

interface SessionSummary {
  id: string
  sessionCode: string
  hostDeviceId: string
  clientDeviceId: string | null
  hostUserEmail: string | null
  status: string
  startedAt: string
}

type Tab = 'overview' | 'users' | 'payments' | 'sessions'

export default function AdminPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<UserSummary[]>([])
  const [payments, setPayments] = useState<PaymentSummary[]>([])
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [tab])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      if (tab === 'overview' || !stats) {
        const res = await api.get<DashboardStats>('/admin/stats')
        setStats(res.data)
      }
      if (tab === 'users') {
        const res = await api.get<{ content: UserSummary[] }>('/admin/users?size=50')
        setUsers(res.data.content)
      }
      if (tab === 'payments') {
        const res = await api.get<{ content: PaymentSummary[] }>('/admin/payments?size=50')
        setPayments(res.data.content)
      }
      if (tab === 'sessions') {
        const res = await api.get<SessionSummary[]>('/admin/sessions')
        setSessions(res.data)
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('관리자 권한이 필요합니다')
      } else {
        setError(err.response?.data?.message || '데이터를 불러오는데 실패했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  const changePlan = async (userId: string, plan: string) => {
    try {
      await api.put(`/admin/users/${userId}/plan`, { plan })
      loadData()
    } catch {
      alert('플랜 변경 실패')
    }
  }

  const changeRole = async (userId: string, role: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role })
      loadData()
    } catch {
      alert('역할 변경 실패')
    }
  }

  const formatKRW = (n: number) => new Intl.NumberFormat('ko-KR').format(n)
  const formatDate = (s: string) => s ? new Date(s).toLocaleString('ko-KR') : '-'

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: '개요', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'users', label: '사용자', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'payments', label: '결제', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'sessions', label: '세션', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900">DeskOn</span>
              </Link>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">ADMIN</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{user?.email}</span>
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">대시보드</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm ring-1 ring-red-100">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">불러오는 중...</div>
        ) : (
          <>
            {/* Overview */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: '전체 사용자', value: stats.totalUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: '등록 기기', value: stats.totalDevices, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: '활성 세션', value: stats.activeSessions, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: '유료 구독', value: stats.activeSubscriptions, color: 'text-violet-600', bg: 'bg-violet-50' },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl p-5 ring-1 ring-gray-200">
                      <p className="text-sm text-gray-500">{s.label}</p>
                      <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue */}
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200">
                    <p className="text-sm text-gray-500">이번 달 매출</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">₩{formatKRW(stats.monthlyRevenue)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200">
                    <p className="text-sm text-gray-500">누적 매출</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">₩{formatKRW(stats.totalRevenue)}</p>
                  </div>
                </div>

                {/* Plan Distribution */}
                <div className="bg-white rounded-xl p-6 ring-1 ring-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">플랜 분포</h3>
                  <div className="flex gap-6">
                    {[
                      { label: 'Free', count: stats.freeUsers, color: 'bg-gray-400' },
                      { label: 'Pro', count: stats.proUsers, color: 'bg-primary-500' },
                      { label: 'Business', count: stats.bizUsers, color: 'bg-violet-500' },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span className="text-sm text-gray-600">{p.label}</span>
                        <span className="text-sm font-bold text-gray-900">{p.count}명</span>
                      </div>
                    ))}
                  </div>
                  {stats.totalUsers > 0 && (
                    <div className="mt-4 flex h-3 rounded-full overflow-hidden bg-gray-100">
                      {stats.freeUsers > 0 && (
                        <div className="bg-gray-400" style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }} />
                      )}
                      {stats.proUsers > 0 && (
                        <div className="bg-primary-500" style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }} />
                      )}
                      {stats.bizUsers > 0 && (
                        <div className="bg-violet-500" style={{ width: `${(stats.bizUsers / stats.totalUsers) * 100}%` }} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Users */}
            {tab === 'users' && (
              <div className="bg-white rounded-xl ring-1 ring-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">이메일</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">이름</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">플랜</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">역할</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">가입방식</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">가입일</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{u.email}</td>
                          <td className="px-4 py-3 text-gray-600">{u.name || '-'}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.plan}
                              onChange={(e) => changePlan(u.id, e.target.value)}
                              className="text-xs font-semibold rounded-md border border-gray-200 px-2 py-1"
                            >
                              <option value="FREE">FREE</option>
                              <option value="PRO">PRO</option>
                              <option value="BUSINESS">BUSINESS</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => changeRole(u.id, e.target.value)}
                              className="text-xs font-semibold rounded-md border border-gray-200 px-2 py-1"
                            >
                              <option value="USER">USER</option>
                              <option value="HELPER">HELPER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              u.provider === 'GOOGLE' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {u.provider}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${u.enabled ? 'text-emerald-600' : 'text-red-600'}`}>
                              {u.enabled ? '활성' : '비활성'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">사용자가 없습니다</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments */}
            {tab === 'payments' && (
              <div className="bg-white rounded-xl ring-1 ring-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">주문번호</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">사용자</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">내용</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">금액</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">결제일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.orderId}</td>
                          <td className="px-4 py-3 text-gray-900">{p.userEmail}</td>
                          <td className="px-4 py-3 text-gray-600">{p.orderName}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">₩{formatKRW(p.amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              p.status === 'DONE' ? 'bg-emerald-50 text-emerald-600'
                              : p.status === 'FAILED' ? 'bg-red-50 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.paidAt)}</td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">결제 내역이 없습니다</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sessions */}
            {tab === 'sessions' && (
              <div className="bg-white rounded-xl ring-1 ring-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">세션코드</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">호스트</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">클라이언트</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">사용자</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">시작</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sessions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono font-semibold text-gray-900">{s.sessionCode}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.hostDeviceId || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.clientDeviceId || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{s.hostUserEmail || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              s.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600'
                              : s.status === 'CONNECTING' ? 'bg-blue-50 text-blue-600'
                              : s.status === 'PENDING' ? 'bg-amber-50 text-amber-600'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.startedAt)}</td>
                        </tr>
                      ))}
                      {sessions.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">활성 세션이 없습니다</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
