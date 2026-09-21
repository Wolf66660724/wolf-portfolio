import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(path.resolve(__dirname, '..'), 'public');

const INK = '#2b2b2b';
const FUR = '#f7efe2';
const MUZZLE = '#fff8ec';
const EAR = '#f2a0a0';
const HOOD1 = '#667eea';
const HOOD2 = '#764ba2';
const CHEEK = '#f3b8b8';

function wolfCloud() {
  const W = 1781, H = 890;
  const cx = W / 2, cy = H / 2;
  let h = '<svg width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg">'
    + '<defs><linearGradient id="hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + HOOD1 + '"/><stop offset="100%" stop-color="' + HOOD2 + '"/></linearGradient></defs>';
  // cloud
  h += '<g fill="#fffdf5" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round">'
    + '<ellipse cx="' + (cx - 380) + '" cy="' + (cy + 120) + '" rx="180" ry="95"/>'
    + '<ellipse cx="' + (cx - 120) + '" cy="' + (cy + 95) + '" rx="230" ry="125"/>'
    + '<ellipse cx="' + (cx + 200) + '" cy="' + (cy + 115) + '" rx="200" ry="110"/>'
    + '<ellipse cx="' + (cx + 430) + '" cy="' + (cy + 130) + '" rx="150" ry="85"/>'
    + '<rect x="' + (cx - 540) + '" y="' + (cy + 130) + '" width="1080" height="110" rx="55"/>'
    + '</g>';
  // tail
  h += '<path d="M ' + (cx + 250) + ' ' + (cy - 40) + ' C ' + (cx + 330) + ' ' + (cy - 60) + ', ' + (cx + 360) + ' ' + (cy - 120) + ', ' + (cx + 300) + ' ' + (cy - 130) + '" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>';
  // lying body (hoodie gradient)
  h += '<ellipse cx="' + (cx + 90) + '" cy="' + (cy - 30) + '" rx="200" ry="95" fill="url(#hood)" stroke="' + INK + '" stroke-width="8"/>';
  // front legs
  h += '<line x1="' + (cx + 40) + '" y1="' + (cy + 50) + '" x2="' + (cx + 30) + '" y2="' + (cy + 110) + '" stroke="' + HOOD2 + '" stroke-width="28" stroke-linecap="round"/>';
  h += '<line x1="' + (cx + 130) + '" y1="' + (cy + 55) + '" x2="' + (cx + 140) + '" y2="' + (cy + 112) + '" stroke="' + HOOD2 + '" stroke-width="28" stroke-linecap="round"/>';
  h += '<ellipse cx="' + (cx + 18) + '" cy="' + (cy + 126) + '" rx="36" ry="16" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>';
  h += '<ellipse cx="' + (cx + 152) + '" cy="' + (cy + 128) + '" rx="36" ry="16" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>';
  // head (refined)
  h += '<path d="M ' + (cx - 220) + ' ' + (cy - 70) + ' C ' + (cx - 220) + ' ' + (cy - 170) + ', ' + (cx - 20) + ' ' + (cy - 170) + ', ' + (cx - 20) + ' ' + (cy - 70) + ' C ' + (cx - 20) + ' ' + (cy + 10) + ', ' + (cx - 120) + ' ' + (cy + 40) + ', ' + (cx - 120) + ' ' + (cy + 40) + ' C ' + (cx - 220) + ' ' + (cy + 10) + ', ' + (cx - 220) + ' ' + (cy - 70) + ', ' + (cx - 220) + ' ' + (cy - 70) + ' Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8"/>';
  // fur tufts
  h += '<path d="M ' + (cx - 165) + ' ' + (cy - 165) + ' l -8 -22 l 16 10 l 8 -20 l 14 14 l 14 -14 l 10 18 l 18 -6 l 0 22 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
  // ears
  h += '<path d="M ' + (cx - 205) + ' ' + (cy - 120) + ' C ' + (cx - 220) + ' ' + (cy - 180) + ', ' + (cx - 235) + ' ' + (cy - 240) + ', ' + (cx - 270) + ' ' + (cy - 225) + ' C ' + (cx - 285) + ' ' + (cy - 210) + ', ' + (cx - 265) + ' ' + (cy - 145) + ', ' + (cx - 235) + ' ' + (cy - 105) + ' Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>';
  h += '<path d="M ' + (cx - 70) + ' ' + (cy - 130) + ' C ' + (cx - 55) + ' ' + (cy - 190) + ', ' + (cx - 40) + ' ' + (cy - 250) + ', ' + (cx - 5) + ' ' + (cy - 235) + ' C ' + (cx + 10) + ' ' + (cy - 220) + ', ' + (cx - 10) + ' ' + (cy - 155) + ', ' + (cx - 40) + ' ' + (cy - 115) + ' Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>';
  // inner ears
  h += '<path d="M ' + (cx - 225) + ' ' + (cy - 200) + ' C ' + (cx - 235) + ' ' + (cy - 210) + ', ' + (cx - 240) + ' ' + (cy - 175) + ', ' + (cx - 228) + ' ' + (cy - 140) + ' Z" fill="' + EAR + '"/>';
  h += '<path d="M ' + (cx - 50) + ' ' + (cy - 210) + ' C ' + (cx - 40) + ' ' + (cy - 220) + ', ' + (cx - 35) + ' ' + (cy - 185) + ', ' + (cx - 47) + ' ' + (cy - 150) + ' Z" fill="' + EAR + '"/>';
  // eyes
  h += '<ellipse cx="' + (cx - 160) + '" cy="' + (cy - 90) + '" rx="22" ry="30" fill="' + INK + '"/>';
  h += '<ellipse cx="' + (cx - 62) + '" cy="' + (cy - 90) + '" rx="22" ry="30" fill="' + INK + '"/>';
  h += '<circle cx="' + (cx - 166) + '" cy="' + (cy - 98) + '" r="7" fill="#fff"/>';
  h += '<circle cx="' + (cx - 68) + '" cy="' + (cy - 98) + '" r="7" fill="#fff"/>';
  // muzzle + nose + mouth
  h += '<ellipse cx="' + (cx - 111) + '" cy="' + (cy - 40) + '" rx="58" ry="42" fill="' + MUZZLE + '" stroke="' + INK + '" stroke-width="6"/>';
  h += '<path d="M ' + (cx - 122) + ' ' + (cy - 52) + ' L ' + (cx - 100) + ' ' + (cy - 52) + ' L ' + (cx - 111) + ' ' + (cy - 38) + ' Z" fill="' + INK + '"/>';
  h += '<path d="M ' + (cx - 128) + ' ' + (cy - 24) + ' Q ' + (cx - 111) + ' ' + (cy - 6) + ' ' + (cx - 94) + ' ' + (cy - 24) + '" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
  // whiskers + blush
  h += '<path d="M ' + (cx - 175) + ' ' + (cy - 38) + ' l -28 -8 M ' + (cx - 175) + ' ' + (cy - 26) + ' l -30 2" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" opacity="0.8"/>';
  h += '<path d="M ' + (cx - 47) + ' ' + (cy - 38) + ' l 28 -8 M ' + (cx - 47) + ' ' + (cy - 26) + ' l 30 2" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" opacity="0.8"/>';
  h += '<path d="M ' + (cx - 192) + ' ' + (cy - 50) + ' q 10 -10 20 0 M ' + (cx - 30) + ' ' + (cy - 50) + ' q 10 -10 20 0" fill="none" stroke="' + CHEEK + '" stroke-width="7" stroke-linecap="round" opacity="0.9"/>';
  // star
  h += '<path d="M ' + (cx + 430) + ' ' + (cy - 190) + ' l 9 26 l 27 9 l -27 9 l -9 26 l -9 -26 l -27 -9 l 27 -9 Z" fill="#ffd76a" stroke="' + INK + '" stroke-width="4"/>';
  h += '</svg>';
  return h;
}

(async () => {
  await sharp(Buffer.from(wolfCloud())).webp({ quality: 90 }).toFile(path.join(PUBLIC, 'textures/about/awatarnachmurce.webp'));
  console.log('refined wolf-on-cloud done');
})();
