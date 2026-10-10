import { partCatalog, partMeta, initialSelection, initialColors, selectedPart, evaluateCompatibility, calculateTotal } from "./catalog.js?v=navek-3d-4";
import { createBowRenderer } from "./renderer.js?v=navek-3d-4";

const $ = id => document.getElementById(id);
const selection = { ...initialSelection }, colors = { ...initialColors };
const colorNames = { "#7752b2":"Gece moru", "#d9d4de":"Ay gümüşü", "#262332":"Grafit", "#af486d":"Ahududu", "#25222d":"Grafit", "#55328c":"Erik", "#c4bdcc":"Sis", "#805a3e":"Ceviz", "#ba78eb":"Orkide", "#28242e":"Grafit", "#7652b2":"Erik", "#ded9e7":"Ay gümüşü", "#ece5f4":"İnci", "#9b8cae":"Lila metal", "#bd4b75":"Ahududu" };
let bowLengthInches = 68, handedness = "right", viewer = null, toastTimer, importedParts = [];
const rodLengths = { longRod: 28, shortRod: 10 };
const formatPrice = price => new Intl.NumberFormat("tr-TR", { style:"currency", currency:"TRY", minimumFractionDigits:2, maximumFractionDigits:2 }).format(price);
const modelKindLabels = { riser:"Yay gövdesi", limbs:"Kanatlar", sight:"Nişangâh", string:"Kiriş", stabilizer:"Stabilizer", vbar:"V-bar", "arrow-rest":"Ok yatağı", plunger:"Basınç düğmesi", clicker:"Clicker", "sight-pin":"Arpacık", grip:"Grip", "bow-stand":"Yay ayağı", bag:"Taşıma çantası", unmapped:"Model türü eşleştirilmedi" };

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
    const rodVariant = part.rodLengths?.length ? `<label class="variant-control">Önizleme boyu<select aria-label="${meta.title} önizleme boyu" data-rod-category="${category}">${part.rodLengths.map(length=>`<option value="${length}" ${rodLengths[category]===length?"selected":""}>${length} inç</option>`).join("")}</select><small>Geometri ayarı · mağaza varyantı ve fiyatı değil</small></label>` : "";
    return `<div class="part-row"><div class="part-icon" aria-hidden="true">${meta.icon}</div><div><div class="part-title">${meta.title}</div><div class="part-meta">${meta.hint}</div></div><select class="part-select" aria-label="${meta.title} seç" data-category="${category}">${partCatalog[category].map(item=>`<option value="${item.id}" ${selection[category]===item.id?"selected":""}>${item.label}${item.price?` · ${formatPrice(item.price)}`:""}</option>`).join("")}</select>${rodVariant}${preview}<a class="product-source" href="${part.source}" target="_blank" rel="noreferrer">${part.material}${part.dimensions?` · ${part.dimensions}`:""} · Navek sayfası ↗</a></div>`;
  }).join("");
  $("partList").querySelectorAll("select[data-category]").forEach(select=>select.addEventListener("change",event=>{const category=event.currentTarget.dataset.category;selection[category]=event.currentTarget.value;const part=selectedPart(selection,category);const colorsForPart=part.colors;if(colorsForPart.length&&!colorsForPart.includes(colors[category]))colors[category]=colorsForPart[0];if(category in rodLengths)rodLengths[category]=part.rodLengthInches??part.rodLengths?.[0]??rodLengths[category];update();}));
  $("partList").querySelectorAll("select[data-rod-category]").forEach(select=>select.addEventListener("change",event=>{rodLengths[event.currentTarget.dataset.rodCategory]=Number(event.currentTarget.value);update();}));
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
    const importedForModel=importedParts.filter(part=>part.modelEnabled&&part.modelable);
    const importedRiser=importedForModel.find(part=>part.modelKind==="riser");
    const selectedAccessories=Object.fromEntries(["longRod","shortRod","vbar"].map(category=>[category,{...selectedPart(selection,category),rodLengthInches:rodLengths[category]}]));
    const dimensions=viewer.update({selection:{...selection,riserPart:{...selectedPart(selection,"riser"),riserLengthInches:importedRiser?.riserLengthInches??selectedPart(selection,"riser").riserLengthInches}},colors,bowLengthInches,handedness,importedParts:importedForModel,selectedAccessories});
    $("modelDimensions").textContent=`Yay ${dimensions.bowLengthInches}" (${Math.round(dimensions.bowLengthMm)} mm) · Gövde ${dimensions.riserLengthInches}" (${Math.round(dimensions.riserLengthMm)} mm) · Kanatlar ${dimensions.limbLengthInches.toFixed(1)}" · Ön rod ${rodLengths.longRod}" · Yan rod ${rodLengths.shortRod}"`;
  }
}

function renderBasketParts() {
  const container=$("basketParts");
  container.replaceChildren();
  container.hidden=!importedParts.length;
  if(!importedParts.length)return;
  const summary=document.createElement("div");summary.className="basket-summary";
  const total=importedParts.reduce((sum,part)=>sum+(part.lineTotal??0),0);
  summary.textContent=`${importedParts.length} ürün satırı · ${importedParts.filter(part=>part.modelEnabled&&part.modelable).length} 3D parça etkin · PDF toplamı ${formatPrice(total)}`;
  container.append(summary);
  for(const part of importedParts){
    const card=document.createElement("div");card.className="basket-part";card.draggable=part.modelable;card.dataset.partId=part.id;
    const text=document.createElement("div");
    const title=document.createElement("div");title.className="basket-part-title";title.textContent=part.label;text.append(title);
    const meta=document.createElement("div");meta.className="basket-part-meta";meta.textContent=`${part.code} · ${part.quantity} adet${part.unitPrice!==null?` · ${formatPrice(part.unitPrice)} / adet`:""}`;text.append(meta);
    const kind=document.createElement("div");kind.className=`basket-kind ${part.modelable?"":"basket-no-model"}`;kind.textContent=part.modelable?`${modelKindLabels[part.modelKind]} · şematik 3D parça`:`${modelKindLabels[part.modelKind]} · 3D yay üzerine takılı değil`;text.append(kind);
    const button=document.createElement("button");button.type="button";button.textContent=part.modelable?(part.modelEnabled?"Modelden çıkar":"Modele ekle"):"Yayda gösterilmez";button.disabled=!part.modelable;
    button.addEventListener("click",()=>{if(!part.modelable)return;part.modelEnabled=!part.modelEnabled;update();renderBasketParts();});
    card.append(text,button);
    if(part.modelable){
      card.addEventListener("dragstart",event=>{event.dataTransfer.setData("application/x-okform-part",part.id);event.dataTransfer.effectAllowed="copy";card.classList.add("dragging");});
      card.addEventListener("dragend",()=>card.classList.remove("dragging"));
    }
    container.append(card);
  }
  const clear=document.createElement("button");clear.type="button";clear.className="remove-basket";clear.textContent="Sepeti kaldır";clear.addEventListener("click",clearImportedBasket);container.append(clear);
}

function clearImportedBasket(){
  importedParts=[];$("basketPdf").value="";$("pdfImportStatus").textContent="PDF içindeki adres ve iletişim bilgileri alınmaz.";renderBasketParts();update();
}

async function importBasketFile(file){
  if(!file)return;
  $("pdfImportStatus").textContent="Sepet PDF’si tarayıcıda okunuyor…";
  try{
    const {extractNavekBasket}=await import("./pdf-import.js?v=pdf-model-3");
    importedParts=(await extractNavekBasket(file)).map(part=>({...part,modelEnabled:part.modelable}));
    const pdfBowLength=importedParts.find(part=>part.modelKind==="limbs"&&[66,68,70].includes(part.bowLengthInches))?.bowLengthInches;
    if(pdfBowLength){bowLengthInches=pdfBowLength;$("bowLength").value=String(pdfBowLength);}
    const pdfRiser=importedParts.find(part=>part.modelKind==="riser"&&part.riserLengthInches);
    const rightHand=importedParts.find(part=>part.handedness);
    if(rightHand)handedness=rightHand.handedness;
    $("handedness").value=handedness;
    update();renderBasketParts();
    const active=importedParts.filter(part=>part.modelEnabled&&part.modelable).length;
    $("pdfImportStatus").textContent=`${importedParts.length} ürün bulundu; ${active} parça yaklaşık 3D geometriyle modele eklendi.${pdfRiser?` Gövde ölçüsü ${pdfRiser.riserLengthInches} inç olarak okundu.`:""} PDF yalnızca bu tarayıcıda işlendi.`;
  }catch(error){$("pdfImportStatus").textContent=error.message;}
}

function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
function summaryText(){return [...Object.entries(partMeta).map(([category,meta])=>{const part=selectedPart(selection,category);return `${meta.title}: ${part.label}${part.price?` (${formatPrice(part.price)})`:" (fiyat doğrulanmadı)"}${part.colors.length?` · görsel önizleme: ${colorNames[colors[category]]??"renk"} (satıcı rengi değil)`:""} · ${part.source}`;}),`3D model: ${bowLengthInches} inç · ${handedness === "right" ? "sağ el" : "sol el"}`,`Ölçekli parametrik önizleme; üretici CAD modeli değildir.`,`Ürün fiyatları kontrol tarihi: 10.10.2026; değişebilir.`,`Tahmini toplam (fiyatı bilinen seçili parçalar): ${formatPrice(calculateTotal(selection))}`,`Uyumluluk: ${evaluateCompatibility(selection).label}`].join("\n");}

$("shareButton").addEventListener("click",async()=>{const params=new URLSearchParams({...selection,...Object.fromEntries(Object.entries(colors).map(([key,value])=>[`color-${key}`,value])),bowLength:String(bowLengthInches),hand:handedness});const url=new URL(location.href);url.hash=params.toString();try{await navigator.clipboard.writeText(url.toString());showToast("Yapılandırma bağlantısı kopyalandı.");}catch{location.hash=params.toString();showToast("Yapılandırma bağlantısı adres çubuğuna eklendi.");}});
$("resetConfig").addEventListener("click",()=>{Object.assign(selection,initialSelection);Object.assign(colors,initialColors);Object.assign(rodLengths,{longRod:28,shortRod:10});bowLengthInches=68;handedness="right";clearImportedBasket();$("bowLength").value="68";$("handedness").value="right";document.querySelectorAll("[data-component]").forEach(input=>{input.checked=true;viewer?.setComponentVisibility(input.dataset.component,true);});history.replaceState(null,"",location.pathname);update();});
$("resetView").addEventListener("click",()=>viewer?.resetView());
$("bowLength").addEventListener("change",event=>{bowLengthInches=Number(event.currentTarget.value);update();});
$("handedness").addEventListener("change",event=>{handedness=event.currentTarget.value;update();});
document.querySelectorAll("[data-component]").forEach(input=>input.addEventListener("change",event=>viewer?.setComponentVisibility(event.currentTarget.dataset.component,event.currentTarget.checked)));
$("basketPdf").addEventListener("change",event=>importBasketFile(event.currentTarget.files?.[0]));
const pdfDropZone=$("pdfDropZone");
for(const eventName of ["dragenter","dragover"])pdfDropZone.addEventListener(eventName,event=>{event.preventDefault();pdfDropZone.classList.add("drag-over");});
for(const eventName of ["dragleave","drop"])pdfDropZone.addEventListener(eventName,event=>{event.preventDefault();pdfDropZone.classList.remove("drag-over");});
pdfDropZone.addEventListener("drop",event=>importBasketFile(event.dataTransfer.files?.[0]));
const canvasWrap=document.querySelector(".canvas-wrap");
canvasWrap.addEventListener("dragover",event=>{if(event.dataTransfer.types.includes("application/x-okform-part")){event.preventDefault();canvasWrap.classList.add("drop-target");}});
canvasWrap.addEventListener("dragleave",event=>{if(!canvasWrap.contains(event.relatedTarget))canvasWrap.classList.remove("drop-target");});
canvasWrap.addEventListener("drop",event=>{event.preventDefault();canvasWrap.classList.remove("drop-target");const part=importedParts.find(item=>item.id===event.dataTransfer.getData("application/x-okform-part"));if(!part?.modelable)return;part.modelEnabled=true;update();renderBasketParts();showToast(`${part.label} 3D modele eklendi.`);});
$("summaryButton").addEventListener("click",()=>{$("summaryContent").innerHTML=summaryText().split("\n").map(line=>`<div>${line}</div>`).join("");$("summaryDialog").showModal();});
$("closeDialog").addEventListener("click", () => $("summaryDialog").close());
$("copySummary").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summaryText());showToast("Özet kopyalandı.");$("summaryDialog").close();}catch{showToast("Kopyalamaya izin verilmedi.");}});

function readHash(){const params=new URLSearchParams(location.hash.slice(1));for(const category of Object.keys(partCatalog))if(partCatalog[category].some(part=>part.id===params.get(category)))selection[category]=params.get(category);for(const category of Object.keys(colors))if(params.has(`color-${category}`)&&/^#[\da-f]{6}$/i.test(params.get(`color-${category}`)))colors[category]=params.get(`color-${category}`);if([66,68,70].includes(Number(params.get("bowLength"))))bowLengthInches=Number(params.get("bowLength"));if(["left","right"].includes(params.get("hand")))handedness=params.get("hand");$("bowLength").value=String(bowLengthInches);$("handedness").value=handedness;}
readHash();
update();
