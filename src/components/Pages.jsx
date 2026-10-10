import { INK } from "./Characters.jsx";
import { SCENES } from "./Scenes.jsx";
import { STORY, WEDDING } from "../content.js";

const Shield = ({ a, b }) => (
  <svg className="sh" viewBox="0 0 20 24">
    <path d="M2 2h16v9c0 6-4 9.5-8 11-4-1.5-8-5-8-11z" fill={a} stroke={INK} strokeWidth="1.3" />
    <path d="M10 6c-2 2-2 4 0 6 2-2 2-4 0-6zM6 13h8M10 12v6" stroke={b} strokeWidth="1.6" fill={b} />
  </svg>
);
const Flower = ({ c }) => (
  <svg viewBox="0 0 24 24">
    <g fill={c} stroke={INK} strokeWidth="1">
      <circle cx="12" cy="6" r="4" /><circle cx="18" cy="11" r="4" /><circle cx="15.5" cy="18" r="4" /><circle cx="8.5" cy="18" r="4" /><circle cx="6" cy="11" r="4" />
    </g>
    <circle cx="12" cy="13" r="3" fill="#e3c27a" stroke={INK} />
  </svg>
);
const Leaf = () => (
  <svg viewBox="0 0 30 16">
    <path d="M1 8c6-7 14-7 28 0-14 7-22 7-28 0z" fill="#4f8a3a" stroke={INK} strokeWidth="1" />
    <path d="M3 8h24" stroke={INK} strokeWidth=".8" />
  </svg>
);
const Bird = () => (
  <svg viewBox="0 0 34 22">
    <path d="M2 13c5-2 9-2 12 1 1-6 6-11 14-12-4 3-6 7-5 11 3 0 6 1 9 3-6 1-11 3-16 4-6 0-11-3-14-7z" fill="#5a86c8" stroke={INK} strokeWidth="1" />
    <circle cx="27" cy="15" r=".9" fill={INK} />
  </svg>
);

const BandTop = () => (
  <div className="band-top">
    <Flower c="#a8302a" /><Leaf /><Flower c="#e3c27a" /><Leaf />
    <Shield a="#2b4c9b" b="#e3c27a" />
    <Leaf /><Flower c="#e3c27a" /><Leaf /><Flower c="#a8302a" />
  </div>
);
const BandBottom = () => (
  <div className="band-bottom">
    <Shield a="#a8302a" b="#e3c27a" /><Bird /><Flower c="#e3c27a" />
    <Shield a="#2b4c9b" b="#e3c27a" />
    <Flower c="#e3c27a" /><Bird /><Shield a="#a8302a" b="#e3c27a" />
  </div>
);

function StoryPage({ chapter, index }) {
  const Scene = SCENES[chapter.scene];
  const [first, ...rest] = chapter.text;
  return (
    <>
      <BandTop />
      <h3 className="chapter">{chapter.title}</h3>
      <div className="scene"><Scene /></div>
      <p className="story">
        <span className="dropcap">{first}</span>
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

function InvitePage() {
  const W = WEDDING;
  return (
    <>
      <BandTop />
      <div className="head">
        <div className="dropcap big">M</div>
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
            <a href={W.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Haritada aç</a>
            <small><a href={W.venueUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Mekânı incele</a></small>
          </div>
        </li>
      </ul>
      <div className="ever">…ve sonsuza kadar mutlu yaşadılar.</div>
      <BandBottom />
    </>
  );
}

// Book content, in reading order: [left, right] for each spread.
export const PAGES = [
  ...STORY.map((chapter, i) => {
    const P = () => <StoryPage chapter={chapter} index={i} />;
    return P;
  }),
  InvitePage,
];
