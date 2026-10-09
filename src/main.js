import { partCatalog, partMeta, initialSelection, initialColors, selectedPart, evaluateCompatibility, calculateTotal } from "./catalog.js";
import { drawBow } from "./renderer.js";

const $ = id => document.getElementById(id);
const selection = { ...initialSelection }, colors = { ...initialColors };
const colorNames = { "#7752b2":"Gece moru", "#d9d4de":"Ay gümüşü", "#262332":"Grafit", "#af486d":"Ahududu", "#25222d":"Grafit", "#55328c":"Erik", "#c4bdcc":"Sis", "#805a3e":"Ceviz", "#ba78eb":"Orkide", "#28242e":"Grafit", "#7652b2":"Erik" };
const canvas = $("bowCanvas"); let yaw = -.38, dragging = false, previousX = 0, toastTimer;
const formatPrice = price => new Intl.NumberFormat("tr-TR", { style:"currency", currency:"TRY", minimumFractionDigits:2, maximumFractionDigits:2 }).format(price);
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
function resizeCanvas(){const ratio=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);const ctx=canvas.getContext("2d");ctx.setTransform(ratio,0,0,ratio,0,0);drawBow(ctx,rect.width,rect.height,{yaw,colors,selection});}
function update(){renderControls();const status=evaluateCompatibility(selection),statusEl=$("compatibility");statusEl.className=`compatibility ${status.level}`;statusEl.innerHTML=`<span class="check" aria-hidden="true">${status.compatible===true?"✓":"!"}</span><span><strong>${status.label}</strong><br>${status.detail}</span>`;$("totalPrice").textContent=formatPrice(calculateTotal(selection));$("colorLabel").textContent=`Görsel önizleme · ${colorNames[colors.riser]??"özel renk"}`;$("viewAngle").textContent=Math.abs(yaw)<.12?"ÖN GÖRÜNÜM":yaw>.12?"SAĞ AÇI":"SOL AÇI";resizeCanvas();}
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
function summaryText(){return [...Object.entries(partMeta).map(([category,meta])=>{const part=selectedPart(selection,category);return `${meta.title}: ${part.label}${part.price?` (${formatPrice(part.price)})`:" (fiyat doğrulanmadı)"}${part.colors.length?` · görsel önizleme: ${colorNames[colors[category]]??"renk"} (satıcı rengi değil)`:""} · ${part.source}`;}),`Ürün fiyatları kontrol tarihi: 10.10.2026; değişebilir.`, `Tahmini toplam (fiyatı bilinen seçili parçalar): ${formatPrice(calculateTotal(selection))}`,`Uyumluluk: ${evaluateCompatibility(selection).label}`].join("\n");}
$("shareButton").addEventListener("click",async()=>{const params=new URLSearchParams({...selection,...Object.fromEntries(Object.entries(colors).map(([key,value])=>[`color-${key}`,value]))});const url=new URL(location.href);url.hash=params.toString();try{await navigator.clipboard.writeText(url.toString());showToast("Yapılandırma bağlantısı kopyalandı.");}catch{location.hash=params.toString();showToast("Yapılandırma bağlantısı adres çubuğuna eklendi.");}});
$("resetConfig").addEventListener("click",()=>{Object.assign(selection,initialSelection);Object.assign(colors,initialColors);yaw=-.38;history.replaceState(null,"",location.pathname);update();});
$("resetView").addEventListener("click",()=>{yaw=-.38;resizeCanvas();$("viewAngle").textContent="ÖN GÖRÜNÜM";});
$("summaryButton").addEventListener("click",()=>{$("summaryContent").innerHTML=summaryText().split("\n").map(line=>`<div>${line}</div>`).join("");$("summaryDialog").showModal();});
$("closeDialog").addEventListener("click", () => $("summaryDialog").close());
$("copySummary").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(summaryText());showToast("Özet kopyalandı.");$("summaryDialog").close();}catch{showToast("Kopyalamaya izin verilmedi.");}});
canvas.addEventListener("pointerdown",event=>{dragging=true;previousX=event.clientX;canvas.setPointerCapture(event.pointerId);});
canvas.addEventListener("pointermove",event=>{if(!dragging)return;yaw+=(event.clientX-previousX)*.012;previousX=event.clientX;resizeCanvas();$("viewAngle").textContent=yaw>.12?"SAĞ AÇI":yaw<-.12?"SOL AÇI":"ÖN GÖRÜNÜM";});
canvas.addEventListener("pointerup",()=>{dragging=false;});window.addEventListener("resize",resizeCanvas);
function readHash(){const params=new URLSearchParams(location.hash.slice(1));for(const category of Object.keys(partCatalog))if(partCatalog[category].some(part=>part.id===params.get(category)))selection[category]=params.get(category);for(const category of Object.keys(colors))if(params.has(`color-${category}`)&&/^#[\da-f]{6}$/i.test(params.get(`color-${category}`)))colors[category]=params.get(`color-${category}`);}
readHash();update();

