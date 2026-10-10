// Navek product details checked on 2026-10-10. Prices can change at any time.
// Preview colors are visual mockups and are not claims about seller variants.
const previewColors = ["#7752b2", "#d9d4de", "#262332", "#af486d"];
const product = (data) => ({ ...data, colors: previewColors, colorOptionsVerified: false, source: `https://www.naveksport.com.tr/${data.slug}` });

export const partCatalog = {
  riser: [
    product({ id: "core-astral-25", label: 'Core Astral 25"', price: 5583.48, listPrice: 6568.8, mount: null, slug: "core-klasik-yay-govdesi-astral-25", dimensions: '25"', riserLengthInches: 25, material: "Ürün sayfasındaki teknik bilgiler" }),
    product({ id: "helix-alfa-23", label: 'Helix Alfa 23"', price: 28224, listPrice: 35280, mount: null, slug: "helix-klasik-yay-govdesi-alfa-23", dimensions: '23"', riserLengthInches: 23, material: "6061 alüminyum · CNC işleme" }),
    product({ id: "kinetic-evolium-21", label: 'Kinetic Evolium 21"', price: 10300.8, listPrice: 12876, mount: null, slug: "kinetic-klasik-yay-govdesi-evolium-21", dimensions: '21"', riserLengthInches: 21, material: "Genç okçular ve kısa çekiş için kompakt gövde" })
  ],
  limbs: [
    product({ id: "kinetic-honoric-v2", label: "Kinetic Honoric V2 Carbon Foam ILF", price: 6814.08, listPrice: 8517.6, mount: "ILF", slug: "kinetic-klasik-yay-kanadi-ilf-honoric-v2-carbon-foam", dimensions: "Varyant sayfasında seçilir", material: "Karbon · foam çekirdek", verifiedCompatibility: "Tüm ILF uyumlu klasik yay gövdeleri" }),
    product({ id: "kinetic-invelta-plus", label: "Kinetic Invelta Plus Fiber Bamboo", price: 5851.74, listPrice: 6884.4, mount: null, slug: "kinetic-klasik-yay-kanadi-invelta-plus-fiber-bamboo", dimensions: "Varyant sayfasında seçilir", material: "Fiber · bambu" })
  ],
  sight: [
    product({ id: "avalon-tyro-first", label: "Avalon Tyro First", price: 790, listPrice: 929.4, mount: "Universal", slug: "avalon-klasik-yay-nisangahi-tyro-first", dimensions: '5.5" uzatma kolu', material: "Alüminyum / metal" }),
    product({ id: "avalon-classic-carbon", label: "Avalon Classic Carbon", price: 3995.52, listPrice: 4994.4, mount: "Universal", slug: "avalon-klasik-yay-nisangahi-classic-carbon", dimensions: "Ürün sayfasında", material: "Karbon" })
  ],
  string: [
    { id: "string-pending", label: "Navek kiriş ürünleri · detay bekleniyor", price: 0, listPrice: null, mount: null, colors: [], colorOptionsVerified: false, source: "https://www.naveksport.com.tr/hazir-kirisler", dimensions: "", material: "Varyant ve fiyat doğrulanmadı" }
  ]
};

export const partMeta = {
  riser: { title: "Yay gövdesi", hint: "Navek · ürün sayfası", icon: "⌁" },
  limbs: { title: "Kanatlar", hint: "Navek · bağlantı standardı kontrolü", icon: "⟋" },
  sight: { title: "Nişangâh", hint: "Navek · klasik yay", icon: "⊙" },
  string: { title: "Kiriş", hint: "Navek · katalog doğrulaması bekleniyor", icon: "╱" }
};
export const initialSelection = { riser: "core-astral-25", limbs: "kinetic-honoric-v2", sight: "avalon-tyro-first", string: "string-pending" };
export const initialColors = { riser: "#7752b2", limbs: "#d9d4de", sight: "#262332", string: "#af486d" };
export function selectedPart(selection, category) {
  return partCatalog[category].find(part => part.id === selection[category]) ?? partCatalog[category][0];
}
export function evaluateCompatibility(selection) {
  const riser = selectedPart(selection, "riser");
  const limbs = selectedPart(selection, "limbs");
  if (!riser.mount || !limbs.mount) return { compatible: null, label: "Uyumluluk doğrulanamadı", detail: `Kanat bağlantısı ${limbs.mount ?? "belirtilmemiş"}; seçili gövdenin bağlantı standardı Navek ürün bilgisinde doğrulanamadı. Satıcıyla teyit et.`, level: "warning" };
  if (riser.mount !== limbs.mount) return { compatible: false, label: "Bağlantı standartları farklı", detail: `Gövde ${riser.mount}, kanat ${limbs.mount}. Birlikte uyumlu olduğu doğrulanmadı.`, level: "warning" };
  return { compatible: true, label: "Bağlantı standardı eşleşiyor", detail: `${riser.mount} standardı ürün bilgilerinde eşleşiyor. Diğer ölçüleri de satın almadan önce doğrula.`, level: "ok" };
}
export function calculateTotal(selection) {
  return Object.keys(partCatalog).reduce((total, category) => total + selectedPart(selection, category).price, 0);
}

