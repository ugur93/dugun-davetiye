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
