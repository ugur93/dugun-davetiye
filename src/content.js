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
  music: "muzik.mp3", // public/ klasörüne koyun
};

// Masalın sayfaları. Her sayfada bir çizim (scene) ve metin var.
// "drop" ilk harfi süslü kutuya koyar.
export const STORY = [
  {
    scene: "swamp",
    title: "Bir varmış, bir yokmuş…",
    text:
      "Uzak, çok uzak diyarlarda, dağınık saçlı, kocaman gülüşlü bir dev yaşarmış. Adı Uğur’muş. Şapkasını ters takar, bataklığının sessizliğini pek severmiş. Ama kalbinin bir köşesi hep bir masal beklermiş.",
  },
  {
    scene: "garden",
    title: "Çiçekli bahçenin prensesi",
    text:
      "Aynı diyarın bir başka köşesinde, kıvırcık saçları rüzgârda dans eden, gülüşü güneşi kıskandıran bir prenses varmış: Fatma. Begonvilli duvarların arasında dolaşır, masalların bir gün gerçek olacağına inanırmış.",
  },
  {
    scene: "meet",
    title: "Kader yolları kesiştirince",
    text:
      "Bir gün kader, ikisinin yolunu aynı patikada buluşturmuş. Dev, prensesi görünce bataklığını unutmuş; prenses ise devin kalbinin, kocaman cüssesinden bile büyük olduğunu anlamış.",
  },
  {
    scene: "sea",
    title: "Denizler ve maceralar",
    text:
      "Birlikte denizler görmüşler, rüzgârlı kıyılarda saçlarını dağıtmışlar, gün batımlarını tek tek saymışlar. Her macera, masallarına yeni bir sayfa eklemiş.",
  },
  {
    scene: "royal",
    title: "…ve sonsuza kadar",
    text:
      "Sonunda dev dizinin üstüne çökmüş ve o soruyu sormuş. Prenses gülümseyerek “Evet!” demiş. Ve sonsuza kadar mutlu yaşamaya karar vermişler.",
  },
];
