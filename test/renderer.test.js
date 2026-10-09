import test from "node:test";
import assert from "node:assert/strict";
import { drawBow } from "../src/renderer.js";

function makeCanvasContext() {
  const calls = [];
  return {
    calls,
    clearRect: (...args) => calls.push(["clearRect", ...args]),
    beginPath: () => calls.push(["beginPath"]),
    moveTo: (...args) => calls.push(["moveTo", ...args]),
    lineTo: (...args) => calls.push(["lineTo", ...args]),
    closePath: () => calls.push(["closePath"]),
    fill: () => calls.push(["fill"]),
    stroke: () => calls.push(["stroke"]),
    arc: (...args) => calls.push(["arc", ...args]),
    fillRect: (...args) => calls.push(["fillRect", ...args]),
    createRadialGradient: () => ({ addColorStop() {} })
  };
}

test("bow renderer draws model faces, limbs, string and sight", () => {
  const context = makeCanvasContext();
  assert.doesNotThrow(() => drawBow(context, 600, 400, {
    yaw: -0.3,
    colors: { riser: "#7752b2", limbs: "#d9d4de", sight: "#c9b5ea", string: "#ba78eb" }
  }));
  assert.ok(context.calls.filter(([name]) => name === "fill").length >= 5);
  assert.ok(context.calls.some(([name]) => name === "arc"));
  assert.ok(context.calls.filter(([name]) => name === "stroke").length >= 5);
});

test("bow renderer tolerates small viewports and a straight-on orientation", () => {
  const context = makeCanvasContext();
  assert.doesNotThrow(() => drawBow(context, 280, 160, {
    yaw: 0,
    colors: { riser: "#55328c", limbs: "#805a3e", sight: "#25222d", string: "#7652b2" }
  }));
});

