import { useEffect, useRef } from "react";
import { PageFlip } from "page-flip";
import { PAGES } from "./Pages.jsx";
import { WEDDING } from "../content.js";
import { coverCreak, pageFlip, unlockSfx } from "../sound.js";

export const SPREADS = PAGES.length / 2;

// page-flip indices: 0 = cover, then PAGES[i] is page i + 1, so spread n
// shows pages 2n-1 (left) and 2n (right); the last index is the back cover.
const indexToSpread = (i) => (i === 0 ? 0 : Math.min(Math.ceil(i / 2), SPREADS));
const spreadToIndex = (s) => (s ? 2 * s - 1 : 0);

function Cover() {
  return (
    <div className="cover-front">
      <div className="emboss" />
      <div className="cover-text">
        <svg className="orn" viewBox="0 0 120 16" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M2 8h44M74 8h44" /><path d="M60 2l6 6-6 6-6-6z" />
          <circle cx="50" cy="8" r="1.6" fill="currentColor" /><circle cx="70" cy="8" r="1.6" fill="currentColor" />
        </svg>
        <h1>{WEDDING.bride}<em>&amp;</em>{WEDDING.groom}</h1>
        {WEDDING.cover && (
          <div className="plate">
            <img src={import.meta.env.BASE_URL + WEDDING.cover} alt="" draggable="false" />
          </div>
        )}
        <p>Bir varmış, bir yokmuş…</p>
        <svg className="orn" viewBox="0 0 120 16" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginTop: "2cqw" }}>
          <path d="M2 8c20 0 28-6 40-6s14 6 18 6 6-6 18-6 20 6 40 6" />
        </svg>
      </div>
    </div>
  );
}

/**
 * A real page-curl book (page-flip). Pages can be dragged by their corners
 * or turned via the `spread` prop (0 = closed, 1..SPREADS = open spread).
 * A short tap opens the cover, or zooms the tapped page when open.
 */
export default function Book({ spread, zoomed, onOpen, onZoom, onUnzoom, onSwipe, onFlip }) {
  const host = useRef(null);
  const root = useRef(null);
  const pf = useRef(null);
  const latest = useRef({});
  latest.current = { spread, zoomed, onOpen, onZoom, onUnzoom, onSwipe, onFlip };

  // While zoomed in on a page, swipes move between pages instead of
  // dragging page corners: keep page-flip from seeing the presses.
  useEffect(() => {
    const el = root.current;
    const block = (e) => latest.current.zoomed && e.stopPropagation();
    ["mousedown", "touchstart"].forEach((ev) => el.addEventListener(ev, block, true));
    return () => ["mousedown", "touchstart"].forEach((ev) => el.removeEventListener(ev, block, true));
  }, []);

  useEffect(() => {
    // page-flip moves the page nodes into its own wrapper, so it is created
    // once and kept for the life of the page (React StrictMode runs effects twice).
    if (pf.current) return;
    const book = new PageFlip(host.current, {
      width: 600,
      height: 800,
      size: "stretch",
      minWidth: 80,
      maxWidth: 1200,
      minHeight: 106,
      maxHeight: 1600,
      showCover: true,
      usePortrait: false,
      drawShadow: true,
      maxShadowOpacity: 0.55,
      flippingTime: 1100,
      disableFlipByClick: true, // taps open the zoom instead
      mobileScrollSupport: false,
      showPageCorners: true,
      startPage: spreadToIndex(latest.current.spread),
    });
    book.loadFromHTML(host.current.querySelectorAll(".pf-page"));
    book.on("changeState", (e) => {
      if (e.data !== "flipping") return;
      book.getCurrentPageIndex() === 0 ? coverCreak() : pageFlip();
    });
    book.on("flip", (e) => latest.current.onFlip(indexToSpread(e.data)));
    pf.current = book;
  }, []);

  // Route changes (buttons, keys, back button) turn the pages.
  useEffect(() => {
    const book = pf.current;
    if (!book) return;
    if (indexToSpread(book.getCurrentPageIndex()) !== spread) book.flip(spreadToIndex(spread), "top");
  }, [spread]);

  // A tap opens the book or zooms in on the tapped page; when zoomed, a tap
  // zooms back out and a horizontal swipe moves to the next/previous page.
  const down = useRef(null);
  const onPointerDown = (e) => {
    unlockSfx(); // a drag can open the book too
    down.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onPointerUp = (e) => {
    const d = down.current;
    down.current = null;
    if (!d) return;
    const L = latest.current;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (L.zoomed && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) return L.onSwipe(dx < 0 ? 1 : -1);
    if (Math.hypot(dx, dy) > 8 || Date.now() - d.t > 500) return;
    if (e.target.closest("a, button")) return;
    if (L.zoomed) return L.onUnzoom();
    const { spread: s, onOpen: open, onZoom: zoom } = L;
    if (!s) return open();
    if (pf.current?.getState() !== "read") return;
    const r = host.current.getBoundingClientRect();
    const right = e.clientX > r.left + r.width / 2;
    zoom(2 * (s - 1) + (right ? 1 : 0));
  };

  return (
    <div className={`book${spread ? " open" : ""}`} ref={root}>
      <div className="shadow" />
      <div className="flip-host" ref={host} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="pf-page" data-density="hard"><Cover /></div>
        {PAGES.map((Content, i) => (
          <div className="pf-page" key={i}>
            <div className={`page ${i % 2 ? "right" : "left"}`}><Content /></div>
          </div>
        ))}
        <div className="pf-page" data-density="hard">
          <div className="cover-front back-cover">
            <div className="emboss" />
            <div className="cover-text"><p>…ve sonsuza kadar<br />mutlu yaşadılar.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
