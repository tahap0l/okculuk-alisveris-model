import test from "node:test";
import assert from "node:assert/strict";
import { calculateModelDimensions, getLimbBendDepthMm, getRiserLengthInches, getStringTipOffsetMm, MILLIMETERS_PER_INCH, STRING_BRACE_HEIGHT_MM } from "../src/modeling.js";

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
  assert.equal(getStringTipOffsetMm(0), STRING_BRACE_HEIGHT_MM);
  assert.ok(STRING_BRACE_HEIGHT_MM > 33, "the string clears the riser's front face");
  for (const drawMm of [0, 12 * MILLIMETERS_PER_INCH, 24 * MILLIMETERS_PER_INCH]) {
    assert.equal(getStringTipOffsetMm(drawMm), STRING_BRACE_HEIGHT_MM + drawMm * 0.12);
  }
});

test("limbs curve away from the string between the riser and the tips", () => {
  const dimensions = calculateModelDimensions(25, 68);
  const stringPlane = getStringTipOffsetMm(0);
  for (const style of ["generic", "carbon-foam", "bamboo-laminate"]) {
    assert.ok(getLimbBendDepthMm(0.5, style, 0) < stringPlane - 60, `${style} limb clears the string at midspan`);
    assert.ok(Math.abs(getLimbBendDepthMm(1, style, 0) - stringPlane) < 1e-9);
    assert.ok(getLimbBendDepthMm(0.5, style, 24 * MILLIMETERS_PER_INCH) < stringPlane);
  }
  assert.equal(dimensions.limbTipOffsetMm, 68 * MILLIMETERS_PER_INCH / 2);
});

test("drawn string midpoint moves toward the archer side while tips stay attached", () => {
  const draw = 24 * MILLIMETERS_PER_INCH;
  assert.ok(getStringTipOffsetMm(draw) > getStringTipOffsetMm(0));
  assert.ok(Math.abs(getLimbBendDepthMm(1, "generic", draw) - getStringTipOffsetMm(draw)) < 1e-9);
});
