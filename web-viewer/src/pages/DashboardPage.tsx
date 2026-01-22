import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { sessionApi, SessionResponse } from '../services/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [connectCode, setConnectCode] = useState('')

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const response = await sessionApi.getActiveSessions()
      return response.data
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    if (connectCode.trim()) {
      navigate(`/connect/${connectCode.replace(/\s/g, '')}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Connect Card */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">원격 연결</h2>
        <p className="text-gray-500 mb-6">
          도움이 필요한 분의 연결 코드를 입력하세요
        </p>

        <form onSubmit={handleConnect} className="flex gap-4">
          <input
            type="text"
            value={connectCode}
            onChange={(e) => setConnectCode(e.target.value)}
            className="input flex-1 text-2xl text-center tracking-widest font-mono"
            placeholder="000 000 000"
            maxLength={11}
          />
          <button
            type="submit"
            disabled={!connectCode.trim()}
            className="btn-primary px-8"
          >
            연결
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">활성 세션</h2>
          <span className="text-sm text-gray-500">
            {sessions?.length || 0}개 활성
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session: SessionResponse) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => navigate(`/connect/${session.sessionCode}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p>현재 활성 세션이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SessionCard({
  session,
  onClick,
}: {
  session: SessionResponse
  onClick: () => void
}) {
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONNECTING: 'bg-blue-100 text-blue-700',
    ACTIVE: 'bg-green-100 text-green-700',
    ENDED: 'bg-gray-100 text-gray-700',
  }

  const statusLabels: Record<string, string> = {
    PENDING: '대기 중',
    CONNECTING: '연결 중',
    ACTIVE: '연결됨',
    ENDED: '종료됨',
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
    >
      <div>
        <div className="font-mono text-lg font-semibold text-gray-800">
          {session.sessionCode.replace(/(.{3})/g, '$1 ').trim()}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {new Date(session.startedAt).toLocaleString('ko-KR')}
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[session.status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {statusLabels[session.status] || session.status}
      </span>
    </button>
  )
}
