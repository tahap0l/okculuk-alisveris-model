import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, evaluateCompatibility, initialSelection, partCatalog, selectedPart } from "../src/catalog.js";

test("default Navek bow does not claim unverified riser compatibility", () => {
  assert.equal(evaluateCompatibility(initialSelection).compatible, null);
  assert.match(evaluateCompatibility(initialSelection).detail, /doğrulanamadı/);
});
test("known ILF limb compatibility is stated for an ILF riser only", () => {
  const result = evaluateCompatibility({ ...initialSelection, riser: "core-astral-25" });
  assert.equal(result.compatible, null);
  assert.equal(partCatalog.limbs.find(part => part.id === "kinetic-honoric-v2").mount, "ILF");
});
test("selected price total includes only priced parts", () => {
  assert.equal(calculateTotal(initialSelection), 5583.48 + 6814.08 + 790);
});
test("unknown selections safely fall back to the first catalog part", () => {
  assert.equal(selectedPart({ ...initialSelection, riser: "missing" }, "riser").id, partCatalog.riser[0].id);
});
test("product prices and source links are present and preview colors are not marked as seller variants", () => {
  for (const category of ["riser", "limbs", "sight"]) for (const part of partCatalog[category]) {
    assert.ok(part.price > 0 && part.source.startsWith("https://www.naveksport.com.tr/"));
    assert.equal(part.colorOptionsVerified, false);
    assert.ok(part.colors.length > 0);
  }
  assert.equal(partCatalog.string[0].price, 0);
  assert.equal(partCatalog.string[0].colors.length, 0);
});

