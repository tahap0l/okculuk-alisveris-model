import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, evaluateCompatibility, initialSelection, partCatalog, selectedPart, partMeta } from "../src/catalog.js";

test("default Navek setup has matching ILF standards and a complete Olympic bow", () => {
  assert.equal(evaluateCompatibility(initialSelection).compatible, true);
  assert.deepEqual(Object.keys(initialSelection), ["riser", "limbs", "sight", "longRod", "shortRod", "vbar", "string"]);
  assert.deepEqual(Object.keys(partMeta), Object.keys(initialSelection));
});

test("known ILF limbs are only confirmed with ILF risers", () => {
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "kinetic-lancer-two-tone-25", limbs: "wns-explore-w1" }).compatible, true);
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "core-astral-25", limbs: "wns-explore-w1" }).compatible, null);
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "kinetic-lancer-two-tone-25", limbs: "kinetic-invelta-plus" }).compatible, null);
});

test("total sums every selected priced part and treats unverified prices as zero", () => {
  const expected = Object.entries(initialSelection).reduce((sum, [category, id]) => sum + (partCatalog[category].find(item => item.id === id)?.price || 0), 0);
  assert.equal(calculateTotal(initialSelection), expected);
  assert.equal(partCatalog.limbs.find(part => part.id === "white-feather-flight").price, 0);
});

test("unknown selections safely fall back to first item per category", () => {
  assert.equal(selectedPart({ ...initialSelection, riser: "missing" }, "riser").id, partCatalog.riser[0].id);
});

test("expanded Navek categories have product links and distinguish preview colors from seller variants", () => {
  for (const category of Object.keys(partCatalog)) {
    assert.ok(partCatalog[category].length >= 3, `${category} has enough choices`);
    for (const part of partCatalog[category]) {
      assert.ok(part.source.startsWith("https://www.naveksport.com.tr/"));
      assert.equal(part.colorOptionsVerified, false);
      assert.ok(part.colors.length > 0);
      assert.ok(part.price >= 0);
    }
  }
});

test("long and short rod length controls are separate model-only variants", () => {
  for (const [category, expected] of [["longRod", [26, 28, 30]], ["shortRod", [10, 11, 12]]]) {
    assert.deepEqual(partCatalog[category][0].rodLengths, expected);
    assert.equal(partCatalog[category][0].rodLengthInches, expected[0] === 26 ? 28 : 10);
  }
});
