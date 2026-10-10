import { Ugur, Fatma, Heart, INK } from "./Characters.jsx";

const Bird = ({ x, y, s = 1, flip }) => (
  <path
    transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
    d="M0 6c4-2 7-1 9 1 1-5 5-8 11-9-3 2-4 5-4 8 2 0 5 1 7 3-5 1-9 2-12 3-5 0-8-3-11-6z"
    fill="#5a86c8" stroke={INK} strokeWidth=".8"
  />
);

const Flower = ({ x, y, c = "#a8302a", r = 3 }) => (
  <g stroke={INK} strokeWidth=".6">
    <circle cx={x} cy={y} r={r} fill={c} />
    <circle cx={x} cy={y} r={r * 0.38} fill="#e3c27a" />
  </g>
);

const Vines = () => (
  <g>
    <g fill="none" stroke="#2f6b3a" strokeWidth="2">
      <path d="M8 150 C2 120 18 100 8 74 S12 36 20 24" />
      <path d="M192 150 C198 120 182 100 192 74 S188 36 180 24" />
    </g>
    <g fill="#4f8a3a" stroke={INK} strokeWidth=".6">
      <path d="M8 104 q10 -8 16 2 q-10 6 -16 -2z" /><path d="M10 56 q-10 -6 -4 -16 q8 6 4 16z" />
      <path d="M192 104 q-10 -8 -16 2 q10 6 16 -2z" /><path d="M190 56 q10 -6 4 -16 q-8 6 -4 16z" />
    </g>
    <Flower x={20} y={24} r={4.5} /><Flower x={7} y={82} r={4} />
    <Flower x={180} y={24} r={4.5} /><Flower x={193} y={82} r={4} />
  </g>
);

const Castle = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="1.1">
    <rect x="0" y="12" width="11" height="34" fill="#c8d0e0" />
    <rect x="13" y="20" width="18" height="26" fill="#d7dcea" />
    <rect x="33" y="8" width="10" height="38" fill="#c8d0e0" />
    <path d="M-2 12l7.5-15 7.5 15z M31 8l7 -14 7 14z" fill="#a8302a" />
    <path d="M11 20l11 -11 11 11z" fill="#2b4c9b" />
    <path d="M19 46v-9a3 3 0 0 1 6 0v9z" fill={INK} />
  </g>
);

function Swamp() {
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
      <Bird x={128} y={18} s={0.8} /><Bird x={150} y={30} s={0.6} />
      {/* sea far away */}
      <path d="M0 92 Q50 86 100 90 T200 88 V112 H0z" fill="#7fa7cf" stroke={INK} strokeWidth=".8" />
      <path d="M120 92 q10 -10 22 -6 q12 -8 26 -2 q14 -4 32 4 V96 H120z" fill="#7d93a8" stroke={INK} strokeWidth=".8" />
      {/* swamp ground */}
      <path d="M0 108 Q60 98 120 106 T200 104 V150 H0z" fill="#6d8a3a" stroke={INK} strokeWidth="1" />
      <ellipse cx="150" cy="134" rx="40" ry="8" fill="#4d6b4a" stroke={INK} strokeWidth=".8" />
      <path d="M126 134 q6 -2 12 0 M150 136 q6 -2 12 0" stroke="#9db58f" fill="none" />
      {/* hut */}
      <g stroke={INK} strokeWidth="1.1">
        <path d="M12 112 L14 70 Q34 56 54 70 L56 112 Z" fill="#8a6239" />
        <path d="M8 74 Q34 44 60 74 Q34 64 8 74 Z" fill="#a3843f" />
        <path d="M28 112 v-18 a6 6 0 0 1 12 0 v18 z" fill="#4a2d17" />
        <rect x="18" y="80" width="8" height="7" fill="#e3c27a" />
      </g>
      {/* sign */}
      <g stroke={INK} strokeWidth="1">
        <rect x="64" y="118" width="3" height="20" fill="#6b4325" />
        <rect x="52" y="108" width="34" height="12" rx="2" fill="#a37a4a" />
      </g>
      <text x="69" y="117" textAnchor="middle" fontFamily="Almendra" fontWeight="700" fontSize="7" fill={INK}>BATAKLIK</text>
      {/* cattails */}
      <g stroke="#2f6b3a" strokeWidth="1.4">
        <path d="M186 140 v-30 M192 142 v-26 M180 142 v-22" />
      </g>
      <g fill="#6b4325" stroke={INK} strokeWidth=".6">
        <rect x="184.5" y="106" width="3" height="10" rx="1.5" /><rect x="190.5" y="112" width="3" height="10" rx="1.5" /><rect x="178.5" y="116" width="3" height="9" rx="1.5" />
      </g>
      <Ugur x={92} y={30} s={0.98} cap />
    </svg>
  );
}

function Garden() {
  const blooms = [[14, 22], [24, 14], [34, 24], [20, 34], [44, 16], [56, 26], [150, 18], [162, 28], [174, 16], [186, 26], [168, 40], [30, 44], [180, 44]];
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
      {/* wall */}
      <rect x="0" y="0" width="200" height="104" fill="#f3ead8" />
      <g stroke="#d9cdb2" strokeWidth=".7">
        {[16, 32, 48, 64, 80, 96].map((y) => <path key={y} d={`M0 ${y} H200`} />)}
      </g>
      {/* gate */}
      <g stroke={INK} strokeWidth="1.1">
        <path d="M84 104 V58 a16 16 0 0 1 32 0 V104 Z" fill="#3d3a33" />
        <path d="M100 42 V104 M92 50 V104 M108 50 V104 M84 76 H116" stroke="#7a7466" strokeWidth=".8" />
      </g>
      {/* bougainvillea */}
      <g fill="#4f8a3a" stroke={INK} strokeWidth=".5">
        <path d="M0 0 Q30 10 64 0 Q60 30 30 50 Q10 40 0 30z" opacity=".9" />
        <path d="M200 0 Q170 10 140 0 Q142 30 170 52 Q190 44 200 32z" opacity=".9" />
      </g>
      {blooms.map(([x, y]) => <Flower key={x + "-" + y} x={x} y={y} c="#d6407a" r={4} />)}
      {/* ground + flower beds */}
      <path d="M0 104 H200 V150 H0z" fill="#9cc06a" stroke={INK} strokeWidth="1" />
      <path d="M0 132 Q50 122 100 130 T200 128 V150 H0z" fill="#4f8a3a" stroke={INK} strokeWidth="1" />
      {[[16, 128], [30, 134], [154, 130], [172, 136], [186, 126]].map(([x, y]) => <Flower key={x} x={x} y={y} c="#e3c27a" r={3.4} />)}
      {[[40, 126], [164, 124]].map(([x, y]) => <Flower key={x} x={x} y={y} c="#a8302a" r={3.4} />)}
      <Bird x={130} y={56} s={0.7} flip />
      <Fatma x={68} y={30} s={0.98} />
    </svg>
  );
}

function Meet() {
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
      <circle cx="100" cy="36" r="18" fill="#f2d27a" stroke={INK} strokeWidth="1" />
      <Bird x={28} y={20} /><Bird x={160} y={16} flip />
      {/* hills & path */}
      <path d="M0 96 Q50 72 100 90 T200 84 V150 H0z" fill="#9cc06a" stroke={INK} strokeWidth="1" />
      <path d="M86 150 Q96 120 100 92 Q104 120 114 150z" fill="#e6d3a8" stroke={INK} strokeWidth=".8" />
      {/* trees */}
      <g stroke={INK} strokeWidth="1">
        <rect x="18" y="80" width="5" height="22" fill="#6b4325" />
        <circle cx="20.5" cy="72" r="14" fill="#4f8a3a" />
        <rect x="176" y="78" width="5" height="22" fill="#6b4325" />
        <circle cx="178.5" cy="70" r="13" fill="#4f8a3a" />
      </g>
      <Flower x={20} y={66} r={2.4} /><Flower x={26} y={76} r={2.4} /><Flower x={176} y={64} r={2.4} />
      <Ugur x={30} y={30} s={0.98} reach={6} />
      <Fatma x={110} y={30} s={0.98} flip reach={6} />
      <Heart x={100} y={58} s={1.6} />
    </svg>
  );
}

function Sea() {
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
      <rect x="0" y="0" width="200" height="80" fill="#dfe4ea" />
      <path d="M0 22 q20 -8 40 0 t40 0 M110 30 q20 -8 40 0 t40 0" stroke="#b9c3cf" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="70" r="16" fill="#f0b26a" stroke={INK} strokeWidth="1" />
      <path d="M0 72 q24 -12 44 -4 q20 -10 46 2 V80 H0z M120 74 q30 -12 54 -4 q14 -4 26 0 V80 H120z" fill="#7d93a8" stroke={INK} strokeWidth=".8" />
      <rect x="0" y="78" width="200" height="72" fill="#6f95ba" stroke={INK} strokeWidth="1" />
      {[[20, 92], [70, 100], [150, 96], [40, 116], [120, 112], [176, 120]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} q5 -3 10 0 q5 -3 10 0`} stroke="#e8f0f8" fill="none" />
      ))}
      <path d="M140 84 h20 M136 90 h28 M142 96 h16" stroke="#f0b26a" strokeWidth="1.4" />
      {/* rocks */}
      <path d="M30 150 Q36 126 64 124 Q100 118 136 126 Q160 130 168 150 Z" fill="#9a8c78" stroke={INK} strokeWidth="1" />
      {/* sailboat */}
      <g stroke={INK} strokeWidth=".8">
        <path d="M172 104 h18 l-3 5 h-12 z" fill="#6b4325" />
        <path d="M181 104 V88 l8 14 z" fill="#fbf7ee" />
      </g>
      <Bird x={40} y={40} s={0.7} /><Bird x={60} y={52} s={0.5} />
      <Ugur x={50} y={28} s={0.84} reach={4} />
      <Fatma x={92} y={28} s={0.84} flip reach={4} />
      <Heart x={100} y={44} s={1.3} />
    </svg>
  );
}

function Royal() {
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
      <Vines />
      <Castle x={150} y={14} s={0.75} />
      <Bird x={32} y={34} /><Bird x={58} y={20} s={0.7} />
      <path d="M16 118 Q40 108 60 116 T100 114 T140 116 T184 114 V150 H16z" fill="#7fa7cf" stroke={INK} strokeWidth="1" />
      <path d="M16 130 Q60 120 100 128 T184 126 V150 H16z" fill="#4f8a3a" stroke={INK} strokeWidth="1" />
      <Ugur x={42} y={26} s={0.98} outfit="royal" reach={8} />
      <Fatma x={98} y={26} s={0.98} outfit="royal" flip reach={8} />
      <Heart x={100} y={50} s={1.6} />
    </svg>
  );
}

export const SCENES = { swamp: Swamp, garden: Garden, meet: Meet, sea: Sea, royal: Royal };
