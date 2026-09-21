import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PAPER = path.join(PUBLIC, 'textures/paper-texture.webp');

const b64 = (p) => fs.readFileSync(path.join(PUBLIC, p)).toString('base64');
const FONTS = { hupo: b64('fonts/HuawenHupo.ttf') };
function fontCss() {
  return "@font-face{font-family:'Hupo';src:url(data:font/ttf;base64," + FONTS.hupo + ") format('truetype');}";
}

async function render(outRel, svg, opts = {}) {
  const outAbs = path.join(PUBLIC, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  const W = 1351, H = 1290;
  let bg = sharp(PAPER).resize(W, H, { fit: 'cover' });
  if (opts.tint) bg = bg.tint(opts.tint);
  const buf = await bg.toBuffer();
  await sharp(buf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).webp({ quality: 84 }).toFile(outAbs);
  console.log('wrote', outRel);
}

const ZONES = [
  { id: 'about',   x: 25, y: 37, label: '自我介绍', accent: '#dc2626', icon: 'person' },
  { id: 'gallery', x: 25, y: 74, label: '博客项目', accent: '#2563eb', icon: 'pencil' },
  { id: 'contact', x: 77, y: 22, label: '留言板', accent: '#16a34a', icon: 'bubble' },
  { id: 'studio',  x: 72, y: 61, label: '友链', accent: '#7c3aed', icon: 'chain' },
];

// PURE SOLID silhouettes (no large white interiors) — big & bold
function iconSvg(type, cx, cy, color) {
  const f = color;
  if (type === 'person') {
    // solid person: head + shoulders
    return '<circle cx="' + cx + '" cy="' + (cy - 40) + '" r="20" fill="' + f + '"/>'
      + '<path d="M ' + (cx - 36) + ' ' + (cy - 6) + ' C ' + (cx - 36) + ' ' + (cy - 30) + ', ' + (cx + 36) + ' ' + (cy - 30) + ', ' + (cx + 36) + ' ' + (cy - 6) + ' L ' + (cx + 20) + ' ' + (cy + 38) + ' L ' + (cx - 20) + ' ' + (cy + 38) + ' Z" fill="' + f + '"/>';
  }
  if (type === 'pencil') {
    // solid diagonal pencil: body + tip + eraser
    return '<g transform="rotate(45 ' + cx + ' ' + cy + ')">'
      + '<rect x="' + (cx - 14) + '" y="' + (cy - 44) + '" width="28" height="74" rx="6" fill="' + f + '"/>'
      + '<path d="M ' + (cx - 14) + ' ' + (cy + 30) + ' L ' + (cx + 14) + ' ' + (cy + 30) + ' L ' + cx + ' ' + (cy + 50) + ' Z" fill="' + f + '"/>'
      + '<rect x="' + (cx - 14) + '" y="' + (cy - 54) + '" width="28" height="12" rx="4" fill="' + f + '"/>'
      + '</g>';
  }
  if (type === 'bubble') {
    // solid speech bubble (with a small tail), solid fill
    return '<path d="M ' + (cx - 40) + ' ' + (cy - 30) + ' L ' + (cx + 40) + ' ' + (cy - 30) + ' L ' + (cx + 40) + ' ' + (cy + 24) + ' L ' + (cx + 4) + ' ' + (cy + 24) + ' L ' + (cx - 14) + ' ' + (cy + 42) + ' L ' + (cx - 10) + ' ' + (cy + 24) + ' L ' + (cx - 40) + ' ' + (cy + 24) + ' Z" fill="' + f + '"/>';
  }
  if (type === 'chain') {
    // two solid interlocked rings (thick), solid fill
    return '<ellipse cx="' + (cx - 20) + '" cy="' + cy + '" rx="26" ry="18" fill="' + f + '" transform="rotate(-22 ' + (cx - 20) + ' ' + cy + ')"/>'
      + '<ellipse cx="' + (cx + 20) + '" cy="' + cy + '" rx="26" ry="18" fill="' + f + '" transform="rotate(22 ' + (cx + 20) + ' ' + cy + ')"/>';
  }
  return '';
}

function buildMap(highlight) {
  const W = 1351, H = 1290;
  const towerX = 676, towerY = 700;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  // dashed roads
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 430" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.55"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 950" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.55"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 1000 300" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.55"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 950 800" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.55"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 676 1240" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.55"/>';

  // tower (solid)
  const tc = highlight === 'tower' ? '#667eea' : '#1a1a1a';
  h += '<g fill="' + tc + '">'
    + '<rect x="626" y="560" width="100" height="150" rx="6"/>'
    + '<rect x="606" y="520" width="140" height="52" rx="6"/>'
    + '<path d="M 616 520 L 676 455 L 736 520 Z"/>'
    + '<circle cx="676" cy="448" r="16"/>'
    + '</g>';

  // zones: big solid icon + label
  for (const z of ZONES) {
    const cx = W * z.x / 100, cy = H * z.y / 100;
    const col = highlight === z.id ? z.accent : '#1a1a1a';
    h += iconSvg(z.icon, cx, cy, col);
    h += '<text x="' + cx + '" y="' + (cy + 84) + '" font-family="Hupo" font-size="54" fill="' + col + '" text-anchor="middle">' + z.label + '</text>';
  }

  h += '<circle cx="676" cy="1250" r="16" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-dasharray="5 6"/>';
  h += '</svg>';
  return h;
}

await render('images/map-v5.webp', buildMap(null));
for (const z of ZONES) {
  await render('images/map-v5-' + z.id + '.webp', buildMap(z.id), { tint: '#e9e3f8' });
}
console.log('MAP V5 DONE');
