# OkForm 🏹

OkForm, Türkiye'deki okçuların olimpik yay parçalarını seçip görsel bir yay önizlemesinde deneyebildiği, satıcı ürün sayfalarına bağlanan açık kaynaklı bir prototiptir.

## Mevcut özellikler

- Fare veya dokunmatik hareketle döndürülebilen Three.js 3D yay önizlemesi
- Gövde, kanatlar, nişangâh, kiriş ve stabilizer takımını ayrı ayrı gösterme/gizleme
- Navek'ten 10 gövde, 7 kanat, 5 nişangâh, 4 uzun rod, 4 kısa rod, 3 V-bar ve 5 kiriş seçeneği
- Uzun ve kısa rod boyunu 3D önizlemede değiştirme
- 66, 68 ve 70 inç yay boyu seçimi; gövde ölçüsüne göre simetrik kanat boyu hesabı
- mm cinsinden model ölçüleri ve sağ/sol el nişangâh konumu
- Navek sepet PDF'sini sürükleyip bırakma, satırları tanıma ve desteklenen parçaları 3D modele ekleme
- Eğrisel kanatlar, gövde/kabza, montaj vidaları, ayarlı nişangâh, kiriş ve ön/yan rod takımı için detaylı parametrik geometri
- PDF'den gelen stabilizer, V-bar, ok yatağı, basınç düğmesi, clicker ve arpacık için şematik aksesuar geometrileri
- PDF ürün satırlarını listeleme; model dışı çanta ve ayaklıkları yay geometrisine zorla eklememe
- Navek'ten tüm ana yay ve denge takımı kategorileri; her seçenek ürün sayfasına bağlıdır
- Görsel renk denemeleri (satıcının sunduğu renk seçenekleri oldukları iddia edilmez)
- Bilgi eksik olduğunda “doğrulanamadı” diyen uyumluluk göstergesi
- Ürün seçimi, fiyat toplamı ve bağlantı paylaşımı

## Çalıştırma

Node.js 20 veya üzeri ile:

```sh
npm start
```

Ardından `http://127.0.0.1:4173` adresini aç. Kontroller:

```sh
npm test
```

## İnternette kullanma

Bu depo, GitHub Actions ile GitHub Pages'e otomatik yayınlanacak şekilde ayarlanmıştır. `main` dalına gönderilen değişiklikler testlerden geçince siteye aktarılır. Yayın adresi: https://tahap0l.github.io/okculuk-alisveris-model/ . İlk yayının hazırlanması birkaç dakika sürebilir.

## Katalog doğruluğu

Ürünler ve görünen fiyatlar 10 Ekim 2026 tarihinde Navek'in herkese açık ürün sayfalarından kontrol edildi. Fiyat ve stok değişebilir; sepete geçmeden önce ürün sayfasını kontrol et. Bazı ürün sayfalarında bağlantı standardı veya beden varyantı belirtilmediği için model bunları tahmin ederek uyum onayı vermez. Mor tonlu renkler yalnızca **görsel önizlemedir**. Rod uzunluğu seçimi geometriyi değiştirir; mağaza varyantı veya fiyatı olduğunu iddia etmez.

## Model kapsamı

3D sahne gövde, kanatlar, nişangâh ve kirişi ayrı parametrik geometrilerle oluşturur. Yay boyu ve gövde seçimi modelin mm ölçülerine yansır. Bu geometri üretici CAD modeli değildir: ürünlerin tam biçimini, üretici toleranslarını veya mekanik uyumunu garanti etmez. Doğrulanmış teknik çizimler eklendiğinde ürün bazında daha doğru modellere geçilebilir. Renkler satıcı varyantı değil, görsel önizlemedir.

Sepet PDF'si PDF.js ile yalnızca kullanıcının tarayıcısında okunur; dosyanın kendisi sunucuya gönderilmez. Ürün satırları, adetleri ve fiyatları ekranda listelenir. Gövde/kanat/nişangâh gibi desteklenen satırlar ilgili yaklaşık geometriyle gösterilir; modelden çıkarılabilir veya yeniden sürükleyerek sahneye eklenebilir. Çanta ve yay ayağı gibi yay üzerine takılmayan ürünler listelenir ama yaya bağlanmış gibi çizilmez. PDF metni olmayan tarama dosyaları henüz desteklenmez.

## Katkı

Doğrulanmış ürün ölçüleri, renk seçenekleri ve CAD dosyaları için issue açabilir veya pull request gönderebilirsin.

## Lisans

Henüz seçilmedi. Resmî lisans eklenene kadar yeniden kullanım koşulları belirlenmemiştir.
