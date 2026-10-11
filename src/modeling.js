export const MILLIMETERS_PER_INCH = 25.4;
export const STRING_BRACE_HEIGHT_MM = 55;
export const SUPPORTED_BOW_LENGTHS_INCHES = Object.freeze([66, 68, 70]);

export function getStringTipOffsetMm(drawMm = 0) {
  return STRING_BRACE_HEIGHT_MM + Math.max(0, Number(drawMm) || 0) * 0.12;
}

export function getLimbBendDepthMm(t, style = "generic", drawMm = 0) {
  const progress = Math.min(1, Math.max(0, Number(t) || 0));
  const pull = Math.max(0, Number(drawMm) || 0);
  const bend = style.includes("foam") ? 112 : style.includes("bamboo") ? 94 : 102;
  return 2 + (STRING_BRACE_HEIGHT_MM - 2) * progress - bend * Math.sin(Math.PI * progress)
    + pull * (0.12 * progress + 0.11 * Math.sin(Math.PI * progress));
}

export function getRiserLengthInches(part) {
  const parsed = Number(part?.riserLengthInches ?? String(part?.dimensions ?? "").match(/[\d.]+/)?.[0]);
  return Number.isFinite(parsed) ? Math.min(29, Math.max(19, parsed)) : 25;
}

export function calculateModelDimensions(riserLengthInches, requestedBowLengthInches = 68) {
  const riserInches = Math.min(29, Math.max(19, Number(riserLengthInches) || 25));
  const requested = Number(requestedBowLengthInches);
  const bowLengthInches = SUPPORTED_BOW_LENGTHS_INCHES.includes(requested) ? requested : 68;
  const limbLengthInches = Math.max(16, (bowLengthInches - riserInches) / 2);
  return Object.freeze({
    units: "mm",
    bowLengthInches,
    riserLengthInches: riserInches,
    limbLengthInches,
    bowLengthMm: bowLengthInches * MILLIMETERS_PER_INCH,
    riserLengthMm: riserInches * MILLIMETERS_PER_INCH,
    limbLengthMm: limbLengthInches * MILLIMETERS_PER_INCH,
    limbTipOffsetMm: bowLengthInches * MILLIMETERS_PER_INCH / 2
  });
}
