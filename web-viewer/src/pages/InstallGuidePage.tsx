import React, { useState } from 'react';

const sections = [
  { id: 'download', label: '다운로드' },
  { id: 'android', label: 'Android 설치' },
  { id: 'ios', label: 'iOS 설치' },
  { id: 'pc', label: 'PC 설치' },
  { id: 'connect', label: '원격 연결' },
  { id: 'usage', label: '상세 사용법' },
  { id: 'faq', label: '문제 해결' },
];

const platforms = [
  {
    name: 'Android',
    desc: 'APK 직접 설치',
    href: '/downloads/android',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.523 2.273l1.747-1.747a.75.75 0 00-1.06-1.06L16.353 1.32A8.46 8.46 0 0012 .25a8.46 8.46 0 00-4.353 1.07L5.79-.527a.75.75 0 10-1.06 1.06l1.747 1.747A8.46 8.46 0 003.5 8.25v.5h17v-.5a8.46 8.46 0 00-2.977-5.977zM8.5 6.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zM3.5 10.25v8.5A2.25 2.25 0 005.75 21h1v2.25a1.75 1.75 0 103.5 0V21h3.5v2.25a1.75 1.75 0 103.5 0V21h1a2.25 2.25 0 002.25-2.25v-8.5h-17zM1 10.25a1.75 1.75 0 00-1.75 1.75v5a1.75 1.75 0 103.5 0v-5A1.75 1.75 0 001 10.25zm22 0a1.75 1.75 0 00-1.75 1.75v5a1.75 1.75 0 103.5 0v-5A1.75 1.75 0 0023 10.25z"/>
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    name: 'Windows',
    desc: '설치 파일 (.exe)',
    href: '/downloads/windows',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    ),
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    name: 'macOS',
    desc: '디스크 이미지 (.dmg)',
    href: '/downloads/macos',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    color: 'from-gray-700 to-gray-900',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
  },
  {
    name: 'iOS',
    desc: '원격 제어 전용 (iPad/iPhone)',
    href: '/downloads/ios',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    color: 'from-gray-800 to-black',
    bg: 'bg-gray-50',
    text: 'text-gray-800',
  },
];

const faqItems = [
  {
    q: '연결이 안 돼요',
    a: [
      '양쪽 기기가 인터넷에 연결되어 있는지 확인하세요.',
      '상대방 앱이 실행 중이고 서비스가 시작된 상태인지 확인하세요.',
      'ID를 정확하게 입력했는지 다시 확인하세요.',
      '방화벽이나 VPN이 연결을 차단하고 있지 않은지 확인하세요.',
    ],
  },
  {
    q: 'Android에서 화면 공유가 안 돼요',
    a: [
      '접근성 서비스(설정 → 접근성 → DeskOn)가 활성화되어 있는지 확인하세요.',
      '"다른 앱 위에 표시" 권한이 허용되어 있는지 확인하세요.',
      '앱을 완전히 종료(최근 앱에서 밀어내기) 후 다시 시작해보세요.',
      '그래도 안 되면 휴대폰을 재부팅 후 다시 시도해보세요.',
    ],
  },
  {
    q: '음성 통화가 안 돼요',
    a: [
      '마이크 권한이 허용되어 있는지 확인하세요.',
      'macOS: 시스템 설정 → 개인정보 보호 → 마이크 → DeskOn 허용',
      'Android: 설정 → 앱 → DeskOn → 권한 → 마이크 허용',
      '양쪽 모두 음성 통화를 수락해야 대화가 시작됩니다.',
    ],
  },
  {
    q: '한글 입력이 안 돼요',
    a: [
      '원격 PC의 입력 언어가 한국어로 설정되어 있는지 확인하세요.',
      'Caps Lock 키 또는 Ctrl+Space로 한/영 전환을 시도하세요.',
      '툴바의 Fn 버튼에서 한/영 전환 키를 찾아 사용할 수 있습니다.',
    ],
  },
  {
    q: 'iOS에서 화면 공유 메뉴가 없어요',
    a: [
      'iOS/iPadOS 앱은 다른 기기를 원격 제어하는 전용 앱입니다.',
      'Apple 보안 정책으로 인해 iPhone/iPad 화면을 다른 기기에서 보거나 제어하는 것은 불가능합니다.',
      '화면 공유(원격 제어 받기)가 필요하면 Android, Windows, macOS 기기를 사용하세요.',
    ],
  },
  {
    q: 'iOS 앱이 "신뢰하지 않는 개발자"라고 나와요',
    a: [
      '설정 → 일반 → VPN 및 기기 관리로 이동하세요.',
      '개발자 앱 목록에서 해당 Apple ID를 탭합니다.',
      '"신뢰" 버튼을 눌러 개발자 프로필을 승인합니다.',
      '이후 앱을 다시 실행하면 정상적으로 열립니다.',
    ],
  },
  {
    q: 'macOS에서 권한 설정을 못 찾겠어요',
    a: [
      '시스템 설정 → 개인정보 보호 및 보안으로 이동하세요.',
      '"화면 녹화", "접근성" 항목에서 DeskOn을 찾아 허용하세요.',
      '권한 설정 후 앱을 재시작해야 적용됩니다.',
    ],
  },
];

const InstallGuidePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">DeskOn</span>
            </a>
            <div className="hidden md:flex items-center gap-6">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-28 pb-12 sm:pt-36 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">DeskOn</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 mt-2">
              설치 및 사용 가이드
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            몇 분이면 설치 완료! 아래 가이드를 따라 DeskOn을 설치하고 원격 지원을 시작하세요.
          </p>
        </div>
      </div>

      {/* Download Section */}
      <section id="download" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Download</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">앱 다운로드</p>
            <p className="mt-4 text-gray-500">사용 중인 기기에 맞는 버전을 다운로드하세요.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className="group relative block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl ${p.bg} flex items-center justify-center mb-4 ${p.text}`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.desc}</p>
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${p.color} text-white text-sm font-semibold group-hover:opacity-90 transition-opacity`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  다운로드
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Android Install Guide */}
      <section id="android" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Android</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">Android 설치 가이드</p>
          </div>

          {/* Step 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="text-xl font-bold text-gray-900">APK 설치</h3>
            </div>
            <div className="ml-11 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3"><span className="text-green-600 font-semibold">1.</span> 위 다운로드 버튼으로 APK 파일을 다운로드합니다.</li>
                <li className="flex gap-3"><span className="text-green-600 font-semibold">2.</span> 다운로드한 APK 파일을 탭합니다.</li>
                <li className="flex gap-3"><span className="text-green-600 font-semibold">3.</span> "출처를 알 수 없는 앱" 설치 허용 팝업이 나오면 <strong className="text-gray-900">허용</strong>을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-green-600 font-semibold">4.</span> <strong className="text-gray-900">설치</strong> 버튼을 누른 뒤, 완료되면 <strong className="text-gray-900">열기</strong>를 누릅니다.</li>
              </ol>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="text-xl font-bold text-gray-900">권한 설정 (필수)</h3>
            </div>
            <div className="ml-11 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                원격 제어를 위해 아래 권한을 반드시 허용해야 합니다.
              </div>
              <ol className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-green-600 font-semibold">1.</span>
                  <span>앱 실행 시 권한 요청 팝업이 나오면 모두 <strong className="text-gray-900">허용</strong>을 누릅니다.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-semibold">2.</span>
                  <div>
                    <strong className="text-gray-900">접근성 서비스 설정</strong>
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>설정 → 접근성 → 설치된 앱 → <strong>DeskOn</strong> 선택</li>
                      <li>스위치를 <strong>ON</strong>으로 활성화</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-semibold">3.</span>
                  <div>
                    <strong className="text-gray-900">"다른 앱 위에 표시" 권한</strong>
                    <ul className="mt-2 ml-4 space-y-1 text-sm">
                      <li>설정 → 앱 → DeskOn → 권한</li>
                      <li>"다른 앱 위에 표시" → <strong>허용</strong></li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="text-xl font-bold text-gray-900">화면 공유 시작</h3>
            </div>
            <div className="ml-11 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3"><span className="text-green-600 font-semibold">1.</span> 앱 하단의 <strong className="text-gray-900">서비스 시작</strong> 버튼을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-green-600 font-semibold">2.</span> "화면 캡처 허용" 팝업에서 <strong className="text-gray-900">지금 시작</strong>을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-green-600 font-semibold">3.</span> 화면에 표시된 <strong className="text-gray-900">9자리 ID</strong>를 상대방에게 알려줍니다.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* iOS Install Guide */}
      <section id="ios" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-gray-800 font-semibold tracking-wide uppercase">iOS / iPadOS</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">iOS 설치 가이드</p>
          </div>

          {/* iOS Notice */}
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-amber-800">iOS 버전 안내</h4>
                <p className="mt-1 text-sm text-amber-700">
                  iOS/iPadOS 앱은 <strong>다른 기기를 원격 제어하는 용도</strong>로만 사용 가능합니다.
                  Apple 보안 정책으로 인해 iPhone/iPad 화면을 다른 기기에서 제어하는 기능은 지원되지 않습니다.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    PC/Mac/Android 원격 제어
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    파일 전송
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    내 화면 공유 불가
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1 - Install */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="text-xl font-bold text-gray-900">앱 설치</h3>
            </div>
            <div className="ml-11 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">1.</span> 위 다운로드 버튼으로 IPA 파일을 다운로드합니다.</li>
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">2.</span> <strong className="text-gray-900">AltStore</strong> 또는 <strong className="text-gray-900">Sideloadly</strong> 등의 사이드로딩 도구로 설치합니다.</li>
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">3.</span> 또는 Mac에서 <strong className="text-gray-900">Xcode</strong>로 직접 빌드하여 설치할 수 있습니다.</li>
              </ol>
              <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                <strong className="text-gray-700">참고:</strong> iOS 앱은 App Store 배포가 아닌 사이드로딩 방식으로 설치됩니다.
                설치 후 <strong>설정 → 일반 → VPN 및 기기 관리</strong>에서 개발자 프로필을 신뢰해야 합니다.
              </div>
            </div>
          </div>

          {/* Step 2 - Use */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="text-xl font-bold text-gray-900">원격 제어 시작</h3>
            </div>
            <div className="ml-11 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">1.</span> DeskOn 앱을 실행합니다.</li>
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">2.</span> 제어할 상대방의 <strong className="text-gray-900">9자리 ID</strong>를 입력합니다.</li>
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">3.</span> <strong className="text-gray-900">연결</strong> 버튼을 눌러 원격 제어를 시작합니다.</li>
                <li className="flex gap-3"><span className="text-gray-800 font-semibold">4.</span> 터치로 마우스 조작, 키보드 입력, 파일 전송이 가능합니다.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* PC Install Guide */}
      <section id="pc" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Desktop</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">PC 설치 가이드</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Windows */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Windows</h3>
              </div>
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">1.</span> 다운로드한 ZIP 파일의 압축을 풀고 .exe 파일을 실행합니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">2.</span> Windows 보안 경고가 나오면 "추가 정보" → "실행"을 클릭합니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">3.</span> 설치 마법사를 따라 설치를 완료합니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">4.</span> 앱 실행 후 화면에 표시된 <strong className="text-gray-900">ID</strong>를 확인합니다.</li>
              </ol>
            </div>

            {/* macOS */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">macOS</h3>
              </div>
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-gray-700 font-semibold">1.</span> 다운로드한 .dmg 파일을 더블클릭하여 엽니다.</li>
                <li className="flex gap-3"><span className="text-gray-700 font-semibold">2.</span> DeskOn 앱을 Applications 폴더로 드래그합니다.</li>
                <li className="flex gap-3"><span className="text-gray-700 font-semibold">3.</span> 처음 실행 시 "확인되지 않은 개발자" 경고가 나오면 시스템 설정에서 "확인 없이 열기"를 클릭합니다.</li>
                <li className="flex gap-3">
                  <span className="text-gray-700 font-semibold">4.</span>
                  <span>
                    <strong className="text-gray-900">시스템 설정 → 개인정보 보호</strong>에서 권한 허용:
                    <span className="block mt-1 ml-2 text-xs text-gray-500">화면 녹화 / 접근성 / 마이크(음성 통화 시)</span>
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Remote Connection */}
      <section id="connect" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Connection</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">원격 연결 방법</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Connect to others */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">다른 기기에 연결하기</h3>
              </div>
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">1.</span> 상대방의 <strong className="text-gray-900">9자리 ID</strong>를 받습니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">2.</span> 앱의 "원격 데스크톱" 입력창에 ID를 입력합니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">3.</span> <strong className="text-gray-900">연결</strong> 버튼을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-blue-600 font-semibold">4.</span> 상대방이 연결을 수락하면 원격 제어가 시작됩니다.</li>
              </ol>
            </div>

            {/* Receive connection */}
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">연결 받기 (원격 제어 허용)</h3>
              </div>
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">1.</span> 앱을 실행하고 화면에 표시된 <strong className="text-gray-900">ID</strong>를 상대방에게 알려줍니다.</li>
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">2.</span> Android의 경우 <strong className="text-gray-900">서비스 시작</strong>을 눌러 화면 공유를 활성화합니다.</li>
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">3.</span> 상대방이 연결 요청을 보내면 <strong className="text-gray-900">수락</strong>을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">4.</span> 연결 후 상대방이 내 화면을 보고 제어할 수 있습니다.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Usage */}
      <section id="usage" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Usage Guide</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">상세 사용법</p>
          </div>

          {/* Toolbar */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
              툴바 기능
            </h3>
            <p className="text-gray-500 mb-4 text-sm">연결 후 화면을 터치하면 하단에 툴바가 나타납니다.</p>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 w-24">기능</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 font-medium text-gray-900">키보드</td><td className="px-4 py-3 text-gray-600">소프트 키보드를 열어 원격 PC에 텍스트 입력</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">파일 전송</td><td className="px-4 py-3 text-gray-600">파일 보내기/받기 화면 열기</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">음성 통화</td><td className="px-4 py-3 text-gray-600">상대방과 실시간 음성 채팅</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">설정</td><td className="px-4 py-3 text-gray-600">화질, 코덱, 입력 모드 등 세부 설정</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">전체화면</td><td className="px-4 py-3 text-gray-600">전체 화면 모드로 전환/해제</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">Fn</td><td className="px-4 py-3 text-gray-600">Ctrl, Alt, F1~F12 등 특수 키 입력</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mouse controls */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
              마우스 조작법 (모바일 → PC 제어)
            </h3>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 w-32">동작</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">터치 조작</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-4 py-3 font-medium text-gray-900">좌클릭</td><td className="px-4 py-3 text-gray-600">화면을 한 번 탭</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">우클릭</td><td className="px-4 py-3 text-gray-600">화면을 길게 누르기 (약 1초)</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">더블클릭</td><td className="px-4 py-3 text-gray-600">화면을 빠르게 두 번 탭</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">드래그</td><td className="px-4 py-3 text-gray-600">화면을 누른 채로 이동</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">스크롤</td><td className="px-4 py-3 text-gray-600">두 손가락으로 위/아래 스와이프</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900">확대/축소</td><td className="px-4 py-3 text-gray-600">두 손가락으로 핀치 인/아웃</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Keyboard input */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              키보드 입력 방법
            </h3>
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">1.</span> 툴바에서 <strong className="text-gray-900">키보드 아이콘</strong>을 탭하여 소프트 키보드를 엽니다.</li>
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">2.</span> 키보드로 입력하면 원격 PC에 텍스트가 전달됩니다.</li>
                <li className="flex gap-3"><span className="text-emerald-600 font-semibold">3.</span> Ctrl, Alt, F1~F12 등 특수 키는 툴바의 <strong className="text-gray-900">Fn 버튼</strong>을 사용합니다.</li>
              </ol>
              <div className="mt-5 bg-white rounded-lg p-4 border border-emerald-200">
                <h4 className="font-bold text-gray-900 mb-2">한/영 전환 방법</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-semibold text-gray-800 mt-0.5">Caps Lock</span>
                    <span>Caps Lock 키를 눌러 한/영 전환 (권장)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-semibold text-gray-800 mt-0.5 whitespace-nowrap">Ctrl+Space</span>
                    <span>Ctrl+Space 조합으로 한/영 전환</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-semibold text-gray-800 mt-0.5">Fn</span>
                    <span>툴바 Fn 버튼에서 한/영 전환 키를 찾아 사용</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* File Transfer */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
              파일 전송 방법
            </h3>
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-pink-600 font-semibold">1.</span> 툴바에서 <strong className="text-gray-900">폴더 아이콘</strong>을 탭합니다.</li>
                <li className="flex gap-3"><span className="text-pink-600 font-semibold">2.</span> 화면이 좌우로 나뉩니다 — <strong className="text-gray-900">왼쪽: 내 기기</strong>, <strong className="text-gray-900">오른쪽: 원격 기기</strong></li>
                <li className="flex gap-3"><span className="text-pink-600 font-semibold">3.</span> 전송할 파일을 선택하고 <strong className="text-gray-900">화살표 버튼</strong>을 눌러 전송합니다.</li>
                <li className="flex gap-3"><span className="text-pink-600 font-semibold">4.</span> 폴더 전체도 선택하여 전송할 수 있습니다.</li>
              </ol>
            </div>
          </div>

          {/* Voice Call */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
              음성 통화 방법
            </h3>
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <ol className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">1.</span> 툴바에서 <strong className="text-gray-900">마이크 아이콘</strong>을 탭합니다.</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">2.</span> "음성 통화 시작" 확인을 누릅니다.</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">3.</span> 상대방도 음성 통화를 수락하면 대화가 시작됩니다.</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">4.</span> 종료하려면 마이크 아이콘을 다시 탭합니다.</li>
              </ol>
            </div>
          </div>

          {/* Zoom */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
              화면 확대/축소
            </h3>
            <div className="bg-sky-50 rounded-xl p-6 border border-sky-100">
              <ul className="space-y-3 text-gray-600 text-sm">
                <li className="flex gap-3"><strong className="text-gray-900">확대:</strong> 두 손가락을 벌리며 핀치 아웃합니다.</li>
                <li className="flex gap-3"><strong className="text-gray-900">축소:</strong> 두 손가락을 모으며 핀치 인합니다.</li>
                <li className="flex gap-3"><strong className="text-gray-900">화면 이동:</strong> 확대 상태에서 두 손가락으로 드래그하여 이동합니다.</li>
                <li className="flex gap-3"><strong className="text-gray-900">원래 크기:</strong> 화면을 두 손가락으로 빠르게 두 번 탭하면 원래 크기로 돌아갑니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">문제 해결</p>
            <p className="mt-4 text-gray-500">자주 발생하는 문제와 해결 방법입니다.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {item.a.map((answer, aIdx) => (
                        <li key={aIdx} className="flex gap-2">
                          <span className="text-red-400 mt-1 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          {answer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg">DeskOn</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">도움이 필요하신가요?</p>
              <p className="text-gray-300 font-medium mt-1">support@on1.kr</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DeskOn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InstallGuidePage;
