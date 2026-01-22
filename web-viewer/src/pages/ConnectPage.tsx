import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ConnectPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!code) {
      navigate('/')
      return
    }

    // In production, this would establish a WebSocket connection
    // to the RustDesk relay server
    const connectToSession = async () => {
      try {
        setStatus('connecting')

        // Simulate connection attempt
        // In real implementation, this would:
        // 1. Call the API to join the session
        // 2. Establish WebSocket connection to hbbr
        // 3. Handle RustDesk protocol handshake

        await new Promise((resolve) => setTimeout(resolve, 2000))

        // For demo purposes, show the connection interface
        setStatus('connected')
      } catch (err: any) {
        setStatus('error')
        setErrorMessage(err.message || '연결에 실패했습니다')
      }
    }

    connectToSession()
  }, [code, navigate])

  if (status === 'connecting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">연결 중...</h2>
        <p className="text-gray-500">
          코드: <span className="font-mono">{code}</span>
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="card max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">연결 실패</h2>
        <p className="text-gray-500 mb-6">{errorMessage}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          돌아가기
        </button>
      </div>
    )
  }

  // Connected state - Remote desktop viewer
  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Toolbar */}
      <div className="bg-white rounded-t-2xl shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <div className="font-semibold text-gray-800">원격 연결</div>
            <div className="text-sm text-gray-500">코드: {code}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            연결됨
          </span>

          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
            title="연결 종료"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Remote Desktop View Placeholder */}
      <div className="bg-gray-900 rounded-b-2xl h-full flex items-center justify-center">
        <div className="text-center text-white">
          <svg
            className="w-24 h-24 mx-auto mb-6 opacity-50"
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
          <p className="text-xl mb-2">원격 화면이 여기에 표시됩니다</p>
          <p className="text-gray-400 text-sm">
            RustDesk 웹 클라이언트 통합 필요
          </p>
        </div>
      </div>
    </div>
  )
}
