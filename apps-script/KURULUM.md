# Katılım bildirimi ve Dilek Defteri: Google Sheets kurulumu

Bir kez yapılır, yaklaşık 10 dakika sürer. Sonunda iki şey elinizde olacak:
- **API adresi** (`https://script.google.com/macros/s/…/exec`): bana gönderin ya da `src/content.js` içindeki `api: ""` satırına yazın.
- **Yönetici anahtarı**: sadece sizde kalsın; `/davetliler` sayfasına girerken kullanacaksınız.

---

## 1. Sheet'i oluşturun
1. [sheets.new](https://sheets.new) adresine gidin ve boş bir tablo açın.
2. Adını verin, ör. **Fatma & Uğur – Davetiye**.

## 2. Script'i yapıştırın
1. Menüden **Uzantılar → Apps Script**.
2. Açılan editördeki örnek kodun hepsini silin.
3. Bu klasördeki **`Code.gs`** dosyasının tamamını kopyalayıp yapıştırın.
4. 💾 **Kaydet**.

## 3. Kurulumu çalıştırın
1. Üstteki fonksiyon listesinden **`setup`** seçin ve **▶ Çalıştır**'a basın.
2. Google izin isteyecek: **İzinleri incele** → hesabınızı seçin.
   "Google bu uygulamayı doğrulamadı" uyarısı çıkarsa **Gelişmiş → … (güvenli değil) sayfasına git → İzin ver** deyin.
   Bu sizin kendi script'iniz; sadece bu tabloya erişiyor.
3. Alttaki **Yürütme günlüğü**'nde şu satır çıkar:
   `Yönetici anahtarı (/davetliler sayfasında girin): xxxxxxxxxxxxxxxx`
   Bu anahtarı bir yere kaydedin.
4. Tabloya dönün. **Davetliler**, **Yanıtlar** ve **Özet** sekmeleri oluşmuş olmalı.

## 4. Web uygulaması olarak yayınlayın
1. Apps Script editöründe sağ üstten **Dağıt → Yeni dağıtım**.
2. ⚙️ simgesinden tür olarak **Web uygulaması** seçin.
3. Ayarlar:
   - **Yürüten:** Ben
   - **Erişimi olanlar:** Herkes
4. **Dağıt** → çıkan **Web uygulaması URL'sini** kopyalayın (sonu `/exec` ile biter).
5. Bu adresi bana gönderin.

> "Herkes" erişimi sadece script'in izin verdiği işlemler içindir. Tablonun kendisi gizli kalır.
> Ziyaretçiler yalnızca kendi kodlarıyla yanıt gönderebilir ve sadece sizin onayladığınız mesajları görebilir.

---

## Günlük kullanım

### Davetli eklemek ve link göndermek
- Sitede **`/davetliler`** sayfasını açın: https://ugur93.github.io/dugun-davetiye/davetliler
- Yönetici anahtarını bir kez girin; o cihazda hatırlanır.
- **Aile** ya da **Kişi** seçin, hitabı yazın ("Yılmaz Ailesi", "Ayşe") ve en fazla kişi sayısını (aile) veya **+1 getirebilir** seçeneğini (kişi) belirleyin → **Ekle ve link oluştur**.
- Her davetin yanında **Linki kopyala**, **WhatsApp** (hazır mesajla) ve **QR** butonları var.
- İsterseniz davetlileri doğrudan tablodaki **Davetliler** sekmesine de yazabilirsiniz. Kod sütunu benzersiz olmalı (ör. 5 harf/rakam).

### Mesajları onaylamak (Dilek Defteri)
- **Yanıtlar** sekmesinde, mesaj bırakan ve izin veren davetlilerin satırında **Göster** kutusunu işaretleyin.
- **Kitaptaki imza** sütununda adı değiştirebilirsiniz (ör. "Ayşe" → "Ayşe Teyze"). **Mesaj** metnindeki yazım hatalarını da düzeltebilirsiniz.
- Değişiklikler birkaç saniye içinde davetiyede görünür.
- Bir davetli mesajını sonradan değiştirirse onay kendiliğinden kalkar; yeni metni tekrar onaylamanız gerekir.

### Toplamlar
**Özet** sekmesinde: davet sayısı, yanıt veren, gelecek kişi sayısı, yanıt bekleyen ve onay bekleyen mesaj sayısı.

### Script'i güncellemek gerekirse
Yeni `Code.gs`'i yapıştırıp kaydedin → **Dağıt → Dağıtımları yönet** → ✏️ → **Sürüm: Yeni sürüm** → **Dağıt**.
URL aynı kalır; sitede bir şey değiştirmeniz gerekmez.
