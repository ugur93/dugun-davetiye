// A cosy candle-lit table, shot like a photo with shallow depth of field:
// a warm pool of light under the book, out-of-focus candles and fairy-light
// bokeh behind, blurred roses in the foreground, a few petals on the table
// and dust motes drifting through the light.
import { useEffect, useMemo, useState } from "react";
import { WEDDING } from "../content.js";

function Candle({ className }) {
  return (
    <svg className={className} viewBox="0 0 80 190" aria-hidden="true">
      <defs>
        <radialGradient id="flame" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".45" stopColor="#ffd25a" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wax" x1="0" x2="1">
          <stop offset="0" stopColor="#c9b08a" /><stop offset=".45" stopColor="#f6e6c4" /><stop offset="1" stopColor="#b89c74" />
        </linearGradient>
      </defs>
      <g className="flame">
        <path d="M40 14c-7 12-9 20-6 28 2 5 10 5 12 0 3-8 1-16-6-28z" fill="url(#flame)" />
        <path d="M40 30c-3 5-3 9-1 12 1 1 3 1 3 0 1-3 1-7-2-12z" fill="#fff" opacity=".9" />
      </g>
      <path d="M40 46v10" stroke="#2a1a0e" strokeWidth="1.6" />
      <path d="M22 56h36v134H22z" fill="url(#wax)" />
      <path d="M22 56c4 0 4 16 9 16s2-12 7-12 2 26 7 26 4-30 13-30" fill="#f6e6c4" />
    </svg>
  );
}

function Roses({ className }) {
  const rose = (x, y, s, c) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="20" fill={c} />
      <path d="M-14-6c6-10 22-10 26 2-6-4-14-4-18 2 6-2 12 0 12 6-6-4-12-2-14 4-2-6-6-10-6-14z" fill="#5e0f14" opacity=".55" />
      <path d="M-6 0c2-6 10-8 14-2-4-1-8 0-8 4 3-1 6 0 6 4-4-2-8 0-10 2 0-4-2-6-2-8z" fill="#3d070b" opacity=".6" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 260 200" aria-hidden="true">
      <g fill="#3f5c2c">
        <path d="M60 120c20-40 70-50 90-30-30 0-60 10-90 30z" /><path d="M150 150c10-40 60-60 90-40-30 4-60 20-90 40z" />
        <path d="M100 170c-10-30 20-60 50-50-20 10-36 26-50 50z" />
      </g>
      {rose(90, 100, 1.5, "#8e1b24")}
      {rose(160, 70, 1.25, "#a3232d")}
      {rose(190, 140, 1.15, "#7a1720")}
    </svg>
  );
}

const Petal = ({ style }) => (
  <svg className="petal" style={style} viewBox="0 0 40 30" aria-hidden="true">
    <defs>
      <radialGradient id="pet" cx="35%" cy="40%" r="70%">
        <stop offset="0" stopColor="#c73a46" /><stop offset=".7" stopColor="#8e1b24" /><stop offset="1" stopColor="#5e0f14" />
      </radialGradient>
    </defs>
    <path d="M3 18C4 6 22 0 34 6c5 3 4 10-2 14-9 6-27 9-29-2z" fill="url(#pet)" />
    <path d="M8 16c8-4 16-6 24-6" stroke="#e46a76" strokeWidth="1" opacity=".5" fill="none" />
  </svg>
);

const rand = (a, b) => a + Math.random() * (b - a);

// Resolves once the table video can play (or there is no video to wait for).
let resolveBg;
export const bgReady = new Promise((r) => (resolveBg = r));

// Prefer the portrait video on phones, falling back to the other one.
function pickVideos() {
  const v = WEDDING.backgroundVideo;
  if (!v) return [];
  const tall = matchMedia("(max-aspect-ratio: 4/5)").matches;
  return (tall ? [v.tall, v.wide] : [v.wide, v.tall]).filter(Boolean);
}

export default function Background() {
  const [videos] = useState(pickVideos);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoSrc = videos[videoIndex];
  useEffect(() => {
    if (!videoSrc) resolveBg();
  }, [videoSrc]);
  const { bokeh, motes } = useMemo(
    () => ({
      bokeh: Array.from({ length: 16 }, (_, i) => ({
        key: i,
        left: `${rand(0, 100)}%`,
        top: `${rand(0, 26)}%`,
        size: `${rand(2.5, 7)}vmin`,
        delay: `${-rand(0, 8)}s`,
        dur: `${rand(5, 9)}s`,
      })),
      motes: Array.from({ length: 18 }, (_, i) => ({
        key: i,
        left: `${rand(15, 85)}%`,
        delay: `${-rand(0, 20)}s`,
        dur: `${rand(14, 24)}s`,
        drift: `${rand(-60, 60)}px`,
        size: `${rand(1.5, 3)}px`,
      })),
    }),
    []
  );
  return (
    <div className={`room${videoReady ? " has-video" : ""}`} aria-hidden="true">
      {videoSrc && (
        <video
          key={videoSrc}
          className="bg-video"
          src={import.meta.env.BASE_URL + videoSrc}
          poster={import.meta.env.BASE_URL + videoSrc.replace(/\.mp4$/, "-poster.jpg")}
          autoPlay muted loop playsInline preload="auto"
          onCanPlay={() => {
            setVideoReady(true);
            resolveBg();
          }}
          onError={() => setVideoIndex((i) => i + 1)}
        />
      )}
      <div className="bokeh">
        {bokeh.map((b) => (
          <span key={b.key} style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.dur }} />
        ))}
      </div>
      <div className="candle-glow l" />
      <div className="candle-glow r" />
      <Candle className="far-candle l" />
      <Candle className="far-candle r" />
      <div className="lightpool" />
      <Petal style={{ left: "17%", top: "64%", "--rot": "-25deg", "--s": 1 }} />
      <Petal style={{ left: "21%", top: "72%", "--rot": "40deg", "--s": 0.8 }} />
      <Petal style={{ right: "18%", top: "24%", "--rot": "120deg", "--s": 0.9 }} />
      <Petal style={{ right: "23%", top: "78%", "--rot": "-70deg", "--s": 0.75 }} />
      <div className="motes">
        {motes.map((m) => (
          <span key={m.key} style={{ left: m.left, animationDelay: m.delay, animationDuration: m.dur, "--drift": m.drift, width: m.size, height: m.size }} />
        ))}
      </div>
      <Roses className="near-roses r" />
      <Roses className="near-roses l" />
    </div>
  );
}
