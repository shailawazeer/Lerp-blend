// ── Canvas refs ──
const cA = document.getElementById("cA");
const cB = document.getElementById("cB");
const cOut = document.getElementById("cOut");
const ctxA = cA.getContext("2d");
const ctxB = cB.getContext("2d");
const ctxOut = cOut.getContext("2d");

const W = 240,
  H = 180; // output size
const SW = 180,
  SH = 135; // side preview size

let dataA = null,
  dataB = null;
let animating = false,
  animDir = 1,
  animT = 50,
  animFrame;

// ── Load image from src into an ImageData at given size ──
function loadImg(src, w, h) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(c.getContext("2d").getImageData(0, 0, w, h));
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ── Draw a side preview ──
function drawPreview(ctx, imgData, canvasW, canvasH) {
  const tmp = document.createElement("canvas");
  tmp.width = W;
  tmp.height = H;
  tmp.getContext("2d").putImageData(imgData, 0, 0);
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(tmp, 0, 0, canvasW, canvasH);
}

// ── Core LERP render ──
function render(tRaw) {
  const t = tRaw / 100;
  const a = 1 - t;

  document.getElementById("tVal").textContent = "t = " + t.toFixed(2);
  document.getElementById("midLabel").textContent =
    "P(" + t.toFixed(2) + ") · blend";
  document.getElementById("formulaOut").textContent =
    a.toFixed(2) + " × A  +  " + t.toFixed(2) + " × B";

  if (!dataA || !dataB) return;

  const out = new ImageData(W, H);
  const dA = dataA.data;
  const dB = dataB.data;
  const dO = out.data;

  // ── THE LERP LOOP — one line per channel ──
  for (let i = 0; i < dA.length; i += 4) {
    dO[i] = a * dA[i] + t * dB[i]; // Red
    dO[i + 1] = a * dA[i + 1] + t * dB[i + 1]; // Green
    dO[i + 2] = a * dA[i + 2] + t * dB[i + 2]; // Blue
    dO[i + 3] = 255; // Alpha
  }

  ctxOut.putImageData(out, 0, 0);
}

// ── Load images from folder ──
async function init() {
  // Place your images as images/A.jpg and images/B.jpg
  // OR change these paths to any two images in the same folder
  try {
    [dataA, dataB] = await Promise.all([
      loadImg("images/A.jpg", W, H),
      loadImg("images/B.jpg", W, H),
    ]);
  } catch (e) {
    // Fallback: generate coloured placeholders if images not found
    dataA = makeSolid(W, H, 255, 95, 126); // pink
    dataB = makeSolid(W, H, 91, 200, 255); // blue
  }

  drawPreview(ctxA, dataA, SW, SH);
  drawPreview(ctxB, dataB, SW, SH);
  render(50);
}

function makeSolid(w, h, r, g, b) {
  const d = new ImageData(w, h);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i] = r;
    d.data[i + 1] = g;
    d.data[i + 2] = b;
    d.data[i + 3] = 255;
  }
  return d;
}

// ── Controls ──
document
  .getElementById("slider")
  .addEventListener("input", (e) => render(+e.target.value));

document.getElementById("b0").addEventListener("click", () => {
  document.getElementById("slider").value = 0;
  render(0);
});
document.getElementById("b50").addEventListener("click", () => {
  document.getElementById("slider").value = 50;
  render(50);
});
document.getElementById("b100").addEventListener("click", () => {
  document.getElementById("slider").value = 100;
  render(100);
});

const animBtn = document.getElementById("animBtn");
animBtn.addEventListener("click", () => {
  animating = !animating;
  animBtn.textContent = animating ? "⏸ Pause" : "▶ Animate";
  if (animating) {
    animT = +document.getElementById("slider").value;
    loop();
  } else cancelAnimationFrame(animFrame);
});

function loop() {
  animT += animDir * 0.6;
  if (animT >= 100) {
    animT = 100;
    animDir = -1;
  }
  if (animT <= 0) {
    animT = 0;
    animDir = 1;
  }
  document.getElementById("slider").value = animT;
  render(animT);
  animFrame = requestAnimationFrame(loop);
}

init();
