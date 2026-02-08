import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: '초고속 P2P 연결',
    desc: 'WebRTC 기반 다이렉트 연결로 지연 없는 실시간 화면 공유. 중간 서버를 거치지 않아 빠르고 안전합니다.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'E2E 암호화',
    desc: '모든 데이터는 엔드투엔드 암호화되어 전송됩니다. 제3자가 내용을 확인할 수 없는 군사급 보안.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: '멀티 플랫폼',
    desc: 'Windows, macOS, Android, iOS 모든 기기에서 사용 가능. 어떤 기기 조합이든 원격 연결됩니다.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: '파일 전송',
    desc: '원격 연결 상태에서 파일과 폴더를 자유롭게 주고받을 수 있습니다. 드래그 앤 드롭으로 간편하게.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: '음성 통화',
    desc: '화면 공유와 동시에 음성 통화가 가능합니다. 문제를 설명하면서 실시간으로 해결하세요.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: '자체 서버 운영',
    desc: '자체 중계 서버로 기업 보안 정책에 맞는 독립적인 원격 지원 환경을 구축합니다.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
  },
];

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '영구 무료',
    desc: '모든 기능을 무료로 체험하세요',
    features: [
      'P2P 직접 연결',
      '화면 공유 및 원격 제어',
      '파일 전송',
      '음성 통화',
      '최대 3대 기기 등록',
      '동시 접속 1세션',
    ],
    limitations: [
      '세션당 1시간 제한',
      '릴레이 서버 미지원',
      '광고 표시',
    ],
    cta: '무료로 시작하기',
    highlight: false,
    gradient: '',
    border: 'border-gray-200',
  },
  {
    name: 'Pro',
    price: '5,900',
    period: '월',
    desc: '제한 없는 원격 데스크톱',
    features: [
      'P2P + 릴레이 서버 연결',
      '화면 공유 및 원격 제어',
      '고속 파일 전송 (무제한)',
      '음성 통화',
      '세션 시간 무제한',
      '최대 10대 기기 등록',
      '동시 접속 3세션',
      '광고 없음',
      '우선 기술 지원',
    ],
    limitations: [],
    cta: '프로 시작하기',
    highlight: true,
    gradient: 'from-primary-500 to-primary-700',
    border: 'border-primary-200',
  },
  {
    name: 'Business',
    price: '12,900',
    period: '월',
    desc: '팀과 기업을 위한 관리형 플랜',
    features: [
      'Pro 플랜의 모든 기능',
      '기기 무제한 등록',
      '동시 접속 10세션',
      '관리자 대시보드',
      '팀원 관리',
      '연결 로그 / 리포트',
      '전담 기술 지원',
    ],
    limitations: [],
    cta: '비즈니스 시작하기',
    highlight: false,
    gradient: '',
    border: 'border-gray-200',
  },
];

const stats = [
  { value: '256-bit', label: 'AES 암호화' },
  { value: '< 50ms', label: '평균 지연시간' },
  { value: '4K', label: '해상도 지원' },
  { value: '24/7', label: '서비스 가용성' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">DeskOn</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">기능</a>
              <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">요금제</a>
              <a href="/guide" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">사용 가이드</a>
              <a href="#contact" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">문의</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인
              </button>
              <a
                href="/signup"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5"
              >
                무료로 시작
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary-50 via-blue-50 to-transparent rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-gradient-to-b from-violet-50 to-transparent rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-primary-700">안전하고 빠른 원격 데스크톱</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              원격 지원,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-blue-500 to-violet-500">
                이제 DeskOn으로
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              클릭 한 번으로 어디서든 연결. 군사급 암호화로 안전하게,
              P2P 다이렉트 연결로 빠르게. 원격 제어의 새로운 기준.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                앱 다운로드
              </a>
              <a
                href="/guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-700 font-semibold text-lg border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                사용 가이드 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Platform badges */}
            <div className="mt-12 flex items-center justify-center gap-6 text-gray-400">
              <span className="text-xs font-medium uppercase tracking-wider">지원 플랫폼</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
                  <span className="text-xs font-medium">Windows</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <span className="text-xs font-medium">macOS</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.273l1.747-1.747a.75.75 0 00-1.06-1.06L16.353 1.32A8.46 8.46 0 0012 .25a8.46 8.46 0 00-4.353 1.07L5.79-.527a.75.75 0 10-1.06 1.06l1.747 1.747A8.46 8.46 0 003.5 8.25v.5h17v-.5a8.46 8.46 0 00-2.977-5.977zM8.5 6.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zM3.5 10.25v8.5A2.25 2.25 0 005.75 21h1v2.25a1.75 1.75 0 103.5 0V21h3.5v2.25a1.75 1.75 0 103.5 0V21h1a2.25 2.25 0 002.25-2.25v-8.5h-17z"/></svg>
                  <span className="text-xs font-medium">Android</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <span className="text-xs font-medium">iOS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
                <div className="mt-1 text-sm text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">3단계로 시작하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: '앱 설치',
                desc: '지원받는 분과 지원하는 분 모두 DeskOn 앱을 설치합니다. 1분이면 충분합니다.',
                gradient: 'from-primary-500 to-blue-500',
              },
              {
                step: '02',
                title: 'ID 공유',
                desc: '앱 화면에 표시된 9자리 ID를 상대방에게 알려줍니다. 비밀번호는 필요 없습니다.',
                gradient: 'from-blue-500 to-violet-500',
              },
              {
                step: '03',
                title: '원격 연결',
                desc: 'ID를 입력하고 연결 버튼을 누르면 즉시 원격 제어가 시작됩니다.',
                gradient: 'from-violet-500 to-pink-500',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${item.gradient} text-white text-xl font-extrabold mb-6 shadow-lg`}>
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-gray-300"></div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">왜 DeskOn인가요?</p>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              속도, 보안, 편의성 어느 하나 타협하지 않았습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 ${f.color} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">합리적인 요금제</p>
            <p className="mt-4 text-lg text-gray-500">무료로 시작하고, 필요할 때 업그레이드하세요.</p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-white rounded-full p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                월간 결제
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                연간 결제
                <span className="ml-1.5 text-xs font-bold text-emerald-500">2개월 무료</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 bg-white border-2 ${plan.border} ${
                  plan.highlight
                    ? 'shadow-2xl shadow-primary-500/10 scale-[1.02] lg:scale-105'
                    : 'shadow-sm'
                } transition-all`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold shadow-lg">
                      가장 인기
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  {plan.price === '별도 문의' ? (
                    <div className="text-2xl font-extrabold text-gray-900">{plan.price}</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price === '0'
                          ? '무료'
                          : `₩${billingPeriod === 'yearly'
                              ? Math.round(parseInt(plan.price.replace(',', '')) * 10 / 12).toLocaleString()
                              : plan.price
                            }`}
                      </span>
                      {plan.period && plan.price !== '0' && (
                        <span className="text-gray-500 font-medium">/ {plan.period}</span>
                      )}
                    </div>
                  )}
                  {plan.price !== '0' && billingPeriod === 'yearly' && (
                    <p className="text-sm text-emerald-600 font-medium mt-1">연간 결제 시 2개월 무료</p>
                  )}
                </div>

                <a
                  href={plan.price === '0' ? '/signup' : '/pricing'}
                  className={`block w-full py-3 rounded-xl font-semibold text-sm transition-all text-center ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </a>

                <div className="mt-8 space-y-3">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{f}</span>
                    </div>
                  ))}
                  {plan.limitations.map((l, li) => (
                    <div key={li} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm text-gray-400">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxek0yNCAyNGgxMnYtMkgyNHYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            지금 바로 시작하세요
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
            복잡한 설정도, 비용 부담도 없습니다. 무료 플랜으로 DeskOn의 모든 핵심 기능을 경험하세요.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-600 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1"
            >
              무료로 시작하기
            </a>
            <a
              href="/guide"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              사용 가이드
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-extrabold text-xl">DeskOn</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                안전하고 빠른 원격 데스크톱 솔루션. 누구나 쉽게 사용할 수 있는 원격 지원 서비스를 제공합니다.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">서비스</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">기능 소개</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">요금제</a></li>
                <li><a href="/guide" className="text-sm text-gray-400 hover:text-white transition-colors">사용 가이드</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">문의</h4>
              <ul className="space-y-3">
                <li className="text-sm text-gray-400">support@on1.kr</li>
              </ul>
            </div>
          </div>

          <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} DeskOn. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">이용약관</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
