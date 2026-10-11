import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Book, { SPREADS, ZoomedPage } from "./components/Book.jsx";
import Background from "./components/Background.jsx";
import { Rsvp } from "./components/Extras.jsx";
import { WEDDING } from "./content.js";
import { coverCreak, pageFlip, setSfxMuted } from "./sound.js";

const spreadFromPath = (pathname) => {
  const m = pathname.match(/^\/sayfa\/(\d+)/);
  return m ? Math.min(Math.max(+m[1], 1), SPREADS) : 0;
};

// Gentle fade-in so the music doesn't start abruptly.
function fadeIn(a, ms = 1500) {
  const t0 = Date.now();
  const id = setInterval(() => {
    a.volume = Math.min(1, (Date.now() - t0) / ms);
    if (a.volume >= 1 || a.paused) clearInterval(id);
  }, 50);
}

export default function Invitation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const spread = spreadFromPath(pathname);

  // names → book. Deep links go straight to the book.
  const [phase, setPhase] = useState(spread > 0 ? "book" : "names");
  const [zoom, setZoom] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const audio = useRef(null);
  const userMuted = useRef(false);
  const touch = useRef(null);

  useEffect(() => {
    if (phase !== "names") return;
    const t = setTimeout(() => setPhase("book"), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  // Page sounds whenever the visible spread changes (buttons, swipes, back button).
  const prevSpread = useRef(spread);
  useEffect(() => {
    const before = prevSpread.current;
    prevSpread.current = spread;
    if (before === spread) return;
    before === 0 || spread === 0 ? coverCreak() : pageFlip();
    if (before === 0) startMusic(); // the first page just opened
  }, [spread]);

  // Opened straight on a page (e.g. a /sayfa/1 link)? Browsers only allow
  // sound after a tap, so start the music on the first interaction.
  useEffect(() => {
    if (!spread) return;
    const events = ["pointerdown", "touchend", "keydown"];
    const off = () => events.forEach((ev) => document.removeEventListener(ev, onTap, true));
    function onTap(e) {
      if (e.target.closest?.(".music")) return off(); // the music button decides itself
      startMusic();
      off();
    }
    events.forEach((ev) => document.addEventListener(ev, onTap, true));
    return off;
  }, [spread > 0]);

  const go = (n) => {
    const next = Math.min(Math.max(n, 0), SPREADS);
    if (next === spread) return;
    navigate(next ? `/sayfa/${next}` : "/");
  };

  // Background music starts when the first page opens, unless the visitor
  // muted it with the music button.
  const startMusic = () => {
    const a = audio.current;
    if (!a || !a.paused || userMuted.current) return;
    if (a.currentTime < WEDDING.musicStart) a.currentTime = WEDDING.musicStart;
    a.volume = 0;
    a.play().then(() => fadeIn(a)).catch(() => {});
  };
  const open = () => {
    startMusic(); // called inside the tap itself, which iOS Safari requires
    go(1);
  };
  const next = () => (spread ? go(spread + 1) : open());
  const prev = () => go(spread - 1);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setZoom(null);
      if (zoom !== null) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    userMuted.current = !a.paused;
    setSfxMuted(userMuted.current);
    if (a.paused) {
      a.volume = 1;
      a.play().catch(() => {});
    } else a.pause();
  };

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null || !spread) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (dx < -45) next();
    else if (dx > 45) prev();
  };

  const last = spread === SPREADS;

  return (
    <>
      <Background />

      <div className={`intro${phase !== "names" ? " hide" : ""}`} onClick={() => setPhase("book")}>
        <div>
          <h2>{WEDDING.bride}<em>&amp;</em>{WEDDING.groom}</h2>
          <div className="line" />
          {WEDDING.guest && <p className="intro-guest">Sevgili {WEDDING.guest}</p>}
        </div>
      </div>

      <audio
        ref={audio}
        preload="auto"
        onLoadedMetadata={(e) => {
          setHasMusic(true);
          if (e.currentTarget.currentTime < WEDDING.musicStart) e.currentTarget.currentTime = WEDDING.musicStart;
        }}
        onEnded={(e) => {
          // loop from where the song becomes audible, not from its quiet intro
          e.currentTarget.currentTime = WEDDING.musicStart;
          e.currentTarget.play().catch(() => {});
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {WEDDING.music.map((file) => (
          <source key={file} src={import.meta.env.BASE_URL + file} type={file.endsWith(".mp3") ? "audio/mpeg" : "audio/mp4"} />
        ))}
      </audio>
      {hasMusic && (
        <button className={`music${playing ? "" : " muted"}`} onClick={toggleMusic} aria-label="Müziği aç/kapat">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
          {!playing && <span className="slash" />}
        </button>
      )}

      <main onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className={`stage${phase === "book" ? " show" : ""}`}>
          <div className={`tilt${spread ? " open" : ""}`}>
            <Book spread={spread} onOpen={open} onZoom={setZoom} />
          </div>
        </div>
      </main>

      {!spread && (
        <button className={`open-cta${phase === "book" ? " show" : ""}`} onClick={open}>
          Masalı aç
        </button>
      )}

      <nav className={`ui${spread ? " show" : ""}`}>
        <button className="arrow" onClick={prev} aria-label="Önceki sayfa">‹</button>
        <div className="mid">
          <div className="dots">
            {Array.from({ length: SPREADS }, (_, i) => (
              <button key={i} className={i + 1 === spread ? "on" : ""} onClick={() => go(i + 1)} aria-label={`${i + 1}. sayfa`} />
            ))}
          </div>
          <p className="hint">
            {last ? "Büyütmek için sayfaya dokun" : "Büyütmek için sayfaya dokun · çevirmek için kaydır"}
          </p>
        </div>
        {last ? (
          <a className="btn" href={WEDDING.mapsUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
            Yol tarifi al
          </a>
        ) : (
          <button className="arrow" onClick={next} aria-label="Sonraki sayfa">›</button>
        )}
      </nav>

      <div className={`zoom${zoom !== null ? " show" : ""}`} onClick={() => setZoom(null)} aria-hidden={zoom === null}>
        {zoom !== null && <ZoomedPage index={zoom} />}
        {zoom !== null && <button className="zoom-back">← Davetiye</button>}
      </div>

      <Rsvp />
    </>
  );
}
