import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PAPER = path.join(PUBLIC, 'textures/paper-texture.webp');

const b64 = (p) => fs.readFileSync(path.join(PUBLIC, p)).toString('base64');
const FONTS = {
  hupo: b64('fonts/HuawenHupo.ttf'),
  cabin: b64('fonts/CabinSketch-Regular.ttf'),
  cabinB: b64('fonts/CabinSketch-Bold.ttf'),
};
function fontCss() {
  return "@font-face{font-family:'Hupo';src:url(data:font/ttf;base64," + FONTS.hupo + ") format('truetype');}"
    + "@font-face{font-family:'Cabin';src:url(data:font/ttf;base64," + FONTS.cabin + ") format('truetype');}"
    + "@font-face{font-family:'CabinB';src:url(data:font/ttf;base64," + FONTS.cabinB + ") format('truetype');}";
}

async function render(outRel, svg, opts = {}) {
  const outAbs = path.join(PUBLIC, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  const W = 1351, H = 1290;
  let bg = sharp(PAPER).resize(W, H, { fit: 'cover' });
  if (opts.tint) bg = bg.tint(opts.tint);
  const buf = await bg.toBuffer();
  await sharp(buf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).webp({ quality: 86 }).toFile(outAbs);
  console.log('wrote', outRel);
}

const INK = '#5b4632'; // warm sepia ink
const ZONES = [
  { id: 'about',   x: 24, y: 36, label: '自我介绍', accent: '#e5484d', icon: 'person' },
  { id: 'gallery', x: 24, y: 75, label: '博客项目', accent: '#3b82f6', icon: 'book' },
  { id: 'contact', x: 78, y: 21, label: '留言板', accent: '#22a55a', icon: 'bubble' },
  { id: 'studio',  x: 73, y: 62, label: '友链', accent: '#8b5cf6', icon: 'chain' },
];

// OUTLINE line-art icons (colored strokes, no solid fill) — thick enough to read at small size
function iconSvg(type, cx, cy, color) {
  const s = 6; // stroke width
  const c = color;
  if (type === 'person') {
    return '<circle cx="' + cx + '" cy="' + (cy - 38) + '" r="19" fill="none" stroke="' + c + '" stroke-width="' + s + '"/>'
      + '<path d="M ' + (cx - 34) + ' ' + (cy - 2) + ' C ' + (cx - 34) + ' ' + (cy - 26) + ', ' + (cx + 34) + ' ' + (cy - 26) + ', ' + (cx + 34) + ' ' + (cy - 2) + '" fill="none" stroke="' + c + '" stroke-width="' + s + '"/>'
      + '<path d="M ' + (cx - 20) + ' ' + (cy - 2) + ' L ' + (cx - 20) + ' ' + (cy + 20) + ' M ' + (cx + 20) + ' ' + (cy - 2) + ' L ' + (cx + 20) + ' ' + (cy + 20) + '" stroke="' + c + '" stroke-width="' + s + '"/>';
  }
  if (type === 'book') {
    // open book: two pages
    return '<path d="M ' + cx + ' ' + (cy - 34) + ' C ' + (cx - 30) + ' ' + (cy - 40) + ', ' + (cx - 44) + ' ' + (cy - 26) + ', ' + (cx - 44) + ' ' + (cy - 6) + ' L ' + (cx - 44) + ' ' + (cy + 22) + ' C ' + (cx - 26) + ' ' + (cy + 26) + ', ' + (cx - 8) + ' ' + (cy + 22) + ', ' + cx + ' ' + (cy + 16) + '" fill="none" stroke="' + c + '" stroke-width="' + s + '"/>'
      + '<path d="M ' + cx + ' ' + (cy - 34) + ' C ' + (cx + 30) + ' ' + (cy - 40) + ', ' + (cx + 44) + ' ' + (cy - 26) + ', ' + (cx + 44) + ' ' + (cy - 6) + ' L ' + (cx + 44) + ' ' + (cy + 22) + ' C ' + (cx + 26) + ' ' + (cy + 26) + ', ' + (cx + 8) + ' ' + (cy + 22) + ', ' + cx + ' ' + (cy + 16) + '" fill="none" stroke="' + c + '" stroke-width="' + s + '"/>'
      + '<path d="M ' + cx + ' ' + (cy - 34) + ' L ' + cx + ' ' + (cy + 16) + '" stroke="' + c + '" stroke-width="' + s + '"/>';
  }
  if (type === 'bubble') {
    return '<path d="M ' + (cx - 40) + ' ' + (cy - 28) + ' L ' + (cx + 40) + ' ' + (cy - 28) + ' L ' + (cx + 40) + ' ' + (cy + 22) + ' L ' + (cx + 6) + ' ' + (cy + 22) + ' L ' + (cx - 12) + ' ' + (cy + 40) + ' L ' + (cx - 8) + ' ' + (cy + 22) + ' L ' + (cx - 40) + ' ' + (cy + 22) + ' Z" fill="none" stroke="' + c + '" stroke-width="' + s + '" stroke-linejoin="round"/>'
      + '<circle cx="' + (cx - 13) + '" cy="' + (cy - 4) + '" r="4.5" fill="' + c + '"/>'
      + '<circle cx="' + cx + '" cy="' + (cy - 4) + '" r="4.5" fill="' + c + '"/>'
      + '<circle cx="' + (cx + 13) + '" cy="' + (cy - 4) + '" r="4.5" fill="' + c + '"/>';
  }
  if (type === 'chain') {
    return '<ellipse cx="' + (cx - 19) + '" cy="' + cy + '" rx="25" ry="17" fill="none" stroke="' + c + '" stroke-width="' + s + '" transform="rotate(-22 ' + (cx - 19) + ' ' + cy + ')"/>'
      + '<ellipse cx="' + (cx + 19) + '" cy="' + cy + '" rx="25" ry="17" fill="none" stroke="' + c + '" stroke-width="' + s + '" transform="rotate(22 ' + (cx + 19) + ' ' + cy + ')"/>';
  }
  return '';
}

function buildMap(highlight) {
  const W = 1351, H = 1290;
  const towerX = 676, towerY = 690;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';

  // ===== title banner =====
  h += '<g>'
    + '<path d="M 430 95 L 921 95 L 921 205 L 430 205 Z" fill="#fffdf5" stroke="' + INK + '" stroke-width="4" opacity="0.9"/>'
    + '<path d="M 430 95 L 470 130 L 430 165 L 470 200 L 430 205" fill="none" stroke="' + INK + '" stroke-width="4"/>'
    + '<path d="M 921 95 L 881 130 L 921 165 L 881 200 L 921 205" fill="none" stroke="' + INK + '" stroke-width="4"/>'
    + '<text x="676" y="162" font-family="Hupo" font-size="72" fill="' + INK + '" text-anchor="middle">WOLF 地图</text>'
    + '</g>';

  // ===== compass rose (top-left) =====
  h += '<g transform="translate(150,150)">'
    + '<circle r="46" fill="none" stroke="' + INK + '" stroke-width="3"/>'
    + '<path d="M 0 -40 L 10 0 L 0 40 L -10 0 Z" fill="' + INK + '"/>'
    + '<circle r="10" fill="none" stroke="' + INK + '" stroke-width="2"/>'
    + '<text x="0" y="-54" font-family="CabinB" font-size="24" fill="' + INK + '" text-anchor="middle">N</text>'
    + '</g>';

  // ===== dashed roads =====
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 390 430" fill="none" stroke="#b7a891" stroke-width="5" stroke-dasharray="13 15" opacity="0.8"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 390 950" fill="none" stroke="#b7a891" stroke-width="5" stroke-dasharray="13 15" opacity="0.8"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 1000 300" fill="none" stroke="#b7a891" stroke-width="5" stroke-dasharray="13 15" opacity="0.8"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 950 800" fill="none" stroke="#b7a891" stroke-width="5" stroke-dasharray="13 15" opacity="0.8"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 676 1230" fill="none" stroke="#b7a891" stroke-width="5" stroke-dasharray="13 15" opacity="0.8"/>';

  // ===== sketch tower (outline, restored style) =====
  const tc = highlight === 'tower' ? '#667eea' : INK;
  h += '<g stroke="' + tc + '" stroke-width="6" fill="none" stroke-linejoin="round">'
    + '<rect x="620" y="545" width="112" height="165" rx="4"/>'
    + '<rect x="602" y="505" width="148" height="52" rx="4"/>'
    + '<path d="M 606 505 L 676 445 L 746 505"/>'
    + '<line x1="676" y1="445" x2="676" y2="415"/>'
    + '<path d="M 676 415 l 6 14 l 26 4 l -18 14 l 4 24 l -18 -11 l -18 11 l 4 -24 l -18 -14 l 26 -4 Z" fill="' + (highlight === 'tower' ? '#667eea' : 'none') + '"/>'
    // windows
    + '<rect x="640" y="570" width="18" height="22" rx="3"/>'
    + '<rect x="693" y="570" width="18" height="22" rx="3"/>'
    + '<rect x="640" y="615" width="18" height="22" rx="3"/>'
    + '<rect x="693" y="615" width="18" height="22" rx="3"/>'
    + '<line x1="649" y1="581" x2="649" y2="591" /><line x1="655" y1="575" x2="655" y2="587" />'
    + '<line x1="702" y1="581" x2="702" y2="591" /><line x1="708" y1="575" x2="708" y2="587" />'
    // door
    + '<path d="M 655 710 L 655 680 Q 676 668 697 680 L 697 710"/>'
    + '</g>';

  // ===== zones: badge + colored outline icon + label =====
  for (const z of ZONES) {
    const cx = W * z.x / 100, cy = H * z.y / 100;
    const isHi = highlight === z.id;
    // light badge
    h += '<circle cx="' + cx + '" cy="' + (cy - 2) + '" r="' + (isHi ? 66 : 54) + '" fill="#fffdf5" opacity="0.85"/>';
    if (isHi) {
      h += '<circle cx="' + cx + '" cy="' + (cy - 2) + '" r="72" fill="none" stroke="' + z.accent + '" stroke-width="5" stroke-dasharray="8 10" opacity="0.8"/>';
    }
    h += iconSvg(z.icon, cx, cy, z.accent);
    h += '<text x="' + cx + '" y="' + (cy + 82) + '" font-family="Hupo" font-size="52" fill="' + z.accent + '" text-anchor="middle">' + z.label + '</text>';
  }

  // pin start marker
  h += '<circle cx="676" cy="1240" r="16" fill="none" stroke="' + INK + '" stroke-width="5" stroke-dasharray="5 6"/>';

  h += '</svg>';
  return h;
}

await render('images/map-v7.webp', buildMap(null));
for (const z of ZONES) {
  await render('images/map-v7-' + z.id + '.webp', buildMap(z.id), { tint: '#f2ecdf' });
}
console.log('MAP V7 DONE');
