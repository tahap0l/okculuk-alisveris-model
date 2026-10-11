import test from "node:test";
import assert from "node:assert/strict";
import { calculateModelDimensions, getLimbBendDepthMm, getLimbDrawDeflectionMm, getRiserDesign, getRiserLengthInches, getStringNockDepthMm, getStringTipOffsetMm, MILLIMETERS_PER_INCH, STRING_BRACE_HEIGHT_MM } from "../src/modeling.js";

test("selected bow length and riser produce correctly scaled millimeter dimensions", () => {
  const dimensions = calculateModelDimensions(25, 68);
  assert.equal(dimensions.units, "mm");
  assert.equal(dimensions.bowLengthMm, 68 * MILLIMETERS_PER_INCH);
  assert.equal(dimensions.riserLengthMm, 25 * MILLIMETERS_PER_INCH);
  assert.equal(dimensions.limbLengthInches, 21.5);
  assert.equal(dimensions.limbTipOffsetMm, dimensions.bowLengthMm / 2);
});

test("supported lengths and riser product sizes produce valid symmetric limbs", () => {
  for (const bowLength of [66, 68, 70]) {
    const dimensions = calculateModelDimensions(23, bowLength);
    assert.equal(dimensions.riserLengthInches + 2 * dimensions.limbLengthInches, bowLength);
    assert.equal(dimensions.limbLengthMm, dimensions.limbLengthInches * MILLIMETERS_PER_INCH);
  }
});

test("unsupported lengths fall back safely and riser values are bounded", () => {
  assert.equal(calculateModelDimensions(25, 64).bowLengthInches, 68);
  assert.equal(calculateModelDimensions(50, 68).riserLengthInches, 29);
  assert.equal(calculateModelDimensions(0, 68).riserLengthInches, 25);
  assert.equal(getRiserLengthInches({ dimensions: '23" riser' }), 23);
  assert.equal(getRiserLengthInches({}), 25);
});

test("both limb tips and the taut string share the same forward mounting plane", () => {
  assert.equal(getStringTipOffsetMm(0), -STRING_BRACE_HEIGHT_MM);
  assert.ok(getStringTipOffsetMm(0) < -33, "the string sits on the archer side of the riser");
  for (const drawMm of [0, 12 * MILLIMETERS_PER_INCH, 24 * MILLIMETERS_PER_INCH]) {
    assert.equal(getStringTipOffsetMm(drawMm), -STRING_BRACE_HEIGHT_MM - drawMm * 0.12);
    assert.equal(getStringNockDepthMm(drawMm), getStringTipOffsetMm(drawMm) - drawMm);
  }
});

test("limbs curve toward the target side, away from the archer-side string", () => {
  const dimensions = calculateModelDimensions(25, 68);
  const stringPlane = getStringTipOffsetMm(0);
  for (const style of ["generic", "carbon-foam", "bamboo-laminate"]) {
    assert.ok(getLimbBendDepthMm(0.5, style, 0) > stringPlane + 60, `${style} limb bends forward away from the string`);
    assert.ok(Math.abs(getLimbBendDepthMm(1, style, 0) - stringPlane) < 1e-9);
    assert.ok(getLimbBendDepthMm(0.5, style, 24 * MILLIMETERS_PER_INCH) > stringPlane);
  }
  assert.equal(dimensions.limbTipOffsetMm, 68 * MILLIMETERS_PER_INCH / 2);
});

test("drawing the string moves its nock backward while limb tips stay attached", () => {
  const draw = 24 * MILLIMETERS_PER_INCH;
  assert.ok(getStringNockDepthMm(draw) < getStringNockDepthMm(0));
  assert.ok(getStringTipOffsetMm(draw) < getStringTipOffsetMm(0));
  assert.ok(Math.abs(getLimbBendDepthMm(1, "generic", draw) - getStringTipOffsetMm(draw)) < 1e-9);
});

test("limb draw mechanics hold the root and flex the working limb toward the archer", () => {
  const draw = 24 * MILLIMETERS_PER_INCH;
  assert.equal(getLimbDrawDeflectionMm(0, draw), 0);
  assert.ok(getLimbDrawDeflectionMm(0.5, draw) < 0, "the working limb flexes toward the archer side");
  assert.ok(getLimbDrawDeflectionMm(1, draw) < getLimbDrawDeflectionMm(0.5, draw), "limb-tip deflection follows the backward-moving string");
  assert.ok(getLimbDrawDeflectionMm(0.5, draw) < getLimbDrawDeflectionMm(0.5, draw / 2));
  assert.ok(getLimbDrawDeflectionMm(1, draw) < getLimbDrawDeflectionMm(1, draw / 2));
});

test("Navek riser models have distinct dimensional and machining profiles", () => {
  const styles = ["astral-cast", "evolium-compact", "scopus-cnc", "lancer-cast", "lancer-two-tone", "sovren-cnc", "alfa-cutout-23", "alfa-cutout-25", "atf-dx-damped", "winex-angular", "formula-offset"];
  const signatures = styles.map(style => {
    const design = getRiserDesign(style);
    assert.ok(design.sightWindowWidthMm > 0, `${style} keeps a real sight window`);
    assert.ok(design.bodyWidthScale > 0 && design.bodyDepthScale > 0);
    return JSON.stringify(design);
  });
  assert.equal(new Set(signatures).size, styles.length, "each catalog body gets its own geometric recipe");
  assert.ok(getRiserDesign("evolium-compact").sightWindowWidthMm < getRiserDesign("alfa-cutout-25").sightWindowWidthMm);
  assert.equal(getRiserDesign("atf-dx-damped").damperCount, 3);
  assert.equal(getRiserDesign("formula-offset").mountStyle, "Formula");
});
