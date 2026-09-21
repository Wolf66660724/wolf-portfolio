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
  cabinB: b64('fonts/CabinSketch-Bold.ttf'),
  hupo: b64('fonts/HuawenHupo.ttf'),
};
function fontCss() {
  return "@font-face{font-family:'Cabin';src:url(data:font/ttf;base64," + FONTS.cabin + ") format('truetype');}"
    + "@font-face{font-family:'CabinB';src:url(data:font/ttf;base64," + FONTS.cabinB + ") format('truetype');}"
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

// Zone data: id, center (x%, y%), icon, chinese label, accent color
const ZONES = [
  { id: 'about',   x: 25, y: 37, label: '自我介绍', accent: '#dc2626', icon: 'person' },
  { id: 'gallery', x: 25, y: 74, label: '博客项目', accent: '#2563eb', icon: 'cards' },
  { id: 'contact', x: 77, y: 22, label: '留言板', accent: '#16a34a', icon: 'envelope' },
  { id: 'studio',  x: 72, y: 61, label: '友链', accent: '#7c3aed', icon: 'link' },
];

function iconSvg(type, cx, cy, color) {
  const s = color;
  if (type === 'person') {
    return '<circle cx="' + cx + '" cy="' + (cy - 30) + '" r="18" fill="none" stroke="' + s + '" stroke-width="5"/>'
      + '<path d="M ' + (cx - 26) + ' ' + (cy + 34) + ' C ' + (cx - 26) + ' ' + (cy - 4) + ', ' + (cx + 26) + ' ' + (cy - 4) + ', ' + (cx + 26) + ' ' + (cy + 34) + '" fill="none" stroke="' + s + '" stroke-width="5"/>';
  }
  if (type === 'cards') {
    return '<rect x="' + (cx - 30) + '" y="' + (cy - 22) + '" width="60" height="44" rx="5" fill="none" stroke="' + s + '" stroke-width="5"/>'
      + '<line x1="' + (cx - 22) + '" y1="' + (cy - 10) + '" x2="' + (cx + 22) + '" y2="' + (cy - 10) + '" stroke="' + s + '" stroke-width="4"/>'
      + '<line x1="' + (cx - 22) + '" y1="' + (cy + 2) + '" x2="' + (cx + 14) + '" y2="' + (cy + 2) + '" stroke="' + s + '" stroke-width="4"/>';
  }
  if (type === 'envelope') {
    return '<rect x="' + (cx - 30) + '" y="' + (cy - 22) + '" width="60" height="44" rx="6" fill="none" stroke="' + s + '" stroke-width="5"/>'
      + '<path d="M ' + (cx - 30) + ' ' + (cy - 22) + ' L ' + cx + ' ' + (cy + 2) + ' L ' + (cx + 30) + ' ' + (cy - 22) + '" fill="none" stroke="' + s + '" stroke-width="4"/>';
  }
  if (type === 'link') {
    return '<circle cx="' + (cx - 14) + '" cy="' + cy + '" r="18" fill="none" stroke="' + s + '" stroke-width="5"/>'
      + '<circle cx="' + (cx + 14) + '" cy="' + cy + '" r="18" fill="none" stroke="' + s + '" stroke-width="5"/>'
      + '<path d="M ' + (cx - 22) + ' ' + cy + ' L ' + (cx + 22) + ' ' + cy + '" stroke="' + s + '" stroke-width="5"/>';
  }
  return '';
}

function buildMap(highlight) {
  const W = 1351, H = 1290;
  const towerX = 676, towerY = 700;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  // light dashed roads from tower to each zone + down to pin start
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 420" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 950" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 1000 300" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 950 800" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 676 1240" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="10 12" opacity="0.7"/>';

  // center tower (sketch)
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

  // zones
  for (const z of ZONES) {
    const cx = W * z.x / 100, cy = H * z.y / 100;
    const isHi = highlight === z.id;
    const col = isHi ? z.accent : '#1a1a1a';
    // subtle zone circle
    h += '<circle cx="' + cx + '" cy="' + (cy - 8) + '" r="46" fill="none" stroke="' + col + '" stroke-width="3" stroke-dasharray="6 8" opacity="0.6"/>';
    h += iconSvg(z.icon, cx, cy, col);
    h += '<text x="' + cx + '" y="' + (cy + 72) + '" font-family="Hupo" font-size="44" fill="' + col + '" text-anchor="middle">' + z.label + '</text>';
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
console.log('MAP DONE');
