import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import { authApi } from '../services/api'

export default function SignupPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGoogleResponse = useCallback(async (response: any) => {
    setError('')
    setLoading(true)
    try {
      const result = await authApi.googleLogin({ idToken: response.credential })
      const { accessToken, email: userEmail, name: userName, plan } = result.data
      login(userEmail, userName || '', accessToken, plan || 'FREE')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google 가입에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }, [login, navigate])

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || !window.google) return

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    })

    const btnEl = document.getElementById('google-signup-btn')
    if (btnEl) {
      window.google.accounts.id.renderButton(btnEl, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }
  }, [handleGoogleResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다')
      return
    }

    setLoading(true)

    try {
      const response = await authApi.register({ email, password, name })
      const { accessToken, email: userEmail, name: userName, plan } = response.data
      login(userEmail, userName || '', accessToken, plan || 'FREE')
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.message
      if (msg?.includes('already registered')) {
        setError('이미 가입된 이메일입니다. 로그인해주세요.')
      } else {
        setError(msg || '회원가입에 실패했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex flex-col">
      {/* Header */}
      <header className="pt-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">DeskOn</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 ring-1 ring-gray-100 overflow-hidden">
            <div className="px-8 pt-10 pb-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">무료 회원가입</h1>
                <p className="mt-2 text-sm text-gray-500">DeskOn으로 원격 데스크톱을 시작하세요</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 ring-1 ring-red-100">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign-Up */}
              <div className="mb-6">
                <div id="google-signup-btn" className="flex justify-center"></div>
                {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google로 가입 (설정 필요)
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">또는 이메일로 가입</span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="8자 이상 입력"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    placeholder="비밀번호 재입력"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      가입 중...
                    </span>
                  ) : '무료로 시작하기'}
                </button>
              </form>

              {/* Free plan info */}
              <div className="mt-6 bg-primary-50/50 rounded-xl p-4 ring-1 ring-primary-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900">무료 플랜 포함</p>
                    <p className="text-xs text-primary-700 mt-0.5">모든 기능 체험 — P2P 연결, 기기 3대, 세션당 1시간</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  로그인
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-8 text-center text-xs text-gray-400">
            가입 시{' '}
            <a href="#" className="underline hover:text-gray-500">이용약관</a>
            {' '}및{' '}
            <a href="#" className="underline hover:text-gray-500">개인정보처리방침</a>
            에 동의합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
