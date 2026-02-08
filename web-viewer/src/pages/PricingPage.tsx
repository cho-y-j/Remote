import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../services/authStore'
import { paymentApi } from '../services/api'

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      payment: (options: { customerKey: string }) => {
        requestBillingAuth: (method: string, options: any) => Promise<void>
      }
    }
  }
}

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || ''

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '모든 기능 사용',
      'P2P 직접 연결',
      '기기 3대',
      '동시 세션 1개',
      '세션당 1시간',
      '광고 포함',
    ],
    notIncluded: ['릴레이 서버'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    monthlyPrice: 5900,
    yearlyPrice: 49170,
    popular: true,
    features: [
      '모든 기능 사용',
      'P2P + 릴레이 서버',
      '기기 10대',
      '동시 세션 3개',
      '무제한 시간',
      '광고 없음',
    ],
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    monthlyPrice: 12900,
    yearlyPrice: 107500,
    features: [
      '모든 기능 사용',
      'P2P + 릴레이 서버',
      '무제한 기기',
      '동시 세션 10개',
      '무제한 시간',
      '광고 없음',
      '관리자 대시보드',
    ],
  },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const loginStore = useAuthStore((s) => s.login)
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle Toss callback (redirect back with authKey)
  useEffect(() => {
    const authKey = searchParams.get('authKey')
    const customerKeyParam = searchParams.get('customerKey')
    const planParam = searchParams.get('plan')
    const cycleParam = searchParams.get('billingCycle')

    if (authKey && customerKeyParam && planParam && cycleParam) {
      handlePaymentConfirm(authKey, customerKeyParam, planParam, cycleParam)
    }
  }, [searchParams])

  const handlePaymentConfirm = async (
    authKey: string,
    customerKey: string,
    plan: string,
    cycle: string
  ) => {
    setLoading(plan)
    setError('')
    try {
      const response = await paymentApi.subscribe({
        authKey,
        customerKey,
        plan,
        billingCycle: cycle,
      })

      // Update local auth store with new plan
      if (user) {
        loginStore(user.email, user.name, useAuthStore.getState().accessToken || '', response.data.plan)
      }

      setSuccess(`${plan} 플랜으로 업그레이드되었습니다!`)
      // Clean URL
      navigate('/pricing', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || '결제 처리에 실패했습니다')
    } finally {
      setLoading(null)
    }
  }

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/signup')
      return
    }

    if (planId === 'FREE') return

    if (!TOSS_CLIENT_KEY) {
      setError('결제 시스템 설정이 필요합니다. 관리자에게 문의하세요.')
      return
    }

    setLoading(planId)
    setError('')

    try {
      const customerKey = `cust_${user!.email.replace(/[@.]/g, '_')}`
      const tossPayments = window.TossPayments?.(TOSS_CLIENT_KEY)

      if (!tossPayments) {
        setError('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
        setLoading(null)
        return
      }

      const payment = tossPayments.payment({ customerKey })

      await payment.requestBillingAuth('카드', {
        customerEmail: user!.email,
        customerName: user!.name,
        successUrl: `${window.location.origin}/pricing?plan=${planId}&billingCycle=${billingCycle}&customerKey=${customerKey}`,
        failUrl: `${window.location.origin}/pricing?error=true`,
      })
    } catch (err: any) {
      if (err.code !== 'USER_CANCEL') {
        setError(err.message || '결제를 시작할 수 없습니다')
      }
      setLoading(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="pt-8 px-4 pb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">DeskOn</span>
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
              대시보드 &rarr;
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">심플한 요금제</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            필요한 만큼만 사용하세요. 언제든 업그레이드하거나 해지할 수 있습니다.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'MONTHLY'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'YEARLY'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              연간
              <span className="ml-1.5 text-xs text-emerald-600 font-semibold">2개월 무료</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="max-w-lg mx-auto mb-8 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm ring-1 ring-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="max-w-lg mx-auto mb-8 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm ring-1 ring-emerald-100 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice
            const perMonth = billingCycle === 'YEARLY' && plan.yearlyPrice > 0
              ? Math.round(plan.yearlyPrice / 12)
              : plan.monthlyPrice
            const isCurrentPlan = user?.plan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl overflow-hidden transition-all ${
                  plan.popular
                    ? 'ring-2 ring-primary-500 shadow-xl shadow-primary-500/10'
                    : 'ring-1 ring-gray-200 shadow-lg shadow-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-xs font-bold text-center py-1.5">
                    가장 인기
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>

                  <div className="mt-4 mb-6">
                    {price === 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">무료</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900">
                            ₩{formatPrice(perMonth)}
                          </span>
                          <span className="text-gray-400 text-sm">/월</span>
                        </div>
                        {billingCycle === 'YEARLY' && (
                          <p className="text-xs text-gray-400 mt-1">
                            연 ₩{formatPrice(price)} 청구
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      현재 플랜
                    </button>
                  ) : plan.id === 'FREE' ? (
                    <Link
                      to={isAuthenticated ? '/dashboard' : '/signup'}
                      className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {isAuthenticated ? '현재 플랜' : '무료로 시작'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading !== null}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        plan.popular
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          처리 중...
                        </span>
                      ) : (
                        `${plan.name} 시작하기`
                      )}
                    </button>
                  )}

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded?.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: '무료 플랜으로도 원격 제어를 할 수 있나요?',
                a: '네, 무료 플랜에서도 P2P 연결을 통한 모든 원격 제어 기능을 사용할 수 있습니다. 다만 세션당 1시간 제한이 있고, 릴레이 서버는 사용할 수 없습니다.',
              },
              {
                q: '릴레이 서버가 뭔가요?',
                a: 'P2P 연결이 되지 않는 환경(회사 방화벽 등)에서 중계 서버를 통해 연결하는 방식입니다. 유료 플랜에서만 사용 가능합니다.',
              },
              {
                q: '언제든 해지할 수 있나요?',
                a: '네, 언제든 해지할 수 있으며 즉시 무료 플랜으로 전환됩니다. 환불은 별도 문의해주세요.',
              },
              {
                q: '결제 수단은 무엇을 지원하나요?',
                a: '토스페이먼츠를 통한 신용카드/체크카드 정기 결제를 지원합니다.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-xl ring-1 ring-gray-200">
                <summary className="px-5 py-4 text-sm font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
