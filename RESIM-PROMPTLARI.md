# Davetiye resimleri için AI promptları

Her resim için **ChatGPT (GPT-4o / görsel oluşturma)** ya da **Gemini**'de yeni bir sohbet açın.
**İki fotoğrafınızı da ekleyin** (IMG_3393 ve IMG_3338), sonra aşağıdaki **ORTAK STİL** metnini
ve ardından o sahnenin metnini tek mesaj olarak yapıştırın.

Çıkan resmi indirip **tam olarak belirtilen isimle** `public/resimler/` klasörüne koyun.
Site o sahne için kodla çizilen resmi otomatik olarak sizinkiyle değiştirir.

İpuçları:
- Yüzler benzemezse: "Make the faces look more like the people in the photos, keep the same style" yazın.
- Arka plan krem değil de beyaz ya da desenli çıkarsa: "Make the background a plain flat cream parchment color, nothing else" yazın.
- Resmin içinde yazı çıkarsa: "Remove all text and letters" yazın.
- Beş resmi aynı sohbette sırayla üretirseniz stil daha tutarlı olur.

---

## ORTAK STİL (her mesajın başına yapıştırın)

```
Create an illustration of the two people in the attached photos, in the style of a
medieval illuminated manuscript / fairy-tale storybook page: gouache and watercolor
with fine dark-brown ink outlines, flat decorative shapes, soft paper texture.
Palette: lapis blue, vermilion red, leaf green, cream, and gold accents.
Typical motifs: gold fleur-de-lis patterns on fabric, white ermine with black tails,
stylized swirling clouds, wavy pale-turquoise sea lines, tulip and vine flourishes,
little blue swallows.

The man: short dark-brown messy wavy hair, short dark beard and moustache, warm
dark eyes, big friendly smile. The woman: voluminous dark-brown curly shoulder-length
hair, warm brown eyes, round soft face, sweet smile. Keep both clearly recognizable
from the photos, cute and flattering, in the illustrated style (not photorealistic).

IMPORTANT: plain flat cream parchment background (#F5EBD2) with no border, no frame,
no page edges, and absolutely no text or letters. Landscape 3:2 format, full figures
standing on the ground, composition centered with some empty cream space around.
```

---

## 1. `1-bataklik.png`: "Bir varmış, bir yokmuş…" (yalnızca Uğur)

```
Scene: ONLY the man (no woman). He is dressed as a simple medieval villager in a
brown tunic with a belt over a cream shirt, wearing a black baseball cap backwards.
He stands happily in front of a small thatched-roof cottage beside a calm pond with
cattails and reeds, the sea and soft hills in the distance, two blue swallows in the sky.
```

## 2. `2-bahce.png`: "Çiçekli bahçenin prensesi" (yalnızca Fatma)

```
Scene: ONLY the woman (no man). She is a princess in a red medieval gown with a
white trimmed neckline and delicate gold floral patterns, a small gold tiara in her
curly hair. She stands in a garden in front of a white wall covered with pink
bougainvillea, a dark wrought-iron gate behind her, flower beds at her feet,
one blue swallow nearby.
```

## 3. `3-tanisma.png`: "Kader yolları kesiştirince"

```
Scene: the man (brown villager tunic, no cap) and the woman (red princess gown,
small tiara) meeting for the first time on a winding path between rolling green
hills. They face each other and smile shyly, almost holding hands; a small red
heart floats between them. A round golden sun, two stylized trees with red flowers,
blue swallows.
```

## 4. `4-deniz.png`: "Denizler ve maceralar"

```
Scene: the two of them hugging cheek to cheek on rocks by the sea, windswept hair,
she wears a red dress, he wears a dark tunic. Calm grey-blue sea drawn with
stylized wave lines, soft mountains on the horizon, a warm sunset sun, a tiny
sailboat, stylized swirling clouds, two swallows.
```

## 5. `5-kral-kralice.png`: "…ve sonsuza kadar"

```
Scene: the two of them as a king and queen, standing close, embracing and holding
hands, smiling. He wears a long royal blue robe covered with gold fleur-de-lis, a
white ermine cape with black tails, and a gold crown. She wears a flowing red and
cream gown with gold and green floral embroidery and a small gold crown on her curly
hair. Behind them: a stylized pale-turquoise sea with wavy lines and swirling clouds,
tulip vines rising on both sides, a blue swallow flying on each side.
```

---

### İsteğe bağlı: kapak

Kapağın da referanstaki gibi gerçek bir deri kitap fotoğrafı olmasını isterseniz:

```
Top-down photo of an old worn brown leather book cover, embossed rectangular frame,
gold-stamped serif text "Fatma & Uğur" and below it in italic "Bir varmış, bir yokmuş…",
scuffed edges, soft warm light, cover fills the whole image, portrait 3:4.
```
`kapak.png` olarak `public/resimler/` klasörüne koyun ve bana haber verin, ben bağlarım.

---

## Hareketli son sayfa: `5-kral-kralice.mp4`

**Araç:** Resimden video üreten bir araç, ör. Kling, Runway (Gen-4), Luma Dream Machine, Google Veo (Gemini) ya da Sora.
**Başlangıç resmi:** `public/resimler/5-kral-kralice.jpg` (kenarları kırpılmış hali; sayfadaki kadrajla birebir aynı olur).
**Ayarlar:** 5 saniye, aynı en-boy oranı, kamera sabit, mümkünse "loop / seamless loop" açık.

```
Animate this illustration as a gentle, seamless looping cinemagraph. Keep the exact
same storybook illuminated-manuscript style, colors, faces and composition. The camera
is completely still: no zoom, no pan, no cuts.

Motion only:
- A soft sea breeze: the woman's long dark curly hair and the man's wavy hair sway
  gently and naturally in the wind; the hem of her gown and the edge of his ermine
  cape flutter slightly.
- The pale turquoise sea behind them ripples with slow, calm waves; the stylized
  swirl clouds drift very slightly.
- The tulip vines on both sides sway a little in the breeze.
- The couple stay in place, holding hands; they breathe softly, maybe a tiny smile
  and one slow blink. No walking, no turning, no new objects.

Subtle, calm, romantic, slow motion. The last frame must match the first frame so it
loops perfectly. No text.
```

İpuçları:
- Yüzler bozulursa: "keep the faces exactly as in the original image" ekleyin ve hareketi azaltın.
- Kuşları sitedeki animasyon zaten uçuruyor; videoda kuş istemiyorsanız "the two birds stay still" ekleyin.
- Çıkan videoyu **`5-kral-kralice.mp4`** adıyla `public/resimler/` klasörüne koyun. 2–4 MB'tan büyükse söyleyin, küçültürüm.
- GIF de olur: adı `5-kral-kralice.gif` olsun ve `src/content.js` içindeki `video:` satırını `.gif` yapın.

---

## Hareketli arka plan: `arka-plan.mp4` (yatay) ve `arka-plan-dikey.mp4` (telefon)

Kitap kodla çiziliyor ve videonun **ortasına** oturuyor. Bu yüzden videonun ortası **boş bir masa yüzeyi** olmalı, kitap ya da kâğıt olmamalı.

**Araç:** Kling, Runway (Gen-4), Luma, Google Veo ya da Sora.
Önce görsel üretip sonra "resimden video" yapmak daha tutarlı sonuç verir.

**1. adım: görsel** (ChatGPT / Gemini / Midjourney). İki boyut üretin: 16:9 yatay ve 9:16 dikey.

```
Cinematic top-down photograph looking straight down at an old dark walnut wooden
table at night, lit only by warm candlelight. The CENTER of the table is completely
empty and clear (a large empty area where a book will be placed later), softly lit
by a warm pool of golden light.

Around the edges of the frame, slightly out of focus (shallow depth of field):
- two or three lit ivory pillar candles in brass holders with dripping wax (top left, top right)
- a small bouquet of dark red and blush roses with a few loose petals scattered on the wood
- a vintage brass key, a feather quill in a glass inkwell, a red wax seal stick
- a sprig of olive leaves and a little dried lavender
- soft warm fairy-light bokeh in the dark background

Mood: cozy, romantic, fairy-tale, intimate, warm amber and deep brown tones, rich
shadows, film-like grain, photorealistic. No people, no text, no book, no paper in the
center.
```

**2. adım: video** (aynı görseli başlangıç karesi olarak verin, 8–10 saniye, kamera sabit, loop):

```
Turn this image into a seamless looping cinemagraph. The camera is completely still,
top-down, no zoom, no pan, no cuts. Keep the empty center of the table empty.

Motion only:
- the candle flames flicker gently and the warm light on the table breathes softly
- a thin wisp of smoke curls up from one candle now and then
- the fairy-light bokeh in the background twinkles slowly
- tiny golden dust motes drift through the candlelight
- one rose petal very slowly settles on the table

Calm, cozy, romantic, slow. The last frame must match the first frame for a perfect
loop. No text, no people.
```

Kaydetme:
- Yatay video → **`public/arka-plan.mp4`** (bilgisayar ve tablet)
- Dikey video → **`public/arka-plan-dikey.mp4`** (telefon)
- Sadece biri olursa o her yerde kullanılır. Videolar 5 MB'tan büyükse söyleyin, küçültürüm.

---

## Gerçekçi sayfa kâğıdı: `sayfa.jpg`

Sayfalardaki yazılar, süslemeler ve resimler kodla üstüne yerleşiyor. Bu görsel yalnızca **boş kâğıdın kendisi**. İçinde yazı ya da süs olmamalı, kenar kenara kâğıt olmalı.

**Araç:** ChatGPT / Gemini / Midjourney. **Format:** dikey 3:4 (ör. 1536×2048).

```
Flat, evenly lit top-down scan of a single blank sheet of antique parchment paper,
filling the entire frame edge to edge (no background, no table, no visible page
border). Warm cream and light honey color, slightly darker and more yellowed toward
the edges. Subtle natural aging: fine paper fibres, faint tea-colored stains, a few
tiny foxing spots, very soft creases, gentle uneven tone like a 500-year-old book
page. Realistic, high resolution, photographic texture.

Absolutely empty: no text, no letters, no drawings, no ornaments, no borders, no
shadows from objects. The middle must stay light and even so dark text stays
readable on it.
```

İpuçları:
- Ortası çok koyu ya da lekeli çıkarsa: "make the center lighter and cleaner" yazın.
- Kâğıdın kenarında masa ya da gölge görünürse: "the paper must fill the whole image edge to edge" yazın.
- Kaydedin: **`public/resimler/sayfa.jpg`**. Site bunu otomatik olarak bütün sayfalarda kullanır, kodla çizilen kâğıdı devre dışı bırakır.

### Telefon için dikey arka plan videosu
Yatay `arka-plan.mp4` telefonda kenarlarından kırpılıyor, mumlar ve güller ekrandan çıkıyor. Aynı promptla **9:16 dikey** bir versiyon üretip `public/arka-plan-dikey.mp4` olarak koyarsanız telefonda o kullanılır.

---

## Ses efektleri: `sayfa-cevirme.mp3` ve `kapak-acilma.mp3`

**Araç:** [ElevenLabs Sound Effects](https://elevenlabs.io/sound-effects) (yazıdan ses üretir, ücretsiz denemesi var) ya da Stable Audio.
Her prompttan birkaç versiyon üretip en doğal olanı seçin.

**1. Sayfa çevirme** (süre: ~1 saniye)

```
A single page of thick, old parchment paper being turned slowly in an antique book.
Soft papery whoosh with a gentle crinkle at the end as the page settles. Close-up,
intimate, quiet room, dry with only a tiny natural room tone. No music, no voices,
no background noise.
```

**2. Kapak açılması** (süre: ~1,5 saniye)

```
An old heavy leather-bound book being opened: the stiff leather spine creaks softly,
the thick cover swings open and lands with a dull, soft thud on a wooden table,
followed by a faint rustle of the first pages. Close-up, quiet candle-lit room,
warm and intimate. No music, no voices.
```

Ayarlar ve kaydetme:
- ElevenLabs'te "Duration" değerini elle 1 sn ve 1,5 sn yapın, "Prompt influence" değerini yükseltin.
- Başta ya da sonda sessizlik varsa kırpın; ses hemen başlamalı.
- **`public/resimler/sayfa-cevirme.mp3`** ve **`public/resimler/kapak-acilma.mp3`** adlarıyla kaydedin.
- Site sesi her çevirmede biraz farklı perdede çalar, böylece hep aynı ses gibi duyulmaz.

Hazır ve ücretsiz ses isterseniz [Pixabay Sound Effects](https://pixabay.com/sound-effects/search/page%20turn/) sitesinde "page turn" ve "book open" aramalarında telifsiz sesler var.

---

## Harita sayfası: `harita.jpg`

Kitapta "Masal diyarının haritası" sayfasında görünür. Görsel gelene kadar kodla çizilmiş basit bir harita duruyor.
**Kare (1:1)** üretin. Yapay zekâ Türkçe yazıları bozduğu için **yazısız** isteyin.

```
A hand-painted medieval fairy-tale treasure map in the same illuminated-manuscript
storybook style as the other illustrations (gouache and watercolor, fine dark ink
outlines, lapis blue, vermilion red, leaf green and gold accents), on aged cream
parchment with soft edges.

Show a stylized bay of the sea (the Gulf of İzmir) curving from the left side into
the middle, with little wave lines and a small sailing ship. Around the bay: tiny
clusters of red-roofed houses on the shores, rolling green hills and small mountains.
On a hilltop at the far east (right) end of the bay stands a small fairy-tale castle
with red and blue turrets and a fluttering flag. A red dotted path winds from the
houses by the shore up the hill to the castle. A decorative compass rose in one
corner, a few blue swallows, a tiny playful sea serpent in the water, tulip and vine
flourishes in the corners.

No text, no letters, no labels, no border frame. Square format.
```

Kaydedin: **`public/resimler/harita.jpg`**

---

## Bağlantı önizlemesi (WhatsApp vb.): `onizleme.jpg`

Bunu ben hazırladım (masa videosundan bir kare ve deri kapak). Kendiniz daha güzelini yaparsanız
**1200×630** boyutunda **`public/onizleme.jpg`** olarak kaydedin. Önemli olan her şeyin ortada olması:
WhatsApp bazen görselin kenarlarını kırpar.

---

## Sade arka plan (eşyasız): `arka-plan.mp4` / `arka-plan-dikey.mp4`

Mumlar, güller ve eşyalar fazla geldiyse: sadece sıcak ışıkta koyu ahşap bir masa, ilk haldeki gibi.
Aynı iki adım: önce görsel (16:9 yatay ve 9:16 dikey), sonra o görselden video.

**1. Görsel**
```
Top-down photograph of a plain, dark walnut wooden table surface at night, filling the
whole frame. Nothing on the table: no objects, no candles, no flowers, no paper.
A soft warm pool of golden candlelight falls on the centre of the table from out of
frame, gently fading into deep brown shadows towards the edges (natural vignette).
Subtle wood grain and a few fine scratches, very slight film grain. A few tiny,
very soft out-of-focus warm bokeh lights at the top edge only. Calm, cozy, intimate,
minimal. No text, no people.
```

**2. Video** (aynı görsel başlangıç karesi, 8 sn, kamera sabit, loop)
```
Seamless looping cinemagraph of this image. Camera completely still, no zoom, no pan.
Only motion: the warm light on the table flickers very gently as if from a candle
just out of frame, the few bokeh lights at the top twinkle slowly, and a handful of
tiny golden dust motes drift slowly through the light. Very subtle and calm. The
last frame must match the first. No new objects, no text.
```

Kaydedin: **`public/resimler/arka-plan.mp4`** (yatay) ve **`public/resimler/arka-plan-dikey.mp4`** (dikey).
Eski videoları ben `resimler-orijinal/` klasörüne alırım; yenilerini de küçültüp ilk karelerini çıkarırım.

> Video beklemeden hemen sadeleştirmek isterseniz: `src/content.js` içinde `backgroundVideo` satırını
> `backgroundVideo: null,` yapın; kodla çizilen sade ahşap masa ve mum ışığı geri gelir.
