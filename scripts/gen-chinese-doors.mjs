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
  rubik: b64('fonts/RubikScribble-Regular.ttf'),
  cabin: b64('fonts/CabinSketch-Regular.ttf'),
  cabinB: b64('fonts/CabinSketch-Bold.ttf'),
  hupo: b64('fonts/HuawenHupo.ttf'),
};
function fontCss() {
  return "@font-face{font-family:'Rubik';src:url(data:font/ttf;base64," + FONTS.rubik + ") format('truetype');}"
    + "@font-face{font-family:'Cabin';src:url(data:font/ttf;base64," + FONTS.cabin + ") format('truetype');}"
    + "@font-face{font-family:'CabinB';src:url(data:font/ttf;base64," + FONTS.cabinB + ") format('truetype');}"
    + "@font-face{font-family:'Hupo';src:url(data:font/ttf;base64," + FONTS.hupo + ") format('truetype');}";
}

async function render(outRel, w, h, svg, opts = {}) {
  const outAbs = path.join(PUBLIC, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  if (opts.paper) {
    let bg = sharp(PAPER).resize(w, h, { fit: 'cover' });
    if (opts.grayscale) bg = bg.grayscale().modulate({ brightness: 1.06 });
    else bg = bg.modulate({ brightness: 1.04, saturation: 1.1 });
    if (opts.paperTint) bg = bg.tint(opts.paperTint);
    const buf = await bg.toBuffer();
    await sharp(buf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).webp({ quality: 84 }).toFile(outAbs);
  } else {
    await sharp(Buffer.from(svg)).webp({ quality: 84 }).toFile(outAbs);
  }
  console.log('wrote', outRel, w + 'x' + h);
}

// ============ DOOR PANELS (512x1024, transparent bg) ============
const doors = [
  { file: 'drzwiprojekty',   icon: 'frame',    accent: '#2563eb' },
  { file: 'drzwisocial',     icon: 'monitor',  accent: '#7c3aed' },
  { file: 'drzwiabout',      icon: 'star',     accent: '#dc2626' },
  { file: 'drzwikontakt',    icon: 'envelope', accent: '#16a34a' },
];
function doorIcon(type, color) {
  if (type === 'frame') return '<rect x="216" y="430" width="80" height="96" rx="6" fill="none" stroke="' + color + '" stroke-width="7"/><rect x="228" y="442" width="56" height="72" fill="none" stroke="' + color + '" stroke-width="4"/>';
  if (type === 'monitor') return '<rect x="206" y="430" width="100" height="70" rx="8" fill="none" stroke="' + color + '" stroke-width="7"/><line x1="206" y1="450" x2="306" y2="450" stroke="' + color + '" stroke-width="5"/><line x1="256" y1="500" x2="256" y2="522" stroke="' + color + '" stroke-width="7"/><line x1="236" y1="522" x2="276" y2="522" stroke="' + color + '" stroke-width="7"/>';
  if (type === 'star') return '<path d="M 256 420 L 272 462 L 318 466 L 283 498 L 293 544 L 256 522 L 219 544 L 229 498 L 194 466 L 240 462 Z" fill="none" stroke="' + color + '" stroke-width="7" stroke-linejoin="round"/>';
  if (type === 'envelope') return '<rect x="206" y="440" width="100" height="66" rx="8" fill="none" stroke="' + color + '" stroke-width="7"/><path d="M 206 448 L 256 486 L 306 448" fill="none" stroke="' + color + '" stroke-width="6"/>';
  return '';
}
function doorSvg(icon, accent, painted) {
  const bodyFill = painted ? 'url(#doorGrad)' : '#f8f5ee';
  const line = '#1a1a1a';
  const iconColor = painted ? accent : '#1a1a1a';
  return '<svg width="512" height="1024" xmlns="http://www.w3.org/2000/svg"><defs><style>' + fontCss() + '</style>'
    + '<linearGradient id="doorGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + accent + '"/><stop offset="100%" stop-color="' + accent + 'dd"/></linearGradient></defs>'
    // door body (rounded top)
    + '<path d="M 40 1024 L 40 280 Q 40 70 256 70 Q 472 70 472 280 L 472 1024 Z" fill="' + bodyFill + '" stroke="' + line + '" stroke-width="8"/>'
    // top arch window
    + '<path d="M 96 300 Q 96 130 256 130 Q 416 130 416 300 Z" fill="none" stroke="' + line + '" stroke-width="6"/>'
    + '<line x1="256" y1="130" x2="256" y2="300" stroke="' + line + '" stroke-width="5"/>'
    + '<line x1="96" y1="215" x2="416" y2="215" stroke="' + line + '" stroke-width="5"/>'
    // horizontal rail
    + '<line x1="40" y1="360" x2="472" y2="360" stroke="' + line + '" stroke-width="7"/>'
    + '<line x1="40" y1="385" x2="472" y2="385" stroke="' + line + '" stroke-width="4"/>'
    // bottom recessed panels
    + '<rect x="80" y="600" width="150" height="360" rx="14" fill="none" stroke="' + line + '" stroke-width="6"/>'
    + '<rect x="282" y="600" width="150" height="360" rx="14" fill="none" stroke="' + line + '" stroke-width="6"/>'
    // icon
    + doorIcon(icon, iconColor)
    + '</svg>';
}
for (const d of doors) {
  await render('textures/corridor/doors/' + d.file + '.webp', 512, 1024, doorSvg(d.icon, d.accent, false));
  await render('textures/corridor/doors/' + d.file + '_painted.webp', 512, 1024, doorSvg(d.icon, d.accent, true));
}

// ============ MAP with Chinese zone labels (1351x1290) ============
function mapSvg(highlight) {
  const S = (c) => highlight === c ? '#667eea' : '#1a1a1a';
  const F = (c) => highlight === c ? '#764ba2' : '#1a1a1a';
  const fill = (c) => highlight === c ? '#764ba2' : '#f8f5ee';
  let h = '<svg width="1351" height="1290" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  h += '<text x="676" y="90" font-family="Hupo" font-size="58" fill="#1a1a1a" text-anchor="middle">WOLF 地图</text>';
  h += '<text x="676" y="145" font-family="Cabin" font-size="26" fill="#555" text-anchor="middle">full-stack · pentest · security</text>';
  h += '<path d="M 300 380 C 420 420, 480 460, 620 500" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 300 880 C 430 820, 500 720, 610 620" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 1050 380 C 930 430, 860 480, 720 520" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 1050 880 C 930 820, 860 720, 740 620" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<g stroke="' + S('tower') + '" fill="none" stroke-width="6"><rect x="626" y="420" width="100" height="180"/><rect x="610" y="380" width="132" height="50"/><path d="M 620 380 L 676 320 L 732 380"/><line x1="676" y1="320" x2="676" y2="290"/><circle cx="676" cy="282" r="8" fill="' + S('tower') + '"/>';
  for (let i = 1; i <= 3; i++) h += '<line x1="646" y1="' + (460 + i * 40) + '" x2="706" y2="' + (460 + i * 40) + '"/>';
  h += '</g>';
  h += '<g stroke="' + S('ship') + '" fill="none" stroke-width="6"><path d="M 240 300 L 360 300 L 300 380 Z"/><path d="M 220 380 C 240 410, 360 410, 380 380 Z" fill="' + fill('ship') + '"/><line x1="300" y1="300" x2="300" y2="240"/></g>';
  h += '<text x="300" y="450" font-family="Hupo" font-size="34" fill="' + F('ship') + '" text-anchor="middle">关于我</text>';
  h += '<g stroke="' + S('bridge') + '" fill="none" stroke-width="6"><path d="M 220 830 Q 300 770 380 830"/><line x1="270" y1="800" x2="270" y2="860"/><line x1="330" y1="800" x2="330" y2="860"/></g>';
  h += '<text x="300" y="910" font-family="Hupo" font-size="34" fill="' + F('bridge') + '" text-anchor="middle">画廊</text>';
  h += '<g stroke="' + S('castle') + '" fill="none" stroke-width="6"><rect x="1000" y="270" width="120" height="90"/><path d="M 990 270 L 1000 240 L 1020 270 L 1040 240 L 1060 270 L 1080 240 L 1090 270 L 1130 270 L 1130 360 L 990 360 Z"/><rect x="1030" y="300" width="60" height="60"/></g>';
  h += '<text x="1060" y="410" font-family="Hupo" font-size="34" fill="' + F('castle') + '" text-anchor="middle">联系我</text>';
  h += '<g stroke="' + S('pyramid') + '" fill="none" stroke-width="6"><path d="M 1000 830 L 1080 740 L 1160 830 Z"/><line x1="1040" y1="790" x2="1120" y2="790"/><line x1="1060" y1="760" x2="1100" y2="760"/></g>';
  h += '<text x="1080" y="870" font-family="Hupo" font-size="34" fill="' + F('pyramid') + '" text-anchor="middle">创作室</text>';
  h += '<g stroke="#1a1a1a" stroke-width="4" fill="none"><circle cx="150" cy="150" r="50"/><path d="M 150 100 L 165 150 L 150 200 L 135 150 Z" fill="#1a1a1a"/></g>';
  h += '<text x="150" y="82" font-family="CabinB" font-size="24" fill="#1a1a1a" text-anchor="middle">N</text>';
  h += '</svg>';
  return h;
}
await render('images/map.webp', 1351, 1290, mapSvg(null), { paper: true });
const zoneMap = { ship: 'about', bridge: 'gallery', castle: 'contact', pyramid: 'studio' };
for (const [z, name] of Object.entries(zoneMap)) {
  await render('images/map_' + name + '_painted.webp', 1351, 1290, mapSvg(z), { paper: true, paperTint: '#dcd6ff' });
}

console.log('DOORS + MAP DONE');
