# OkForm 🏹

**OkForm**, okçuların olimpik yay parçalarını seçip renklerini deneyebildiği ve montaj uyumunu satın almadan önce kontrol edebildiği bir 3D yapılandırıcı prototipidir.

## Özellikler

- Sürükleyerek döndürülebilen, renk ve parça seçimine tepki veren 3D önizleme
- Gövde, kanat, nişangâh ve kiriş seçimi
- Renk seçenekleri ve tahmini sepet toplamı
- ILF / vidalı bağlantı türlerine göre temel uyumluluk kontrolü
- Bağlantı ve yapılandırma özeti paylaşımı
- Telefon ve masaüstü için uyumlu arayüz

## Çalıştırma

Node.js 20 veya üzeri ile:

```sh
npm start
```

Ardından `http://127.0.0.1:4173` adresini aç. Testler için:

```sh
npm test
```

## Durum

Bu, ilk arayüz prototipidir. Yay modeli, temel derinlik etkileriyle kodla çizilen hafif bir önizlemedir; üretici CAD modelleri ve doğrulanmış ölçüler geldikçe gerçek parça geometrileriyle değiştirilecektir.

## Veri doğruluğu

Şu an katalogdaki ürün adları, fiyatlar ve bağlantılar **arayüz prototipi için örnek veridir**; Navek veya BVE'den alınmış canlı ürün bilgisi değildir. Gerçek kullanım için ürün ölçüleri ve bağlantı bilgileri üretici/satıcı kaynaklarıyla doğrulanmalıdır. Uyumluluk uyarıları da yalnızca bu doğrulanmış veriler kadar güvenilirdir.

## Katkı

Ürün kataloğu, ölçüler veya model doğruluğuna katkıda bulunmak için bir issue açabilir ya da pull request gönderebilirsin.

## Lisans

Henüz seçilmedi. Resmî lisans eklenene kadar kodun yeniden kullanım koşulları belirlenmemiştir.
