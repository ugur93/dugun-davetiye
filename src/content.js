// Davetiyedeki tüm yazılar burada. Metinleri buradan değiştirebilirsiniz.

export const WEDDING = {
  bride: "Fatma",
  groom: "Uğur",
  dateText: "4 Temmuz 2027 Pazar",
  timeText: "Saat: 19.00", // TODO: saati netleştirin
  venue: "Seyirtepe · Saklıvadi Bahçe",
  city: "İzmir",
  address: "Postacılar Mah. 7368/5 Sk. No: 15/D, Bayraklı / İzmir",
  venueUrl: "https://seyirtepedugun.com/saklivadi-bahce/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Seyirtepe Düğün, 7368/5 Sk. No:15/D, Postacılar, Bayraklı, İzmir"),
  // public/ klasöründeki ilk bulunan dosya çalar: kendi şarkınızı muzik.mp3 olarak koyun
  music: ["muzik.mp3"],
  // Ses efektleri (public/ içinde). Dosya yoksa sayfalar sessizce çevrilir.
  sfx: { flip: "resimler/sayfa-cevirme.m4a", cover: "resimler/kapak-acilma.m4a" },
  musicStart: 8.5, // şarkının ilk 8,5 saniyesi çok sessiz: kitap açılınca buradan başlar
  cover: "resimler/kapak.jpg", // kapağın ortasındaki resim
  paper: "resimler/sayfa.jpg", // yatay parşömen: sol yarısı sol sayfaya, sağ yarısı sağ sayfaya (yoksa kodla çizilen kâğıt)
  // Hareketli arka plan videoları (public/ içinde). Yoksa çizilmiş mum ışıklı masa görünür.
  backgroundVideo: { wide: "resimler/arka-plan.mp4", tall: "resimler/arka-plan-dikey.mp4" },
  event: "Düğün törenimizde", // davetiye sayfasındaki süslü başlık
  siteUrl: "https://ugur93.github.io/dugun-davetiye/", // QR kod bu adrese gider
  // Aile isimlerini yazarsanız davetiyede çiftin isimleri yerine bunlar çıkar, ör.
  // families: [{ parents: "Ayşe & Ali", surname: "YILMAZ" }, { parents: "Zehra & Mehmet", surname: "DEMİR" }],
  families: null,
  // Geri sayım ve "Takvime ekle" için (saat değişirse burayı da güncelleyin)
  dateISO: "2027-07-04T19:00:00+03:00",
  durationHours: 6,
  // Katılım bildirimi bu WhatsApp numarasına gelir, ör. "905551112233" (boşsa buton gizlenir)
  whatsapp: "",
  // Kişiye özel link: …/dugun-davetiye/?misafir=Ayşe%20Teyze → "Sevgili Ayşe Teyze"
  guest: new URLSearchParams(window.location.search).get("misafir")?.trim().slice(0, 40) || "",
};

// Anı sayfasındaki fotoğraflar (public/resimler/ içinde)
export const MEMORIES = [
  { src: "resimler/ani-1.jpg", caption: "Çiçekli sokaklarda" },
  { src: "resimler/ani-2.jpg", caption: "Rüzgârlı kıyılarda" },
];

// Masalın sayfaları. Her sayfada bir resim (public/resimler/…) ya da
// resim yoksa kodla çizilmiş bir sahne (scene) ve metin var.
export const STORY = [
  {
    scene: "swamp",
    image: "resimler/1-bataklik.jpg", // yoksa kodla çizilen sahne görünür
    title: "Bir varmış, bir yokmuş…",
    text:
      "Uzak, çok uzak diyarlarda, dağınık saçlı, kocaman gülüşlü bir delikanlı yaşarmış. Adı Uğur’muş. Şapkasını ters takar, kulübesinin önündeki gölün sessizliğini pek severmiş. Ama kalbinin bir köşesi hep bir masal beklermiş.",
  },
  {
    scene: "garden",
    image: "resimler/2-bahce.jpg", // yoksa kodla çizilen sahne görünür
    title: "Çiçekli bahçenin prensesi",
    text:
      "Aynı diyarın bir başka köşesinde, kıvırcık saçları rüzgârda dans eden, gülüşü güneşi kıskandıran bir prenses varmış: Fatma. Begonvilli duvarların arasında dolaşır, masalların bir gün gerçek olacağına inanırmış.",
  },
  {
    scene: "meet",
    image: "resimler/3-tanisma.jpg", // yoksa kodla çizilen sahne görünür
    title: "Kader yolları kesiştirince",
    text:
      "Bir gün kader, ikisinin yolunu aynı patikada buluşturmuş. Delikanlı, prensesi görünce bütün yolları unutmuş; prenses ise bu kocaman gülüşün ardındaki kalbin, gülüşünden bile büyük olduğunu anlamış.",
  },
  {
    scene: "sea",
    image: "resimler/4-deniz.jpg", // yoksa kodla çizilen sahne görünür
    title: "Denizler ve maceralar",
    text:
      "Birlikte denizler görmüşler, rüzgârlı kıyılarda saçlarını dağıtmışlar, gün batımlarını tek tek saymışlar. Her macera, masallarına yeni bir sayfa eklemiş. Sonunda bir gün delikanlı dizinin üstüne çökmüş ve o soruyu sormuş; prenses gülümseyerek “Evet!” demiş.",
  },
  {
    scene: "royal",
    image: "resimler/5-kral-kralice.jpg", // yoksa kodla çizilen sahne görünür
    // Hareketli versiyon: resimler/5-kral-kralice.mp4 (ya da .webm / .gif) koyarsanız resmin yerine o oynar
    video: "resimler/5-kral-kralice.mp4",
    finale: true, // "Ve Sonsuza Kadar Mutlu Yaşadılar." başlığı + QR kod
  },
];
