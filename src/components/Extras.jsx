import { useEffect, useState } from "react";
import { WEDDING } from "../content.js";
import { sealCrack } from "../sound.js";

/* ---------- wax-sealed envelope intro ---------- */
export function Envelope({ show, onOpened }) {
  const [state, setState] = useState("closed"); // closed → opening → gone
  const open = () => {
    if (state !== "closed") return;
    sealCrack();
    setState("opening");
    setTimeout(() => { setState("gone"); onOpened(); }, 1900);
  };
  if (state === "gone") return null;
  return (
    <div className={`envelope-wrap${show ? " show" : ""} ${state}`} onClick={open}>
      <div className="envelope">
        <div className="env-back" />
        <div className="letter">
          {WEDDING.guest && <small>Sevgili {WEDDING.guest},</small>}
          <b>{WEDDING.bride} &amp; {WEDDING.groom}</b>
          <span>masalımıza davetlisiniz</span>
        </div>
        <div className="env-front" />
        <div className="env-flap" />
        <div className="wax">{WEDDING.bride[0]}&amp;{WEDDING.groom[0]}</div>
      </div>
      <p className="env-hint">Mührü kırmak için dokun</p>
    </div>
  );
}

/* ---------- confetti ---------- */
const COLORS = ["#e3c27a", "#b8352c", "#24459a", "#1f7a45", "#fbf3dc", "#f0a3b5"];
export function confetti(count = 110) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.createElement("div");
  box.className = "confetti";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    p.style.left = 50 + (Math.random() - 0.5) * 30 + "%";
    p.style.background = COLORS[i % COLORS.length];
    p.style.setProperty("--x", (Math.random() - 0.5) * 120 + "vw");
    p.style.setProperty("--y", 40 + Math.random() * 70 + "vh");
    p.style.setProperty("--r", Math.random() * 900 - 450 + "deg");
    p.style.animationDelay = Math.random() * 0.25 + "s";
    p.style.animationDuration = 2.2 + Math.random() * 1.6 + "s";
    if (i % 3 === 0) p.style.borderRadius = "50%";
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4500);
}

/* ---------- countdown ---------- */
export function Countdown() {
  const target = new Date(WEDDING.dateISO).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((target - now) / 1000));
  const parts = [
    [Math.floor(s / 86400), "gün"],
    [Math.floor((s % 86400) / 3600), "saat"],
    [Math.floor((s % 3600) / 60), "dakika"],
    [s % 60, "saniye"],
  ];
  return (
    <div className="countdown">
      {parts.map(([n, l]) => (
        <div key={l}><b>{n}</b><small>{l}</small></div>
      ))}
    </div>
  );
}

/* ---------- calendar ---------- */
const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
function eventTimes() {
  const start = new Date(WEDDING.dateISO);
  const end = new Date(start.getTime() + WEDDING.durationHours * 3600e3);
  return { start, end, title: `${WEDDING.bride} & ${WEDDING.groom} Düğünü`, place: `${WEDDING.venue}, ${WEDDING.city}` };
}
export function googleCalendarUrl() {
  const { start, end, title, place } = eventTimes();
  const q = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${stamp(start)}/${stamp(end)}`, location: place, details: WEDDING.siteUrl });
  return "https://calendar.google.com/calendar/render?" + q;
}
export function downloadIcs() {
  const { start, end, title, place } = eventTimes();
  const esc = (t) => t.replace(/[,;\\]/g, (m) => "\\" + m);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//dugun-davetiye//TR", "BEGIN:VEVENT",
    `UID:${start.getTime()}@dugun-davetiye`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(place)}`, `URL:${WEDDING.siteUrl}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${esc(title)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  a.download = "dugun.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- RSVP via WhatsApp ---------- */
export const openRsvp = () => window.dispatchEvent(new Event("rsvp:open"));

export function Rsvp() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(WEDDING.guest);
  const [coming, setComing] = useState(true);
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("rsvp:open", on);
    return () => window.removeEventListener("rsvp:open", on);
  }, []);
  if (!open) return null;

  const send = (e) => {
    e.preventDefault();
    const lines = [
      `${WEDDING.bride} & ${WEDDING.groom} düğünü – katılım bildirimi`,
      `İsim: ${name.trim()}`,
      coming ? `Katılıyorum 🎉 (${count} kişi)` : "Maalesef katılamıyorum 💌",
      note.trim() && `Not: ${note.trim()}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${WEDDING.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    if (coming) confetti();
    setOpen(false);
  };

  return (
    <div className="modal" onClick={() => setOpen(false)}>
      <form className="rsvp" onClick={(e) => e.stopPropagation()} onSubmit={send}>
        <h3>Katılım bildirimi</h3>
        <label>
          Adınız
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} placeholder="Ad Soyad" />
        </label>
        <div className="choice">
          <button type="button" className={coming ? "on" : ""} onClick={() => setComing(true)}>Katılıyorum</button>
          <button type="button" className={!coming ? "on" : ""} onClick={() => setComing(false)}>Katılamıyorum</button>
        </div>
        {coming && (
          <label>
            Kaç kişi?
            <div className="stepper">
              <button type="button" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
              <b>{count}</b>
              <button type="button" onClick={() => setCount(Math.min(10, count + 1))}>+</button>
            </div>
          </label>
        )}
        <label>
          Notunuz (isteğe bağlı)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} />
        </label>
        <button className="send" type="submit">WhatsApp ile gönder</button>
        <button className="close" type="button" onClick={() => setOpen(false)} aria-label="Kapat">×</button>
      </form>
    </div>
  );
}
