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
};
function fontCss() {
  return "@font-face{font-family:'Rubik';src:url(data:font/ttf;base64," + FONTS.rubik + ") format('truetype');}"
    + "@font-face{font-family:'Cabin';src:url(data:font/ttf;base64," + FONTS.cabin + ") format('truetype');}"
    + "@font-face{font-family:'CabinB';src:url(data:font/ttf;base64," + FONTS.cabinB + ") format('truetype');}";
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

// ============ 1. SKILL BALLOONS (512x1024, transparent bg) ============
const skills = [
  { key: 'pentest',  c1: '#ef4444', c2: '#b91c1c' },
  { key: 'security', c1: '#667eea', c2: '#4c1d95' },
  { key: 'webdev',   c1: '#3b82f6', c2: '#1d4ed8' },
  { key: 'linux',    c1: '#22c55e', c2: '#15803d' },
  { key: 'python',   c1: '#f59e0b', c2: '#b45309' },
  { key: 'embedded', c1: '#14b8a6', c2: '#0f766e' },
  { key: 'db',       c1: '#a855f7', c2: '#7e22ce' },
  { key: 'ai',       c1: '#8b5cf6', c2: '#6d28d9' },
  { key: 'network',  c1: '#06b6d4', c2: '#0e7490' },
  { key: 'blog',     c1: '#f97316', c2: '#c2410c' },
];
function balloonSvg(c1, c2, painted) {
  const bodyFill = painted ? 'url(#g)' : '#f8f5ee';
  const hi = painted ? '<ellipse cx="205" cy="235" rx="42" ry="70" fill="#ffffff" opacity="0.35" transform="rotate(-25 205 235)"/>' : '';
  return '<svg width="512" height="1024" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><style>' + fontCss() + '</style>'
    + '<linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient></defs>'
    + '<ellipse cx="256" cy="330" rx="168" ry="215" fill="' + bodyFill + '" stroke="#1a1a1a" stroke-width="7"/>'
    + hi
    + '<path d="M 256 542 L 236 580 L 276 580 Z" fill="' + bodyFill + '" stroke="#1a1a1a" stroke-width="6"/>'
    + '<path d="M 256 580 C 250 680, 300 720, 262 840 C 250 880, 244 940, 250 980" fill="none" stroke="' + (painted ? '#666' : '#1a1a1a') + '" stroke-width="5"/>'
    + '</svg>';
}
for (const s of skills) {
  await render('textures/about/wolfballoon_' + s.key + '.webp', 512, 1024, balloonSvg(s.c1, s.c2, false));
  await render('textures/about/wolfballoon_' + s.key + '_painted.webp', 512, 1024, balloonSvg(s.c1, s.c2, true));
}

// ============ 2. MAP (1351x1290 base + 4 painted highlights) ============
function mapSvg(highlight) {
  const S = (c) => highlight === c ? '#667eea' : '#1a1a1a';
  const F = (c) => highlight === c ? '#764ba2' : '#1a1a1a';
  const fill = (c) => highlight === c ? '#764ba2' : '#f8f5ee';
  let h = '<svg width="1351" height="1290" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>';
  h += '<text x="676" y="90" font-family="Rubik" font-size="54" fill="#1a1a1a" text-anchor="middle">WOLF&apos;S MAP</text>';
  h += '<text x="676" y="140" font-family="Cabin" font-size="26" fill="#555" text-anchor="middle">full-stack · pentest · security</text>';
  h += '<path d="M 300 380 C 420 420, 480 460, 620 500" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 300 880 C 430 820, 500 720, 610 620" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 1050 380 C 930 430, 860 480, 720 520" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  h += '<path d="M 1050 880 C 930 820, 860 720, 740 620" fill="none" stroke="#888" stroke-width="4" stroke-dasharray="10 10"/>';
  // tower
  h += '<g stroke="' + S('tower') + '" fill="none" stroke-width="6"><rect x="626" y="420" width="100" height="180"/><rect x="610" y="380" width="132" height="50"/><path d="M 620 380 L 676 320 L 732 380"/><line x1="676" y1="320" x2="676" y2="290"/><circle cx="676" cy="282" r="8" fill="' + S('tower') + '"/>';
  for (let i = 1; i <= 3; i++) h += '<line x1="646" y1="' + (460 + i * 40) + '" x2="706" y2="' + (460 + i * 40) + '"/>';
  h += '</g>';
  // ship
  h += '<g stroke="' + S('ship') + '" fill="none" stroke-width="6"><path d="M 240 300 L 360 300 L 300 380 Z"/><path d="M 220 380 C 240 410, 360 410, 380 380 Z" fill="' + fill('ship') + '"/><line x1="300" y1="300" x2="300" y2="240"/></g>';
  h += '<text x="300" y="440" font-family="CabinB" font-size="30" fill="' + F('ship') + '" text-anchor="middle">ABOUT</text>';
  // bridge
  h += '<g stroke="' + S('bridge') + '" fill="none" stroke-width="6"><path d="M 220 830 Q 300 770 380 830"/><line x1="270" y1="800" x2="270" y2="860"/><line x1="330" y1="800" x2="330" y2="860"/></g>';
  h += '<text x="300" y="900" font-family="CabinB" font-size="30" fill="' + F('bridge') + '" text-anchor="middle">GALLERY</text>';
  // castle
  h += '<g stroke="' + S('castle') + '" fill="none" stroke-width="6"><rect x="1000" y="270" width="120" height="90"/><path d="M 990 270 L 1000 240 L 1020 270 L 1040 240 L 1060 270 L 1080 240 L 1090 270 L 1130 270 L 1130 360 L 990 360 Z"/><rect x="1030" y="300" width="60" height="60"/></g>';
  h += '<text x="1060" y="400" font-family="CabinB" font-size="30" fill="' + F('castle') + '" text-anchor="middle">CONTACT</text>';
  // pyramid
  h += '<g stroke="' + S('pyramid') + '" fill="none" stroke-width="6"><path d="M 1000 830 L 1080 740 L 1160 830 Z"/><line x1="1040" y1="790" x2="1120" y2="790"/><line x1="1060" y1="760" x2="1100" y2="760"/></g>';
  h += '<text x="1080" y="860" font-family="CabinB" font-size="30" fill="' + F('pyramid') + '" text-anchor="middle">STUDIO</text>';
  // compass
  h += '<g stroke="#1a1a1a" stroke-width="4" fill="none"><circle cx="150" cy="150" r="50"/><path d="M 150 100 L 165 150 L 150 200 L 135 150 Z" fill="#1a1a1a"/></g>';
  h += '<text x="150" y="82" font-family="CabinB" font-size="24" fill="#1a1a1a" text-anchor="middle">N</text>';
  h += '</svg>';
  return h;
}
await render('images/map.webp', 1351, 1290, mapSvg(null), { paper: true });
await render('images/map_ship_painted.webp', 1351, 1290, mapSvg('ship'), { paper: true, paperTint: '#dcd6ff' });
await render('images/map_bridge_painted.webp', 1351, 1290, mapSvg('bridge'), { paper: true, paperTint: '#dcd6ff' });
await render('images/map_castle_painted.webp', 1351, 1290, mapSvg('castle'), { paper: true, paperTint: '#dcd6ff' });
await render('images/map_pyramid_painted.webp', 1351, 1290, mapSvg('pyramid'), { paper: true, paperTint: '#dcd6ff' });

// ============ 3. AVATAR WINDOW (1024x1024) ============
const blogImg = path.join(ROOT, 'public/images/blog-home-bg.webp');
if (!fs.existsSync(blogImg)) {
  const src = 'D:/git/Blog/source/img/pages/home-bg.jpg';
  if (fs.existsSync(src)) {
    await sharp(src).resize(800, 800, { fit: 'cover' }).grayscale().modulate({ brightness: 1.1 }).webp({ quality: 80 }).toFile(blogImg);
    console.log('blog home-bg -> public/images/blog-home-bg.webp');
  }
}
const windowSvg = '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>'
  + '<rect x="70" y="70" width="884" height="884" rx="40" fill="none" stroke="#1a1a1a" stroke-width="10" stroke-dasharray="18 12"/>'
  + '<image href="/images/blog-home-bg.webp" x="150" y="150" width="724" height="724" preserveAspectRatio="xMidYMid slice" opacity="0.95"/>'
  + '<line x1="150" y1="512" x2="874" y2="512" stroke="#1a1a1a" stroke-width="6"/>'
  + '<line x1="512" y1="150" x2="512" y2="874" stroke="#1a1a1a" stroke-width="6"/>'
  + '<text x="512" y="975" font-family="Rubik" font-size="64" fill="#1a1a1a" text-anchor="middle">WOLF</text></svg>';
await render('textures/entrance/avatar_window.webp', 1024, 1024, windowSvg, { paper: true, grayscale: true });

// ============ 4. ENTRANCE SIGN (1802x901) ============
const signSvg = '<svg width="1802" height="901" xmlns="http://www.w3.org/2000/svg"><style>' + fontCss() + '</style>'
  + '<rect x="70" y="80" width="1662" height="700" rx="50" fill="none" stroke="#1a1a1a" stroke-width="12" stroke-dasharray="20 14"/>'
  + '<text x="901" y="420" font-family="Rubik" font-size="200" fill="#1a1a1a" text-anchor="middle">WOLF</text>'
  + '<text x="901" y="600" font-family="CabinB" font-size="66" fill="#555" text-anchor="middle">full-stack · pentest · security</text></svg>';
await render('textures/entrance/sign.webp', 1802, 901, signSvg, { paper: true, grayscale: true });

// ============ 5. JOURNEY ISLANDS ============
function islandSvg(title, sub, c1, c2, painted) {
  return '<svg width="1372" height="686" xmlns="http://www.w3.org/2000/svg"><defs><style>' + fontCss() + '</style>'
    + '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient></defs>'
    + '<path d="M 120 420 C 260 320, 520 300, 760 330 C 1000 360, 1200 420, 1250 520 L 1220 600 L 900 620 C 700 640, 500 640, 320 620 L 140 600 Z" fill="' + (painted ? 'url(#g)' : '#f8f5ee') + '" stroke="#1a1a1a" stroke-width="8"/>'
    + '<path d="M 500 330 C 560 290, 640 280, 700 300 C 640 340, 560 350, 500 330 Z" fill="' + (painted ? '#22c55e' : '#e8e4da') + '" stroke="#1a1a1a" stroke-width="5"/>'
    + '<text x="686" y="470" font-family="Rubik" font-size="70" fill="' + (painted ? '#fff' : '#1a1a1a') + '" text-anchor="middle">' + title + '</text>'
    + '<text x="686" y="540" font-family="Cabin" font-size="34" fill="' + (painted ? '#fff' : '#555') + '" text-anchor="middle">' + sub + '</text></svg>';
}
await render('textures/about/uowyspa.webp', 1372, 686, islandSvg('SELF-TAUGHT', 'Blog · Targets · Labs', '#667eea', '#764ba2', false), { paper: true, grayscale: true });
await render('textures/about/uowyspa_painted.webp', 1372, 686, islandSvg('SELF-TAUGHT', 'Blog · Targets · Labs', '#667eea', '#764ba2', true));
await render('textures/about/freelancewyspa.webp', 1372, 686, islandSvg('SECURITY OPS', 'XDR · Pentest · AI', '#dc2626', '#7c3aed', false), { paper: true, grayscale: true });
await render('textures/about/freelancewyspa_painted.webp', 1372, 686, islandSvg('SECURITY OPS', 'XDR · Pentest · AI', '#dc2626', '#7c3aed', true));

console.log('ALL WOLF ASSETS GENERATED');
