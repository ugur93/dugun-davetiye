import { useEffect, useState } from "react";
import { WEDDING } from "../content.js";
import { apiEnabled, apiPost } from "../api.js";
import { refreshGuest, useGuest } from "../guest.js";

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
  return { start, end, title: `${WEDDING.bride} & ${WEDDING.groom} Düğünü`, place: `${WEDDING.venue}, ${WEDDING.address}` };
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

/* ---------- RSVP ---------- */
// With a personal link (?d=code) and the Apps Script API, answers go to the
// Google Sheet; otherwise the old WhatsApp message form is used (if a number is set).
export const openRsvp = () => window.dispatchEvent(new Event("rsvp:open"));
export const rsvpAvailable = (g) => (apiEnabled && !!g.info) || !!WEDDING.whatsapp;

export function Rsvp() {
  const g = useGuest();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("rsvp:open", on);
    return () => window.removeEventListener("rsvp:open", on);
  }, []);
  if (!open) return null;
  const close = () => setOpen(false);
  return (
    <div className="modal" onClick={close}>
      {apiEnabled && g.info ? <SheetRsvp guest={g.info} close={close} /> : <WhatsAppRsvp close={close} />}
    </div>
  );
}

function SheetRsvp({ guest, close }) {
  const sen = guest.hitap === "sen";
  const family = guest.tur === "aile";
  const prev = guest.yanit;
  const prevNames = prev?.gelenler ? prev.gelenler.split(",").map((x) => x.trim()) : [];

  const [coming, setComing] = useState(prev ? prev.katilim === "Evet" : true);
  const [count, setCount] = useState(Math.min(Math.max(prev?.kisi || (family ? guest.max : 1), 1), guest.max));
  const [names, setNames] = useState(prevNames);
  const [plusOne, setPlusOne] = useState(!family && (prev?.kisi || 0) > 1);
  const [plusName, setPlusName] = useState(!family ? prevNames[0] || "" : "");
  const [note, setNote] = useState(prev?.mesaj || "");
  const [allow, setAllow] = useState(prev ? prev.izin : true);
  const [status, setStatus] = useState("form"); // form | sending | done | error

  const t = (senText, sizText) => (sen ? senText : sizText);

  const send = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const kisi = !coming ? 0 : family ? count : plusOne ? 2 : 1;
    const gelenler = !coming ? "" : family ? names.slice(0, count).map((n) => n.trim()).filter(Boolean).join(", ") : plusOne ? plusName.trim() : "";
    try {
      const r = await apiPost({ action: "rsvp", code: guest.kod, katilim: coming ? "Evet" : "Hayır", kisi, gelenler, mesaj: note.trim(), izin: allow });
      if (r.error) throw new Error(r.error);
      setStatus("done");
      refreshGuest();
      if (coming) confetti();
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rsvp" onClick={(e) => e.stopPropagation()}>
        <h3>Teşekkür ederiz!</h3>
        <p className="rsvp-sub">
          {coming
            ? t("Masalın en sıcak köşesinde yerin hazır; seni görmek için sabırsızlanıyoruz.", "Masalın en sıcak köşesinde yeriniz hazır; sizi görmek için sabırsızlanıyoruz.")
            : t("Yokluğun hissedilecek; o gece bir mumu da senin için yakacağız.", "Yokluğunuz hissedilecek; o gece bir mumu da sizin için yakacağız.")}
        </p>
        <p className="rsvp-note">{t("Yanıtını bu linkle istediğin zaman değiştirebilirsin.", "Yanıtınızı bu linkle istediğiniz zaman değiştirebilirsiniz.")}</p>
        <button className="send" type="button" onClick={close}>Davetiyeye dön</button>
      </div>
    );
  }

  return (
    <form className="rsvp" onClick={(e) => e.stopPropagation()} onSubmit={send}>
      <h3>Katılım bildirimi</h3>
      <p className="rsvp-sub">Sevgili {guest.isim}{prev ? t(", yanıtını güncelleyebilirsin", ", yanıtınızı güncelleyebilirsiniz") : ""}</p>

      <div className="choice">
        <button type="button" className={coming ? "on" : ""} onClick={() => setComing(true)}>
          {family ? "Katılıyoruz" : "Katılıyorum"}
        </button>
        <button type="button" className={!coming ? "on" : ""} onClick={() => setComing(false)}>
          {family ? "Katılamıyoruz" : "Katılamıyorum"}
        </button>
      </div>

      {coming && family && (
        <>
          <label>
            Kaç kişi geliyorsunuz?
            <div className="stepper">
              <button type="button" onClick={() => setCount(Math.max(1, count - 1))}>−</button>
              <b>{count}</b>
              <button type="button" onClick={() => setCount(Math.min(guest.max, count + 1))}>+</button>
              <span className="max">en fazla {guest.max}</span>
            </div>
          </label>
          <label>
            Gelenlerin isimleri <i>(isteğe bağlı)</i>
            <div className="names">
              {Array.from({ length: count }, (_, i) => (
                <input
                  key={i}
                  value={names[i] || ""}
                  maxLength={40}
                  placeholder={`${i + 1}. kişi`}
                  onChange={(e) => setNames(Object.assign([...names], { [i]: e.target.value }))}
                />
              ))}
            </div>
          </label>
        </>
      )}

      {coming && !family && guest.max > 1 && (
        <>
          <label className="check">
            <input type="checkbox" checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} />
            +1 ile geleceğim
          </label>
          {plusOne && (
            <label>
              +1'in adı <i>(isteğe bağlı)</i>
              <input value={plusName} maxLength={40} onChange={(e) => setPlusName(e.target.value)} placeholder="Ad Soyad" />
            </label>
          )}
        </>
      )}

      <label>
        {t("Bize bir dilek bırak", "Bize bir dilek bırakın")} <i>(isteğe bağlı)</i>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} placeholder="Dilekler, anılar, güzel sözler…" />
      </label>
      {note.trim() && (
        <label className="check small">
          <input type="checkbox" checked={allow} onChange={(e) => setAllow(e.target.checked)} />
          Mesajım, Fatma ile Uğur'un onayıyla davetiyedeki Dilek Defteri'nde gösterilebilir
        </label>
      )}

      <button className="send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Gönderiliyor…" : prev ? "Yanıtı güncelle" : "Gönder"}
      </button>
      {status === "error" && <p className="rsvp-error">Gönderilemedi, lütfen biraz sonra tekrar deneyin.</p>}
      <button className="close" type="button" onClick={close} aria-label="Kapat">×</button>
    </form>
  );
}

function WhatsAppRsvp({ close }) {
  const [name, setName] = useState(WEDDING.guest);
  const [coming, setComing] = useState(true);
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");

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
    close();
  };

  return (
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
      <button className="close" type="button" onClick={close} aria-label="Kapat">×</button>
    </form>
  );
}
