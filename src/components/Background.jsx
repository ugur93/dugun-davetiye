// The table the book lies on: plain dark wood with a soft vignette, or an
// optional looping video (WEDDING.backgroundVideo).
import { useEffect, useState } from "react";
import { WEDDING } from "../content.js";

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
    </div>
  );
}
