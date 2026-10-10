# OkForm 🏹

OkForm, Türkiye'deki okçuların olimpik yay parçalarını seçip görsel bir yay önizlemesinde deneyebildiği, satıcı ürün sayfalarına bağlanan açık kaynaklı bir prototiptir.

## Mevcut özellikler

- Fare veya dokunmatik hareketle döndürülebilen Three.js 3D yay önizlemesi
- Gövde, kanatlar, nişangâh ve kirişi ayrı ayrı gösterme/gizleme
- 66, 68 ve 70 inç yay boyu seçimi; gövde ölçüsüne göre simetrik kanat boyu hesabı
- mm cinsinden model ölçüleri ve sağ/sol el nişangâh konumu
- Navek'ten gövde, kanat ve nişangâh ürünleri; ürün sayfası bağlantıları ve kontrol edilen fiyatlar
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

Ürünler ve fiyatlar 10 Ekim 2026 tarihinde Navek'in herkese açık ürün sayfalarından kontrol edildi. Fiyatlar değişebilir. Ürün sayfalarının görünür içeriğinde satıcı renk varyantları ve bazı gövde/kanat bağlantı standartları doğrulanamadığından uygulama mor tonlu renkleri yalnızca **görsel önizleme** olarak sunar ve belirsiz bağlantı uyumunu onaylamaz. Kiriş kategorisi bağlantısı var; ürün varyantı ve fiyatı henüz katalogda doğrulanmadı.

## Model kapsamı

3D sahne gövde, kanatlar, nişangâh ve kirişi ayrı parametrik geometrilerle oluşturur. Yay boyu ve gövde seçimi modelin mm ölçülerine yansır. Bu geometri üretici CAD modeli değildir: ürünlerin tam biçimini, üretici toleranslarını veya mekanik uyumunu garanti etmez. Doğrulanmış teknik çizimler eklendiğinde ürün bazında daha doğru modellere geçilebilir. Renkler satıcı varyantı değil, görsel önizlemedir.

## Katkı

Doğrulanmış ürün ölçüleri, renk seçenekleri ve CAD dosyaları için issue açabilir veya pull request gönderebilirsin.

## Lisans

Henüz seçilmedi. Resmî lisans eklenene kadar yeniden kullanım koşulları belirlenmemiştir.

