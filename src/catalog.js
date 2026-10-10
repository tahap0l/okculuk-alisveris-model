// Navek product pages checked on 10 October 2026. Prices can change without notice.
// Preview swatches only change the 3D appearance; they do not claim stock color variants.
const previewColors = ["#7652b2", "#ded9e7", "#28242e", "#bd4b75"];
const product = data => ({ ...data, colors: data.colors ?? previewColors, colorOptionsVerified: false, source: `https://www.naveksport.com.tr/${data.slug}` });

export const partCatalog = {
  riser: [
    product({ id: "core-astral-25", label: 'Core Astral · 25″', price: 5583.48, mount: null, slug: "core-klasik-yay-govdesi-astral-25", dimensions: '25″ · teknik standardı doğrulanmadı', riserLengthInches: 25, material: "Başlangıç gövdesi" }),
    product({ id: "kinetic-evolium-21", label: 'Kinetic Evolium · 21″', price: 10300.8, mount: null, slug: "kinetic-klasik-yay-govdesi-evolium-21", dimensions: '21″ · genç/kompakt gövde', riserLengthInches: 21, material: "Kompakt alüminyum gövde" }),
    product({ id: "kinetic-scopus-23", label: 'Kinetic Scopus · 23″', price: 10122.24, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-scopus-23", dimensions: '23″ · ILF', riserLengthInches: 23, material: "6063-T6 CNC alüminyum · 1078 g" }),
    product({ id: "kinetic-lancer-v2-25", label: 'Kinetic Lancer V2 · 25″', price: 7778.4, mount: null, slug: "kinetic-klasik-yay-govdesi-lancer-v2-25", dimensions: '25″ · el/renk varyantı mağazada', riserLengthInches: 25, material: "Alüminyum · pivot hizalama" }),
    product({ id: "kinetic-lancer-two-tone-25", label: 'Kinetic Lancer V2 Two Tone · 25″', price: 7778.4, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-lancer-v2-two-tone-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "Die-cast alüminyum · 1190 g" }),
    product({ id: "kinetic-sovren-25", label: 'Kinetic Sovren · 25″', price: 20608.8, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-sovren-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "6061-T651 CNC alüminyum · 1230 g" }),
    product({ id: "helix-alfa-23", label: 'Helix Alfa · 23″', price: 28224, mount: null, slug: "helix-klasik-yay-govdesi-alfa-23", dimensions: '23″', riserLengthInches: 23, material: "Alüminyum gövde" }),
    product({ id: "helix-alfa-25", label: 'Helix Alfa · 25″', price: 28224, mount: null, slug: "helix-klasik-yay-govdesi-alfa-25", dimensions: '25″', riserLengthInches: 25, material: "Alüminyum gövde" }),
    product({ id: "winwin-atf-dx-25", label: 'Win&Win Wiawis ATF-DX · 25″', price: 56093.28, mount: "ILF", slug: "winwin-klasik-yay-govdesi-wiawis-atf-dx-25", dimensions: '25″ · sağ/sol el seçeneği', riserLengthInches: 25, material: "CNC alüminyum · EHS damper" }),
    product({ id: "winwin-winex-25", label: 'Win&Win Winex · 25″', price: 33342.24, mount: "ILF", slug: "winwin-klasik-yay-govdesi-winex-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "Alüminyum · 1080 g" })
  ],
  limbs: [
    product({ id: "kinetic-honoric-v2", label: "Kinetic Honoric V2 Carbon Foam", price: 6814.08, mount: "ILF", slug: "kinetic-klasik-yay-kanadi-ilf-honoric-v2-carbon-foam", dimensions: "66″ / 68″ / 70″ ve libre varyantı mağazada", material: "Karbon · foam çekirdek" }),
    product({ id: "kinetic-invelta-plus", label: "Kinetic Invelta Plus Fiber Bamboo", price: 5851.74, mount: null, slug: "kinetic-klasik-yay-kanadi-invelta-plus-fiber-bamboo", dimensions: "Varyant mağazada seçilir", material: "Fiber · bambu çekirdek" }),
    product({ id: "kinetic-honoric-carbon", label: "Kinetic Honoric Foam Carbon", price: 8310.72, mount: "ILF", slug: "kinetic-klasik-yay-kanadi-ilf-honoric-foam-carbon", dimensions: "ILF · boy/libre varyantı mağazada", material: "Karbon · foam çekirdek" }),
    product({ id: "wns-explore-w1", label: "WNS Explore W1", price: 6010.08, mount: "ILF", slug: "wns-klasik-yay-kanadi-explore-w1", dimensions: '66″ / 68″ / 70″ · 16–38 lb', material: "Ahşap çekirdek · fiber laminasyon" }),
    product({ id: "helix-vector", label: "Helix Vector", price: 8491.68, mount: null, slug: "helix-klasik-yay-kanadi-vector", dimensions: '66″ / 68″ / 70″ · 18–44 lb', material: "Akçaağaç · fiber · evrensel giriş" }),
    product({ id: "white-feather-flight", label: "White Feather Flight", price: 0, mount: "ILF", slug: "white-feather-yay-kanadi-flight", dimensions: '68″ orta / 70″ uzun · fiyatı sepette doğrula', material: "Fiber kaplı akçaağaç" }),
    product({ id: "wns-explore-b1", label: "WNS Explore B1", price: 7371, mount: "ILF", slug: "wns-klasik-yay-kanadi-explore-b1", dimensions: "Boy ve libre varyantı mağazada", material: "Başlangıç/orta seviye kanat" })
  ],
  sight: [
    product({ id: "avalon-tyro-first", label: "Avalon Tyro First", price: 790, mount: "Universal", slug: "avalon-klasik-yay-nisangahi-tyro-first", dimensions: '5.5″ uzatma kolu', material: "Alüminyum" }),
    product({ id: "avalon-classic-carbon", label: "Avalon Classic Carbon", price: 3995.52, mount: "Universal", slug: "avalon-klasik-yay-nisangahi-classic-carbon", dimensions: "Karbon bar · hassas ayar", material: "Karbon" }),
    product({ id: "wns-spr-100", label: "WNS SPR-100", price: 6112.8, mount: "Universal", slug: "wns-klasik-yay-nisangahi-spr-100", dimensions: "Karbon bar · mikro ayar", material: "Hafif ayarlanabilir nişangâh" }),
    product({ id: "wns-spr-200", label: "WNS SPR-200", price: 11088.48, mount: "Universal", slug: "wns-klasik-yay-nisangahi-spr-200", dimensions: "Üst seviye mikro ayar", material: "Hassas klasik yay nişangâhı" }),
    product({ id: "wns-sja-40", label: "WNS SJA-40 Short", price: 1458.72, mount: "Universal", slug: "wns-klasik-yay-nisangahi-sja-40-short", dimensions: "Kısa uzatma kolu", material: "Alüminyum nişangâh" })
  ],
  longRod: [
    product({ id: "ases-xforce-long", label: "Ases X-Force 3K · uzun rod", price: 3227.52, mount: "1/4 ağırlık sistemi", slug: "ases-stabilizer-uzun-x-force-3k", dimensions: '26″ / 28″ / 30″', rodLengthInches: 28, rodLengths: [26, 28, 30], material: "3K karbon · siyah" }),
    product({ id: "ases-sonix-long", label: "Ases Sonix · uzun rod", price: 3939.84, mount: "Standart stabilizer bağlantısı", slug: "ases-stabilizer-uzun-sonix", dimensions: '26″ / 28″ / 30″', rodLengthInches: 28, rodLengths: [26, 28, 30], material: "Karbon · siyah" }),
    product({ id: "helix-firefly-long", label: "Helix Firefly · uzun rod", price: 3664.2, mount: null, slug: "helix-stabilizer-uzun-firefly", dimensions: "Uzun · varyant mağazada", rodLengthInches: 28, material: "3K karbon · 114 g uç ağırlığı" }),
    product({ id: "wns-hmc-long", label: "WNS HMC Plus · uzun rod", price: 8666.4, mount: null, slug: "winwin-stabilizer-uzun-hmc-plus", dimensions: '26″ / 28″ / 30″', rodLengthInches: 28, rodLengths: [26, 28, 30], material: "Karbon · ağırlıklar dahil" })
  ],
  shortRod: [
    product({ id: "helix-firefly-short", label: "Helix Firefly · kısa rod", price: 1966.56, mount: "1/4 ağırlık sistemi", slug: "helix-stabilizer-kisa-firefly", dimensions: '10″ / 11″ / 12″', rodLengthInches: 10, rodLengths: [10, 11, 12], material: "3K karbon · 76 g uç ağırlığı" }),
    product({ id: "ases-sonix-short", label: "Ases Sonix · kısa rod", price: 2366.88, mount: null, slug: "ases-stabilizer-kisa-carbon-sonix", dimensions: '10″ / 12″', rodLengthInches: 10, rodLengths: [10, 12], material: "Karbon" }),
    product({ id: "wns-smc-short", label: "WNS SMC · kısa rod", price: 4243.8, mount: null, slug: "wns-stabilizer-kisa-smc", dimensions: "Kısa stabilizer", rodLengthInches: 10, rodLengths: [10, 12], material: "3K karbon · şok emici" }),
    product({ id: "ases-xforce-short", label: "Ases X-Force 3K · kısa rod", price: 2260.32, mount: null, slug: "ases-stabilizer-kisa-x-force-3k", dimensions: "Kısa stabilizer", rodLengthInches: 10, rodLengths: [10, 12], material: "3K karbon" })
  ],
  vbar: [
    product({ id: "ases-vbar-unibar", label: "Ases Uni Bar Plus · ayarlanabilir V-bar", price: 2648.64, mount: "Rod bağlantısı ürün sayfasında", slug: "ases-v-bar-adjustable-uni-bar-plus", dimensions: "Açı/konum ayarlı · önizleme 40°", previewAngleDegrees: 40, material: "Paslanmaz bağlantı civataları" }),
    product({ id: "wns-vbar-smc", label: "WNS V-Bar Carbon SMC", price: 3025.44, mount: "SMC rod sistemi", slug: "wns-v-bar-carbon-smc", dimensions: '40° / 45°', previewAngleDegrees: 45, material: "Full karbon" }),
    product({ id: "winwin-vbar-cxa", label: "Win&Win V-Bar CX-A Carbon", price: 3966.24, mount: "Standart rod bağlantısı", slug: "winwin-v-bar-cx-a-carbon", dimensions: "Karbon V-bar · önizleme 40°", previewAngleDegrees: 40, material: "Win&Win" })
  ],
  string: [
    product({ id: "atan-652x", label: "Atan 652X Recurve", price: 403.2, mount: "Olimpik klasik yay", slug: "atan-hazir-kiris-ipi-652x-recurve-bow", dimensions: 'Yay boyu ürün varyantından seçilir', material: "652X hazır kiriş" }),
    product({ id: "atan-8125", label: "Atan 8125 Recurve", price: 1322.88, mount: "Olimpik klasik yay", slug: "atan-hazir-kiris-ipi-8125-recurve-bow", dimensions: "Yay boyu ürün varyantından seçilir", material: "8125 hazır kiriş" }),
    product({ id: "helix-string-point", label: "Helix Point · Dacron", price: 227.04, mount: "Klasik yay", slug: "helix-hazir-kiris-ipi-point", dimensions: '48″–70″ seçenekleri', material: "12 sarım · beyaz" }),
    product({ id: "shocq-b50", label: "Shocq B50 Recurve", price: 253.92, mount: "Klasik yay", slug: "shocq-hazir-kiris-ipi-b50-recurve", dimensions: "Boy varyantını mağazada doğrula", material: "B50 hazır kiriş" }),
    product({ id: "shocq-fast-flight", label: "Shocq Fast Flight Recurve", price: 530.88, mount: "Klasik yay", slug: "shocq-hazir-kiris-ipi-fast-flight-recurve", dimensions: "Boy varyantını mağazada doğrula", material: "Fast Flight hazır kiriş" })
  ]
};

export const partMeta = {
  riser: { title: "Gövde", hint: "10 Navek seçeneği", icon: "▱" },
  limbs: { title: "Kanat", hint: "Boy ve libre varyantı mağazada", icon: "⟋" },
  sight: { title: "Nişangâh", hint: "Kol ve kafa şekli 3D önizleme", icon: "⊙" },
  longRod: { title: "Uzun rod", hint: "Ön stabilizer · uzunluk seçilebilir", icon: "━" },
  shortRod: { title: "Kısa rod", hint: "Yan stabilizer · V-bar ile bağlanır", icon: "╱" },
  vbar: { title: "V-bar", hint: "Yan rod bağlantısı", icon: "Y" },
  string: { title: "Kiriş", hint: "Farklı malzeme ve fiyat seçenekleri", icon: "╱" }
};
export const initialSelection = { riser: "kinetic-lancer-two-tone-25", limbs: "wns-explore-w1", sight: "avalon-tyro-first", longRod: "helix-firefly-long", shortRod: "helix-firefly-short", vbar: "ases-vbar-unibar", string: "atan-652x" };
export const initialColors = { riser: "#7652b2", limbs: "#ded9e7", sight: "#28242e", longRod: "#28242e", shortRod: "#28242e", vbar: "#9b8cae", string: "#ece5f4" };

export function selectedPart(selection, category) {
  return partCatalog[category].find(part => part.id === selection[category]) ?? partCatalog[category][0];
}
export function evaluateCompatibility(selection) {
  const riser = selectedPart(selection, "riser");
  const limbs = selectedPart(selection, "limbs");
  if (!riser.mount || !limbs.mount) return { compatible: null, label: "Bağlantı uyumu teyit bekliyor", detail: `Gövde: ${riser.mount ?? "ürün sayfasında belirtilmiyor"}; kanat: ${limbs.mount ?? "ürün sayfasında belirtilmiyor"}. Aynı standart ve yay boyunu Navek'te doğrulamadan uyumlu kabul etme.`, level: "warning" };
  if (riser.mount !== limbs.mount) return { compatible: false, label: "Bağlantı standartları farklı", detail: `Gövde ${riser.mount}, kanat ${limbs.mount}. Birlikte uyum doğrulanmadı.`, level: "warning" };
  return { compatible: true, label: "Bağlantı standardı eşleşiyor", detail: `${riser.mount} standardı ürün bilgilerinde eşleşiyor. Yay boyu/libre varyantını ayrıca doğrula.`, level: "ok" };
}
export function calculateTotal(selection) {
  return Object.keys(partCatalog).reduce((total, category) => total + (selectedPart(selection, category).price || 0), 0);
}
