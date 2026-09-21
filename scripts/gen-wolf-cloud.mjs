import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(path.resolve(__dirname, '..'), 'public');

const INK = '#2a2a2a';
const FILL = '#f5efe6';
const FILL2 = '#fdf9f0';
const ACCENT = '#e5484d';

function wolfOnCloud() {
  const W = 1781, H = 890;
  const cx = W / 2, cy = H / 2;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">';
  // cloud
  h += '<g fill="' + FILL + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round">'
    + '<ellipse cx="' + (cx - 380) + '" cy="' + (cy + 120) + '" rx="180" ry="95"/>'
    + '<ellipse cx="' + (cx - 120) + '" cy="' + (cy + 95) + '" rx="230" ry="125"/>'
    + '<ellipse cx="' + (cx + 200) + '" cy="' + (cy + 115) + '" rx="200" ry="110"/>'
    + '<ellipse cx="' + (cx + 430) + '" cy="' + (cy + 130) + '" rx="150" ry="85"/>'
    + '<rect x="' + (cx - 540) + '" y="' + (cy + 130) + '" width="1080" height="110" rx="55"/>'
    + '</g>';
  // wolf body (lying)
  h += '<g stroke="' + INK + '" stroke-width="8" stroke-linejoin="round" fill="none">'
    + '<ellipse cx="' + (cx + 90) + '" cy="' + (cy - 40) + '" rx="200" ry="95" fill="' + FILL + '"/>'
    // tail
    + '<path d="M ' + (cx + 275) + ' ' + (cy - 55) + ' C ' + (cx + 350) + ' ' + (cy - 90) + ', ' + (cx + 330) + ' ' + (cy - 150) + ', ' + (cx + 280) + ' ' + (cy - 130) + '" fill="' + FILL + '"/>'
    // legs
    + '<path d="M ' + (cx + 40) + ' ' + (cy + 40) + ' L ' + (cx + 30) + ' ' + (cy + 105) + '"/>'
    + '<path d="M ' + (cx + 130) + ' ' + (cy + 45) + ' L ' + (cx + 140) + ' ' + (cy + 108) + '"/>'
    + '<ellipse cx="' + (cx + 20) + '" cy="' + (cy + 120) + '" rx="34" ry="14" fill="' + FILL + '"/>'
    + '<ellipse cx="' + (cx + 150) + '" cy="' + (cy + 122) + '" rx="34" ry="14" fill="' + FILL + '"/>'
    // head
    + '<ellipse cx="' + (cx - 120) + '" cy="' + (cy - 80) + '" rx="100" ry="88" fill="' + FILL + '"/>'
    // ears
    + '<path d="M ' + (cx - 200) + ' ' + (cy - 110) + ' L ' + (cx - 220) + ' ' + (cy - 200) + ' L ' + (cx - 145) + ' ' + (cy - 145) + ' Z" fill="' + FILL + '"/>'
    + '<path d="M ' + (cx - 60) + ' ' + (cy - 150) + ' L ' + (cx - 40) + ' ' + (cy - 235) + ' L ' + (cx - 8) + ' ' + (cy - 160) + ' Z" fill="' + FILL + '"/>'
    // inner ears
    + '<path d="M ' + (cx - 196) + ' ' + (cy - 120) + ' L ' + (cx - 208) + ' ' + (cy - 180) + ' L ' + (cx - 158) + ' ' + (cy - 148) + ' Z" stroke="' + ACCENT + '" stroke-width="5" fill="none"/>'
    + '<path d="M ' + (cx - 58) + ' ' + (cy - 158) + ' L ' + (cx - 48) + ' ' + (cy - 212) + ' L ' + (cx - 20) + ' ' + (cy - 165) + ' Z" stroke="' + ACCENT + '" stroke-width="5" fill="none"/>'
    // muzzle
    + '<ellipse cx="' + (cx - 168) + '" cy="' + (cy - 58) + '" rx="40" ry="30" fill="' + FILL2 + '"/>'
    // eye
    + '<circle cx="' + (cx - 100) + '" cy="' + (cy - 95) + '" r="12" fill="' + INK + '"/>'
    + '<circle cx="' + (cx - 96) + '" cy="' + (cy - 99) + '" r="4" fill="#fff"/>'
    // nose + smile
    + '<path d="M ' + (cx - 186) + ' ' + (cy - 68) + ' L ' + (cx - 170) + ' ' + (cy - 68) + ' L ' + (cx - 178) + ' ' + (cy - 56) + ' Z" fill="' + INK + '"/>'
    + '<path d="M ' + (cx - 200) + ' ' + (cy - 42) + ' Q ' + (cx - 168) + ' ' + (cy - 24) + ' ' + (cx - 140) + ' ' + (cy - 44) + '"/>'
    + '</g>';
  // star
  h += '<path d="M ' + (cx + 420) + ' ' + (cy - 200) + ' l 8 24 l 24 8 l -24 8 l -8 24 l -8 -24 l -24 -8 l 24 -8 Z" fill="' + ACCENT + '"/>';
  h += '</svg>';
  return h;
}

(async () => {
  const svg = wolfOnCloud();
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(PUBLIC, 'textures/about/awatarnachmurce.webp'));
  console.log('wrote awatarnachmurce.webp (wolf on cloud)');
})();
