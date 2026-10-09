import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, evaluateCompatibility, initialSelection, partCatalog, selectedPart } from "../src/catalog.js";

test("default bow has matching ILF limbs and riser", () => {
  assert.equal(evaluateCompatibility(initialSelection).compatible, true);
  assert.match(evaluateCompatibility(initialSelection).detail, /ILF/);
});
test("compatibility flags mismatched bow limb standards", () => {
  const result = evaluateCompatibility({ ...initialSelection, riser: "classic" });
  assert.equal(result.compatible, false);
  assert.match(result.detail, /uyumlu görünmüyor/);
});
test("compatible bolt-on set can be assembled", () => {
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "classic", limbs: "classic-limb" }).compatible, true);
});
test("selected price total reflects all four chosen parts", () => {
  assert.equal(calculateTotal(initialSelection), 42250);
});
test("unknown selections safely fall back to the first catalog part", () => {
  assert.equal(selectedPart({ ...initialSelection, riser: "missing" }, "riser").id, partCatalog.riser[0].id);
});
test("catalog parts all have a price, mounting type, and at least one color", () => {
  for (const parts of Object.values(partCatalog)) for (const part of parts) assert.ok(part.price > 0 && part.mount && part.colors.length > 0);
});

