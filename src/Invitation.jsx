import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Book from "./components/Book.jsx";
import { buildPages, mapSpread } from "./components/Pages.jsx";
import { apiEnabled, apiGet } from "./api.js";
import { greetingName, useGuest } from "./guest.js";
import Background, { bgReady } from "./components/Background.jsx";
import { Rsvp } from "./components/Extras.jsx";
import { WEDDING } from "./content.js";
import { setSfxMuted, unlockSfx } from "./sound.js";

// Approved guestbook messages, fetched once while the names intro is showing.
const messagesReady = apiEnabled
  ? Promise.race([
      apiGet("messages").then((m) => (Array.isArray(m) ? m : [])).catch(() => []),
      new Promise((r) => setTimeout(() => r([]), 6000)),
    ])
  : Promise.resolve([]);

const spreadFromPath = (pathname, SPREADS) => {
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
  const guest = useGuest();
  const [messages, setMessages] = useState(null); // null until loaded
  useEffect(() => {
    messagesReady.then(setMessages);
  }, []);
  const pages = useMemo(() => buildPages(messages || []), [messages]);
  const SPREADS = pages.length / 2;
  const MAP_SPREAD = mapSpread(pages); // map (left) + countdown (right)
  const spread = spreadFromPath(pathname, SPREADS);

  // names → book. Deep links go straight to the book.
  const [phase, setPhase] = useState(spread > 0 ? "book" : "names");
  // Tapping a page zooms the book in on it (side 0 = left, 1 = right).
  const [zoomed, setZoomed] = useState(false);
  const [side, setSide] = useState(0);
  const [zoomFit, setZoomFit] = useState({ s: 2, dy: 0 });
  const pendingSide = useRef(null);
  const focusRef = useRef(null);
  const [rotateHint, setRotateHint] = useState(false);
  // "Yer" on the invitation rolls the book to the map; remember where to return.
  const [returnTo, setReturnTo] = useState(null);
  const roll = useRef(null); // { target, dir } while pages are rolling
  const [rolling, setRolling] = useState(false);
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
    Promise.all([minimum, bgReady, messagesReady, img(WEDDING.cover), img(WEDDING.paper)]).then(show);
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

  // Zoom so one page fills the space between the top buttons and the
  // arrows at the bottom, centred in that space.
  const TOP = 64, BOTTOM = 84;
  const measureZoom = () => {
    const el = focusRef.current;
    const w = el?.offsetWidth;
    if (!w) return;
    const h = w / 1.5;
    const s = Math.min((innerWidth * 0.96) / (w / 2), (innerHeight - TOP - BOTTOM - 12) / h);
    const r = el.parentElement.getBoundingClientRect(); // the stage is never zoomed
    const centre = r.top + r.height / 2;
    setZoomFit({ s, dy: (TOP + innerHeight - BOTTOM) / 2 - centre });
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
  // Turn the pages one by one (quickly) until `target` is open.
  const rollTo = (target) => {
    if (target === spread || roll.current) return;
    setZoomed(false);
    roll.current = { target, dir: target > spread ? 1 : -1 };
    setRolling(true);
    go(spread + roll.current.dir);
  };
  const onFlipped = (s) => {
    if (s !== spread) go(s);
    const r = roll.current;
    if (!r) return;
    if (s === r.target) {
      roll.current = null;
      setRolling(false);
    } else setTimeout(() => go(s + r.dir), 80);
  };
  const goToMap = () => {
    if (spread === MAP_SPREAD) return;
    setReturnTo(spread);
    rollTo(MAP_SPREAD);
  };
  const goBack = () => {
    const back = returnTo;
    setReturnTo(null);
    if (back) rollTo(back);
  };
  useEffect(() => {
    addEventListener("goto:map", goToMap);
    return () => removeEventListener("goto:map", goToMap);
  });
  // The "back" shortcut only makes sense while the map spread is open.
  useEffect(() => {
    if (!rolling && returnTo && spread !== MAP_SPREAD) setReturnTo(null);
  }, [spread, rolling]);

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
          {greetingName(guest) && <p className="intro-guest">Sevgili {greetingName(guest)}</p>}
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
            style={zoomed && spread ? { transform: `translateY(${zoomFit.dy}px) scale(${zoomFit.s}) translateX(${side ? -25 : 25}%)` } : undefined}
          >
            <div className={`tilt${spread ? " open" : ""}${zoomed && spread ? " zoomed" : ""}`}>
              {messages && <Book
                pages={pages}
                spread={spread}
                zoomed={zoomed && spread > 0}
                onOpen={open}
                onZoom={zoomTo}
                onUnzoom={() => setZoomed(false)}
                onSwipe={(dir) => (dir > 0 ? next() : prev())}
                fast={rolling}
                onFlip={onFlipped}
              />}
            </div>
          </div>
        </div>
      </main>

      {!spread && (
        <button className={`open-cta${phase === "book" ? " show" : ""}`} onClick={open}>
          Masalı aç
        </button>
      )}

      {/* simple footer: a hint and the directions button; side arrows only for mouse users */}
      <nav className={`ui${spread ? " show" : ""}${zoomed && spread ? " zoomed" : ""}`}>
        <p className="hint">
          {zoomed
            ? "Kaydırarak sayfaları gez · küçültmek için dokun"
            : "Yakından görmek için bir sayfaya dokun"}
        </p>
        {spread === MAP_SPREAD ? (
          <a className="btn" href={WEDDING.mapsUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></svg>
            Yol tarifi al
          </a>
        ) : (
          <button className="btn" onClick={goToMap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.3" /></svg>
            Yol tarifi al
          </button>
        )}
      </nav>
      {spread > 0 && (
        <>
          <button className="arrow side prev" onClick={prev} aria-label="Önceki sayfa">‹</button>
          {!last && <button className="arrow side next" onClick={next} aria-label="Sonraki sayfa">›</button>}
        </>
      )}

      {zoomed && spread > 0 && (
        <button className="unzoom" onClick={() => setZoomed(false)} aria-label="Kitabın tamamını göster">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5M8 10.5h5" />
          </svg>
        </button>
      )}

      {returnTo && spread === MAP_SPREAD && !rolling && (
        <button className="go-back" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6l-6 6 6 6M4 12h16" />
          </svg>
          Kaldığın yere dön
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
