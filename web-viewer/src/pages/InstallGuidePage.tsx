import React from 'react';

const InstallGuidePage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>DeskOn 설치 가이드</h1>

      {/* 다운로드 섹션 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>1. 앱 다운로드</h2>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          marginTop: '20px'
        }}>
          <a
            href="https://github.com/cho-y-j/Remote/releases/download/v1.0.0/DeskOn-Android.apk"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#3DDC84',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Android APK 다운로드
          </a>
          <a
            href="https://github.com/cho-y-j/Remote/releases/download/v1.0.0/DeskOn-macOS.dmg"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#333',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            macOS 다운로드
          </a>
          <a
            href="https://github.com/cho-y-j/Remote/releases/download/v1.0.0/DeskOn-Windows.zip"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#0078D4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            Windows 다운로드
          </a>
        </div>
      </section>

      {/* Android 설치 가이드 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>2. Android 설치 및 설정</h2>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Step 1: APK 설치</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>다운로드한 APK 파일을 탭합니다</li>
            <li>"출처를 알 수 없는 앱" 설치 허용 팝업이 나오면 <strong>허용</strong>을 누릅니다</li>
            <li><strong>설치</strong> 버튼을 누릅니다</li>
            <li>설치 완료 후 <strong>열기</strong>를 누릅니다</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Step 2: 권한 허용 (중요!)</h3>
          <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            원격 제어를 위해 아래 권한을 반드시 허용해야 합니다.
          </p>
          <ol style={{ lineHeight: '2' }}>
            <li>앱 실행 시 권한 요청 팝업이 나오면 모두 <strong>허용</strong>을 누릅니다</li>
            <li>
              <strong>접근성 서비스 설정</strong>
              <ul>
                <li>설정 → 접근성 → 설치된 앱 → <strong>DeskOn</strong> 선택</li>
                <li>스위치를 <strong>ON</strong>으로 활성화</li>
              </ul>
            </li>
            <li>
              <strong>다른 앱 위에 표시 권한</strong>
              <ul>
                <li>설정 → 앱 → DeskOn → 권한</li>
                <li>"다른 앱 위에 표시" → <strong>허용</strong></li>
              </ul>
            </li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Step 3: 화면 공유 시작 (원격 제어 받을 때)</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>앱 하단의 <strong>서비스 시작</strong> 버튼을 누릅니다</li>
            <li>"화면 캡처 허용" 팝업에서 <strong>지금 시작</strong>을 누릅니다</li>
            <li>화면에 표시된 <strong>9자리 ID</strong>를 상대방에게 알려줍니다</li>
          </ol>
        </div>
      </section>

      {/* PC 설치 가이드 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>3. PC (Windows/macOS) 설치</h2>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Windows</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>다운로드한 .exe 파일을 실행합니다</li>
            <li>설치 마법사를 따라 설치를 완료합니다</li>
            <li>앱 실행 후 화면에 표시된 <strong>ID</strong>를 확인합니다</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>macOS</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>다운로드한 .dmg 파일을 엽니다</li>
            <li>앱을 Applications 폴더로 드래그합니다</li>
            <li>앱 실행 시 <strong>시스템 설정 → 개인정보 보호</strong>에서 권한을 허용합니다:
              <ul>
                <li>화면 녹화</li>
                <li>접근성</li>
                <li>마이크 (음성 통화 시)</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      {/* 연결 방법 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>4. 원격 연결 방법</h2>

        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>다른 기기에 연결하기</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>상대방의 <strong>9자리 ID</strong>를 받습니다</li>
            <li>앱의 "원격 데스크톱" 입력창에 ID를 입력합니다</li>
            <li><strong>연결</strong> 버튼을 누릅니다</li>
            <li>상대방이 연결을 수락하면 원격 제어가 시작됩니다</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>연결 받기 (원격 제어 허용)</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>앱을 실행하고 화면에 표시된 <strong>ID</strong>를 상대방에게 알려줍니다</li>
            <li>Android의 경우 <strong>서비스 시작</strong>을 눌러 화면 공유를 활성화합니다</li>
            <li>상대방이 연결 요청을 보내면 <strong>수락</strong>을 누릅니다</li>
          </ol>
        </div>
      </section>

      {/* 사용법 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>5. 상세 사용법</h2>

        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>툴바 사용법</h3>
          <p>연결 후 화면을 터치하면 하단에 툴바가 나타납니다.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#bbdefb' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>아이콘</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>기능</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>⌨️</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>키보드</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>소프트 키보드를 열어 텍스트 입력</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>📁</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>파일 전송</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>파일 보내기/받기 화면 열기</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>🎤</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>음성 통화</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>상대방과 음성 채팅</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>⚙️</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>설정</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>화질, 입력 모드 등 설정</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>🔲</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>전체화면</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>전체 화면 모드 전환</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: '#fff3e0',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>마우스 조작법 (모바일에서 PC 제어 시)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe0b2' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>동작</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>조작 방법</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>클릭 (좌클릭)</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>화면을 한 번 탭</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>우클릭</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>화면을 길게 누르기</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>더블클릭</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>화면을 빠르게 두 번 탭</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>드래그</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>화면을 누른 채로 이동</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>스크롤</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>두 손가락으로 위/아래 스와이프</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>확대/축소</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>두 손가락으로 핀치 인/아웃</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>키보드 입력 방법</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>툴바에서 <strong>키보드 아이콘(⌨️)</strong>을 탭합니다</li>
            <li>소프트 키보드가 나타납니다</li>
            <li>키보드로 입력하면 원격 PC에 텍스트가 입력됩니다</li>
            <li>특수 키(Ctrl, Alt, F1~F12 등)는 툴바의 <strong>Fn 버튼</strong>을 눌러 사용합니다</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#fce4ec',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>파일 전송 방법</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>툴바에서 <strong>폴더 아이콘(📁)</strong>을 탭합니다</li>
            <li>왼쪽: 내 기기 파일, 오른쪽: 원격 기기 파일</li>
            <li>파일을 선택하고 <strong>화살표 버튼</strong>을 눌러 전송합니다</li>
            <li>폴더 전체도 전송 가능합니다</li>
          </ol>
        </div>

        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>음성 통화 방법</h3>
          <ol style={{ lineHeight: '2' }}>
            <li>툴바에서 <strong>마이크 아이콘(🎤)</strong>을 탭합니다</li>
            <li>"음성 통화 시작" 확인을 누릅니다</li>
            <li>상대방도 음성 통화를 수락하면 대화가 가능합니다</li>
            <li>종료하려면 마이크 아이콘을 다시 탭합니다</li>
          </ol>
        </div>
      </section>

      {/* 주요 기능 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>6. 주요 기능</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>원격 제어</h4>
            <p>마우스, 키보드로 원격 PC 제어</p>
          </div>
          <div style={{
            backgroundColor: '#e1f5fe',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>파일 전송</h4>
            <p>연결 후 폴더 아이콘 클릭</p>
          </div>
          <div style={{
            backgroundColor: '#f3e5f5',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>음성 통화</h4>
            <p>마이크 아이콘으로 음성 채팅</p>
          </div>
          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4>P2P 연결</h4>
            <p>빠르고 안전한 직접 연결</p>
          </div>
        </div>
      </section>

      {/* 문제 해결 */}
      <section style={{ marginBottom: '50px' }}>
        <h2>7. 문제 해결</h2>

        <div style={{
          backgroundColor: '#ffebee',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4>연결이 안 돼요</h4>
          <ul style={{ lineHeight: '2' }}>
            <li>양쪽 기기가 인터넷에 연결되어 있는지 확인하세요</li>
            <li>상대방 앱이 실행 중인지 확인하세요</li>
            <li>ID가 정확한지 확인하세요</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#ffebee',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4>Android에서 화면 공유가 안 돼요</h4>
          <ul style={{ lineHeight: '2' }}>
            <li>접근성 서비스가 활성화되어 있는지 확인하세요</li>
            <li>앱을 완전히 종료 후 다시 시작해보세요</li>
            <li>핸드폰을 재부팅 후 다시 시도해보세요</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: '#ffebee',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h4>음성 통화가 안 돼요</h4>
          <ul style={{ lineHeight: '2' }}>
            <li>마이크 권한이 허용되어 있는지 확인하세요</li>
            <li>macOS: 시스템 설정 → 개인정보 → 마이크 → DeskOn 허용</li>
            <li>Android: 설정 → 앱 → DeskOn → 권한 → 마이크 허용</li>
          </ul>
        </div>
      </section>

      {/* 연락처 */}
      <section style={{
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <h3>도움이 필요하신가요?</h3>
        <p>문의: support@on1.kr</p>
      </section>
    </div>
  );
};

export default InstallGuidePage;
