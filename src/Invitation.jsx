import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Book, { SPREADS, ZoomedPage } from "./components/Book.jsx";
import { WEDDING } from "./content.js";

const spreadFromPath = (pathname) => {
  const m = pathname.match(/^\/sayfa\/(\d+)/);
  return m ? Math.min(Math.max(+m[1], 1), SPREADS) : 0;
};

export default function Invitation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const spread = spreadFromPath(pathname);

  const [introDone, setIntroDone] = useState(spread > 0); // deep links skip the intro
  const [zoom, setZoom] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const audio = useRef(null);
  const userMuted = useRef(false);
  const touch = useRef(null);

  // Start the music right away. Browsers block sound until the visitor
  // interacts with the page, so if autoplay is refused we retry on the
  // very first tap / click / key press anywhere.
  useEffect(() => {
    const events = ["pointerdown", "pointerup", "touchend", "click", "keydown"];
    const stopListening = () => events.forEach((ev) => document.removeEventListener(ev, onInteract, true));
    const start = () => {
      const a = audio.current;
      if (!a || userMuted.current || !a.paused) return;
      a.play().then(stopListening).catch(() => {});
    };
    function onInteract(e) {
      if (e.target.closest?.(".music")) return; // the music button handles itself
      start();
    }
    events.forEach((ev) => document.addEventListener(ev, onInteract, true));
    start();
    return stopListening;
  }, []);

  useEffect(() => {
    if (introDone) return;
    const t = setTimeout(() => setIntroDone(true), 3000);
    return () => clearTimeout(t);
  }, [introDone]);

  const go = (n) => {
    const next = Math.min(Math.max(n, 0), SPREADS);
    if (next === spread) return;
    navigate(next ? `/sayfa/${next}` : "/");
  };

  const open = () => {
    if (!userMuted.current) audio.current?.play().catch(() => {});
    go(1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setZoom(null);
      if (zoom !== null) return;
      if (e.key === "ArrowRight") go(spread + 1);
      if (e.key === "ArrowLeft") go(spread - 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    userMuted.current = !a.paused;
    a.paused ? a.play().catch(() => {}) : a.pause();
  };

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touch.current == null || !spread) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (dx < -45) go(spread + 1);
    else if (dx > 45) go(spread - 1);
  };

  const last = spread === SPREADS;

  return (
    <>
      <div className={`intro${introDone ? " hide" : ""}`} onClick={() => setIntroDone(true)}>
        <div>
          <h2>{WEDDING.bride}<em>&amp;</em>{WEDDING.groom}</h2>
          <div className="line" />
        </div>
      </div>

      <audio
        ref={audio}
        loop
        preload="auto"
        onLoadedMetadata={() => setHasMusic(true)}
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
        <div className={`stage${introDone ? " show" : ""}`}>
          <div className={`tilt${spread ? " open" : ""}`}>
            <Book spread={spread} onOpen={open} onZoom={setZoom} />
          </div>
        </div>
      </main>

      {!spread && (
        <button className={`open-cta${introDone ? " show" : ""}`} onClick={open}>
          Masalı aç
        </button>
      )}

      <nav className={`ui${spread ? " show" : ""}`}>
        <button className="arrow" onClick={() => go(spread - 1)} aria-label="Önceki sayfa">‹</button>
        <div className="mid">
          <div className="dots">
            {Array.from({ length: SPREADS }, (_, i) => (
              <button key={i} className={i + 1 === spread ? "on" : ""} onClick={() => go(i + 1)} aria-label={`${i + 1}. sayfa`} />
            ))}
          </div>
          <p className="hint">
            {last ? "Yakından görmek için bir sayfaya dokun" : "Okumak için sayfaya dokun · çevirmek için kaydır"}
          </p>
        </div>
        {last ? (
          <a className="btn" href={WEDDING.mapsUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
            Yol tarifi al
          </a>
        ) : (
          <button className="arrow" onClick={() => go(spread + 1)} aria-label="Sonraki sayfa">›</button>
        )}
      </nav>

      <div className={`zoom${zoom !== null ? " show" : ""}`} onClick={() => setZoom(null)} aria-hidden={zoom === null}>
        {zoom !== null && <ZoomedPage index={zoom} />}
        {zoom !== null && <button className="zoom-back">← Davetiye</button>}
      </div>
    </>
  );
}
