// Sketch → CAD lens.
//
// Clones the hand-drawn layer into a CAD layer stacked on top of it. CSS clips
// the CAD layer to a circle (--r) at the pointer (--x, --y). Without this
// script the page is simply the sketch.

(() => {
  const stage = document.querySelector(".stage");
  const sketch = stage?.querySelector(".layer--sketch");
  const toggle = document.querySelector(".mode-toggle");
  if (!sketch || !toggle) return;

  const cad = sketch.cloneNode(true);
  cad.classList.replace("layer--sketch", "layer--cad");
  cad.setAttribute("aria-hidden", "true");
  cad.inert = true;
  for (const el of cad.querySelectorAll("[id]")) el.removeAttribute("id");

  const crosshair = document.createElement("div");
  crosshair.className = "crosshair";
  crosshair.innerHTML = '<span class="crosshair__box"></span><span class="crosshair__readout"></span>';
  const readout = crosshair.lastElementChild;
  cad.append(crosshair);
  stage.append(cad);

  document.documentElement.classList.add("has-lens");
  toggle.hidden = false;

  // Keep the layers aligned: the two fonts wrap differently, so give each pair
  // of text blocks the taller of the two heights.
  const SYNC = "h1, h2, h3, p, li, figcaption, .titleblock > div";
  const pairs = (() => {
    const a = sketch.querySelectorAll(SYNC);
    const b = cad.querySelectorAll(SYNC);
    return Array.from(a, (el, i) => [el, b[i]]);
  })();

  const syncHeights = () => {
    for (const [a, b] of pairs) a.style.minHeight = b.style.minHeight = "";
    const heights = pairs.map(([a, b]) =>
      Math.max(a.getBoundingClientRect().height, b.getBoundingClientRect().height),
    );
    pairs.forEach(([a, b], i) => {
      a.style.minHeight = b.style.minHeight = `${heights[i]}px`;
    });
  };

  syncHeights();
  document.fonts?.ready.then(syncHeights);
  let resizeTimer;
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncHeights, 120);
  });

  // Pointer tracking.
  let clientX = 0;
  let clientY = 0;
  let frame = 0;
  let full = false;

  const place = (x, y) => {
    const box = stage.getBoundingClientRect();
    const px = x - box.left;
    const py = y - box.top;
    stage.style.setProperty("--x", `${px}px`);
    stage.style.setProperty("--y", `${py}px`);
    return [px, py];
  };

  const update = () => {
    frame = 0;
    if (full) return;
    const [px, py] = place(clientX, clientY);
    // 1 px ≈ 10 mm, the scale of a 1:100 drawing on screen.
    const mm = (v) => String(Math.max(0, Math.round(v * 10))).padStart(5, "0");
    readout.textContent = `X ${mm(px)}  Y ${mm(py)}`;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    clientX = e.clientX;
    clientY = e.clientY;
    if (!full) stage.classList.add("is-lens");
    schedule();
  });

  document.documentElement.addEventListener("pointerleave", () => {
    stage.classList.remove("is-lens");
  });

  window.addEventListener("scroll", schedule, { passive: true });

  // Whole-page mode for touch screens and keyboard users: the circle grows
  // out of the button until it covers the page.
  toggle.addEventListener("click", () => {
    full = !full;
    toggle.setAttribute("aria-pressed", String(full));
    toggle.textContent = full ? toggle.dataset.labelSketch : toggle.dataset.labelCad;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", full ? "#0b1622" : "#f6f1e4");

    if (full) {
      const b = toggle.getBoundingClientRect();
      place(b.left + b.width / 2, b.top + b.height / 2);
      const s = stage.getBoundingClientRect();
      stage.style.setProperty("--full-r", `${Math.hypot(s.width, s.height)}px`);
      stage.classList.remove("is-lens");
      stage.classList.add("is-full");
    } else {
      stage.classList.remove("is-full");
    }
  });
})();
