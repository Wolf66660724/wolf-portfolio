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

// ============ 1. Friend-links monitor screen (1024x512) ============
function linksMonitorSvg(painted) {
  const barBg = painted ? '#4A90D9' : '#e8e6e0';
  const textColor = painted ? '#4A90D9' : '#1a1a1a';
  const dot = ['#e05b5b','#e8b84b','#5bb06b'];
  let rows = '';
  for (let i = 0; i < 6; i++) {
    const y = 200 + i * 44;
    const rw = [360, 300, 400, 280, 340, 260][i];
    rows += '<rect x="90" y="' + y + '" width="' + rw + '" height="16" rx="8" fill="' + (painted ? '#4A90D9' : '#c9c6bf') + '" opacity="' + (painted ? 0.7 : 0.85) + '"/>';
    rows += '<circle cx="76" cy="' + (y + 8) + '" r="6" fill="' + (painted ? '#2d6cb5' : '#999') + '"/>';
  }
  return '<svg width="1024" height="512" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>'
    + '<rect x="0" y="0" width="1024" height="64" fill="' + barBg + '"/>'
    + dot.map((c, i) => '<circle cx="' + (34 + i * 30) + '" cy="32" r="9" fill="' + c + '" opacity="0.9"/>').join('')
    + '<rect x="120" y="16" width="784" height="32" rx="16" fill="#ffffff" opacity="0.85"/>'
    + '<text x="512" y="39" font-family="Cabin" font-size="20" fill="#555" text-anchor="middle">worldpeace.top / links 友链</text>'
    + '<text x="70" y="150" font-family="Rubik" font-size="56" fill="' + textColor + '" text-anchor="start">友链 LINKS</text>'
    + rows + '</svg>';
}
await render('textures/studio/monitorfront_wolflinks.webp', 1024, 512, linksMonitorSvg(false), { paper: true, grayscale: true });
await render('textures/studio/monitorfront_wolflinks_painted.webp', 1024, 512, linksMonitorSvg(true), { paper: true, paperTint: '#cfe0ff' });

// ============ 2. Photos -> wall-photo-1..4 (natural aspect, grayscale + color) ============
const photos = [
  { src: 'photos/photo1.jpg', name: 'wall-photo-1' },
  { src: 'photos/photo2.jpg', name: 'wall-photo-2' },
  { src: 'photos/photo3.jpg', name: 'wall-photo-3' },
  { src: 'photos/photo4.jpg', name: 'wall-photo-4' },
];
for (const ph of photos) {
  const img = sharp(ph.src);
  const meta = await img.metadata();
  // resize to max 1024 width, keep aspect
  const w = Math.min(1024, meta.width);
  const h = Math.round(w * meta.height / meta.width);
  await img.clone().resize(w, h).webp({ quality: 84 }).toFile(path.join(PUBLIC, 'textures/corridor/', ph.name + '_color.webp'));
  await img.clone().resize(w, h).grayscale().modulate({ brightness: 1.05 }).webp({ quality: 84 }).toFile(path.join(PUBLIC, 'textures/corridor/', ph.name + '.webp'));
  console.log('photo', ph.name, w + 'x' + h);
}

// ============ 3. Portrait wooden frame texture (1024x1536) ============
function frameSvg(painted) {
  const border = painted ? 'url(#wood)' : '#e8e2d6';
  const stroke = painted ? '#5b3a1e' : '#1a1a1a';
  return '<svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg"><defs><style>' + fontCss() + '</style>'
    + '<linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5a2b"/><stop offset="50%" stop-color="#a9743f"/><stop offset="100%" stop-color="#6f4422"/></linearGradient></defs>'
    // outer wooden border (thick rounded rect)
    + '<rect x="20" y="20" width="984" height="1496" rx="46" fill="' + border + '" stroke="' + stroke + '" stroke-width="10"/>'
    + '<rect x="110" y="110" width="804" height="1316" rx="24" fill="#000000" opacity="0"/>'
    // inner frame line
    + '<rect x="86" y="86" width="852" height="1364" rx="20" fill="none" stroke="' + stroke + '" stroke-width="6" stroke-dasharray="14 10" opacity="0.7"/>'
    // corner nails
    + '<circle cx="86" cy="86" r="10" fill="' + (painted ? '#3d2410' : '#1a1a1a') + '"/>'
    + '<circle cx="938" cy="86" r="10" fill="' + (painted ? '#3d2410' : '#1a1a1a') + '"/>'
    + '<circle cx="86" cy="1450" r="10" fill="' + (painted ? '#3d2410' : '#1a1a1a') + '"/>'
    + '<circle cx="938" cy="1450" r="10" fill="' + (painted ? '#3d2410' : '#1a1a1a') + '"/>'
    + '</svg>';
}
await render('textures/corridor/ramkanazdjecieduza.webp', 1024, 1536, frameSvg(false));
await render('textures/corridor/ramkanazdjecieduza_painted.webp', 1024, 1536, frameSvg(true));

// ============ 4. Map with new labels ============
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
  h += '<text x="300" y="450" font-family="Hupo" font-size="32" fill="' + F('ship') + '" text-anchor="middle">自我介绍</text>';
  h += '<g stroke="' + S('bridge') + '" fill="none" stroke-width="6"><path d="M 220 830 Q 300 770 380 830"/><line x1="270" y1="800" x2="270" y2="860"/><line x1="330" y1="800" x2="330" y2="860"/></g>';
  h += '<text x="300" y="910" font-family="Hupo" font-size="32" fill="' + F('bridge') + '" text-anchor="middle">博客项目</text>';
  h += '<g stroke="' + S('castle') + '" fill="none" stroke-width="6"><rect x="1000" y="270" width="120" height="90"/><path d="M 990 270 L 1000 240 L 1020 270 L 1040 240 L 1060 270 L 1080 240 L 1090 270 L 1130 270 L 1130 360 L 990 360 Z"/><rect x="1030" y="300" width="60" height="60"/></g>';
  h += '<text x="1060" y="410" font-family="Hupo" font-size="32" fill="' + F('castle') + '" text-anchor="middle">留言板</text>';
  h += '<g stroke="' + S('pyramid') + '" fill="none" stroke-width="6"><path d="M 1000 830 L 1080 740 L 1160 830 Z"/><line x1="1040" y1="790" x2="1120" y2="790"/><line x1="1060" y1="760" x2="1100" y2="760"/></g>';
  h += '<text x="1080" y="870" font-family="Hupo" font-size="32" fill="' + F('pyramid') + '" text-anchor="middle">友链</text>';
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
