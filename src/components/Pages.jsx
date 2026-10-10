import { useState } from "react";
import qrcode from "qrcode-generator";
import { INK } from "./Characters.jsx";
import { SCENES } from "./Scenes.jsx";
import { MEMORIES, STORY, WEDDING } from "../content.js";
import { Countdown, downloadIcs, googleCalendarUrl, openRsvp } from "./Extras.jsx";

const GOLD = "#e3c27a";
const RED = "#b8352c";
const BLUE = "#24459a";
const GREEN = "#1f7a45";
const LEAF = "#2f8a4f";

const FLEUR =
  "M10 1.5c-2.6 3-2.6 6.2 0 9.3 2.6-3.1 2.6-6.3 0-9.3zM10 11.5c-2.2-3.6-6.6-3.4-6.8-.4-.1 1.8 1.6 3 3.4 2.1M10 11.5c2.2-3.6 6.6-3.4 6.8-.4.1 1.8-1.6 3-3.4 2.1M4.6 13.6h10.8M10 13.6v6.6M7 20.2h6";
const SHIELD = "M2 2h20v10.5c0 7-5 11.5-10 13.5C7 24 2 19.5 2 12.5z";

/* ---------- ornaments ---------- */
const FleurShield = () => (
  <svg className="sh big" viewBox="0 0 24 28">
    <path d={SHIELD} fill={BLUE} stroke={INK} strokeWidth="1.3" />
    <path d="M3.6 3.6h16.8v8.9c0 6-4.2 9.8-8.4 11.6-4.2-1.8-8.4-5.6-8.4-11.6z" fill="none" stroke={RED} strokeWidth="1" />
    <path d={FLEUR} transform="translate(2 2.6)" fill={GOLD} stroke={GOLD} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const PartyShield = ({ a = BLUE, b = RED }) => (
  <svg className="sh" viewBox="0 0 24 28">
    <path d="M12 2H2v10.5c0 7 5 11.5 10 13.5z" fill={a} />
    <path d="M12 2h10v10.5c0 7-5 11.5-10 13.5z" fill={b} />
    <path d="M12 13H22v-.5" fill="none" />
    <path d={SHIELD} fill="none" stroke={INK} strokeWidth="1.4" />
    <path d={SHIELD} fill="none" stroke="#fbf7ee" strokeWidth=".7" transform="translate(1.2 1.2) scale(.9)" />
  </svg>
);
const ChevronShield = () => (
  <svg className="sh" viewBox="0 0 24 28">
    <path d={SHIELD} fill={RED} />
    <path d="M2 14l10-6 10 6v-1 0c0 7-5 11.5-10 13.5C7 24.5 2 20 2 14z" fill={BLUE} />
    <path d="M2 14l10-6 10 6" fill="none" stroke={GOLD} strokeWidth="1.6" />
    <path d={SHIELD} fill="none" stroke={INK} strokeWidth="1.4" />
  </svg>
);
const Lozenge = () => (
  <svg viewBox="0 0 20 24">
    <path d="M10 1l8.5 11L10 23 1.5 12z" fill={LEAF} stroke={INK} strokeWidth="1.2" />
    <path d="M10 6l4 6-4 6-4-6z" fill={GOLD} stroke={INK} strokeWidth=".8" />
    <circle cx="10" cy="12" r="1.3" fill={RED} />
  </svg>
);
const Rosette = ({ c = RED }) => (
  <svg viewBox="0 0 24 24">
    <g fill={c} stroke={INK} strokeWidth=".8">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <path key={r} d="M12 12c-2-3-2.2-7.4 0-10.4 2.2 3 2 7.4 0 10.4z" transform={`rotate(${r} 12 12)`} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.8" fill={GOLD} stroke={INK} strokeWidth=".8" />
  </svg>
);
const GoldFlower = ({ size = 20 }) => (
  <svg viewBox="0 0 20 20" width={size}>
    <g fill={GOLD} stroke="#9a7428" strokeWidth=".7">
      {[0, 90, 180, 270].map((r) => <path key={r} d="M10 10c-1.6-2.2-1.6-5.4 0-7.6 1.6 2.2 1.6 5.4 0 7.6z" transform={`rotate(${r} 10 10)`} />)}
      {[45, 135, 225, 315].map((r) => <path key={r} d="M10 10c-.8-1.4-.8-3 0-4.4.8 1.4.8 3 0 4.4z" transform={`rotate(${r} 10 10)`} />)}
    </g>
  </svg>
);
const Vine = ({ flip }) => (
  <svg viewBox="0 0 64 24" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M2 16c8-12 18-12 24-5s14 9 20 2 10-10 16-6" fill="none" stroke={LEAF} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M12 7c-4-5 1-8 5-6-1 4-3 5-5 6zM34 18c3 5 8 5 9 1-4-1-5-1-9-1zM52 5c2-4 7-4 7 0-3 1-4 1-7 0z" fill={LEAF} stroke={INK} strokeWidth=".7" />
    <g transform="translate(19 2) scale(.5)"><path d="M10 10c-1.6-2.2-1.6-5.4 0-7.6 1.6 2.2 1.6 5.4 0 7.6zM10 10c1.6 2.2 1.6 5.4 0 7.6-1.6-2.2-1.6-5.4 0-7.6zM10 10c2.2-1.6 5.4-1.6 7.6 0-2.2 1.6-5.4 1.6-7.6 0zM10 10c-2.2 1.6-5.4 1.6-7.6 0 2.2-1.6 5.4-1.6 7.6 0z" fill={GOLD} stroke="#9a7428" strokeWidth="1" /></g>
    <g transform="translate(40 8) scale(.45)"><path d="M10 10c-1.6-2.2-1.6-5.4 0-7.6 1.6 2.2 1.6 5.4 0 7.6zM10 10c1.6 2.2 1.6 5.4 0 7.6-1.6-2.2-1.6-5.4 0-7.6zM10 10c2.2-1.6 5.4-1.6 7.6 0-2.2 1.6-5.4 1.6-7.6 0zM10 10c-2.2 1.6-5.4 1.6-7.6 0 2.2-1.6 5.4-1.6 7.6 0z" fill={GOLD} stroke="#9a7428" strokeWidth="1" /></g>
  </svg>
);
export const Swallow = ({ flip, className }) => (
  <svg className={className} viewBox="0 0 44 28" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M3 5c6 1 12 5 16 9 3-6 9-11 17-12-3 3-5 7-5 10 4 0 8 1 11 4-6 1-10 1-14 2-2 4-7 6-12 6 2-2 3-4 3-6C13 16 8 11 3 5z" fill="#2f5fb0" stroke={INK} strokeWidth=".9" strokeLinejoin="round" />
    <path d="M19 15c2 2 6 3 10 2-2 2-6 3-9 2z" fill="#fbf7ee" />
    <path d="M8 8c4 1 7 3 9 5" stroke="#9cc3ea" strokeWidth="1.2" fill="none" />
    <path d="M38 15l4 1-4 1z" fill={RED} />
    <circle cx="34" cy="14" r="1" fill={INK} />
  </svg>
);
const Daisy = () => (
  <svg viewBox="0 0 20 20">
    <g fill="#fbf7ee" stroke={INK} strokeWidth=".6">
      {[0, 60, 120, 180, 240, 300].map((r) => <ellipse key={r} cx="10" cy="5" rx="2.6" ry="4" transform={`rotate(${r} 10 10)`} />)}
    </g>
    <circle cx="10" cy="10" r="2.2" fill="#e0a53a" stroke={INK} strokeWidth=".6" />
  </svg>
);

const BandTop = () => (
  <div className="band-top">
    <Lozenge /><Vine /><Rosette />
    <FleurShield />
    <Rosette /><Vine flip /><Lozenge />
  </div>
);
const BandBottom = () => (
  <div className="band-bottom">
    <PartyShield /><Swallow /><Daisy /><ChevronShield /><Daisy /><Swallow flip /><PartyShield a={RED} b={BLUE} />
  </div>
);

export const Dropcap = ({ letter, color = BLUE }) => (
  <span className="dropcap">
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M5 35c5-9 2-15 9-19M35 5c-5 9-2 15-9 19M5 5c6 4 5 9 10 10M35 35c-6-4-5-9-10-10" fill="none" stroke={LEAF} strokeWidth="1.4" />
      <path d="M9 22c-4-2-4-6-1-7 1 3 1 5 1 7zM31 18c4 2 4 6 1 7-1-3-1-5-1-7z" fill={LEAF} />
      <circle cx="6" cy="9" r="2.2" fill={RED} /><circle cx="34" cy="31" r="2.2" fill={RED} />
      <circle cx="34" cy="8" r="1.8" fill={RED} /><circle cx="6" cy="32" r="1.8" fill={RED} />
    </svg>
    <b style={{ color }}>{letter}</b>
  </span>
);

/* ---------- QR code in a decorated frame ---------- */
function QrBox() {
  const qr = qrcode(0, "M");
  qr.addData(WEDDING.siteUrl);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return (
    <div className="qr">
      <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges">
        <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fbf3dc" />
        <path d={d} fill="#a32a22" />
      </svg>
    </div>
  );
}

function Illustration({ chapter }) {
  const [failed, setFailed] = useState(!chapter.image);
  const [videoFailed, setVideoFailed] = useState(!chapter.video);
  const Scene = SCENES[chapter.scene];
  const base = import.meta.env.BASE_URL;
  if (chapter.video && !videoFailed) {
    if (chapter.video.endsWith(".gif")) {
      return <img src={base + chapter.video} alt="" draggable="false" onError={() => setVideoFailed(true)} />;
    }
    return (
      <video
        src={base + chapter.video}
        poster={chapter.image ? base + chapter.image : undefined}
        autoPlay muted loop playsInline preload="metadata"
        onError={() => setVideoFailed(true)}
      />
    );
  }
  if (failed) return <Scene />;
  return (
    <img src={base + chapter.image} alt="" draggable="false" onError={() => setFailed(true)} />
  );
}

/* ---------- pages ---------- */
function StoryPage({ chapter }) {
  const [first, ...rest] = chapter.text;
  return (
    <>
      <BandTop />
      <div className="body">
        <h3 className="chapter">{chapter.title}</h3>
        <p className="story"><Dropcap letter={first} />{rest.join("")}</p>
      </div>
      <div className="scene"><Illustration chapter={chapter} /></div>
      <BandBottom />
    </>
  );
}

function FinalePage({ chapter }) {
  return (
    <>
      <BandTop />
      <div className="finale-head">
        <Dropcap letter="V" />
        <div className="lead">
          <span className="red">e Sonsuza Kadar</span>
          <span className="blue">Mutlu Yaşadılar.</span>
        </div>
        <QrBox />
      </div>
      <div className="scene alive">
        <Illustration chapter={chapter} />
        <div className="life" aria-hidden="true">
          <span className="fly f1"><Swallow /></span>
          <span className="fly f2"><Swallow flip /></span>
          {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className={`heart h${i}`}>♥</span>)}
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`spark s${i}`}>✦</span>)}
        </div>
      </div>
      <BandBottom />
    </>
  );
}

const Tile = ({ frame, children }) => (
  <span className="tile" style={{ "--frame": frame }}>{children}</span>
);
const stop = (e) => e.stopPropagation();

function InvitePage() {
  const W = WEDDING;
  const [first, ...rest] = W.event;
  return (
    <>
      <BandTop />
      <Swallow className="bird b1" flip />
      <Swallow className="bird b2" flip />
      <div className="invite-head">
        {W.guest && <div className="greeting">Sevgili {W.guest},</div>}
        <div className="line1"><Dropcap letter={first} color={GREEN} /><span className="red">{rest.join("")}</span></div>
        <div className="blue">sizleri de yanımızda görmekten</div>
        <div className="red">mutluluk duyarız.</div>
        <div className="divider">
          <GoldFlower size={14} /><Lozenge /><GoldFlower size={14} /><Lozenge /><GoldFlower size={14} />
        </div>
      </div>
      {W.families ? (
        <div className="families">
          <div>{W.families[0].parents}<b>{W.families[0].surname}</b></div>
          <GoldFlower size={22} />
          <div>{W.families[1].parents}<b>{W.families[1].surname}</b></div>
        </div>
      ) : (
        <div className="couple">{W.bride}<GoldFlower size={26} />{W.groom}</div>
      )}
      <ul className="details">
        <li>
          <Tile frame={RED}>
            <svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="1.5" fill="#fbf3dc" stroke={INK} /><path d="M4 10h16" stroke={INK} /><path d="M8 4v4M16 4v4" stroke={INK} strokeWidth="1.6" /><path d="M8 17l1-4 3 2 3-2 1 4z" fill={GOLD} stroke={INK} strokeWidth=".6" /></svg>
          </Tile>
          <div>{W.dateText}<br />{W.timeText}</div>
        </li>
        <li>
          <Tile frame={GREEN}>
            <svg viewBox="0 0 24 24"><path d="M12 3a6.5 6.5 0 0 0-6.5 6.5c0 4.9 6.5 12 6.5 12s6.5-7.1 6.5-12A6.5 6.5 0 0 0 12 3z" fill={RED} stroke={INK} /><circle cx="12" cy="9.5" r="2.4" fill="#fbf3dc" /></svg>
          </Tile>
          <div>Yer: {W.venue}</div>
        </li>
        <li>
          <Tile frame={GOLD}>
            <svg viewBox="0 0 20 22"><path d={FLEUR} fill={RED} stroke={RED} strokeWidth="1.2" strokeLinejoin="round" /></svg>
          </Tile>
          <div>
            {W.city} ·{" "}
            <a href={W.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={stop}>Haritada aç</a>
          </div>
        </li>
      </ul>
      <BandBottom />
    </>
  );
}

function MemoriesPage() {
  return (
    <>
      <BandTop />
      <h3 className="chapter mem-title">Masalımızdan kareler</h3>
      <div className="polaroids">
        {MEMORIES.map((m, i) => (
          <figure key={m.src} className={`polaroid p${i}`}>
            <span className="tape" />
            <img src={import.meta.env.BASE_URL + m.src} alt={m.caption} draggable="false" loading="lazy" />
            <figcaption>{m.caption}</figcaption>
          </figure>
        ))}
      </div>
      <BandBottom />
    </>
  );
}

function CelebratePage() {
  const W = WEDDING;
  return (
    <>
      <BandTop />
      <div className="celebrate">
        <h3 className="chapter">{W.guest ? `Sevgili ${W.guest},` : "Bizimle kutlar mısınız?"}</h3>
        <p className="cel-sub">Masalın en güzel gününe</p>
        <Countdown />
        <p className="cel-sub">kaldı</p>
        <div className="actions" onClick={stop}>
          {W.whatsapp && <button className="act primary" onClick={openRsvp}>Katılımını bildir</button>}
          <button className="act" onClick={downloadIcs}>Takvime ekle</button>
          <a className="act" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">Google Takvim</a>
          <a className="act" href={W.mapsUrl} target="_blank" rel="noopener noreferrer">Yol tarifi al</a>
        </div>
        <div className="ever">…ve sonsuza kadar mutlu yaşadılar.</div>
      </div>
      <BandBottom />
    </>
  );
}

// Book content in reading order: [left, right] for each spread.
export const PAGES = [
  ...STORY.map((chapter) => {
    const P = () => (chapter.finale ? <FinalePage chapter={chapter} /> : <StoryPage chapter={chapter} />);
    return P;
  }),
  InvitePage,
  MemoriesPage,
  CelebratePage,
];
