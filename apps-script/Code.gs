/**
 * Fatma & Uğur – davetiye API'si (Google Apps Script web uygulaması).
 *
 * Sheet sekmeleri (setup() bunları oluşturur):
 *   Davetliler: Kod | Tür | İsim | Max kişi | Hitap | Not
 *   Yanıtlar:   Kod | Tür | İsim | Katılım | Kişi | Gelenler | Mesaj | Mesaj izni | Göster | Kitaptaki imza | Tarih
 *   Özet:       toplamlar (formüller)
 *
 * Herkese açık uçlar:
 *   GET  ?action=messages          → onaylanmış mesajlar [{isim, mesaj}]
 *   GET  ?action=guest&code=xxxx   → davetli bilgisi + varsa önceki yanıtı
 *   POST {action:"rsvp", code, katilim, kisi, gelenler, mesaj, izin}
 * Yönetici uçları (ADMIN_KEY gerekir):
 *   POST {action:"guests", key}                    → davetli listesi + yanıtlar + toplamlar
 *   POST {action:"addGuest", key, tur, isim, max, hitap}
 */

const GUESTS = "Davetliler";
const ANSWERS = "Yanıtlar";
const SUMMARY = "Özet";
const G = { kod: 0, tur: 1, isim: 2, max: 3, hitap: 4, not: 5 };
const A = { kod: 0, tur: 1, isim: 2, katilim: 3, kisi: 4, gelenler: 5, mesaj: 6, izin: 7, goster: 8, imza: 9, tarih: 10 };
const CODE_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const MESSAGES_CACHE = "messages";

/* ---------- one-time setup: run this once from the editor ---------- */
function setup() {
  const ss = SpreadsheetApp.getActive();
  const sheet = (name, headers) => {
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (headers && sh.getLastRow() === 0) {
      sh.appendRow(headers);
      sh.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3e6c4");
      sh.setFrozenRows(1);
    }
    return sh;
  };
  sheet(GUESTS, ["Kod", "Tür", "İsim", "Max kişi", "Hitap", "Not"]);
  const answers = sheet(ANSWERS, ["Kod", "Tür", "İsim", "Katılım", "Kişi", "Gelenler", "Mesaj", "Mesaj izni", "Göster", "Kitaptaki imza", "Tarih"]);
  answers.getRange("I2:I").insertCheckboxes();

  const sum = sheet(SUMMARY);
  sum.clear();
  sum.getRange("A1:B6").setValues([
    ["Davet sayısı", `=COUNTA(${GUESTS}!A2:A)`],
    ["Yanıt veren", `=COUNTA(${ANSWERS}!A2:A)`],
    ["Gelecek kişi", `=SUMIF(${ANSWERS}!D2:D,"Evet",${ANSWERS}!E2:E)`],
    ["Gelemeyecek davet", `=COUNTIF(${ANSWERS}!D2:D,"Hayır")`],
    ["Yanıt bekleniyor", "=B1-B2"],
    ["Onay bekleyen mesaj", `=COUNTIFS(${ANSWERS}!G2:G,"<>",${ANSWERS}!H2:H,TRUE,${ANSWERS}!I2:I,FALSE)`],
  ]);
  sum.getRange("A1:A6").setFontWeight("bold");

  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty("ADMIN_KEY")) props.setProperty("ADMIN_KEY", randomCode(16));
  console.log("Yönetici anahtarı (/davetliler sayfasında girin): " + props.getProperty("ADMIN_KEY"));
}

/* ---------- web app ---------- */
function doGet(e) {
  const p = e.parameter || {};
  if (p.action === "messages") return json(messages());
  if (p.action === "guest") return json(guestInfo(p.code) || { error: "bilinmeyen kod" });
  return json({ error: "bilinmeyen istek" });
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ error: "geçersiz istek" });
  }
  if (d.action === "rsvp") return json(rsvp(d));
  if (d.action === "guests" || d.action === "addGuest") {
    if (!isAdmin(d.key)) return json({ error: "yetkisiz" });
    return json(d.action === "guests" ? listGuests() : addGuest(d));
  }
  return json({ error: "bilinmeyen istek" });
}

// Approving a message (ticking "Göster") or editing a signature shows up right away.
function onEdit() {
  CacheService.getScriptCache().remove(MESSAGES_CACHE);
}

/* ---------- public ---------- */
function messages() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get(MESSAGES_CACHE);
  if (hit) return JSON.parse(hit);
  const out = rows(ANSWERS)
    .filter((r) => r[A.goster] === true && r[A.izin] === true && String(r[A.mesaj]).trim())
    .sort((a, b) => new Date(a[A.tarih]) - new Date(b[A.tarih]))
    .map((r) => ({ isim: String(r[A.imza] || r[A.isim]), mesaj: String(r[A.mesaj]) }));
  cache.put(MESSAGES_CACHE, JSON.stringify(out), 300);
  return out;
}

function guestInfo(code) {
  const g = findGuest(code);
  if (!g) return null;
  const a = rows(ANSWERS).find((r) => r[A.kod] === g.kod);
  return {
    kod: g.kod, tur: g.tur, isim: g.isim, max: g.max, hitap: g.hitap,
    yanit: a ? {
      katilim: a[A.katilim], kisi: Number(a[A.kisi]) || 0, gelenler: String(a[A.gelenler] || ""),
      mesaj: String(a[A.mesaj] || ""), izin: a[A.izin] === true,
    } : null,
  };
}

function rsvp(d) {
  const g = findGuest(d.code);
  if (!g) return { error: "bilinmeyen kod" };
  const evet = d.katilim === "Evet";
  const kisi = evet ? clamp(parseInt(d.kisi, 10) || 1, 1, g.max) : 0;
  const gelenler = evet ? clean(d.gelenler, 300) : "";
  const mesaj = clean(d.mesaj, 500);
  const izin = d.izin === true;

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(ANSWERS);
    const data = sh.getDataRange().getValues();
    const i = data.findIndex((r, n) => n > 0 && r[A.kod] === g.kod);
    if (i > 0) {
      const old = data[i];
      const changed = String(old[A.mesaj]) !== mesaj || !izin;
      sh.getRange(i + 1, 1, 1, 11).setValues([[
        g.kod, g.tur, g.isim, evet ? "Evet" : "Hayır", kisi, gelenler, mesaj, izin,
        changed ? false : old[A.goster] === true, // an edited message needs approval again
        old[A.imza] || g.isim, new Date(),
      ]]);
    } else {
      sh.appendRow([g.kod, g.tur, g.isim, evet ? "Evet" : "Hayır", kisi, gelenler, mesaj, izin, false, g.isim, new Date()]);
      sh.getRange(sh.getLastRow(), A.goster + 1).insertCheckboxes();
    }
  } finally {
    lock.releaseLock();
  }
  CacheService.getScriptCache().remove(MESSAGES_CACHE);
  return { ok: true };
}

/* ---------- admin ---------- */
function isAdmin(key) {
  const real = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  return !!real && key === real;
}

function listGuests() {
  const answers = {};
  rows(ANSWERS).forEach((r) => (answers[r[A.kod]] = r));
  const guests = rows(GUESTS).filter((r) => r[G.kod]).map((r) => {
    const a = answers[r[G.kod]];
    return {
      kod: r[G.kod], tur: r[G.tur], isim: r[G.isim], max: Number(r[G.max]) || 1, hitap: r[G.hitap],
      katilim: a ? a[A.katilim] : "", kisi: a ? Number(a[A.kisi]) || 0 : 0,
      gelenler: a ? String(a[A.gelenler] || "") : "", mesaj: a ? String(a[A.mesaj] || "") : "",
    };
  });
  const coming = guests.reduce((n, g) => n + (g.katilim === "Evet" ? g.kisi : 0), 0);
  return { guests, totals: { davet: guests.length, yanit: guests.filter((g) => g.katilim).length, gelecek: coming } };
}

function addGuest(d) {
  const tur = d.tur === "kişi" ? "kişi" : "aile";
  const isim = clean(d.isim, 60);
  if (!isim) return { error: "isim gerekli" };
  const max = clamp(parseInt(d.max, 10) || (tur === "aile" ? 4 : 1), 1, 12);
  const hitap = d.hitap === "sen" || d.hitap === "siz" ? d.hitap : tur === "kişi" ? "sen" : "siz";
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const taken = new Set(rows(GUESTS).map((r) => r[G.kod]));
    let kod;
    do kod = randomCode(5); while (taken.has(kod));
    SpreadsheetApp.getActive().getSheetByName(GUESTS).appendRow([kod, tur, isim, max, hitap, clean(d.not, 200)]);
    return { ok: true, kod };
  } finally {
    lock.releaseLock();
  }
}

/* ---------- helpers ---------- */
function rows(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  return sh ? sh.getDataRange().getValues().slice(1) : [];
}

function findGuest(code) {
  const kod = String(code || "").trim().toLowerCase();
  if (!kod) return null;
  const r = rows(GUESTS).find((x) => String(x[G.kod]).toLowerCase() === kod);
  if (!r) return null;
  const tur = r[G.tur] === "kişi" ? "kişi" : "aile";
  return {
    kod: r[G.kod], tur, isim: String(r[G.isim]),
    max: clamp(Number(r[G.max]) || 1, 1, 12),
    hitap: r[G.hitap] === "sen" || r[G.hitap] === "siz" ? r[G.hitap] : tur === "kişi" ? "sen" : "siz",
  };
}

// Plain text only, trimmed, and never starting like a spreadsheet formula.
function clean(v, max) {
  const s = String(v == null ? "" : v).replace(/[\u0000-\u0008\u000b-\u001f]/g, "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function randomCode(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
