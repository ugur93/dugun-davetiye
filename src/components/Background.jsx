// Candle-lit desk by the fireplace: flickering fire glow, rising embers,
// and props around the book (candle, quill & inkwell, dried roses, wax seal).
import { useMemo } from "react";
import { WEDDING } from "../content.js";

function Candle() {
  return (
    <svg className="prop candle" viewBox="0 0 80 190" aria-hidden="true">
      <defs>
        <radialGradient id="flame" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".45" stopColor="#ffd25a" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wax" x1="0" x2="1">
          <stop offset="0" stopColor="#d9c8a4" /><stop offset=".45" stopColor="#f6ecd2" /><stop offset="1" stopColor="#c7b48c" />
        </linearGradient>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5520" /><stop offset=".5" stopColor="#e2b85a" /><stop offset="1" stopColor="#6a4718" />
        </linearGradient>
      </defs>
      <g className="flame">
        <ellipse cx="40" cy="38" rx="22" ry="30" fill="url(#flame)" opacity=".55" />
        <path d="M40 14c-7 12-9 20-6 28 2 5 10 5 12 0 3-8 1-16-6-28z" fill="url(#flame)" />
        <path d="M40 30c-3 5-3 9-1 12 1 1 3 1 3 0 1-3 1-7-2-12z" fill="#fff" opacity=".9" />
      </g>
      <path d="M40 46v10" stroke="#2a1a0e" strokeWidth="1.6" />
      <path d="M26 56h28v100H26z" fill="url(#wax)" />
      <path d="M26 56c4 0 4 14 8 14s2-10 6-10 2 22 6 22 3-26 8-26" fill="#f6ecd2" />
      <ellipse cx="40" cy="160" rx="34" ry="9" fill="url(#brass)" />
      <ellipse cx="40" cy="156" rx="16" ry="4" fill="#5a3c14" />
      <path d="M8 160c0 14 64 14 64 0" fill="url(#brass)" />
    </svg>
  );
}

function QuillInk() {
  return (
    <svg className="prop quill" viewBox="0 0 240 200" aria-hidden="true">
      <defs>
        <linearGradient id="glass" x1="0" x2="1">
          <stop offset="0" stopColor="#0d1422" /><stop offset=".35" stopColor="#2b3d5c" /><stop offset=".6" stopColor="#101a2c" /><stop offset="1" stopColor="#060a12" />
        </linearGradient>
        <linearGradient id="vane" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#d8cdb6" /><stop offset="1" stopColor="#fbf8f0" />
        </linearGradient>
      </defs>
      {/* feather */}
      <path d="M78 120C108 70 160 26 228 4c-30 40-80 86-136 124z" fill="url(#vane)" />
      <path d="M78 120C110 74 162 30 228 4" fill="none" stroke="#9b8c70" strokeWidth="2" />
      <g stroke="#b9ad93" strokeWidth=".8" opacity=".8">
        {Array.from({ length: 16 }, (_, i) => {
          const t = i / 16;
          const x = 92 + t * 120, y = 104 - t * 92;
          return <path key={i} d={`M${x} ${y}l${10 - t * 6} ${14 - t * 4}`} />;
        })}
      </g>
      <path d="M60 150L82 116" stroke="#6b5a3a" strokeWidth="3" strokeLinecap="round" />
      {/* inkwell */}
      <ellipse cx="62" cy="186" rx="52" ry="10" fill="rgba(0,0,0,.45)" />
      <path d="M22 140c0-10 80-10 80 0v36c0 12-80 12-80 0z" fill="url(#glass)" />
      <ellipse cx="62" cy="140" rx="40" ry="8" fill="#1b2840" />
      <path d="M44 126h36v14c0 5-36 5-36 0z" fill="#b8892e" />
      <ellipse cx="62" cy="126" rx="18" ry="4" fill="#e2b85a" />
      <path d="M30 148c4-4 10-4 12 4v22" stroke="#6d84ad" strokeWidth="2" opacity=".35" fill="none" />
    </svg>
  );
}

function Roses() {
  const rose = (x, y, s, c) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="20" fill={c} />
      <path d="M-14-6c6-10 22-10 26 2-6-4-14-4-18 2 6-2 12 0 12 6-6-4-12-2-14 4-2-6-6-10-6-14z" fill="#5e0f14" opacity=".55" />
      <path d="M-6 0c2-6 10-8 14-2-4-1-8 0-8 4 3-1 6 0 6 4-4-2-8 0-10 2 0-4-2-6-2-8z" fill="#3d070b" opacity=".6" />
      <path d="M-18 6c4 10 18 14 30 4" stroke="#c74654" strokeWidth="2" fill="none" opacity=".6" />
    </g>
  );
  return (
    <svg className="prop roses" viewBox="0 0 260 200" aria-hidden="true">
      <g stroke="#3d5a2a" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M70 90C110 120 170 150 250 170" /><path d="M110 60C140 110 190 140 250 160" /><path d="M150 100c30 30 60 50 100 58" />
      </g>
      <g fill="#4d6e32" stroke="#2c3f1b" strokeWidth="1">
        <path d="M140 124c10-18 30-18 36-10-14 2-24 6-36 10z" /><path d="M186 140c4-20 24-26 32-18-14 4-22 10-32 18z" />
        <path d="M120 96c-4-18 10-30 20-26-8 8-14 16-20 26z" />
      </g>
      {rose(70, 88, 1.1, "#8e1b24")}
      {rose(110, 58, 0.95, "#a3232d")}
      {rose(150, 100, 0.85, "#7a1720")}
      <g fill="#8e1b24" opacity=".85">
        <path d="M30 160c8-6 18-4 20 2-8 2-14 2-20-2z" /><path d="M200 60c6-6 14-4 16 2-6 1-11 1-16-2z" />
      </g>
    </svg>
  );
}

function Seal() {
  const initials = `${WEDDING.bride[0]}&${WEDDING.groom[0]}`;
  return (
    <svg className="prop seal" viewBox="0 0 140 140" aria-hidden="true">
      <defs>
        <radialGradient id="wax-red" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#d23a35" /><stop offset=".7" stopColor="#8f1414" /><stop offset="1" stopColor="#5e0a0a" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="80" rx="54" ry="48" fill="rgba(0,0,0,.4)" />
      <path d="M70 16c18 0 22 10 34 12s20 16 18 30 8 22 0 36-22 16-30 26-28 8-40 2-26-10-30-24-12-24-6-36 6-24 20-32 20-14 34-14z" fill="url(#wax-red)" />
      <circle cx="70" cy="72" r="38" fill="none" stroke="#5e0a0a" strokeWidth="3" />
      <circle cx="70" cy="72" r="33" fill="none" stroke="#e46a5e" strokeWidth="1.2" opacity=".6" />
      <text x="70" y="84" textAnchor="middle" fontFamily="Almendra" fontWeight="700" fontSize="32" fill="#5e0a0a">{initials}</text>
      <text x="69" y="82.5" textAnchor="middle" fontFamily="Almendra" fontWeight="700" fontSize="32" fill="#e46a5e" opacity=".45">{initials}</text>
    </svg>
  );
}

export default function Background() {
  const embers = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        key: i,
        left: `${Math.random() * 100}%`,
        delay: `${-Math.random() * 12}s`,
        dur: `${8 + Math.random() * 8}s`,
        drift: `${(Math.random() - 0.5) * 120}px`,
        size: `${2 + Math.random() * 3}px`,
      })),
    []
  );
  return (
    <div className="room" aria-hidden="true">
      <div className="fireglow" />
      <div className="fireglow two" />
      <div className="embers">
        {embers.map((e) => (
          <span key={e.key} style={{ left: e.left, animationDelay: e.delay, animationDuration: e.dur, "--drift": e.drift, width: e.size, height: e.size }} />
        ))}
      </div>
      <Candle />
      <QuillInk />
      <Roses />
      <Seal />
    </div>
  );
}
