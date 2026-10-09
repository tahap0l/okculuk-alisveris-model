# OkForm 🏹

OkForm, Türkiye'deki okçuların olimpik yay parçalarını seçip görsel bir yay önizlemesinde deneyebildiği, satıcı ürün sayfalarına bağlanan açık kaynaklı bir prototiptir.

## Mevcut özellikler

- Sürükleyerek döndürülebilen kodla çizilmiş yay önizlemesi
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

Mevcut önizleme gerçek üretici CAD modeli değildir; canvas üzerinde derinlik hissiyle çizilmiş yaklaşık bir temsildir. Satın almaya uygun gerçek 3D model için satıcı/üretici ölçüleri ve kullanım izni gerekir. Bu nedenle önizleme ürünün tam boyutunu, gerçek rengini veya mekanik uyumunu garanti etmez.

## Katkı

Doğrulanmış ürün ölçüleri, renk seçenekleri ve CAD dosyaları için issue açabilir veya pull request gönderebilirsin.

## Lisans

Henüz seçilmedi. Resmî lisans eklenene kadar yeniden kullanım koşulları belirlenmemiştir.

