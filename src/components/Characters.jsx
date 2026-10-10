// Ogre versions of Uğur and Fatma, drawn in a medieval-manuscript style.
// Each figure lives in a 60 x 120 box with the head centred at (30, 30).

export const INK = "#2c1d10";
const SKIN = "#8fb84a";
const SKIN_D = "#6f9636";
const HAIR = "#3a2414";

function Ear({ side, small }) {
  const s = side === "left" ? -1 : 1;
  const x0 = 30 + s * (small ? 11.5 : 13);
  const x1 = x0 + s * (small ? 6 : 9);
  return (
    <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
      <path d={`M${x0} 29 L${x1} 25 L${x1} 33 Z`} fill={SKIN} />
      <ellipse cx={x1} cy="29" rx="1.8" ry={small ? 3.2 : 4.2} fill={SKIN_D} />
    </g>
  );
}

const Crown = ({ y = 6, w = 13 }) => (
  <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
    <path
      d={`M${30 - w} ${y + 9} L${30 - w + 2} ${y} L${30 - w / 2} ${y + 6} L30 ${y - 3} L${30 + w / 2} ${y + 6} L${30 + w - 2} ${y} L${30 + w} ${y + 9} Z`}
      fill="#e3c27a"
    />
    <circle cx="30" cy={y + 3} r="1.4" fill="#a8302a" />
  </g>
);

/** Uğur: messy dark hair, short beard & moustache, big grin. */
export function Ugur({ x = 0, y = 0, s = 1, outfit = "tunic", cap = false, reach = 0, flip = false }) {
  const robe = outfit === "royal" ? "#2b4c9b" : "#7a4a2a";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(${flip ? -60 : 0} 0)`}>
      {/* body */}
      <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M10 118 L15 60 Q30 52 45 60 L50 118 Z" fill={robe} />
        {outfit === "royal" ? (
          <>
            <path d="M14 62 Q30 72 46 62 L48 80 Q30 74 12 80 Z" fill="#fbf7ee" />
            <g fill={INK} stroke="none">
              <circle cx="19" cy="72" r=".8" /><circle cx="27" cy="70" r=".8" /><circle cx="35" cy="70" r=".8" /><circle cx="42" cy="73" r=".8" />
            </g>
            <g fill="#e3c27a" stroke="none">
              {[[20, 92], [32, 88], [40, 100], [24, 106], [36, 110]].map(([a, b]) => (
                <path key={a + "" + b} d={`M${a} ${b - 3}c-1.5 1.5-1.5 3 0 4.4 1.5-1.4 1.5-2.9 0-4.4zM${a - 2.3} ${b + 2}h4.6`} stroke="#e3c27a" strokeWidth=".8" />
              ))}
            </g>
          </>
        ) : (
          <>
            <path d="M23 57 L30 70 L37 57 Z" fill="#efe4c8" />
            <rect x="14" y="84" width="33" height="4.5" fill="#4a2d17" />
            <rect x="28" y="83.5" width="5" height="5.5" fill="#e3c27a" />
          </>
        )}
        {/* arms */}
        <path d="M16 64 Q8 80 12 94" fill="none" strokeWidth="7" />
        <path d="M16 64 Q8 80 12 94" fill="none" strokeWidth="5" stroke={robe} />
        <circle cx="12" cy="95" r="3.4" fill={SKIN} />
        <path d={reach ? `M44 64 Q${52 + reach * 0.4} 72 ${48 + reach} 80` : "M44 64 Q52 80 48 94"} fill="none" strokeWidth="7" />
        <path d={reach ? `M44 64 Q${52 + reach * 0.4} 72 ${48 + reach} 80` : "M44 64 Q52 80 48 94"} fill="none" strokeWidth="5" stroke={robe} />
        <circle cx={reach ? 48 + reach : 48} cy={reach ? 81 : 95} r="3.4" fill={SKIN} />
      </g>
      <Ear side="left" />
      <Ear side="right" />
      {/* head */}
      <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
        <ellipse cx="30" cy="30" rx="14" ry="15.5" fill={SKIN} />
        {/* beard + moustache */}
        <path d="M16.5 31 Q17 46.5 30 47.5 Q43 46.5 43.5 31 Q41 41 30 41.5 Q19 41 16.5 31 Z" fill={HAIR} />
        <path d="M23.5 36.5 Q30 33.5 36.5 36.5 Q30 38.2 23.5 36.5 Z" fill={HAIR} />
        <path d="M25 38.6 Q30 43.5 35 38.6 Z" fill="#fff" strokeWidth="1" />
        {/* messy hair */}
        <path
          d="M16 27 Q13 14 22 11 Q22 4 30 7 Q35 1 40 8 Q48 9 45.5 21 Q46 25 44 28 Q42 19 36 18 Q33 14 28 18 Q22 16 19 21 Q17 23 16 27 Z"
          fill={HAIR}
        />
        {cap && (
          <>
            <path d="M15.5 22 Q15 7 30 6.5 Q45 7 44.5 22 Q30 17 15.5 22 Z" fill="#2b2b2b" />
            <path d="M24 19.4 Q30 17.6 36 19.4 L35.4 22 Q30 20.6 24.6 22 Z" fill="#7a7a7a" strokeWidth=".8" />
            <path d="M20 21.8 Q24 24 26 22 M34 22 Q36 24 40 21.8" fill="none" stroke={HAIR} strokeWidth="2" />
          </>
        )}
        {/* face */}
        <path d="M21.5 24 q3 -2.4 6 -.6 M32.5 23.4 q3 -1.8 6 .6" fill="none" strokeWidth="1.3" />
        <circle cx="24.5" cy="28.5" r="1.4" fill={INK} stroke="none" />
        <circle cx="35.5" cy="28.5" r="1.4" fill={INK} stroke="none" />
        <path d="M28.5 33 Q30 34.4 31.5 33" fill="none" />
      </g>
      {outfit === "royal" && <Crown y={2} w={12} />}
    </g>
  );
}

/** Fatma: big dark curly hair, warm smile, red dress with white trim. */
export function Fatma({ x = 0, y = 0, s = 1, outfit = "dress", reach = 0, flip = false }) {
  const curlsBack = [
    [17, 18, 7], [43, 18, 7], [12, 30, 7], [48, 30, 7], [11, 42, 7.5], [49, 42, 7.5],
    [13, 54, 7], [47, 54, 7], [18, 62, 6], [42, 62, 6], [22, 9, 7], [38, 9, 7], [30, 6, 7.5],
  ];
  const curlsFront = [[21, 14, 4.5], [27, 11, 4.5], [33, 11, 4.5], [39, 14, 4.5], [17.5, 21, 4], [42.5, 21, 4]];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(${flip ? -60 : 0} 0)`}>
      {/* hair behind */}
      <g fill={HAIR} stroke={INK} strokeWidth="1.1">
        <path d="M12 28 Q12 4 30 4 Q48 4 48 28 L50 60 Q30 70 10 60 Z" />
        {curlsBack.map(([cx, cy, r]) => <circle key={cx + "-" + cy} cx={cx} cy={cy} r={r} />)}
      </g>
      {/* dress */}
      <g stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M8 118 Q16 84 19 60 Q30 53 41 60 Q44 84 52 118 Z" fill="#b3302b" />
        <path d="M19 60 Q30 66 41 60 L40.5 57 Q30 63 19.5 57 Z" fill="#fbf7ee" strokeWidth="1" />
        {outfit === "royal" && (
          <g fill="none" stroke="#e3c27a" strokeWidth=".9">
            <path d="M20 84 q3 4 0 8 q-3 4 0 8 M30 80 q3 4 0 8 q-3 4 0 8 q3 4 0 8 M40 84 q3 4 0 8 q-3 4 0 8" />
          </g>
        )}
        <path d="M11 108 Q30 102 49 108 L51 114 Q30 108 9 114 Z" fill={outfit === "royal" ? "#2f6b3a" : "#fbf7ee"} />
        {/* arms */}
        <path d="M20 64 Q12 78 15 92" fill="none" strokeWidth="6.5" />
        <path d="M20 64 Q12 78 15 92" fill="none" strokeWidth="4.5" stroke="#b3302b" />
        <circle cx="15" cy="93" r="3" fill={SKIN} />
        <path d={reach ? `M40 64 Q${47 + reach * 0.4} 72 ${44 + reach} 80` : "M40 64 Q48 78 45 92"} fill="none" strokeWidth="6.5" />
        <path d={reach ? `M40 64 Q${47 + reach * 0.4} 72 ${44 + reach} 80` : "M40 64 Q48 78 45 92"} fill="none" strokeWidth="4.5" stroke="#b3302b" />
        <circle cx={reach ? 44 + reach : 45} cy={reach ? 81 : 93} r="3" fill={SKIN} />
      </g>
      <Ear side="left" small />
      <Ear side="right" small />
      {/* head */}
      <g stroke={INK} strokeWidth="1.3">
        <ellipse cx="30" cy="31" rx="12.5" ry="14" fill={SKIN} />
      </g>
      <g fill={HAIR} stroke={INK} strokeWidth="1">
        {curlsFront.map(([cx, cy, r]) => <circle key={cx + "-" + cy} cx={cx} cy={cy} r={r} />)}
      </g>
      <g stroke={INK} strokeWidth="1.2">
        <path d="M22.5 26 q3 -1.6 6 0 M31.5 26 q3 -1.6 6 0" fill="none" />
        <circle cx="25.5" cy="30" r="1.3" fill={INK} stroke="none" />
        <circle cx="34.5" cy="30" r="1.3" fill={INK} stroke="none" />
        <circle cx="22" cy="35" r="2.2" fill="#e88a8a" stroke="none" opacity=".55" />
        <circle cx="38" cy="35" r="2.2" fill="#e88a8a" stroke="none" opacity=".55" />
        <path d="M25.5 37 Q30 41.5 34.5 37 Z" fill="#fff" />
      </g>
      {outfit === "royal" && <Crown y={0} w={9} />}
    </g>
  );
}

export const Heart = ({ x, y, s = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 4 l-5 -5 a3.2 3.2 0 0 1 5 -4 a3.2 3.2 0 0 1 5 4 z"
    fill="#a8302a"
    stroke={INK}
    strokeWidth="1"
  />
);
