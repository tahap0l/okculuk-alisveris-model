import { partCatalog, partMeta, initialSelection, initialColors, selectedPart, evaluateCompatibility, calculateTotal } from "./catalog.js?v=3d-model-1";
import { createBowRenderer } from "./renderer.js?v=3d-model-1";

const $ = id => document.getElementById(id);
const selection = { ...initialSelection }, colors = { ...initialColors };
const colorNames = { "#7752b2":"Gece moru", "#d9d4de":"Ay gümüşü", "#262332":"Grafit", "#af486d":"Ahududu", "#25222d":"Grafit", "#55328c":"Erik", "#c4bdcc":"Sis", "#805a3e":"Ceviz", "#ba78eb":"Orkide", "#28242e":"Grafit", "#7652b2":"Erik" };
let bowLengthInches = 68, handedness = "right", viewer = null, toastTimer;
const formatPrice = price => new Intl.NumberFormat("tr-TR", { style:"currency", currency:"TRY", minimumFractionDigits:2, maximumFractionDigits:2 }).format(price);

try {
  viewer = createBowRenderer($("bowCanvas"));
} catch (error) {
  $("modelDimensions").textContent = error.message;
  $("bowCanvas").hidden = true;
}

function renderControls() {
  $("partList").innerHTML = Object.entries(partMeta).map(([category, meta]) => {
    const part = selectedPart(selection, category);
    const swatches = part.colors.map(color => `<button class="color-option ${colors[category]===color?"selected":""}" type="button" style="background:${color}" title="${colorNames[color]??"Renk"}" aria-label="${meta.title}: ${colorNames[color]??"renk"}" aria-pressed="${colors[category]===color}" data-color-category="${category}" data-color="${color}"></button>`).join("");
    const preview = part.colors.length ? `<div class="color-row" aria-label="${meta.title} önizleme renkleri"><span class="part-meta">Önizleme rengi</span>${swatches}<span class="part-meta">Satıcı rengi doğrulanmadı</span></div>` : `<div class="color-row"><span class="part-meta">Renk seçeneği doğrulanmadı</span></div>`;
    return `<div class="part-row"><div class="part-icon" aria-hidden="true">${meta.icon}</div><div><div class="part-title">${meta.title}</div><div class="part-meta">${meta.hint}</div></div><select class="part-select" aria-label="${meta.title} seç" data-category="${category}">${partCatalog[category].map(item=>`<option value="${item.id}" ${selection[category]===item.id?"selected":""}>${item.label}${item.price?` · ${formatPrice(item.price)}`:""}</option>`).join("")}</select>${preview}<a class="product-source" href="${part.source}" target="_blank" rel="noreferrer">${part.material}${part.dimensions?` · ${part.dimensions}`:""} · Navek sayfası ↗</a></div>`;
  }).join("");
  $("partList").querySelectorAll("select").forEach(select=>select.addEventListener("change",event=>{const category=event.currentTarget.dataset.category;selection[category]=event.currentTarget.value;const colorsForPart=selectedPart(selection,category).colors;if(colorsForPart.length&&!colorsForPart.includes(colors[category]))colors[category]=colorsForPart[0];update();}));
  $("partList").querySelectorAll(".color-option").forEach(button=>button.addEventListener("click",event=>{const {colorCategory,color}=event.currentTarget.dataset;colors[colorCategory]=color;update();}));
}

function update() {
  renderControls();
  const status=evaluateCompatibility(selection),statusEl=$("compatibility");
  statusEl.className=`compatibility ${status.level}`;
  statusEl.innerHTML=`<span class="check" aria-hidden="true">${status.compatible===true?"✓":"!"}</span><span><strong>${status.label}</strong><br>${status.detail}</span>`;
  $("totalPrice").textContent=formatPrice(calculateTotal(selection));
  $("colorLabel").textContent=`Görsel önizleme · ${colorNames[colors.riser]??"özel renk"}`;
  $("canvasBadge").innerHTML=`OLİMPİK YAY <span>·</span> ${handedness === "right" ? "SAĞ EL" : "SOL EL"}`;
  if (viewer) {
    const dimensions=viewer.update({selection:{...selection,riserPart:selectedPart(selection,"riser")},colors,bowLengthInches,handedness});
    $("modelDimensions").textContent=`Yay ${dimensions.bowLengthInches}" (${Math.round(dimensions.bowLengthMm)} mm) · Gövde ${dimensions.riserLengthInches}" (${Math.round(dimensions.riserLengthMm)} mm) · Her kanat ${dimensions.limbLengthInches.toFixed(1)}" (${Math.round(dimensions.limbLengthMm)} mm)`;
  }
}

function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
function summaryText(){return [...Object.entries(partMeta).map(([category,meta])=>{const part=selectedPart(selection,category);return `${meta.title}: ${part.label}${part.price?` (${formatPrice(part.price)})`:" (fiyat doğrulanmadı)"}${part.colors.length?` · görsel önizleme: ${colorNames[colors[category]]??"renk"} (satıcı rengi değil)`:""} · ${part.source}`;}),`3D model: ${bowLengthInches} inç · ${handedness === "right" ? "sağ el" : "sol el"}`,`Ölçekli parametrik önizleme; üretici CAD modeli değildir.`,`Ürün fiyatları kontrol tarihi: 10.10.2026; değişebilir.`,`Tahmini toplam (fiyatı bilinen seçili parçalar): ${formatPrice(calculateTotal(selection))}`,`Uyumluluk: ${evaluateCompatibility(selection).label}`].join("\n");}

$("shareButton").addEventListener("click",async()=>{const params=new URLSearchParams({...selection,...Object.fromEntries(Object.entries(colors).map(([key,value])=>[`color-${key}`,value])),bowLength:String(bowLengthInches),hand:handedness});const url=new URL(location.href);url.hash=params.toString();try{await navigator.clipboard.writeText(url.toString());showToast("Yapılandırma bağlantısı kopyalandı.");}catch{location.hash=params.toString();showToast("Yapılandırma bağlantısı adres çubuğuna eklendi.");}});
$("resetConfig").addEventListener("click",()=>{Object.assign(selection,initialSelection);Object.assign(colors,initialColors);bowLengthInches=68;handedness="right";$("bowLength").value="68";$("handedness").value="right";document.querySelectorAll("[data-component]").forEach(input=>{input.checked=true;viewer?.setComponentVisibility(input.dataset.component,true);});history.replaceState(null,"",location.pathname);update();});
$("resetView").addEventListener("click",()=>viewer?.resetView());
$("bowLength").addEventListener("change",event=>{bowLengthInches=Number(event.currentTarget.value);update();});
$("handedness").addEventListener("change",event=>{handedness=event.currentTarget.value;update();});
document.querySelectorAll("[data-component]").forEach(input=>input.addEventListener("change",event=>viewer?.setComponentVisibility(event.currentTarget.dataset.component,event.currentTarget.checked)));
$("summaryButton").addEventListener("click",()=>{$("summaryContent").innerHTML=summaryText().split("\n").map(line=>`<div>${line}</div>`).join("");$("summaryDialog").showModal();});
$("closeDialog").addEventListener("click", () => $("summaryDialog").close());
$("copySummary").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summaryText());showToast("Özet kopyalandı.");$("summaryDialog").close();}catch{showToast("Kopyalamaya izin verilmedi.");}});

function readHash(){const params=new URLSearchParams(location.hash.slice(1));for(const category of Object.keys(partCatalog))if(partCatalog[category].some(part=>part.id===params.get(category)))selection[category]=params.get(category);for(const category of Object.keys(colors))if(params.has(`color-${category}`)&&/^#[\da-f]{6}$/i.test(params.get(`color-${category}`)))colors[category]=params.get(`color-${category}`);if([66,68,70].includes(Number(params.get("bowLength"))))bowLengthInches=Number(params.get("bowLength"));if(["left","right"].includes(params.get("hand")))handedness=params.get("hand");$("bowLength").value=String(bowLengthInches);$("handedness").value=handedness;}
readHash();
update();

