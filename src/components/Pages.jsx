import { useState } from "react";
import { INK } from "./Characters.jsx";
import { SCENES } from "./Scenes.jsx";
import { STORY, WEDDING } from "../content.js";

const GOLD = "#e3c27a";
const RED = "#b8352c";
const BLUE = "#2b4c9b";
const GREEN = "#2f6b3a";

const FLEUR =
  "M10 1.5c-2.6 3-2.6 6.2 0 9.3 2.6-3.1 2.6-6.3 0-9.3zM10 11.5c-2.2-3.6-6.6-3.4-6.8-.4-.1 1.8 1.6 3 3.4 2.1M10 11.5c2.2-3.6 6.6-3.4 6.8-.4.1 1.8-1.6 3-3.4 2.1M4.6 13.6h10.8M10 13.6v6.6M7 20.2h6";

const FleurShield = () => (
  <svg className="sh" viewBox="0 0 24 28">
    <path d="M2 2h20v10.5c0 7-5 11.5-10 13.5C7 24 2 19.5 2 12.5z" fill={BLUE} stroke={INK} strokeWidth="1.4" />
    <path d="M3.6 3.6h16.8v8.9c0 6-4.2 9.8-8.4 11.6-4.2-1.8-8.4-5.6-8.4-11.6z" fill="none" stroke={GOLD} strokeWidth=".8" />
    <path d={FLEUR} transform="translate(2 2.6)" fill={GOLD} stroke={GOLD} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const PartyShield = ({ a = RED, b = BLUE }) => (
  <svg className="sh" viewBox="0 0 24 28">
    <path d="M12 2H2v10.5c0 7 5 11.5 10 13.5z" fill={a} />
    <path d="M12 2h10v10.5c0 7-5 11.5-10 13.5z" fill={b} />
    <path d="M2 2h20v10.5c0 7-5 11.5-10 13.5C7 24 2 19.5 2 12.5z" fill="none" stroke={INK} strokeWidth="1.4" />
    <path d="M12 2v24" stroke={GOLD} strokeWidth="1" />
  </svg>
);
const Lozenge = () => (
  <svg viewBox="0 0 20 24">
    <path d="M10 1l8.5 11L10 23 1.5 12z" fill={GREEN} stroke={INK} strokeWidth="1.2" />
    <path d="M10 6l4 6-4 6-4-6z" fill={GOLD} stroke={INK} strokeWidth=".8" />
  </svg>
);
const Rosette = ({ c = RED }) => (
  <svg viewBox="0 0 24 24">
    <g fill={c} stroke={INK} strokeWidth=".9">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <path key={r} d="M12 12c-2-3-2-7 0-10 2 3 2 7 0 10z" transform={`rotate(${r} 12 12)`} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.6" fill={GOLD} stroke={INK} strokeWidth=".8" />
  </svg>
);
const GoldFlower = () => (
  <svg viewBox="0 0 20 20">
    <g fill={GOLD} stroke="#8a6a2a" strokeWidth=".7">
      {[0, 90, 180, 270].map((r) => <path key={r} d="M10 10c-1.6-2.2-1.6-5.4 0-7.6 1.6 2.2 1.6 5.4 0 7.6z" transform={`rotate(${r} 10 10)`} />)}
    </g>
    <circle cx="10" cy="10" r="1.6" fill={RED} />
  </svg>
);
const Scroll = ({ flip }) => (
  <svg viewBox="0 0 44 22" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M2 14c6-10 14-10 18-4s10 8 14 2 6-8 8-6" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 8c-3-4 1-7 4-5-1 3-2 4-4 5zM26 15c2 4 6 4 7 1-3-1-4-1-7-1z" fill="#4f8a3a" stroke={INK} strokeWidth=".7" />
    <circle cx="20" cy="9.5" r="1.6" fill={RED} stroke={INK} strokeWidth=".5" />
  </svg>
);
const Swallow = ({ flip }) => (
  <svg viewBox="0 0 40 24" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M2 4c6 1 11 4 15 8 3-5 8-9 15-10-3 3-5 6-5 9 4 0 8 1 11 3-6 1-10 1-13 2-2 3-6 5-11 5 2-2 3-3 3-5-5-2-10-6-15-12z" fill="#3f6fb5" stroke={INK} strokeWidth=".9" strokeLinejoin="round" />
    <path d="M17 13c2 2 5 3 9 2-2 2-5 3-8 2z" fill="#fbf7ee" />
    <circle cx="29" cy="12" r=".9" fill={INK} />
  </svg>
);
const Daisy = () => (
  <svg viewBox="0 0 20 20">
    <g fill="#fbf7ee" stroke={INK} strokeWidth=".7">
      {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="10" cy="5" rx="2.8" ry="4" transform={`rotate(${r} 10 10)`} />)}
    </g>
    <circle cx="10" cy="10" r="2" fill={GOLD} stroke={INK} strokeWidth=".6" />
  </svg>
);

const BandTop = () => (
  <div className="band-top">
    <Lozenge /><Scroll /><GoldFlower /><Rosette />
    <FleurShield />
    <Rosette /><GoldFlower /><Scroll flip /><Lozenge />
  </div>
);
const BandBottom = () => (
  <div className="band-bottom">
    <PartyShield /><Swallow /><Daisy /><PartyShield a={BLUE} b={RED} /><Daisy /><Swallow flip /><PartyShield />
  </div>
);

export const Dropcap = ({ letter, big }) => (
  <span className={`dropcap${big ? " big" : ""}`}>
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M4 34c4-8 2-14 8-18M36 6c-4 8-2 14-8 18" fill="none" stroke={GREEN} strokeWidth="1.6" />
      <path d="M9 22c-4-2-4-6-1-7 1 3 1 5 1 7zM31 18c4 2 4 6 1 7-1-3-1-5-1-7z" fill="#4f8a3a" />
      <circle cx="6" cy="9" r="2" fill={RED} /><circle cx="34" cy="31" r="2" fill={RED} />
    </svg>
    <b>{letter}</b>
  </span>
);

function Illustration({ chapter }) {
  const [failed, setFailed] = useState(!chapter.image);
  const Scene = SCENES[chapter.scene];
  if (failed) return <Scene />;
  return (
    <img
      src={import.meta.env.BASE_URL + chapter.image}
      alt=""
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}

function StoryPage({ chapter, index }) {
  const [first, ...rest] = chapter.text;
  return (
    <>
      <BandTop />
      <h3 className="chapter">{chapter.title}</h3>
      <div className="scene"><Illustration chapter={chapter} /></div>
      <p className="story">
        <Dropcap letter={first} />
        {rest.join("")}
      </p>
      <div className="folio">· {index + 1} ·</div>
      <BandBottom />
    </>
  );
}

const icon = {
  cal: "M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14v11zM7 11h5v5H7z",
  castle: "M3 22V8h2v2h2V8h2v2h2V4h2v6h2V8h2v2h2V8h2v14h-7v-5a2 2 0 0 0-4 0v5z",
  pin: "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
};
const Ico = ({ d }) => (
  <span className="ico"><svg viewBox="0 0 24 24"><path d={d} /></svg></span>
);
const stop = (e) => e.stopPropagation();

function InvitePage() {
  const W = WEDDING;
  return (
    <>
      <BandTop />
      <div className="head">
        <Dropcap letter="M" big />
        <div className="lead">
          asalımızın en güzel sayfasında<br />
          <span className="ink">sizleri de yanımızda görmekten mutluluk duyarız.</span>
        </div>
      </div>
      <div className="couple">
        {W.bride}<span>&amp;</span>{W.groom}
      </div>
      <ul className="details">
        <li><Ico d={icon.cal} /><div>{W.dateText}<small>{W.timeText}</small></div></li>
        <li><Ico d={icon.castle} /><div>{W.venue}<small>{W.city}</small></div></li>
        <li>
          <Ico d={icon.pin} />
          <div>
            <a href={W.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={stop}>Haritada aç</a>
            <small><a href={W.venueUrl} target="_blank" rel="noopener noreferrer" onClick={stop}>Mekânı incele</a></small>
          </div>
        </li>
      </ul>
      <div className="ever">…ve sonsuza kadar mutlu yaşadılar.</div>
      <BandBottom />
    </>
  );
}

// Book content in reading order: [left, right] for each spread.
export const PAGES = [
  ...STORY.map((chapter, i) => {
    const P = () => <StoryPage chapter={chapter} index={i} />;
    return P;
  }),
  InvitePage,
];
