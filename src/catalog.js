// Navek product pages checked on 10 October 2026. Prices can change without notice.
// Preview swatches only change the 3D appearance; they do not claim stock color variants.
const previewColors = ["#7652b2", "#ded9e7", "#28242e", "#bd4b75"];
const productPalettes = {
  "core-astral-25": ["#74579b", "#a4a1aa", "#332f3d"], "kinetic-evolium-21": ["#3b657e", "#946077", "#292630"],
  "kinetic-scopus-23": ["#aa3851", "#284f79", "#a8a2ae", "#575544"], "kinetic-lancer-v2-25": ["#25232b", "#376992", "#ad4054"],
  "kinetic-lancer-two-tone-25": ["#f4f1e9", "#eff3f7", "#f4eeee", "#e9e9eb"], "kinetic-sovren-25": ["#3f4b83", "#762e43", "#27262b"],
  "helix-alfa-23": ["#5a477d", "#29272f", "#b2adb9"], "helix-alfa-25": ["#433b67", "#1f252b", "#b8b1a7"],
  "winwin-atf-dx-25": ["#22252d", "#4b505c", "#a9aab0"], "winwin-winex-25": ["#332d39", "#4d6470", "#bebcc4"],
  "kinetic-honoric-v2": ["#26242a", "#ddd9df"], "kinetic-invelta-plus": ["#c1a67a", "#dfd1b2", "#393236"],
  "kinetic-honoric-carbon": ["#252328", "#c8c4ce"], "wns-explore-w1": ["#c6a97e", "#ece8de", "#302d30"],
  "helix-vector": ["#b69a71", "#26252b", "#e6e2dc"], "white-feather-flight": ["#b9a07a", "#e1d8c7"], "wns-explore-b1": ["#ba9d73", "#29262b"],
  "avalon-tyro-first": ["#28272b", "#aeb2bb"], "avalon-classic-carbon": ["#25252b", "#8f8a99"], "wns-spr-100": ["#29272c", "#858994"],
  "wns-spr-200": ["#1f2025", "#a3a1a7"], "wns-sja-40": ["#26252a", "#b1afb7"],
  "atan-652x": ["#f4f0e8", "#bb3948", "#28252b"], "atan-8125": ["#29272c", "#f1eee7", "#a83849"],
  "helix-string-point": ["#f2eee5", "#28252c"], "shocq-b50": ["#f3eee6", "#524638"], "shocq-fast-flight": ["#27252a", "#bb3747"],
  "ases-xforce-long": ["#202126", "#555862"], "ases-sonix-long": ["#25272d", "#5a524b"], "helix-firefly-long": ["#1c1e24", "#6a3f82"], "wns-hmc-long": ["#18191d", "#777d88"],
  "helix-firefly-short": ["#1c1e24", "#6a3f82"], "ases-sonix-short": ["#25272d", "#5a524b"], "wns-smc-short": ["#18191d", "#777d88"], "ases-xforce-short": ["#202126", "#555862"],
  "helix-firefly-extender": ["#1c1e24", "#6a3f82"], "ases-sonix-extender": ["#25272d", "#5a524b"], "ases-xforce-extender": ["#202126", "#555862"], "winwin-hmc-extender": ["#18191d", "#777d88"],
  "ases-vbar-unibar": ["#8a8d96", "#25262b"], "wns-vbar-smc": ["#202126", "#7a7d84"], "winwin-vbar-cxa": ["#18191d", "#626773"]
};
const productStyles = {
  "core-astral-25":"astral-cast", "kinetic-evolium-21":"evolium-compact", "kinetic-lancer-v2-25":"lancer-cast", "helix-alfa-23":"alfa-cutout-23", "helix-alfa-25":"alfa-cutout-25", "hoyt-formula-sr-25":"formula-offset",
  "kinetic-honoric-v2":"carbon-foam", "kinetic-invelta-plus":"bamboo-laminate", "kinetic-honoric-carbon":"carbon-laminate", "wns-explore-w1":"wood-fiberglass", "helix-vector":"maple-fiber", "white-feather-flight":"maple-fiberglass", "wns-explore-b1":"b1-laminate", "hoyt-formula-metrix-foam":"carbon-foam-formula", "hoyt-formula-metrix-wood":"carbon-wood-formula",
  "avalon-tyro-first":"tyro-adjustable", "avalon-classic-carbon":"avalon-carbon", "wns-spr-100":"spr-100-micro", "wns-spr-200":"spr-200-micro", "wns-sja-40":"sja-short",
  "ases-xforce-long":"xforce-3k", "ases-sonix-long":"sonix-carbon", "helix-firefly-long":"firefly-3k", "wns-hmc-long":"hmc-plus", "helix-firefly-short":"firefly-3k", "ases-sonix-short":"sonix-carbon", "wns-smc-short":"smc-damped", "ases-xforce-short":"xforce-3k",
  "helix-firefly-extender":"firefly-extender", "ases-sonix-extender":"sonix-extender", "ases-xforce-extender":"xforce-extender", "winwin-hmc-extender":"hmc-extender",
  "ases-vbar-unibar":"adjustable-vbar", "wns-vbar-smc":"smc-vbar", "winwin-vbar-cxa":"cxa-vbar",
  "atan-652x":"652x-string", "atan-8125":"8125-string", "helix-string-point":"dacron-string", "shocq-b50":"b50-string", "shocq-fast-flight":"fastflight-string"
};
const product = data => ({ ...data, modelStyle: data.modelStyle ?? productStyles[data.id] ?? data.id, colors: data.colors ?? productPalettes[data.id] ?? previewColors, colorOptionsVerified: data.colorOptionsVerified ?? false, source: data.source ?? `https://www.naveksport.com.tr/${data.slug}` });

export const partCatalog = {
  riser: [
    product({ id: "core-astral-25", label: 'Core Astral · 25″', price: 5583.48, mount: null, slug: "core-klasik-yay-govdesi-astral-25", dimensions: '25″ · teknik standardı doğrulanmadı', riserLengthInches: 25, material: "Başlangıç gövdesi" }),
    product({ id: "kinetic-evolium-21", label: 'Kinetic Evolium · 21″', price: 10300.8, mount: null, slug: "kinetic-klasik-yay-govdesi-evolium-21", dimensions: '21″ · genç/kompakt gövde', riserLengthInches: 21, material: "Kompakt alüminyum gövde" }),
    product({ id: "kinetic-scopus-23", label: 'Kinetic Scopus · 23″', price: 10122.24, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-scopus-23", dimensions: '23″ · ILF', riserLengthInches: 23, material: "6063-T6 CNC alüminyum · 1078 g", modelStyle: "scopus-cnc", colors:["#15171b","#225782","#af334f","#d87522","#237c86","#b28e3f","#855238","#aaa7a0","#167754","#683888","#4c4856","#a84875","#1d5737"], colorLabels:["Siyah","Mavi","Kırmızı","Turuncu","Turkuaz","Altın","Bronz","Gümüş","Yeşil","Mor","Duman","Pembe","Koyu yeşil"], colorOptionsVerified: true }),
    product({ id: "kinetic-lancer-v2-25", label: 'Kinetic Lancer V2 · 25″', price: 7778.4, mount: null, slug: "kinetic-klasik-yay-govdesi-lancer-v2-25", dimensions: '25″ · el/renk varyantı mağazada', riserLengthInches: 25, material: "Alüminyum · pivot hizalama" }),
    product({ id: "kinetic-lancer-two-tone-25", label: 'Kinetic Lancer V2 Two Tone · 25″', price: 7778.4, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-lancer-v2-two-tone-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "Die-cast alüminyum · 1190 g · iki ton", modelStyle: "lancer-two-tone", colors: ["#28272b", "#376992", "#bd3948", "#8e929c"], colorLabels: ["Beyaz / siyah", "Beyaz / mavi", "Beyaz / kırmızı", "Beyaz / gri"], colorOptionsVerified: true }),
    product({ id: "kinetic-sovren-25", label: 'Kinetic Sovren · 25″', price: 20608.8, mount: "ILF", slug: "kinetic-klasik-yay-govdesi-sovren-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "6061-T651 CNC alüminyum · 1230 g", modelStyle: "sovren-cnc", colorOptionsVerified: true }),
    product({ id: "helix-alfa-23", label: 'Helix Alfa · 23″', price: 28224, mount: null, slug: "helix-klasik-yay-govdesi-alfa-23", dimensions: '23″', riserLengthInches: 23, material: "Alüminyum gövde" }),
    product({ id: "helix-alfa-25", label: 'Helix Alfa · 25″', price: 28224, mount: null, slug: "helix-klasik-yay-govdesi-alfa-25", dimensions: '25″', riserLengthInches: 25, material: "Alüminyum gövde" }),
    product({ id: "winwin-atf-dx-25", label: 'Win&Win Wiawis ATF-DX · 25″', price: 56093.28, mount: "ILF", slug: "winwin-klasik-yay-govdesi-wiawis-atf-dx-25", dimensions: '25″ · sağ/sol el seçeneği', riserLengthInches: 25, material: "CNC alüminyum · EHS damper", modelStyle: "atf-dx-damped" }),
    product({ id: "winwin-winex-25", label: 'Win&Win Winex · 25″', price: 33342.24, mount: "ILF", slug: "winwin-klasik-yay-govdesi-winex-25", dimensions: '25″ · ILF', riserLengthInches: 25, material: "Alüminyum · 1080 g", modelStyle: "winex-angular" }),
    product({ id: "hoyt-formula-sr-25", label: 'Hoyt Formula SR · 25″', price: 70590.84, mount: "Formula", slug: "hoyt-klasik-yay-govdesi-formula-sr-25", dimensions: '25″ · yalnız Hoyt Formula kanatları', riserLengthInches: 25, material: "Formula sistem · yalnız sağ el", modelStyle: "formula-offset", colors: ["#28272b", "#374859", "#a08c72"] })
  ],
  limbs: [
    product({ id: "kinetic-honoric-v2", label: "Kinetic Honoric V2 Carbon Foam", price: 6814.08, mount: "ILF", slug: "kinetic-klasik-yay-kanadi-ilf-honoric-v2-carbon-foam", dimensions: "66″ / 68″ / 70″ ve libre varyantı mağazada", material: "Karbon · foam çekirdek" }),
    product({ id: "kinetic-invelta-plus", label: "Kinetic Invelta Plus Fiber Bamboo", price: 5851.74, mount: null, slug: "kinetic-klasik-yay-kanadi-invelta-plus-fiber-bamboo", dimensions: "Bağlantı standardı Navek'te belirtilmiyor", material: "Fiber · bambu çekirdek", modelStyle: "bamboo-laminate" }),
    product({ id: "kinetic-honoric-carbon", label: "Kinetic Honoric Foam Carbon", price: 8310.72, mount: "ILF", slug: "kinetic-klasik-yay-kanadi-ilf-honoric-foam-carbon", dimensions: "ILF · boy/libre varyantı mağazada", material: "Karbon · foam çekirdek" }),
    product({ id: "wns-explore-w1", label: "WNS Explore W1", price: 6010.08, mount: "ILF", slug: "wns-klasik-yay-kanadi-explore-w1", dimensions: '66″ / 68″ / 70″ · 16–38 lb', material: "Ahşap çekirdek · fiber laminasyon", modelStyle: "wood-fiberglass" }),
    product({ id: "helix-vector", label: "Helix Vector", price: 8491.68, mount: null, slug: "helix-klasik-yay-kanadi-vector", dimensions: '66″ / 68″ / 70″ · 18–44 lb', material: "Akçaağaç · fiber · evrensel giriş" }),
    product({ id: "white-feather-flight", label: "White Feather Flight", price: 0, mount: "ILF", slug: "white-feather-yay-kanadi-flight", dimensions: '68″ orta / 70″ uzun · fiyatı sepette doğrula', material: "Fiber kaplı akçaağaç", modelStyle: "maple-fiberglass" }),
    product({ id: "wns-explore-b1", label: "WNS Explore B1", price: 7371, mount: "ILF", slug: "wns-klasik-yay-kanadi-explore-b1", dimensions: "Boy ve libre varyantı mağazada", material: "Başlangıç/orta seviye kanat", modelStyle: "b1-laminate" }),
    product({ id: "hoyt-formula-metrix-foam", label: "Hoyt Formula Metrix Foam", price: 82676.64, mount: "Formula", slug: "hoyt-klasik-yay-kanadi-formula-syntactic-foam-core-metrix", dimensions: '66″ / 68″ / 70″ · 28–50 lb · Formula', material: "%100 karbon · syntactic foam çekirdek", modelStyle: "carbon-foam-formula", colors: ["#23242a", "#a4a0a8"] }),
    product({ id: "hoyt-formula-metrix-wood", label: "Hoyt Formula Metrix Wood", price: 103345.8, mount: "Formula", slug: "hoyt-klasik-yay-kanadi-formula-laminate-core-metrix", dimensions: '66″ / 68″ / 70″ · 28–50 lb · Formula', material: "%100 karbon · lamine ahşap çekirdek", modelStyle: "carbon-wood-formula", colors: ["#26242a", "#8e7254"] })
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
  extender: [
    product({ id: "helix-firefly-extender", label: "Helix Firefly Extender", price: 757.44, mount: "Stabilizer · 1/4″ vida", slug: "helix-stabilizer-extender-firefly", dimensions: '3″ / 4″ / 5″ · 3K karbon', rodLengthInches: 4, rodLengths: [3, 4, 5], material: "3K karbon · iç çap 14 mm · dış çap 16 mm" }),
    product({ id: "ases-sonix-extender", label: "Ases Sonix Extender", price: 633.12, mount: "Stabilizer", slug: "ases-extender-sonix", source:"https://www.naveksport.com.tr/ases", dimensions: "Sonix stabilizer uzatması", rodLengthInches: 4, rodLengths: [3, 4], material: "Karbon stabilizer extender" }),
    product({ id: "ases-xforce-extender", label: "Ases X-Force 3K Extender", price: 1292.16, mount: "Stabilizer", slug: "ases-extender-carbon-x-force-3k", dimensions: "3″ / 4″ · 3K karbon", rodLengthInches: 4, rodLengths: [3, 4], material: "3K karbon", source:"https://www.naveksport.com.tr/ases-extender-carbon-x-force-3k" }),
    product({ id: "ases-protena-extender", label: "Ases Protena Extender", price: 1967.52, mount: "Stabilizer", slug: "ases-rod-protena-extender", dimensions: "3″ / 4″ / 5″ / 6″ · çift modül", rodLengthInches: 4, rodLengths: [3, 4, 5, 6], material: "3K karbon", source:"https://www.naveksport.com.tr/ases-rod-protena-extender" }),
    product({ id: "winwin-hmc-extender", label: "Win&Win HMC Plus Extender", price: 3129.6, mount: "Stabilizer", slug: "winwin-extender-hmc-plus", source:"https://www.naveksport.com.tr/winwin", dimensions: "HMC Plus karbon", rodLengthInches: 4, rodLengths: [3, 4, 5, 6], material: "Karbon stabilizer extender" })
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
  riser: { title: "Gövde", hint: "11 Navek seçeneği", icon: "▱" },
  limbs: { title: "Kanat", hint: "9 Navek seçeneği", icon: "⟋" },
  sight: { title: "Nişangâh", hint: "Kol ve kafa şekli 3D önizleme", icon: "⊙" },
  longRod: { title: "Uzun rod", hint: "Ön stabilizer · uzunluk seçilebilir", icon: "━" },
  shortRod: { title: "Kısa rod", hint: "Yan stabilizer · V-bar ile bağlanır", icon: "╱" },
  extender: { title: "Extender", hint: "Gövde ile V-bar arasındaki uzatma", icon: "⇢" },
  vbar: { title: "V-bar", hint: "Yan rod bağlantısı", icon: "Y" },
  string: { title: "Kiriş", hint: "Farklı malzeme ve fiyat seçenekleri", icon: "╱" }
};
export const initialSelection = { riser: "kinetic-lancer-two-tone-25", limbs: "wns-explore-w1", sight: "avalon-tyro-first", longRod: "helix-firefly-long", shortRod: "helix-firefly-short", extender: "helix-firefly-extender", vbar: "ases-vbar-unibar", string: "atan-652x" };
export const initialColors = { riser: "#28272b", limbs: "#c6a97e", sight: "#28272b", longRod: "#1c1e24", shortRod: "#1c1e24", extender: "#1c1e24", vbar: "#8a8d96", string: "#f4f0e8" };

export function selectedPart(selection, category) {
  return partCatalog[category].find(part => part.id === selection[category]) ?? partCatalog[category][0];
}
export function evaluateCompatibility(selection) {
  const riser = selectedPart(selection, "riser");
  const limbs = selectedPart(selection, "limbs");
  if (selection.handedness === "left" && riser.id === "hoyt-formula-sr-25") return { compatible: false, label: "Bu gövde sol el kullanımına uymaz", detail: "Hoyt Formula SR ürün bilgisi yalnız sağ el seçeneği veriyor.", level: "warning" };
  if (!riser.mount || !limbs.mount) return { compatible: null, label: "Bağlantı uyumu teyit bekliyor", detail: `Gövde: ${riser.mount ?? "ürün sayfasında belirtilmiyor"}; kanat: ${limbs.mount ?? "ürün sayfasında belirtilmiyor"}. Aynı standart ve yay boyunu Navek'te doğrulamadan uyumlu kabul etme.`, level: "warning" };
  if (riser.mount !== limbs.mount) return { compatible: false, label: "Bu kanat seçili gövdeye uymaz", detail: `Gövde ${riser.mount}, kanat ${limbs.mount}. Bu iki bağlantı standardı birbirine uymaz.`, level: "warning" };
  return { compatible: true, label: `${riser.mount} bağlantısı eşleşiyor`, detail: `${riser.mount} standardı ürün bilgilerinde eşleşiyor. Yay boyu ve libre varyantını ayrıca kontrol et.`, level: "ok" };
}
export function getPartCompatibility(selection, category, partId) {
  if (category === "limbs") return evaluateCompatibility({ ...selection, limbs: partId });
  return { compatible: null, label: "Bu parça için bağlantı bilgisi yok", level: "unknown" };
}
export function calculateTotal(selection) {
  return Object.keys(partCatalog).reduce((total, category) => total + (selectedPart(selection, category).price || 0), 0);
}
