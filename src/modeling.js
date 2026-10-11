export const MILLIMETERS_PER_INCH = 25.4;
export const STRING_BRACE_HEIGHT_MM = 55;
export const SUPPORTED_BOW_LENGTHS_INCHES = Object.freeze([66, 68, 70]);

const RISER_DESIGNS = Object.freeze({
  generic: Object.freeze({ bodyWidthScale: 1, bodyDepthScale: 1, sightWindowWidthMm: 24, sightWindowHeightMm: 104, sideSweepMm: 0, edgeStyle: "swept", detailStyle: "plain", damperCount: 0, mountStyle: "unknown" }),
  "astral-cast": Object.freeze({ bodyWidthScale: 0.95, bodyDepthScale: 0.96, sightWindowWidthMm: 20, sightWindowHeightMm: 94, sideSweepMm: -4, edgeStyle: "soft-cast", detailStyle: "astral", damperCount: 0, mountStyle: "unknown" }),
  "evolium-compact": Object.freeze({ bodyWidthScale: 0.82, bodyDepthScale: 0.86, sightWindowWidthMm: 16, sightWindowHeightMm: 82, sideSweepMm: -8, edgeStyle: "compact", detailStyle: "evolium", damperCount: 0, mountStyle: "unknown" }),
  "scopus-cnc": Object.freeze({ bodyWidthScale: 1.08, bodyDepthScale: 0.94, sightWindowWidthMm: 25, sightWindowHeightMm: 108, sideSweepMm: 2, edgeStyle: "extruded-cnc", detailStyle: "scopus-rails", damperCount: 0, mountStyle: "ILF" }),
  "lancer-cast": Object.freeze({ bodyWidthScale: 0.99, bodyDepthScale: 1.02, sightWindowWidthMm: 22, sightWindowHeightMm: 100, sideSweepMm: 1, edgeStyle: "cast-sweep", detailStyle: "lancer", damperCount: 0, mountStyle: "unknown" }),
  "lancer-two-tone": Object.freeze({ bodyWidthScale: 1.02, bodyDepthScale: 1, sightWindowWidthMm: 23, sightWindowHeightMm: 102, sideSweepMm: 3, edgeStyle: "cast-sweep-two-tone", detailStyle: "two-tone", damperCount: 0, mountStyle: "ILF" }),
  "sovren-cnc": Object.freeze({ bodyWidthScale: 1.12, bodyDepthScale: 0.92, sightWindowWidthMm: 29, sightWindowHeightMm: 116, sideSweepMm: 8, edgeStyle: "open-cnc", detailStyle: "sovren-ribs", damperCount: 0, mountStyle: "ILF" }),
  "alfa-cutout-23": Object.freeze({ bodyWidthScale: 1.12, bodyDepthScale: 0.92, sightWindowWidthMm: 30, sightWindowHeightMm: 112, sideSweepMm: 10, edgeStyle: "cutout-23", detailStyle: "alfa-23", damperCount: 0, mountStyle: "unknown" }),
  "alfa-cutout-25": Object.freeze({ bodyWidthScale: 1.18, bodyDepthScale: 0.9, sightWindowWidthMm: 32, sightWindowHeightMm: 122, sideSweepMm: 13, edgeStyle: "cutout-25", detailStyle: "alfa-25", damperCount: 0, mountStyle: "unknown" }),
  "atf-dx-damped": Object.freeze({ bodyWidthScale: 1.06, bodyDepthScale: 1.05, sightWindowWidthMm: 27, sightWindowHeightMm: 110, sideSweepMm: 6, edgeStyle: "cnc-damped", detailStyle: "ehs-dampers", damperCount: 3, mountStyle: "ILF" }),
  "winex-angular": Object.freeze({ bodyWidthScale: 0.93, bodyDepthScale: 1.1, sightWindowWidthMm: 24, sightWindowHeightMm: 106, sideSweepMm: -2, edgeStyle: "angular-cast", detailStyle: "winex-facets", damperCount: 0, mountStyle: "ILF" }),
  "formula-offset": Object.freeze({ bodyWidthScale: 1.18, bodyDepthScale: 0.94, sightWindowWidthMm: 28, sightWindowHeightMm: 118, sideSweepMm: 11, edgeStyle: "formula-offset", detailStyle: "formula-pocket", damperCount: 0, mountStyle: "Formula" })
});

export function getRiserDesign(style = "generic") {
  return RISER_DESIGNS[style] ?? RISER_DESIGNS.generic;
}

export function getStringTipOffsetMm(drawMm = 0) {
  return -STRING_BRACE_HEIGHT_MM - Math.max(0, Number(drawMm) || 0) * 0.12;
}

export function getStringNockDepthMm(drawMm = 0) {
  return getStringTipOffsetMm(drawMm) - Math.max(0, Number(drawMm) || 0);
}

export function getLimbDrawDeflectionMm(t, drawMm = 0) {
  const progress = Math.min(1, Math.max(0, Number(t) || 0));
  const pull = Math.max(0, Number(drawMm) || 0);
  const smoothTipLoad = progress * progress * (3 - 2 * progress);
  return pull * (0.2 * Math.sin(Math.PI * progress) - 0.12 * smoothTipLoad);
}

export function getLimbBendDepthMm(t, style = "generic", drawMm = 0) {
  const progress = Math.min(1, Math.max(0, Number(t) || 0));
  const pull = Math.max(0, Number(drawMm) || 0);
  const bend = style.includes("foam") ? 112 : style.includes("bamboo") ? 94 : 102;
  return 2 + (-STRING_BRACE_HEIGHT_MM - 2) * progress + bend * Math.sin(Math.PI * progress)
    + getLimbDrawDeflectionMm(progress, pull);
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
