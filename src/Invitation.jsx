import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Book, { SPREADS } from "./components/Book.jsx";
import Background, { bgReady } from "./components/Background.jsx";
import { Rsvp } from "./components/Extras.jsx";
import { WEDDING } from "./content.js";
import { setSfxMuted, unlockSfx } from "./sound.js";

const spreadFromPath = (pathname) => {
  const m = pathname.match(/^\/sayfa\/(\d+)/);
  return m ? Math.min(Math.max(+m[1], 1), SPREADS) : 0;
};

// Gentle fade-in so the music doesn't start abruptly.
function fadeIn(a, ms = 1500) {
  const t0 = Date.now();
  const id = setInterval(() => {
    a.volume = Math.max(0, Math.min(1, (Date.now() - t0) / ms));
    if (a.volume >= 1 || a.paused) clearInterval(id);
  }, 50);
}

export default function Invitation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const spread = spreadFromPath(pathname);

  // names → book. Deep links go straight to the book.
  const [phase, setPhase] = useState(spread > 0 ? "book" : "names");
  // Tapping a page zooms the book in on it (side 0 = left, 1 = right).
  const [zoomed, setZoomed] = useState(false);
  const [side, setSide] = useState(0);
  const [zoomScale, setZoomScale] = useState(2);
  const pendingSide = useRef(null);
  const focusRef = useRef(null);
  const [rotateHint, setRotateHint] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const audio = useRef(null);
  const userMuted = useRef(false);

  // The names stay on screen while the cover, paper and table video load
  // (at least 3 s, at most 7 s), so the book appears without popping in.
  useEffect(() => {
    if (phase !== "names") return;
    let done = false;
    const show = () => !done && (done = true, setPhase("book"));
    const img = (file) => new Promise((r) => {
      if (!file) return r();
      const i = new Image();
      i.onload = i.onerror = r;
      i.src = import.meta.env.BASE_URL + file;
    });
    const minimum = new Promise((r) => setTimeout(r, 3000));
    Promise.all([minimum, bgReady, img(WEDDING.cover), img(WEDDING.paper)]).then(show);
    const cap = setTimeout(show, 7000);
    return () => {
      done = true;
      clearTimeout(cap);
    };
  }, [phase]);

  // Music starts as soon as the book opens, however it was opened.
  const prevSpread = useRef(spread);
  useEffect(() => {
    const before = prevSpread.current;
    prevSpread.current = spread;
    if (before === spread) return;
    if (before === 0) startMusic(); // the first page just opened
    if (!spread) setZoomed(false);
    // while zoomed, turning forward shows the new left page, back the right page
    setSide(pendingSide.current ?? (spread > before ? 0 : 1));
    pendingSide.current = null;
  }, [spread]);

  // First time the book opens on a portrait phone, suggest turning it sideways.
  useEffect(() => {
    if (!spread || !matchMedia("(max-aspect-ratio: 4/5) and (max-width: 600px)").matches) return;
    try {
      if (sessionStorage.getItem("rotateHint")) return;
      sessionStorage.setItem("rotateHint", "1");
    } catch {}
    const show = setTimeout(() => setRotateHint(true), 1600);
    const hide = setTimeout(() => setRotateHint(false), 7000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [spread > 0]);

  // How far to zoom so one page fills the screen.
  const measureZoom = () => {
    const w = focusRef.current?.offsetWidth;
    if (!w) return;
    setZoomScale(Math.min((innerWidth * 0.96) / (w / 2), (innerHeight * 0.84) / (w / 1.5)));
  };
  useEffect(() => {
    if (!zoomed) return;
    addEventListener("resize", measureZoom);
    return () => removeEventListener("resize", measureZoom);
  }, [zoomed]);
  const zoomTo = (pageIndex) => {
    measureZoom();
    setSide(pageIndex % 2);
    setZoomed(true);
    setRotateHint(false);
  };

  // Opened straight on a page (e.g. a /sayfa/1 link)? Browsers only allow
  // sound after a tap, so start the music on the first interaction.
  useEffect(() => {
    if (!spread) return;
    const events = ["pointerdown", "touchend", "keydown"];
    const off = () => events.forEach((ev) => document.removeEventListener(ev, onTap, true));
    function onTap(e) {
      if (e.target.closest?.(".music")) return off(); // the music button decides itself
      unlockSfx();
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
    unlockSfx();
    startMusic(); // called inside the tap itself, which iOS Safari requires
    go(1);
  };
  // While zoomed, step page by page; otherwise spread by spread.
  const next = () => {
    if (!spread) return open();
    if (zoomed && side === 0) return setSide(1);
    if (zoomed) pendingSide.current = 0;
    go(spread + 1);
  };
  const prev = () => {
    if (zoomed && side === 1) return setSide(0);
    if (zoomed) pendingSide.current = 1;
    go(spread - 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setZoomed(false);
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


  const last = spread === SPREADS && (!zoomed || side === 1);

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
        loop
        onTimeUpdate={(e) => {
          // the native loop restarts at 0:00; skip the quiet intro again
          const a = e.currentTarget;
          if (!a.paused && a.currentTime < WEDDING.musicStart - 0.5) a.currentTime = WEDDING.musicStart;
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

      <main>
        <div className={`stage${phase === "book" ? " show" : ""}`}>
          <div
            ref={focusRef}
            className="focus"
            style={zoomed && spread ? { transform: `scale(${zoomScale}) translateX(${side ? -25 : 25}%)` } : undefined}
          >
            <div className={`tilt${spread ? " open" : ""}${zoomed && spread ? " zoomed" : ""}`}>
              <Book
                spread={spread}
                zoomed={zoomed && spread > 0}
                onOpen={open}
                onZoom={zoomTo}
                onUnzoom={() => setZoomed(false)}
                onSwipe={(dir) => (dir > 0 ? next() : prev())}
                onFlip={(s) => s !== spread && go(s)}
              />
            </div>
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
            {zoomed
              ? "Kaydırarak sayfaları gez · küçültmek için dokun"
              : "Büyütmek için sayfaya dokun · çevirmek için kaydır"}
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

      {zoomed && spread > 0 && (
        <button className="unzoom" onClick={() => setZoomed(false)} aria-label="Kitabın tamamını göster">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5M8 10.5h5" />
          </svg>
        </button>
      )}

      <div className={`rotate-hint${rotateHint ? " show" : ""}`} onClick={() => setRotateHint(false)}>
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
          <rect x="15" y="6" width="18" height="32" rx="3.5" />
          <path d="M22 33h4" strokeLinecap="round" />
          <path d="M38 22a14 14 0 0 1-10 17" strokeLinecap="round" />
          <path d="M25 36l3 3-3 3" strokeLinecap="round" />
        </svg>
        <span>Kitabı daha büyük görmek için telefonu yan çevirin</span>
      </div>

      <Rsvp />
    </>
  );
}
