const PDF_JS_VERSION = "6.4.299";
const PDF_JS_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.min.mjs`;

const wordPattern = terms => new RegExp(`(?:^|[^\\p{L}\\p{N}])(?:${terms})(?=$|[^\\p{L}\\p{N}])`, "iu");
const categoryPatterns = [
  ["riser", wordPattern("riser|yay gövdesi|yay gövde|gövdesi|gövde")],
  ["limbs", wordPattern("limbs?|yay kanadı|kanadı|kanatları")],
  ["sight", wordPattern("sights?|nişangahı|nişangâhı|nişangah|nişangâh")],
  ["string", wordPattern("string|kiriş")],
  ["stabilizer", wordPattern("stabilizer|stabiliser|denge çubuğu")],
  ["vbar", wordPattern("v[- ]?bar")],
  ["arrow-rest", wordPattern("arrow rest|ok yatağı|ok yatakları")],
  ["plunger", wordPattern("plunger|basınç düğmesi|basınç butonu")],
  ["clicker", wordPattern("clicker|klikör|klikır")],
  ["sight-pin", wordPattern("arpacık|sight pin|pin")],
  ["grip", wordPattern("grip|tutamak")],
  ["bow-stand", wordPattern("ayaklığı|yay sehpası|bow stand|stand")],
  ["bag", wordPattern("çanta|sırt çantası|bag|backpack")]
];

function amountFromText(text) {
  const matches = [...text.matchAll(/(?:₺\s*|\b)(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:TL|₺)/gi)];
  if (!matches.length) return null;
  return Number(matches[0][1].replaceAll(".", "").replace(",", "."));
}

function cleanLabel(text) {
  return text
    .replace(/\b\d{2}-\d{8}\b/g, " ")
    .replace(/(?:₺\s*)?\d{1,3}(?:\.\d{3})*,\d{2}\s*(?:TL|₺)/gi, " ")
    .replace(/\b\d+\s*(?:adet|ad\.?|pcs?)\b/gi, " ")
    .replace(/\b(?:birim fiyat|toplam|fiyat|ürün|code|adet|birim)\b/gi, " ")
    .replace(/[|•·]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function inferModelKind(label) {
  return categoryPatterns.find(([, pattern]) => pattern.test(label))?.[0] ?? "unmapped";
}

function readDimensions(label, modelKind) {
  const inch = label.match(/\b(\d{1,2}(?:\.\d+)?)\s*(?:inch|inches|in\b|["'″”])/i);
  const lbs = label.match(/\b(\d{1,2}(?:\.\d+)?)\s*(?:lbs?|pound)\b/i);
  return {
    ...(modelKind === "riser" && inch ? { riserLengthInches: Number(inch[1]) } : {}),
    ...(modelKind === "limbs" && inch ? { bowLengthInches: Number(inch[1]) } : {}),
    ...(lbs ? { drawWeightLbs: Number(lbs[1]) } : {})
  };
}

export function parseBasketLines(lines) {
  const blocks = [];
  let current = null;
  let pending = [];
  let tableStarted = !lines.some(line => /code.*ürün.*adet/i.test(String(line)));
  for (const rawLine of lines) {
    const line = String(rawLine).replace(/\s+/g, " ").trim();
    if (!line) continue;
    if (/code.*ürün.*adet/i.test(line)) {
      if (current) blocks.push(current);
      current = null;
      pending = [];
      tableStarted = true;
      continue;
    }
    if (!tableStarted) continue;
    if (/sepet toplamı|genel toplam|https?:\/\//i.test(line)) {
      if (current) blocks.push(current);
      current = null;
      pending = [];
      continue;
    }
    const codeMatch = line.match(/\b(\d{2}-\d{8})\b/);
    if (codeMatch) {
      if (current) blocks.push(current);
      current = { code: codeMatch[1], lines: [...pending, line] };
      pending = [];
    } else if (current) current.lines.push(line);
    else pending.push(line);
  }
  if (current) blocks.push(current);

  return blocks.map(({ code, lines: itemLines }) => {
    const sourceText = itemLines.join(" ");
    const label = cleanLabel(sourceText);
    const modelKind = inferModelKind(label);
    const quantityMatch = sourceText.match(/\b(\d+)\s*(?:adet|ad\.?|pcs?)\b/i);
    const quantity = Math.max(1, Number(quantityMatch?.[1] ?? 1));
    const unitPrice = amountFromText(sourceText);
    const inches = readDimensions(label, modelKind);
    const hasRightHand = /sağ el|right hand/i.test(label);
    const color = /siyah|black/i.test(label) ? "#262332" : /mor|purple|violet/i.test(label) ? "#7752b2" : null;
    return {
      id: code,
      code,
      label: label || `Ürün ${code}`,
      quantity,
      unitPrice,
      lineTotal: unitPrice === null ? null : unitPrice * quantity,
      modelKind,
      modelable: !["bag", "bow-stand", "unmapped"].includes(modelKind),
      handedness: hasRightHand ? "right" : /sol el|left hand/i.test(label) ? "left" : null,
      color,
      ...inches
    };
  });
}

function groupPdfTextLines(items) {
  const rows = new Map();
  for (const item of items) {
    const value = String(item.str ?? "").trim();
    if (!value) continue;
    const y = Math.round(Number(item.transform?.[5] ?? 0) / 2) * 2;
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y).push({ x: Number(item.transform?.[4] ?? 0), value });
  }
  return [...rows.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, cells]) => cells.sort((a, b) => a.x - b.x).map(cell => cell.value).join(" "));
}

export async function extractNavekBasket(file) {
  if (!file || (!file.name?.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf")) {
    throw new Error("Lütfen bir PDF sepet dosyası seç.");
  }
  if (file.size > 15 * 1024 * 1024) throw new Error("PDF en fazla 15 MB olabilir.");
  const pdfjs = await import(PDF_JS_URL);
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.min.mjs`;
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  if (pdf.numPages > 30) {
    await pdf.destroy();
    throw new Error("Sepet PDF'si en fazla 30 sayfa olabilir.");
  }
  const lines = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    lines.push(...groupPdfTextLines((await page.getTextContent()).items));
  }
  await pdf.destroy();
  const products = parseBasketLines(lines);
  if (!products.length) throw new Error("PDF içinde okunabilir ürün satırı bulunamadı. Tarama görüntüsü olan PDF'leri henüz okuyamıyorum.");
  return products;
}

