import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal, evaluateCompatibility, getPartCompatibility, initialSelection, partCatalog, selectedPart, partMeta } from "../src/catalog.js";

test("default Navek setup has matching ILF standards and a complete Olympic bow", () => {
  assert.equal(evaluateCompatibility(initialSelection).compatible, true);
  assert.deepEqual(Object.keys(initialSelection), ["riser", "limbs", "sight", "longRod", "shortRod", "extender", "vbar", "clicker", "string"]);
  assert.deepEqual(Object.keys(partMeta), Object.keys(initialSelection));
});

test("known ILF limbs are only confirmed with ILF risers", () => {
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "kinetic-lancer-two-tone-25", limbs: "wns-explore-w1" }).compatible, true);
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "core-astral-25", limbs: "wns-explore-w1" }).compatible, null);
  assert.equal(evaluateCompatibility({ ...initialSelection, riser: "kinetic-lancer-two-tone-25", limbs: "kinetic-invelta-plus" }).compatible, null);
});

test("Formula risers only accept Formula limbs and incompatible choices are marked", () => {
  const formulaSetup = { ...initialSelection, riser: "hoyt-formula-sr-25", limbs: "hoyt-formula-metrix-foam" };
  assert.equal(evaluateCompatibility(formulaSetup).compatible, true);
  assert.equal(getPartCompatibility(formulaSetup, "limbs", "wns-explore-w1").compatible, false);
  assert.equal(getPartCompatibility(formulaSetup, "limbs", "hoyt-formula-metrix-wood").compatible, true);
  assert.equal(getPartCompatibility({ ...initialSelection, riser: "kinetic-lancer-two-tone-25" }, "limbs", "hoyt-formula-metrix-foam").compatible, false);
  assert.equal(evaluateCompatibility({ ...formulaSetup, handedness: "left" }).compatible, false);
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
      assert.equal(typeof part.colorOptionsVerified, "boolean");
      assert.ok(part.colors.length > 0);
      assert.ok(part.price >= 0);
    }
  }
});

test("every listed product has its own 3D style and color preview", () => {
  for (const [category, parts] of Object.entries(partCatalog)) {
    assert.equal(new Set(parts.map(part => part.modelStyle)).size, parts.length, `${category} products have distinct model styles`);
    for (const part of parts) assert.ok(part.colorOptionsVerified || part.colors.length >= 2, `${part.label} has multiple render colors`);
  }
});

test("long and short rod length controls are separate model-only variants", () => {
  for (const [category, expected] of [["longRod", [26, 28, 30]], ["shortRod", [10, 11, 12]], ["extender", [3, 4, 5]]]) {
    assert.deepEqual(partCatalog[category][0].rodLengths, expected);
    assert.equal(partCatalog[category][0].rodLengthInches, expected[0] === 26 ? 28 : expected[0] === 3 ? 4 : 10);
  }
});

test("a Navek clicker is selected by default and has distinct configurable 3D product models", () => {
  assert.equal(selectedPart(initialSelection, "clicker").id, "avalon-clicker-sight-hole");
  assert.equal(partCatalog.clicker.length, 3);
  assert.equal(new Set(partCatalog.clicker.map(part => part.modelStyle)).size, 3);
  assert.ok(partCatalog.clicker.every(part => part.source.startsWith("https://www.naveksport.com.tr/")));
  assert.ok(Math.abs(calculateTotal({ ...initialSelection, clicker: "beiter-clicker-standard" }) - calculateTotal(initialSelection) - (1252.8 - 693.6)) < 1e-8);
});
