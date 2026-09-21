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
  cabinBold: b64('fonts/CabinSketch-Bold.ttf'),
  cabin: b64('fonts/CabinSketch-Regular.ttf'),
};

function fontCss() {
  return `@font-face{font-family:'Rubik';src:url(data:font/ttf;base64,${FONTS.rubik}) format('truetype');}
@font-face{font-family:'Cabin';src:url(data:font/ttf;base64,${FONTS.cabin}) format('truetype');}
@font-face{font-family:'CabinB';src:url(data:font/ttf;base64,${FONTS.cabinBold}) format('truetype');}`;
}

// Build an SVG overlay (transparent bg) for a card
function cardSvg({ w, h, topLabel, title, subtitle, accent, painted }) {
  const stroke = painted ? accent : '#1a1a1a';
  const titleColor = painted ? accent : '#1a1a1a';
  const subColor = painted ? accent : '#444444';
  const labelColor = painted ? accent : '#333333';
  const line = painted ? accent : '#333333';
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <style>${fontCss()}</style>
  <rect x="34" y="34" width="${w-68}" height="${h-68}" rx="42" fill="none" stroke="${stroke}" stroke-width="10" stroke-dasharray="16 12" opacity="0.9"/>
  <line x1="${w*0.18}" y1="${h*0.24}" x2="${w*0.82}" y2="${h*0.24}" stroke="${line}" stroke-width="4" stroke-dasharray="10 8" opacity="0.55"/>
  <text x="${w/2}" y="${h*0.21}" font-family="CabinB" font-size="${Math.round(w*0.042)}" fill="${labelColor}" text-anchor="middle" letter-spacing="6">${topLabel}</text>
  <text x="${w/2}" y="${h*0.50}" font-family="Rubik" font-size="${Math.round(w*0.128)}" fill="${titleColor}" text-anchor="middle">${title}</text>
  <text x="${w/2}" y="${h*0.60}" font-family="Cabin" font-size="${Math.round(w*0.05)}" fill="${subColor}" text-anchor="middle" letter-spacing="2">${subtitle}</text>
</svg>`;
}

function monitorSvg({ w, h, accent, painted }) {
  const barBg = painted ? accent : '#e8e6e0';
  const textColor = painted ? accent : '#1a1a1a';
  const gray = painted ? accent : '#777777';
  const dot = ['#e05b5b','#e8b84b','#5bb06b'];
  const rows = Array.from({length: 6}, (_, i) => {
    const y = 200 + i * 44;
    const rw = [380, 300, 420, 260, 350, 240][i];
    return `<rect x="90" y="${y}" width="${rw}" height="16" rx="8" fill="${painted ? accent : '#c9c6bf'}" opacity="${painted ? 0.75 : 0.85}"/>`;
  }).join('');
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <style>${fontCss()}</style>
  <rect x="0" y="0" width="${w}" height="64" fill="${barBg}"/>
  ${dot.map((c,i) => `<circle cx="${34 + i*30}" cy="32" r="9" fill="${c}" opacity="0.9"/>`).join('')}
  <rect x="120" y="16" width="${w-220}" height="32" rx="16" fill="#ffffff" opacity="0.85"/>
  <text x="${w/2}" y="39" font-family="Cabin" font-size="20" fill="#555" text-anchor="middle">worldpeace.top / blog</text>
  <text x="70" y="150" font-family="Rubik" font-size="58" fill="${textColor}" text-anchor="start">WOLF BLOG</text>
  ${rows}
</svg>`;
}

function highlightSvg({ w, h, title, subtitle, accent, painted }) {
  const stroke = painted ? accent : '#1a1a1a';
  const titleColor = painted ? accent : '#1a1a1a';
  const subColor = painted ? accent : '#444444';
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <style>${fontCss()}</style>
  <rect x="22" y="22" width="${w-44}" height="${h-44}" rx="26" fill="none" stroke="${stroke}" stroke-width="8" stroke-dasharray="12 9" opacity="0.9"/>
  <text x="${w/2}" y="${h*0.52}" font-family="Rubik" font-size="${Math.round(w*0.115)}" fill="${titleColor}" text-anchor="middle">${title}</text>
  <text x="${w/2}" y="${h*0.68}" font-family="Cabin" font-size="${Math.round(w*0.062)}" fill="${subColor}" text-anchor="middle" letter-spacing="2">${subtitle}</text>
</svg>`;
}

async function paperBg(w, h, { painted, tint }) {
  let img = sharp(PAPER).resize(w, h, { fit: 'cover' });
  if (!painted) {
    img = img.grayscale().modulate({ brightness: 1.06 });
  } else {
    img = img.modulate({ brightness: 1.03, saturation: 1.2 });
    if (tint) img = img.tint(tint);
  }
  return img.toBuffer();
}

async function render(outRel, w, h, svg, { painted, tint }) {
  const outAbs = path.join(PUBLIC, outRel);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  const bg = await paperBg(w, h, { painted, tint });
  await sharp(bg).composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 84 })
    .toFile(outAbs);
  console.log('wrote', outRel, w + 'x' + h);
}

// ============ GALLERY COVERS (1024x2048) ============
const projects = [
  { key: 'ailab',   title: 'AI SECURITY', sub: 'LAB',       accent: '#7c3aed' },
  { key: 'blog',    title: 'WOLF',        sub: 'BLOG',      accent: '#2563eb' },
  { key: 'toolkit', title: 'PENTEST',     sub: 'TOOLKIT',   accent: '#dc2626' },
  { key: 'embed',   title: 'EMBEDDED',    sub: 'NODE',      accent: '#16a34a' },
];
for (const p of projects) {
  const front = cardSvg({ w: 1024, h: 2048, topLabel: 'WOLF PORTFOLIO', title: p.title, subtitle: p.sub, accent: p.accent, painted: false });
  const paintedSvg = cardSvg({ w: 1024, h: 2048, topLabel: 'WOLF PORTFOLIO', title: p.title, subtitle: p.sub, accent: p.accent, painted: true });
  await render('textures/gallery/' + p.key + '_front.webp', 1024, 2048, front, { painted: false });
  await render('textures/gallery/' + p.key + '_painted.webp', 1024, 2048, paintedSvg, { painted: true, tint: p.accent });
}

// ============ STUDIO MONITOR SCREENS (1024x512) ============
await render('textures/studio/monitorfront_wolfblog.webp', 1024, 512, monitorSvg({ w: 1024, h: 512, accent: '#2563eb', painted: false }), { painted: false });
await render('textures/studio/monitorfront_wolfblog_painted.webp', 1024, 512, monitorSvg({ w: 1024, h: 512, accent: '#2563eb', painted: true }), { painted: true, tint: '#2563eb' });

// ============ ABOUT HIGHLIGHT CARDS (512x512) ============
const highlights = [
  { key: 'HIGHLIGHT_AI',       title: 'AI LAB',      sub: 'AI SECURITY PLATFORM', accent: '#7c3aed' },
  { key: 'HIGHLIGHT_BLOG',     title: 'BLOG',        sub: 'WORLDPEACE.TOP',       accent: '#2563eb' },
  { key: 'HIGHLIGHT_TOOLKIT',  title: 'TOOLKIT',     sub: 'PENTEST SCRIPTS',      accent: '#dc2626' },
  { key: 'HIGHLIGHT_EMBED',    title: 'EMBEDDED',    sub: 'STM32 / ESP32',        accent: '#16a34a' },
  { key: 'HIGHLIGHT_1',        title: 'FULL-STACK',  sub: 'SECURITY + WEB + EMBED', accent: '#7c3aed' },
  { key: 'HIGHLIGHT_2',        title: 'HANDS-ON',    sub: 'FROM APP TO HARDWARE', accent: '#2563eb' },
  { key: 'HIGHLIGHT_3',        title: 'LEARNER',     sub: 'QUICK RAMP-UP',        accent: '#dc2626' },
  { key: 'HIGHLIGHT_4',        title: 'FIELD EXP',   sub: 'TARGETS + PROJECTS',   accent: '#16a34a' },
];
for (const h of highlights) {
  const front = highlightSvg({ w: 512, h: 512, title: h.title, subtitle: h.sub, accent: h.accent, painted: false });
  const paintedSvg = highlightSvg({ w: 512, h: 512, title: h.title, subtitle: h.sub, accent: h.accent, painted: true });
  await render('textures/about/' + h.key + '.webp', 512, 512, front, { painted: false });
  await render('textures/about/' + h.key + '_painted.webp', 512, 512, paintedSvg, { painted: true, tint: h.accent });
}

// ============ ABOUT BIG CARDS (1290x645) ============
const bigCards = [
  { key: 'SOTY', title: 'HIGHLIGHTS', sub: 'FULL-STACK - PENTEST - SECURITY OPS', accent: '#7c3aed' },
  { key: 'SOTD', title: 'STRENGTHS',  sub: 'HANDS-ON - FAST LEARNER - FIELD EXP', accent: '#2563eb' },
  { key: 'SOTM', title: 'JOURNEY',    sub: 'FROM LEARNER TO SECURITY ENGINEER',  accent: '#dc2626' },
];
for (const c of bigCards) {
  const front = cardSvg({ w: 1290, h: 645, topLabel: 'WOLF PORTFOLIO', title: c.title, subtitle: c.sub, accent: c.accent, painted: false });
  const paintedSvg = cardSvg({ w: 1290, h: 645, topLabel: 'WOLF PORTFOLIO', title: c.title, subtitle: c.sub, accent: c.accent, painted: true });
  await render('textures/about/' + c.key + '.webp', 1290, 645, front, { painted: false });
  await render('textures/about/' + c.key + '_painted.webp', 1290, 645, paintedSvg, { painted: true, tint: c.accent });
}

console.log('ALL TEXTURES GENERATED');
