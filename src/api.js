// Talks to the Google Apps Script web app (apps-script/Code.gs).
// POST bodies are sent as text/plain so the browser does not send a CORS
// preflight, which Apps Script cannot answer; the script parses the JSON.
import { WEDDING } from "./content.js";

// For local testing: ?mock in the URL (dev server only) uses an in-memory API.
const useMock = import.meta.env.DEV && new URLSearchParams(location.search).has("mock");

export const apiEnabled = useMock || !!WEDDING.api;

export async function apiGet(action, params = {}) {
  if (useMock) return mock.get(action, params);
  const q = new URLSearchParams({ action, ...params });
  const r = await fetch(`${WEDDING.api}?${q}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

export async function apiPost(body) {
  if (useMock) return mock.post(body);
  const r = await fetch(WEDDING.api, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

/* ---------- in-memory stand-in with the same behaviour as Code.gs ---------- */
const mock = (() => {
  const guests = [
    { kod: "aile1", tur: "aile", isim: "Yılmaz Ailesi", max: 4, hitap: "siz" },
    { kod: "kisi1", tur: "kişi", isim: "Ayşe", max: 1, hitap: "sen" },
    { kod: "kisi2", tur: "kişi", isim: "Mehmet", max: 2, hitap: "sen" },
  ];
  const answers = {};
  const approved = [
    { isim: "Ayşe Teyze", mesaj: "Masalınız hiç bitmesin, her sayfası bir öncekinden güzel olsun. Sizi çok seviyoruz!" },
    { isim: "Can & Elif", mesaj: "Bataklıktan saraya uzanan bu yolculukta hep yanınızdayız. Nice mutlu yıllara!" },
    { isim: "Dedemler", mesaj: "Allah bir yastıkta kocatsın. Gözümüz aydın!" },
    { isim: "Zeynep", mesaj: "Fatma'nın kahkahası ve Uğur'un gülüşü bir araya gelince ortaya bu güzel masal çıktı. ❤" },
  ];
  const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 300));
  const find = (code) => guests.find((g) => g.kod === String(code || "").toLowerCase());
  return {
    get(action, p) {
      if (action === "messages") return wait(approved);
      if (action === "guest") {
        const g = find(p.code);
        return wait(g ? { ...g, yanit: answers[g.kod] || null } : { error: "bilinmeyen kod" });
      }
      return wait({ error: "bilinmeyen istek" });
    },
    post(d) {
      if (d.action === "rsvp") {
        const g = find(d.code);
        if (!g) return wait({ error: "bilinmeyen kod" });
        const evet = d.katilim === "Evet";
        answers[g.kod] = {
          katilim: evet ? "Evet" : "Hayır", kisi: evet ? Math.min(Math.max(+d.kisi || 1, 1), g.max) : 0,
          gelenler: evet ? d.gelenler || "" : "", mesaj: d.mesaj || "", izin: !!d.izin,
        };
        return wait({ ok: true });
      }
      if (d.key !== "test") return wait({ error: "yetkisiz" });
      if (d.action === "guests") {
        const list = guests.map((g) => ({ ...g, ...(answers[g.kod] || { katilim: "", kisi: 0, gelenler: "", mesaj: "" }) }));
        const gelecek = list.reduce((n, g) => n + (g.katilim === "Evet" ? g.kisi : 0), 0);
        return wait({ guests: list, totals: { davet: list.length, yanit: list.filter((g) => g.katilim).length, gelecek } });
      }
      if (d.action === "addGuest") {
        const kod = Math.random().toString(36).slice(2, 7);
        const tur = d.tur === "kişi" ? "kişi" : "aile";
        guests.push({ kod, tur, isim: d.isim, max: +d.max || 1, hitap: d.hitap || (tur === "kişi" ? "sen" : "siz") });
        return wait({ ok: true, kod });
      }
      return wait({ error: "bilinmeyen istek" });
    },
  };
})();
