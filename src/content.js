// Davetiyedeki tüm yazılar burada. Metinleri buradan değiştirebilirsiniz.

export const WEDDING = {
  bride: "Fatma",
  groom: "Uğur",
  dateText: "4 Temmuz 2027 Pazar",
  timeText: "Saat: 19.00", // TODO: saati netleştirin
  venue: "Seyirtepe · Saklıvadi Bahçe",
  city: "İzmir",
  venueUrl: "https://seyirtepedugun.com/saklivadi-bahce/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Seyirtepe Düğün Saklıvadi Bahçe İzmir"),
  // public/ klasöründeki ilk bulunan dosya çalar: kendi şarkınızı muzik.mp3 olarak koyun
  music: ["muzik.mp3", "muzik.m4a"],
  cover: "resimler/kapak.jpg", // kapağın ortasındaki resim
};

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
      "Birlikte denizler görmüşler, rüzgârlı kıyılarda saçlarını dağıtmışlar, gün batımlarını tek tek saymışlar. Her macera, masallarına yeni bir sayfa eklemiş.",
  },
  {
    scene: "royal",
    image: "resimler/5-kral-kralice.jpg", // yoksa kodla çizilen sahne görünür
    title: "…ve sonsuza kadar",
    text:
      "Sonunda delikanlı dizinin üstüne çökmüş ve o soruyu sormuş. Prenses gülümseyerek “Evet!” demiş. Ve sonsuza kadar mutlu yaşamaya karar vermişler.",
  },
];
