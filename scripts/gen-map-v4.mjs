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
};
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
  { id: 'gallery', x: 25, y: 74, label: '博客项目', accent: '#2563eb', icon: 'laptop' },
  { id: 'contact', x: 77, y: 22, label: '留言板', accent: '#16a34a', icon: 'bubble' },
  { id: 'studio',  x: 72, y: 61, label: '友链', accent: '#7c3aed', icon: 'chain' },
];

// FILLED silhouettes (solid shapes read clearly at small sizes)
function iconSvg(type, cx, cy, color) {
  const f = color;
  if (type === 'person') {
    return '<circle cx="' + cx + '" cy="' + (cy - 34) + '" r="17" fill="' + f + '"/>'
      + '<path d="M ' + (cx - 30) + ' ' + (cy + 2) + ' C ' + (cx - 30) + ' ' + (cy - 22) + ', ' + (cx + 30) + ' ' + (cy - 22) + ', ' + (cx + 30) + ' ' + (cy + 2) + ' L ' + (cx + 16) + ' ' + (cy + 34) + ' L ' + (cx - 16) + ' ' + (cy + 34) + ' Z" fill="' + f + '"/>';
  }
  if (type === 'laptop') {
    return '<rect x="' + (cx - 34) + '" y="' + (cy - 32) + '" width="68" height="46" rx="6" fill="' + f + '"/>'
      + '<path d="M ' + (cx - 38) + ' ' + (cy + 14) + ' L ' + (cx + 38) + ' ' + (cy + 14) + ' L ' + (cx + 26) + ' ' + (cy + 34) + ' L ' + (cx - 26) + ' ' + (cy + 34) + ' Z" fill="' + f + '"/>'
      + '<rect x="' + (cx - 26) + '" y="' + (cy - 24) + '" width="52" height="30" rx="3" fill="#ffffff" opacity="0.85"/>';
  }
  if (type === 'bubble') {
    return '<path d="M ' + (cx - 34) + ' ' + (cy - 26) + ' L ' + (cx + 34) + ' ' + (cy - 26) + ' L ' + (cx + 34) + ' ' + (cy + 20) + ' L ' + (cx + 2) + ' ' + (cy + 20) + ' L ' + (cx - 14) + ' ' + (cy + 38) + ' L ' + (cx - 8) + ' ' + (cy + 20) + ' L ' + (cx - 34) + ' ' + (cy + 20) + ' Z" fill="' + f + '"/>'
      + '<circle cx="' + (cx - 14) + '" cy="' + (cy - 3) + '" r="5" fill="#ffffff"/>'
      + '<circle cx="' + cx + '" cy="' + (cy - 3) + '" r="5" fill="#ffffff"/>'
      + '<circle cx="' + (cx + 14) + '" cy="' + (cy - 3) + '" r="5" fill="#ffffff"/>';
  }
  if (type === 'chain') {
    return '<ellipse cx="' + (cx - 18) + '" cy="' + cy + '" rx="24" ry="16" fill="' + f + '" transform="rotate(-25 ' + (cx - 18) + ' ' + cy + ')"/>'
      + '<ellipse cx="' + (cx + 18) + '" cy="' + cy + '" rx="24" ry="16" fill="' + f + '" transform="rotate(25 ' + (cx + 18) + ' ' + cy + ')"/>'
      + '<circle cx="' + (cx - 14) + '" cy="' + cy + '" r="9" fill="#ffffff" opacity="0.85"/>'
      + '<circle cx="' + (cx + 14) + '" cy="' + cy + '" r="9" fill="#ffffff" opacity="0.85"/>';
  }
  return '';
}

function buildMap(highlight) {
  const W = 1351, H = 1290;
  const towerX = 676, towerY = 700;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  // dashed roads
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 420" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.6"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 400 950" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.6"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 1000 300" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.6"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 950 800" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.6"/>';
  h += '<path d="M ' + towerX + ' ' + towerY + ' L 676 1240" fill="none" stroke="#aaa" stroke-width="5" stroke-dasharray="12 14" opacity="0.6"/>';

  // tower (filled silhouette)
  const tc = highlight === 'tower' ? '#667eea' : '#1a1a1a';
  h += '<g fill="' + tc + '">'
    + '<rect x="626" y="560" width="100" height="150" rx="6"/>'
    + '<rect x="606" y="520" width="140" height="52" rx="6"/>'
    + '<path d="M 616 520 L 676 455 L 736 520 Z"/>'
    + '<circle cx="676" cy="448" r="16"/>'
    + '</g>';

  // zones: big filled icon + label
  for (const z of ZONES) {
    const cx = W * z.x / 100, cy = H * z.y / 100;
    const col = highlight === z.id ? z.accent : '#1a1a1a';
    h += iconSvg(z.icon, cx, cy, col);
    h += '<text x="' + cx + '" y="' + (cy + 78) + '" font-family="Hupo" font-size="52" fill="' + col + '" text-anchor="middle">' + z.label + '</text>';
  }

  // pin start marker
  h += '<circle cx="676" cy="1250" r="16" fill="none" stroke="#1a1a1a" stroke-width="5" stroke-dasharray="5 6"/>';

  h += '</svg>';
  return h;
}

// output as map-v4 (fresh filenames to dodge any cache)
await render('images/map-v4.webp', buildMap(null));
for (const z of ZONES) {
  await render('images/map-v4-' + z.id + '.webp', buildMap(z.id), { tint: '#e9e3f8' });
}
console.log('MAP V4 DONE');
