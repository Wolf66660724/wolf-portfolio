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
  console.log('wrote', outRel);
}

function cardSvg({ w, h, topLabel, title, subtitle, accent, painted }) {
  const stroke = painted ? accent : '#1a1a1a';
  const titleColor = painted ? accent : '#1a1a1a';
  const subColor = painted ? accent : '#444444';
  const labelColor = painted ? accent : '#333333';
  const line = painted ? accent : '#333333';
  return '<svg width="' + w + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>'
    + '<rect x="34" y="34" width="' + (w-68) + '" height="' + (h-68) + '" rx="42" fill="none" stroke="' + stroke + '" stroke-width="10" stroke-dasharray="16 12" opacity="0.9"/>'
    + '<line x1="' + (w*0.18) + '" y1="' + (h*0.24) + '" x2="' + (w*0.82) + '" y2="' + (h*0.24) + '" stroke="' + line + '" stroke-width="4" stroke-dasharray="10 8" opacity="0.55"/>'
    + '<text x="' + (w/2) + '" y="' + (h*0.21) + '" font-family="CabinB" font-size="' + Math.round(w*0.042) + '" fill="' + labelColor + '" text-anchor="middle" letter-spacing="6">' + topLabel + '</text>'
    + '<text x="' + (w/2) + '" y="' + (h*0.50) + '" font-family="Rubik" font-size="' + Math.round(w*0.128) + '" fill="' + titleColor + '" text-anchor="middle">' + title + '</text>'
    + '<text x="' + (w/2) + '" y="' + (h*0.60) + '" font-family="Cabin" font-size="' + Math.round(w*0.05) + '" fill="' + subColor + '" text-anchor="middle" letter-spacing="2">' + subtitle + '</text></svg>';
}

// New gallery covers for the Security room
const covers = [
  { key: 'ops',   title: 'SECURITY', sub: 'OPS',   accent: '#dc2626' },
  { key: 'notes', title: 'SECURITY', sub: 'NOTES', accent: '#2563eb' },
];
for (const c of covers) {
  await render('textures/gallery/' + c.key + '_front.webp', 1024, 2048, cardSvg({ w: 1024, h: 2048, topLabel: 'WOLF PORTFOLIO', title: c.title, subtitle: c.sub, accent: c.accent, painted: false }), { paper: true, grayscale: true });
  await render('textures/gallery/' + c.key + '_painted.webp', 1024, 2048, cardSvg({ w: 1024, h: 2048, topLabel: 'WOLF PORTFOLIO', title: c.title, subtitle: c.sub, accent: c.accent, painted: true }), { paper: true, paperTint: c.accent });
}

// Map with new labels: 安全笔记 / 生活随笔 / 关于我 / 联系我
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
  h += '<text x="300" y="910" font-family="Hupo" font-size="32" fill="' + F('bridge') + '" text-anchor="middle">安全笔记</text>';
  h += '<g stroke="' + S('castle') + '" fill="none" stroke-width="6"><rect x="1000" y="270" width="120" height="90"/><path d="M 990 270 L 1000 240 L 1020 270 L 1040 240 L 1060 270 L 1080 240 L 1090 270 L 1130 270 L 1130 360 L 990 360 Z"/><rect x="1030" y="300" width="60" height="60"/></g>';
  h += '<text x="1060" y="410" font-family="Hupo" font-size="34" fill="' + F('castle') + '" text-anchor="middle">联系我</text>';
  h += '<g stroke="' + S('pyramid') + '" fill="none" stroke-width="6"><path d="M 1000 830 L 1080 740 L 1160 830 Z"/><line x1="1040" y1="790" x2="1120" y2="790"/><line x1="1060" y1="760" x2="1100" y2="760"/></g>';
  h += '<text x="1080" y="870" font-family="Hupo" font-size="32" fill="' + F('pyramid') + '" text-anchor="middle">生活随笔</text>';
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
console.log('DONE');
