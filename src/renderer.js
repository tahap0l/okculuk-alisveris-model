function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r},${g},${b})`;
}
export function drawBow(ctx, width, height, { yaw, colors }) {
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width / 620, height / 380), cx = width * .52, cy = height * .51;
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const p = (x, y, z = 0) => [cx + (x * c + z * s) * scale, cy + y * scale];
  const polygon = (points, fill, stroke = "rgba(238,224,255,.23)", line = 1) => {
    ctx.beginPath(); points.forEach(([x, y, z], i) => { const [px, py] = p(x, y, z); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = line; ctx.strokeStyle = stroke; ctx.stroke();
  };
  const line = (points, color, lineWidth = 1.5) => {
    ctx.beginPath(); points.forEach(([x, y, z], i) => { const [px, py] = p(x, y, z); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
  };
  const riser = colors.riser || "#7752b2", limb = colors.limbs || "#d9d4de", hw = colors.sight || "#c9b5ea", string = colors.string || "#ba78eb";
  const shadow = ctx.createRadialGradient(cx, cy + 103 * scale, 5, cx, cy + 103 * scale, 203 * scale);
  shadow.addColorStop(0, "rgba(0,0,0,.45)"); shadow.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = shadow; ctx.fillRect(0, 0, width, height);
  polygon([[-19,-19,0],[-37,-151,0],[-29,-162,0],[-12,-27,0]], shade(limb,-45), "rgba(255,255,255,.15)");
  polygon([[19,19,0],[37,151,0],[29,162,0],[12,27,0]], shade(limb,-65), "rgba(255,255,255,.15)");
  polygon([[-19,-19,7],[-37,-151,4],[-29,-162,-3],[-12,-27,-2]], shade(limb,10));
  polygon([[19,19,7],[37,151,4],[29,162,-3],[12,27,-2]], shade(limb,-4));
  line([[-29,-155,5],[-17,-51,7],[-14,-27,7]], "rgba(255,255,255,.55)", 1.1);
  line([[29,155,5],[17,51,7],[14,27,7]], "rgba(255,255,255,.35)", 1.1);
  polygon([[-13,-30,-12],[-25,-17,-12],[-17,-3,-12],[-20,17,-12],[-12,29,-12],[10,29,-12],[16,17,-12],[12,4,-12],[21,-10,-12],[12,-30,-12]], shade(riser,-72), "rgba(255,255,255,.1)");
  polygon([[-13,-30,13],[-25,-17,10],[-17,-3,10],[-20,17,10],[-12,29,13],[10,29,13],[16,17,8],[12,4,10],[21,-10,12],[12,-30,13]], shade(riser,-45), "rgba(246,228,255,.46)", 1.1);
  polygon([[-13,-30,14],[-25,-17,11],[-17,-3,11],[-5,-5,12],[1,-13,13],[12,-30,14]], riser, "rgba(255,255,255,.25)");
  polygon([[-17,-3,11],[-5,-5,12],[0,4,13],[12,4,10],[16,17,8],[2,17,13],[-8,17,13],[-20,17,10]], shade(riser,12));
  polygon([[-8,-16,16],[-1,-20,17],[5,-12,17],[2,-2,17],[-7,-1,16]], "#15101f", "rgba(236,218,255,.16)");
  line([[4,6,15],[7,16,15],[3,26,15]], "rgba(244,228,255,.68)", 1.3);
  line([[-29,-162,-5],[0,0,-7],[29,162,-5]], string, 1.25);
  line([[10,-7,15],[53,-12,14],[78,-12,12]], hw, 1.7);
  polygon([[45,-17,13],[54,-17,13],[54,-7,13],[45,-7,13]], shade(hw,-55), "rgba(255,255,255,.3)");
  const [rx, ry] = p(83,-12,12); ctx.beginPath(); ctx.arc(rx, ry, 14*scale, 0, Math.PI*2); ctx.strokeStyle = hw; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(rx, ry, 2.1*scale, 0, Math.PI*2); ctx.fillStyle = hw; ctx.fill();
  line([[83,-12,12],[96,-12,12]], hw, 1);
  line([[7,-2,16],[23,-2,16],[25,2,16]], "#d8caed", 1.2);
  line([[1,-21,16],[17,-21,16]], "rgba(255,255,255,.54)", .8);
  for (const y of [-19,20]) { const [x, py] = p(0,y,15); ctx.beginPath(); ctx.arc(x,py,2.1*scale,0,Math.PI*2); ctx.fillStyle="#d7c6f3"; ctx.fill(); }
}

