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
  cabin: b64('fonts/CabinSketch-Regular.ttf'),
  hupo: b64('fonts/HuawenHupo.ttf'),
};
function fontCss() {
  return "@font-face{font-family:'Cabin';src:url(data:font/ttf;base64," + FONTS.cabin + ") format('truetype');}"
    + "@font-face{font-family:'Hupo';src:url(data:font/ttf;base64," + FONTS.hupo + ") format('truetype');}";
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
  { id: 'gallery', x: 25, y: 74, label: '博客项目', accent: '#2563eb', icon: 'laptop' },
  { id: 'contact', x: 77, y: 22, label: '留言板', accent: '#16a34a', icon: 'bubble' },
  { id: 'studio',  x: 72, y: 61, label: '友链', accent: '#7c3aed', icon: 'chain' },
];

// Distinct icons, each centered around (cx, cy)
function iconSvg(type, cx, cy, color) {
  const s = color;
  if (type === 'person') {
    // head + shoulders (avatar)
    return '<circle cx="' + cx + '" cy="' + (cy - 34) + '" r="17" fill="none" stroke="' + s + '" stroke-width="6"/>'
      + '<path d="M ' + (cx - 30) + ' ' + (cy + 6) + ' C ' + (cx - 30) + ' ' + (cy - 22) + ', ' + (cx + 30) + ' ' + (cy - 22) + ', ' + (cx + 30) + ' ' + (cy + 6) + '" fill="none" stroke="' + s + '" stroke-width="6"/>'
      + '<line x1="' + cx + '" y1="' + (cy + 6) + '" x2="' + cx + '" y2="' + (cy + 22) + '" stroke="' + s + '" stroke-width="6"/>';
  }
  if (type === 'laptop') {
    // laptop: screen + base
    return '<rect x="' + (cx - 32) + '" y="' + (cy - 30) + '" width="64" height="46" rx="6" fill="none" stroke="' + s + '" stroke-width="6"/>'
      + '<line x1="' + (cx - 32) + '" y1="' + (cy - 14) + '" x2="' + (cx + 32) + '" y2="' + (cy - 14) + '" stroke="' + s + '" stroke-width="5"/>'
      + '<path d="M ' + (cx - 34) + ' ' + (cy + 16) + ' L ' + (cx + 34) + ' ' + (cy + 16) + ' L ' + (cx + 24) + ' ' + (cy + 34) + ' L ' + (cx - 24) + ' ' + (cy + 34) + ' Z" fill="none" stroke="' + s + '" stroke-width="6" stroke-linejoin="round"/>';
  }
  if (type === 'bubble') {
    // speech bubble with dots
    return '<path d="M ' + (cx - 32) + ' ' + (cy - 24) + ' L ' + (cx + 32) + ' ' + (cy - 24) + ' L ' + (cx + 32) + ' ' + (cy + 18) + ' L ' + (cx + 4) + ' ' + (cy + 18) + ' L ' + (cx - 12) + ' ' + (cy + 34) + ' L ' + (cx - 8) + ' ' + (cy + 18) + ' L ' + (cx - 32) + ' ' + (cy + 18) + ' Z" fill="none" stroke="' + s + '" stroke-width="6" stroke-linejoin="round"/>'
      + '<circle cx="' + (cx - 14) + '" cy="' + (cy - 3) + '" r="4" fill="' + s + '"/>'
      + '<circle cx="' + cx + '" cy="' + (cy - 3) + '" r="4" fill="' + s + '"/>'
      + '<circle cx="' + (cx + 14) + '" cy="' + (cy - 3) + '" r="4" fill="' + s + '"/>';
  }
  if (type === 'chain') {
    return '<ellipse cx="' + (cx - 16) + '" cy="' + cy + '" rx="22" ry="14" fill="none" stroke="' + s + '" stroke-width="6" transform="rotate(-20 ' + (cx - 16) + ' ' + cy + ')"/>'
      + '<ellipse cx="' + (cx + 16) + '" cy="' + cy + '" rx="22" ry="14" fill="none" stroke="' + s + '" stroke-width="6" transform="rotate(20 ' + (cx + 16) + ' ' + cy + ')"/>';
  }
  return '';
}

function buildMap(highlight) {
  const W = 1351, H = 1290;
  const towerX = 676, towerY = 700;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  // light dashed roads
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 420" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 950" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 1000 300" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 950 800" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 676 1240" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';

  // center tower
  const tc = highlight === 'tower' ? '#667eea' : '#1a1a1a';
  h += '<g stroke="' + tc + '" fill="none" stroke-width="7">'
    + '<rect x="626" y="560" width="100" height="150"/>'
    + '<rect x="606" y="520" width="140" height="50"/>'
    + '<path d="M 616 520 L 676 455 L 736 520"/>'
    + '<line x1="676" y1="455" x2="676" y2="420"/>'
    + '<circle cx="676" cy="412" r="9" fill="' + tc + '"/>'
    + '<line x1="646" y1="595" x2="706" y2="595"/>'
    + '<line x1="646" y1="635" x2="706" y2="635"/>'
    + '<line x1="646" y1="675" x2="706" y2="675"/>'
    + '</g>';

  // zones: icon + label, no dashed frame
  for (const z of ZONES) {
    const cx = W * z.x / 100, cy = H * z.y / 100;
    const col = highlight === z.id ? z.accent : '#1a1a1a';
    h += iconSvg(z.icon, cx, cy, col);
    h += '<text x="' + cx + '" y="' + (cy + 66) + '" font-family="Hupo" font-size="46" fill="' + col + '" text-anchor="middle">' + z.label + '</text>';
  }

  // pin start marker at bottom center
  h += '<circle cx="676" cy="1250" r="16" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-dasharray="5 6"/>';

  h += '</svg>';
  return h;
}

await render('images/map.webp', buildMap(null));
for (const z of ZONES) {
  await render('images/map_' + z.id + '_painted.webp', buildMap(z.id), { tint: '#e6e0f7' });
}
console.log('MAP V3 DONE');
