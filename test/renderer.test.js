import test from "node:test";
import assert from "node:assert/strict";
import { calculateModelDimensions, getRiserLengthInches, MILLIMETERS_PER_INCH } from "../src/modeling.js";

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
