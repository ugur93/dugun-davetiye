import { useEffect, useRef, useState } from "react";
import { PAGES } from "./Pages.jsx";
import { WEDDING } from "../content.js";

export const SPREADS = PAGES.length / 2;

function Cover() {
  return (
    <div className="face cover-front">
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

function PageFace({ index, side, back, visible, onZoom }) {
  const Content = PAGES[index];
  return (
    <div
      className={`face page ${side}${back ? " back" : ""}`}
      onClick={(e) => {
        if (!visible) return;
        e.stopPropagation();
        onZoom(index);
      }}
    >
      <Content />
      <i className="turn-shade" />
    </div>
  );
}

/**
 * spread: 0 = closed, 1..SPREADS = open at that spread.
 * Leaf 0 is the cover (front) with page 0 on its back; leaf i carries
 * page 2i-1 on its front and page 2i on its back. The last right page is fixed.
 */
export default function Book({ spread, onOpen, onZoom }) {
  const leaves = Array.from({ length: SPREADS }, (_, i) => i);
  const leftVisible = spread ? 2 * (spread - 1) : -1;
  const rightVisible = spread ? leftVisible + 1 : -1;
  const lastPage = PAGES.length - 1;

  // Leaves that are mid-turn get a moving shadow so the page looks curved.
  const prev = useRef(spread);
  const [turning, setTurning] = useState([]);
  useEffect(() => {
    const a = Math.min(prev.current, spread), b = Math.max(prev.current, spread);
    prev.current = spread;
    if (a === b) return;
    setTurning(Array.from({ length: b - a }, (_, k) => a + k));
    const t = setTimeout(() => setTurning([]), 1800);
    return () => clearTimeout(t);
  }, [spread]);

  return (
    <div className={`book${spread ? " open" : ""}`}>
      <div className="shadow" />
      <div className="page-right" style={{ transform: "translateZ(1px)" }}>
        <PageFace index={lastPage} side="right" visible={rightVisible === lastPage} onZoom={onZoom} />
      </div>
      {leaves.map((i) => {
        const flipped = i < spread;
        const z = flipped ? (i + 1) * 2 + 1 : (SPREADS - i) * 2 + 1;
        return (
          <div
            key={i}
            className={`leaf${i === 0 ? " cover" : ""}${turning.includes(i) ? (i < spread ? " turning fwd" : " turning back") : ""}`}
            style={{ transform: `translateZ(${z}px) rotateY(${flipped ? -180 : 0}deg)` }}
            onClick={i === 0 && !spread ? onOpen : undefined}
          >
            {i === 0 ? (
              <Cover />
            ) : (
              <PageFace index={2 * i - 1} side="right" visible={rightVisible === 2 * i - 1} onZoom={onZoom} />
            )}
            <PageFace index={2 * i} side="left" back visible={leftVisible === 2 * i} onZoom={onZoom} />
          </div>
        );
      })}
    </div>
  );
}

export function ZoomedPage({ index }) {
  const Content = PAGES[index];
  return (
    <div className={`page ${index % 2 ? "right" : "left"}`}>
      <Content />
    </div>
  );
}
