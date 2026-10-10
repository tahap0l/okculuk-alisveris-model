import test from "node:test";
import assert from "node:assert/strict";
import { parseBasketLines } from "../src/pdf-import.js";

test("basket parser joins wrapped catalog rows and extracts price, quantity and model dimensions", () => {
  const parts = parseBasketLines([
    "Code Ürün Adet Birim Fiyat Toplam",
    "00-00002828 Win&Win Klasik Yay Kanadı Wiawis",
    "NS-G Wood 70 inch - 44 Lbs 1 Adet 57.708,00 TL 57.708,00 TL",
    "00-00002648 Win&Win Klasik Yay Gövdesi Wiawis CX7 25'' Siyah Sağ El",
    "1 Adet 44.170,08 TL 44.170,08 TL",
    "Sepet Toplamı: 101.878,08 TL"
  ]);

  assert.equal(parts.length, 2);
  assert.equal(parts[0].modelKind, "limbs");
  assert.equal(parts[0].bowLengthInches, 70);
  assert.equal(parts[0].drawWeightLbs, 44);
  assert.equal(parts[0].quantity, 1);
  assert.equal(parts[0].unitPrice, 57708);
  assert.equal(parts[1].modelKind, "riser");
  assert.equal(parts[1].riserLengthInches, 25);
  assert.equal(parts[1].handedness, "right");
  assert.equal(parts[1].color, "#262332");
});

test("basket parser distinguishes mounted accessories from products kept outside the bow model", () => {
  const [stabilizer, caseItem, unknown] = parseBasketLines([
    "00-00002415 Ases Stabilizer Uzun Sonix Siyah 26 inch 1 Adet 3.939,84 TL 3.939,84 TL",
    "00-00002120 Helix Klasik Yay Sırt Çantası Siyah 1 Adet 3.851,52 TL 3.851,52 TL",
    "00-00005555 Bakım Bezi 1 Adet 100,00 TL 100,00 TL"
  ]);
  assert.equal(stabilizer.modelKind, "stabilizer");
  assert.equal(stabilizer.modelable, true);
  assert.equal(caseItem.modelKind, "bag");
  assert.equal(caseItem.modelable, false);
  assert.equal(unknown.modelKind, "unmapped");
  assert.equal(unknown.unitPrice, 100);
});

