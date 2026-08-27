import React from 'react';

export default function FloatingObjects() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes crane-swing {
          0%   { transform: rotate(-7deg); }
          50%  { transform: rotate(7deg); }
          100% { transform: rotate(-7deg); }
        }
        @keyframes build-floor {
          0%   { transform: translateY(20px) scaleY(0); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: translateY(0) scaleY(1); opacity: 0.45; }
        }
        @keyframes bobWorker {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes hookSwing {
          0%   { transform: rotate(-10deg) translateY(0); }
          50%  { transform: rotate(10deg) translateY(6px); }
          100% { transform: rotate(-10deg) translateY(0); }
        }
        @keyframes scaffoldPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.25; }
        }
        @keyframes craneBodySway {
          0%,100% { transform: rotate(0deg); }
          33%     { transform: rotate(1deg); }
          66%     { transform: rotate(-1deg); }
        }
        @keyframes risingDust {
          0%   { transform: translateY(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-70px) scale(2.2); opacity: 0; }
        }
        @keyframes slideRope {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 40; }
        }
        @keyframes floatParticle {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes cloudDrift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(80px); }
        }
        @keyframes sunPulse {
          0%,100% { opacity: 0.9; r: 42; }
          50%     { opacity: 1; r: 46; }
        }
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* Daytime sky gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe9ff" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#e8f6ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.30" />
          </linearGradient>
          {/* Building gradient — light stone colour */}
          <linearGradient id="buildGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="buildGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.45" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sky overlay */}
        <rect width="1440" height="900" fill="url(#skyGrad)" />

        {/* Sun */}
        <circle cx="1300" cy="90" r="44" fill="#fde68a" opacity="0.5"
          style={{ animation: 'sunPulse 4s ease-in-out infinite' }} />
        <circle cx="1300" cy="90" r="32" fill="#fbbf24" opacity="0.55" />
        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <line key={i}
            x1={1300 + Math.cos(angle * Math.PI/180) * 38}
            y1={90 + Math.sin(angle * Math.PI/180) * 38}
            x2={1300 + Math.cos(angle * Math.PI/180) * 56}
            y2={90 + Math.sin(angle * Math.PI/180) * 56}
            stroke="#fbbf24" strokeWidth="2.5" opacity="0.35"
          />
        ))}

        {/* Clouds */}
        {[
          { cx: 200,  cy: 80,  r1: 32, r2: 22, r3: 26, delay: '0s',   dur: '28s' },
          { cx: 600,  cy: 55,  r1: 40, r2: 28, r3: 32, delay: '5s',   dur: '35s' },
          { cx: 950,  cy: 100, r1: 35, r2: 24, r3: 28, delay: '12s',  dur: '40s' },
        ].map(({ cx, cy, r1, r2, r3, delay, dur }, i) => (
          <g key={i} opacity="0.55" style={{ animation: `cloudDrift ${dur} ${delay} ease-in-out infinite alternate` }}>
            <circle cx={cx} cy={cy} r={r1} fill="white" />
            <circle cx={cx - r1 * 0.6} cy={cy + 8} r={r2} fill="white" />
            <circle cx={cx + r1 * 0.55} cy={cy + 10} r={r3} fill="white" />
          </g>
        ))}

        {/* ──────── BACKGROUND BUILDINGS (far silhouettes) ──────── */}
        <rect x="30"   y="400" width="85"  height="500" fill="url(#buildGrad2)" />
        <rect x="62"   y="380" width="44"  height="30"  fill="url(#buildGrad2)" />
        {[0,1,2,3,4,5,6].map(row => [0,1,2].map(col => (
          <rect key={`${row}-${col}`} x={38 + col*26} y={408 + row*42} width="14" height="22"
            fill="#bae6fd" opacity={col===1&&row%2===0?0.55:0.2} />
        )))}

        <rect x="1320" y="370" width="110" height="530" fill="url(#buildGrad2)" />
        {[0,1,2,3,4,5,6,7].map(row => [0,1,2,3].map(col => (
          <rect key={`${row}-${col}`} x={1328+col*26} y={378+row*44} width="14" height="26"
            fill="#a5f3fc" opacity={col%2===0&&row%3===0?0.5:0.18} />
        )))}

        {/* ──────── MAIN UNDER-CONSTRUCTION BUILDING (Centre) ──────── */}
        {/* Foundation slab */}
        <rect x="440" y="720" width="560" height="28" rx="3" fill="#94a3b8" opacity="0.5" />

        {/* Floor 1 */}
        <rect x="470" y="648" width="500" height="74" fill="#e2e8f0" opacity="0.6" />
        {/* Floor 2 */}
        <rect x="482" y="574" width="476" height="74" fill="#dde5ef" opacity="0.55" />
        {/* Floor 3 */}
        <rect x="494" y="500" width="452" height="74" fill="#d8e2ec" opacity="0.5" />
        {/* Floor 4 — being built */}
        <rect x="506" y="440" width="428" height="62" fill="#d0dce8" opacity="0.4"
          style={{ transformOrigin: '720px 500px', animation: 'build-floor 3.5s 1s ease-out forwards' }} />

        {/* Structural columns */}
        {[470, 550, 640, 800, 885, 968].map((x, i) => (
          <rect key={i} x={x} y="440" width="16" height="283" fill="#94a3b8" opacity="0.65" />
        ))}

        {/* Floor dividers */}
        {[648, 574, 500, 440].map((y, i) => (
          <rect key={i} x="466" y={y} width="508" height="4" fill="#1aad9c" opacity="0.22" />
        ))}

        {/* Windows */}
        {[
          { floorY: 656, count: 8 },
          { floorY: 582, count: 8 },
          { floorY: 508, count: 7 },
        ].map(({ floorY, count }, fi) =>
          Array.from({ length: count }).map((_, wi) => (
            <rect key={`${fi}-${wi}`}
              x={490 + wi * 62} y={floorY} width="38" height="46"
              rx="3" fill="#bae6fd" opacity={wi%3===1?0.6:0.3}
            />
          ))
        )}

        {/* ──────── SCAFFOLDING ──────── */}
        <rect x="450" y="300" width="7" height="420" fill="#64748b" opacity="0.18"
          style={{ animation: 'scaffoldPulse 3s ease-in-out infinite' }} />
        <rect x="983" y="300" width="7" height="420" fill="#64748b" opacity="0.18"
          style={{ animation: 'scaffoldPulse 3s 1s ease-in-out infinite' }} />
        {[320, 370, 420, 470, 520, 570, 620, 670].map((y, i) => (
          <rect key={i} x="450" y={y} width="540" height="4" rx="2" fill="#64748b" opacity="0.14" />
        ))}

        {/* ──────── CRANE 1 (Left, amber) ──────── */}
        <g style={{ transformOrigin: '362px 280px', animation: 'craneBodySway 6s ease-in-out infinite' }}>
          <rect x="356" y="260" width="13" height="480" fill="#f59e0b" opacity="0.55" />
          <rect x="342" y="250" width="42" height="28" rx="4" fill="#f59e0b" opacity="0.6" />
          <g style={{ transformOrigin: '362px 255px', animation: 'crane-swing 8s ease-in-out infinite' }}>
            <rect x="202" y="247" width="390" height="9" rx="4" fill="#f59e0b" opacity="0.6" />
            <rect x="188" y="255" width="30" height="26" rx="4" fill="#92400e" opacity="0.5" />
            <rect x="460" y="243" width="18" height="13" rx="3" fill="#fbbf24" opacity="0.7" />
            <g style={{ animation: 'hookSwing 4s 1s ease-in-out infinite', transformOrigin: '469px 256px' }}>
              <line x1="469" y1="256" x2="469" y2="335" stroke="#94a3b8" strokeWidth="2"
                opacity="0.55" strokeDasharray="5 4"
                style={{ animation: 'slideRope 1.1s linear infinite' }} />
              <path d="M462,335 Q462,353 471,353 Q480,353 480,344"
                stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.6" />
              <rect x="454" y="348" width="28" height="20" rx="3" fill="#b45309" opacity="0.55" />
            </g>
          </g>
          <line x1="349" y1="320" x2="312" y2="435" stroke="#f59e0b" strokeWidth="2.5" opacity="0.4" />
          <line x1="374" y1="320" x2="411" y2="435" stroke="#f59e0b" strokeWidth="2.5" opacity="0.4" />
        </g>

        {/* ──────── CRANE 2 (Right, teal) ──────── */}
        <g style={{ transformOrigin: '1078px 220px', animation: 'craneBodySway 7s 2s ease-in-out infinite' }}>
          <rect x="1073" y="200" width="11" height="520" fill="#1aad9c" opacity="0.5" />
          <rect x="1058" y="190" width="40" height="26" rx="4" fill="#1aad9c" opacity="0.55" />
          <g style={{ transformOrigin: '1078px 195px', animation: 'crane-swing 10s 3s ease-in-out infinite' }}>
            <rect x="950" y="186" width="330" height="9" rx="4" fill="#1aad9c" opacity="0.55" />
            <rect x="936" y="194" width="26" height="24" rx="4" fill="#0f766e" opacity="0.5" />
            <rect x="1188" y="182" width="16" height="13" rx="3" fill="#2dd4bf" opacity="0.7" />
            <g style={{ animation: 'hookSwing 5s 0.5s ease-in-out infinite', transformOrigin: '1196px 195px' }}>
              <line x1="1196" y1="195" x2="1196" y2="305" stroke="#94a3b8" strokeWidth="1.8"
                opacity="0.5" strokeDasharray="5 4"
                style={{ animation: 'slideRope 1.3s linear infinite' }} />
              <path d="M1189,305 Q1189,322 1197,322 Q1205,322 1205,313"
                stroke="#2cc9b8" strokeWidth="2.5" fill="none" opacity="0.6" />
              <rect x="1181" y="316" width="28" height="34" rx="4" fill="#374151" opacity="0.55" />
            </g>
          </g>
          <line x1="1066" y1="275" x2="1040" y2="375" stroke="#1aad9c" strokeWidth="2.5" opacity="0.35" />
          <line x1="1091" y1="275" x2="1117" y2="375" stroke="#1aad9c" strokeWidth="2.5" opacity="0.35" />
        </g>

        {/* ──────── WORKERS ──────── */}
        <g style={{ animation: 'bobWorker 1.2s ease-in-out infinite', transformOrigin: '548px 450px' }}>
          <ellipse cx="548" cy="435" rx="9" ry="5.5" fill="#f59e0b" opacity="0.8" />
          <circle cx="548" cy="441" r="6.5" fill="#fde68a" opacity="0.75" />
          <rect x="541" y="448" width="13" height="19" rx="3" fill="#1e40af" opacity="0.65" />
          <line x1="541" y1="452" x2="529" y2="460" stroke="#fde68a" strokeWidth="2.5" opacity="0.65" />
          <line x1="554" y1="452" x2="568" y2="448" stroke="#fde68a" strokeWidth="2.5" opacity="0.65" />
          <line x1="543" y1="467" x2="539" y2="478" stroke="#1e40af" strokeWidth="2.5" opacity="0.65" />
          <line x1="553" y1="467" x2="555" y2="478" stroke="#1e40af" strokeWidth="2.5" opacity="0.65" />
        </g>

        <g style={{ animation: 'bobWorker 1.5s 0.5s ease-in-out infinite', transformOrigin: '888px 450px' }}>
          <ellipse cx="888" cy="435" rx="9" ry="5.5" fill="#ef4444" opacity="0.8" />
          <circle cx="888" cy="441" r="6.5" fill="#fde68a" opacity="0.75" />
          <rect x="881" y="448" width="13" height="19" rx="3" fill="#065f46" opacity="0.65" />
          <line x1="881" y1="452" x2="865" y2="464" stroke="#fde68a" strokeWidth="2.5" opacity="0.65" />
          <line x1="865" y1="464" x2="855" y2="486" stroke="#92400e" strokeWidth="2.5" opacity="0.6" />
          <ellipse cx="852" cy="489" rx="8" ry="4.5" fill="#b45309" opacity="0.55" />
          <line x1="894" y1="452" x2="904" y2="448" stroke="#fde68a" strokeWidth="2.5" opacity="0.65" />
          <line x1="883" y1="467" x2="879" y2="478" stroke="#065f46" strokeWidth="2.5" opacity="0.65" />
          <line x1="893" y1="467" x2="895" y2="478" stroke="#065f46" strokeWidth="2.5" opacity="0.65" />
        </g>

        {/* ──────── GROUND + MATERIAL PILE ──────── */}
        <rect x="0" y="748" width="1440" height="152" fill="url(#groundGrad)" />
        {/* Road lines */}
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <rect key={i} x={i * 140} y="788" width="75" height="5" rx="3" fill="#1aad9c" opacity="0.1" />
        ))}

        {/* Concrete mixer */}
        <ellipse cx="622" cy="746" rx="52" ry="14" fill="#9ca3af" opacity="0.2" />
        <rect x="582" y="714" width="78" height="30" rx="8" fill="#d1d5db" opacity="0.55" />
        <ellipse cx="621" cy="714" rx="38" ry="22" fill="#e5e7eb" opacity="0.6" />
        <path d="M600,706 L642,706 L650,726 L592,726 Z" fill="#cbd5e1" opacity="0.5" />
        <rect x="609" y="744" width="22" height="14" rx="3" fill="#d1d5db" opacity="0.55" />
        <rect x="592" y="756" width="58" height="7" rx="4" fill="#9ca3af" opacity="0.45" />

        {/* Sand / material pile */}
        <path d="M800,760 Q850,722 900,760 Z" fill="#b45309" opacity="0.3" />
        <path d="M796,764 Q850,720 904,764 Z" fill="#d97706" opacity="0.25" />
        {/* Bricks */}
        {[0,1,2,3].map(i => (
          <rect key={i} x={950} y={754 - i*11} width={50-i*2} height="9" rx="2" fill="#ef4444" opacity={0.3-i*0.04} />
        ))}

        {/* Safety fence */}
        {[430, 488, 546, 604, 662, 720, 778, 836, 894, 952].map((x, i) => (
          <g key={i}>
            <rect x={x} y="749" width="4" height="30" fill="#f59e0b" opacity="0.4" />
            <rect x={x+4} y="757" width={52} height="5" rx="2" fill="#ef4444" opacity="0.35" />
          </g>
        ))}

        {/* Warning sign */}
        <g transform="translate(1018,748)">
          <rect x="0" y="0" width="46" height="38" rx="5" fill="#fde68a" opacity="0.65" />
          <text x="23" y="26" textAnchor="middle" fontSize="18" fill="#92400e" opacity="0.85">⚠️</text>
        </g>

        {/* Dust particles */}
        {[615, 715, 815].map((cx, i) => (
          <ellipse key={i} cx={cx} cy={738} rx="16" ry="9"
            fill="#d1d5db" opacity="0.18"
            style={{ animation: `risingDust ${2.5 + i * 0.6}s ${i * 0.8}s ease-out infinite` }} />
        ))}

        {/* Floating construction icons */}
        {[
          { x: 320, y: 600, emoji: '🔩', size: 20 },
          { x: 1110, y: 560, emoji: '🪝', size: 24 },
          { x: 248, y: 460, emoji: '📐', size: 18 },
          { x: 1175, y: 685, emoji: '⚙️', size: 22 },
          { x: 155, y: 680, emoji: '🧱', size: 26 },
          { x: 1255, y: 465, emoji: '🪛', size: 18 },
        ].map(({ x, y, emoji, size }, i) => (
          <text key={i} x={x} y={y} fontSize={size} opacity="0.18" textAnchor="middle"
            style={{ animation: `floatParticle ${5 + i * 1.2}s ${i * 0.7}s ease-in-out infinite alternate` }}>
            {emoji}
          </text>
        ))}

        {/* Very light overall veil — keeps the background subtle behind white cards */}
        <rect width="1440" height="900" fill="#f0f9ff" opacity="0.18" />
      </svg>
    </div>
  );
}
