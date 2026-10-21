// Hidden page (/davetliler) for the couple: add invites, copy/share each
// personal link or QR code, and see who has answered. Protected by the
// admin key from the Apps Script setup (kept on this device only).
import { useEffect, useState } from "react";
import qrcode from "qrcode-generator";
import { apiEnabled, apiPost } from "./api.js";
import { WEDDING } from "./content.js";

const KEY = "davet-yonetici";
const store = {
  get: () => { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } },
  set: (v) => { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch {} },
};

const linkFor = (kod) => `${WEDDING.siteUrl}?d=${kod}`;
const shareText = (g) =>
  `Sevgili ${g.isim}, bir masal başlıyor ve ${g.hitap === "sen" ? "senin de içinde olmanı" : "sizin de içinde olmanızı"} çok istiyoruz 💌\n` +
  `${WEDDING.bride} & ${WEDDING.groom} · ${WEDDING.dateText}\n${linkFor(g.kod)}`;

function Qr({ text }) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return (
    <svg className="adm-qr" viewBox={`-2 -2 ${n + 4} ${n + 4}`} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#2c1d10" />
    </svg>
  );
}

function Status({ g }) {
  if (g.katilim === "Evet") return <span className="st yes">Geliyor · {g.kisi} kişi</span>;
  if (g.katilim === "Hayır") return <span className="st no">Gelemiyor</span>;
  return <span className="st wait">Yanıt bekleniyor</span>;
}

export default function Admin() {
  const [key, setKey] = useState(store.get());
  const [keyInput, setKeyInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null); // code with QR shown
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ tur: "aile", isim: "", max: 4, plusOne: false, hitap: "siz", not: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    document.title = "Davetliler · Fatma & Uğur";
    return () => meta.remove();
  }, []);

  const load = async (k = key) => {
    if (!k) return;
    setError("");
    try {
      const r = await apiPost({ action: "guests", key: k });
      if (r.error) {
        if (r.error === "yetkisiz") { store.set(""); setKey(""); }
        setError(r.error === "yetkisiz" ? "Anahtar yanlış." : r.error);
        return;
      }
      setData(r);
    } catch {
      setError("Bağlanılamadı. İnternetinizi ve API adresini kontrol edin.");
    }
  };
  useEffect(() => { load(); }, [key]);

  const login = (e) => {
    e.preventDefault();
    const k = keyInput.trim();
    store.set(k);
    setKey(k);
  };

  const add = async (e) => {
    e.preventDefault();
    const isim = form.isim.trim();
    if (!isim) return;
    const dup = data?.guests.find((g) => g.isim.toLocaleLowerCase("tr") === isim.toLocaleLowerCase("tr"));
    if (dup && !confirm(`"${dup.isim}" zaten listede. Yine de eklensin mi?`)) return;
    setBusy(true);
    const max = form.tur === "aile" ? form.max : form.plusOne ? 2 : 1;
    const r = await apiPost({ action: "addGuest", key, tur: form.tur, isim, max, hitap: form.hitap, not: form.not }).catch(() => ({ error: "bağlantı" }));
    setBusy(false);
    if (r.error) return setError("Eklenemedi: " + r.error);
    setForm({ ...form, isim: "", not: "", plusOne: false });
    setOpen(r.kod);
    load();
  };

  const copy = async (g) => {
    try {
      await navigator.clipboard.writeText(linkFor(g.kod));
      setCopied(g.kod);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      prompt("Linki kopyalayın:", linkFor(g.kod));
    }
  };

  if (!apiEnabled) {
    return (
      <div className="admin"><div className="adm-card">
        <h1>Davetliler</h1>
        <p>Önce Google Sheets bağlantısını kurun ve API adresini <code>src/content.js</code> içindeki <code>api</code> satırına yazın (bkz. <code>apps-script/KURULUM.md</code>).</p>
      </div></div>
    );
  }

  if (!key) {
    return (
      <div className="admin"><form className="adm-card" onSubmit={login}>
        <h1>Davetliler</h1>
        <p>Kurulumda aldığınız yönetici anahtarını girin. Bu cihazda hatırlanır.</p>
        <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="Yönetici anahtarı" autoComplete="off" />
        <button className="adm-btn primary">Giriş</button>
        {error && <p className="adm-err">{error}</p>}
      </form></div>
    );
  }

  const t = data?.totals;
  return (
    <div className="admin">
      <div className="adm-card">
        <div className="adm-head">
          <h1>Davetliler</h1>
          <button className="adm-link" onClick={() => { store.set(""); setKey(""); setData(null); }}>Çıkış</button>
        </div>
        {t && (
          <div className="adm-totals">
            <div><b>{t.davet}</b><small>davet</small></div>
            <div><b>{t.yanit}</b><small>yanıt</small></div>
            <div><b>{t.davet - t.yanit}</b><small>bekleniyor</small></div>
            <div><b>{t.gelecek}</b><small>kişi geliyor</small></div>
          </div>
        )}
        {error && <p className="adm-err">{error}</p>}
      </div>

      <form className="adm-card" onSubmit={add}>
        <h2>Yeni davet</h2>
        <div className="adm-seg">
          {["aile", "kişi"].map((tur) => (
            <button type="button" key={tur} className={form.tur === tur ? "on" : ""}
              onClick={() => setForm({ ...form, tur, hitap: tur === "kişi" ? "sen" : "siz" })}>
              {tur === "aile" ? "Aile" : "Kişi"}
            </button>
          ))}
        </div>
        <input value={form.isim} onChange={(e) => setForm({ ...form, isim: e.target.value })}
          placeholder={form.tur === "aile" ? "Hitap, ör. Yılmaz Ailesi" : "Hitap, ör. Ayşe"} maxLength={60} required />
        {form.tur === "aile" ? (
          <label className="adm-row">En fazla kaç kişi?
            <input type="number" min={1} max={12} value={form.max} onChange={(e) => setForm({ ...form, max: +e.target.value })} />
          </label>
        ) : (
          <label className="adm-row"><input type="checkbox" checked={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.checked })} /> +1 getirebilir</label>
        )}
        <label className="adm-row">Hitap
          <select value={form.hitap} onChange={(e) => setForm({ ...form, hitap: e.target.value })}>
            <option value="sen">sen</option>
            <option value="siz">siz</option>
          </select>
        </label>
        <input value={form.not} onChange={(e) => setForm({ ...form, not: e.target.value })} placeholder="Not (sadece siz görürsünüz)" maxLength={200} />
        <button className="adm-btn primary" disabled={busy}>{busy ? "Ekleniyor…" : "Ekle ve link oluştur"}</button>
      </form>

      <div className="adm-card">
        <h2>Liste</h2>
        {!data && !error && <p>Yükleniyor…</p>}
        {data?.guests.length === 0 && <p>Henüz davet yok.</p>}
        <ul className="adm-list">
          {data?.guests.slice().reverse().map((g) => (
            <li key={g.kod}>
              <div className="adm-who">
                <b>{g.isim}</b>
                <small>{g.tur === "aile" ? `Aile · en fazla ${g.max}` : g.max > 1 ? "Kişi · +1" : "Kişi"} · {g.hitap}</small>
                <Status g={g} />
                {g.gelenler && <small className="adm-names">{g.gelenler}</small>}
              </div>
              <div className="adm-actions">
                <button className="adm-btn" onClick={() => copy(g)}>{copied === g.kod ? "Kopyalandı ✓" : "Linki kopyala"}</button>
                <a className="adm-btn wa" href={`https://wa.me/?text=${encodeURIComponent(shareText(g))}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <button className="adm-btn" onClick={() => setOpen(open === g.kod ? null : g.kod)}>QR</button>
              </div>
              {open === g.kod && (
                <div className="adm-qrbox">
                  <Qr text={linkFor(g.kod)} />
                  <code>{linkFor(g.kod)}</code>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
