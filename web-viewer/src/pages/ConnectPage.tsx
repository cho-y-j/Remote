import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ConnectPage() {
  const navigate = useNavigate()
  const [remoteId, setRemoteId] = useState('')
  const [copied, setCopied] = useState(false)

  const handleConnect = () => {
    if (remoteId.trim()) {
      // 앱이 설치되어 있으면 앱으로 연결 시도
      window.location.href = `rustdesk://connect/${remoteId.replace(/\s/g, '')}`
    }
  }

  const copyDownloadLink = () => {
    navigator.clipboard.writeText('https://rustdesk.com/download')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">원격 지원 연결</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 연결 카드 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🖥️ 원격 연결하기
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상대방 ID 입력
            </label>
            <input
              type="text"
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
              placeholder="예: 123 456 789"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono tracking-wider"
            />
          </div>

          <button
            onClick={handleConnect}
            disabled={!remoteId.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            앱으로 연결하기
          </button>

          <p className="text-sm text-gray-500 mt-3 text-center">
            * RustDesk 앱이 설치되어 있어야 합니다
          </p>
        </div>

        {/* 앱 다운로드 카드 */}
        <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📱 앱 다운로드
          </h2>

          <p className="text-gray-600 mb-6">
            원격 지원을 받거나 제공하려면 앱 설치가 필요합니다.
          </p>

          <div className="space-y-3">
            <a
              href="https://github.com/rustdesk/rustdesk/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪟</span>
                <span className="font-medium">Windows</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>

            <a
              href="https://github.com/rustdesk/rustdesk/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍎</span>
                <span className="font-medium">macOS</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.carriez.flutter_hbb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <span className="font-medium">Android</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>

          <button
            onClick={copyDownloadLink}
            className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            {copied ? '✅ 링크 복사됨!' : '📋 다운로드 링크 복사'}
          </button>
        </div>
      </div>

      {/* 사용 안내 */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📖 사용 방법
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">앱 설치</h3>
            <p className="text-sm text-gray-500">
              도움받을 분과 도와줄 분 모두 앱을 설치합니다
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">ID 공유</h3>
            <p className="text-sm text-gray-500">
              도움받을 분이 화면의 ID 번호를 알려줍니다
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">연결</h3>
            <p className="text-sm text-gray-500">
              ID를 입력하면 원격으로 화면을 보고 제어할 수 있습니다
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← 대시보드로 돌아가기
        </button>
      </div>
    </div>
  )
}
