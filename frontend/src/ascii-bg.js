// Ambient ASCII background: a quiet, slowly-flickering field of characters.
// (The cursor-following character trail has been removed — the cursor is
// left plain, as before. This file only drives the ambient layer now.)
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ambientCanvas = document.getElementById('asciiAmbient');
  if (!ambientCanvas) return;

  const aCtx = ambientCanvas.getContext('2d');

  const CHARS = 'XxOo+=-:.#*<>/\\'.split('');
  const CELL = 34;
  const FONT = "IBM Plex Mono, monospace";

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let cells = [];
  let colors = { accent: '#9C6A1B', muted: '#4A463C' };

  function readColors(){
    const s = getComputedStyle(document.documentElement);
    colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
    colors.muted = s.getPropertyValue('--text-muted').trim() || colors.muted;
  }

  function hexToRgb(hex){
    const h = hex.replace('#','');
    const n = h.length === 3
      ? h.split('').map(c => c + c).join('')
      : h;
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function sizeCanvas(cv, ctx){
    cv.width = Math.floor(window.innerWidth * dpr);
    cv.height = Math.floor(window.innerHeight * dpr);
    cv.style.width = window.innerWidth + 'px';
    cv.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildAmbientGrid(){
    W = window.innerWidth;
    H = window.innerHeight;
    sizeCanvas(ambientCanvas, aCtx);
    const cols = Math.ceil(W / CELL);
    const rows = Math.ceil(H / CELL);
    cells = [];
    for (let r = 0; r < rows; r++){
      for (let c = 0; c < cols; c++){
        cells.push({
          x: c * CELL + CELL / 2,
          y: r * CELL + CELL / 2,
          char: CHARS[(Math.random() * CHARS.length) | 0],
          opacity: 0.05 + Math.random() * 0.14,
          tinted: Math.random() < 0.1
        });
      }
    }
    drawAmbient();
  }

  function drawAmbient(){
    aCtx.clearRect(0, 0, W, H);
    aCtx.font = `13px ${FONT}`;
    aCtx.textAlign = 'center';
    aCtx.textBaseline = 'middle';
    for (const cell of cells){
      const rgb = cell.tinted ? hexToRgb(colors.accent) : hexToRgb(colors.muted);
      aCtx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${cell.opacity})`;
      aCtx.fillText(cell.char, cell.x, cell.y);
    }
  }

  function flickerAmbient(){
    const n = Math.min(40, cells.length);
    for (let i = 0; i < n; i++){
      const cell = cells[(Math.random() * cells.length) | 0];
      cell.char = CHARS[(Math.random() * CHARS.length) | 0];
      cell.opacity = 0.05 + Math.random() * 0.14;
      cell.tinted = Math.random() < 0.08;
    }
    drawAmbient();
  }

  window.addEventListener('resize', () => {
    readColors();
    buildAmbientGrid();
  });

  new MutationObserver(() => {
    readColors();
    drawAmbient();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- init ----------
  readColors();
  buildAmbientGrid();

  if (!reduceMotion){
    setInterval(flickerAmbient, 220);
  }
})();