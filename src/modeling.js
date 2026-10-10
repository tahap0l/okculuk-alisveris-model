export const MILLIMETERS_PER_INCH = 25.4;
export const SUPPORTED_BOW_LENGTHS_INCHES = Object.freeze([66, 68, 70]);

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

