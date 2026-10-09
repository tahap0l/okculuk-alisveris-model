export const partCatalog = {
  riser: [
    { id: "nova", label: "Nova ILF 25\"", price: 24900, mount: "ILF", colors: ["#7752b2", "#d9d4de", "#262332", "#af486d"] },
    { id: "arc", label: "Arc 25\"", price: 18750, mount: "ILF", colors: ["#7752b2", "#d9d4de", "#262332", "#af486d"] },
    { id: "classic", label: "Klasik vidalı 24\"", price: 13900, mount: "Bolt", colors: ["#55328c", "#25232d", "#c4bdcc"] }
  ],
  limbs: [
    { id: "feather", label: "Feather Carbon 68\"", price: 11600, mount: "ILF", colors: ["#d9d4de", "#25222d", "#7752b2"] },
    { id: "swift", label: "Swift Fiber 68\"", price: 7250, mount: "ILF", colors: ["#25222d", "#d9d4de", "#7752b2"] },
    { id: "classic-limb", label: "Klasik ahşap 66\"", price: 5600, mount: "Bolt", colors: ["#805a3e", "#d9d4de"] }
  ],
  sight: [
    { id: "orbit", label: "Orbit Micro", price: 4800, mount: "Universal", colors: ["#d9d4de", "#7752b2", "#25222d"] },
    { id: "pin", label: "Pin Lite", price: 2950, mount: "Universal", colors: ["#d9d4de", "#25222d"] }
  ],
  string: [
    { id: "fastflight", label: "FastFlight 68\"", price: 950, mount: "Universal", colors: ["#d9d4de", "#ba78eb", "#28242e"] },
    { id: "dacron", label: "Dacron 66\"", price: 550, mount: "Universal", colors: ["#d9d4de", "#7652b2"] }
  ]
};
export const partMeta = {
  riser: { title: "Yay gövdesi", hint: "25\" · Alüminyum alaşım", icon: "⌁" },
  limbs: { title: "Kanatlar", hint: "68\" · Karbon / fiberglass", icon: "⟋" },
  sight: { title: "Nişangâh", hint: "Hassas mikro ayar", icon: "⊙" },
  string: { title: "Kiriş", hint: "FastFlight · 16 tel", icon: "╱" }
};
export const initialSelection = { riser: "nova", limbs: "feather", sight: "orbit", string: "fastflight" };
export const initialColors = { riser: "#7752b2", limbs: "#d9d4de", sight: "#d9d4de", string: "#ba78eb" };
export function selectedPart(selection, category) {
  return partCatalog[category].find(part => part.id === selection[category]) ?? partCatalog[category][0];
}
export function evaluateCompatibility(selection) {
  const riser = selectedPart(selection, "riser");
  const limbs = selectedPart(selection, "limbs");
  if (riser.mount !== limbs.mount) return { compatible: false, label: "Uyumluluk kontrolü gerekli", detail: `Gövde bağlantısı ${riser.mount}, kanat bağlantısı ${limbs.mount}. Bu parçalar birlikte uyumlu görünmüyor.`, level: "warning" };
  return { compatible: true, label: "Parçalar birbiriyle uyumlu görünüyor", detail: `${riser.mount} bağlantı standardı eşleşiyor. Ürün ölçüleri örnek katalog verisidir.`, level: "ok" };
}
export function calculateTotal(selection) {
  return Object.keys(partCatalog).reduce((total, category) => total + selectedPart(selection, category).price, 0);
}

