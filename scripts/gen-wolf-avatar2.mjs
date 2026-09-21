import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(path.resolve(__dirname, '..'), 'public');
const OUT = path.join(PUBLIC, 'textures/corridor/avatar_anim');

const INK = '#2b2b2b';
const FUR = '#f7efe2';
const FUR_DARK = '#e9dcc4';
const MUZZLE = '#fff8ec';
const EAR = '#f2a0a0';
const HOOD1 = '#667eea';
const HOOD2 = '#764ba2';
const CHEEK = '#f3b8b8';

function wolfSvg(i) {
  const a = (18 + 64 * Math.sin(Math.PI * i / 8)) * Math.PI / 180;
  const SX = 652, SY = 575;
  const ARM_LEN = 168;
  const hx = SX + Math.cos(a) * ARM_LEN;
  const hy = SY - Math.sin(a) * ARM_LEN;
  const midX = SX + Math.cos(a) * ARM_LEN * 0.55;
  const midY = SY - Math.sin(a) * ARM_LEN * 0.55;
  const waveLines = (i >= 3 && i <= 6)
    ? '<path d="M ' + (hx + 36) + ' ' + (hy - 30) + ' q 12 -16 4 -32 M ' + (hx + 54) + ' ' + (hy - 16) + ' q 11 -14 7 -26" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" opacity="0.6"/>'
    : '';

  return '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">'
    + '<defs>'
    + '<linearGradient id="hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + HOOD1 + '"/><stop offset="100%" stop-color="' + HOOD2 + '"/></linearGradient>'
    + '</defs>'
    // tail (fluffy, behind)
    + '<path d="M 372 700 C 300 730, 240 660, 258 580 C 272 520, 320 560, 352 610 C 370 640, 376 672, 372 700 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7" stroke-linejoin="round"/>'
    + '<path d="M 300 600 q 8 -26 24 -30 M 290 635 q -2 -24 14 -34" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>'
    // left arm (static, resting)
    + '<path d="M 402 585 C 372 630, 356 680, 362 720" fill="none" stroke="' + HOOD2 + '" stroke-width="30" stroke-linecap="round"/>'
    + '<path d="M 402 585 C 372 630, 356 680, 362 720" fill="none" stroke="' + INK + '" stroke-width="34" stroke-linecap="round" opacity="0.15"/>'
    + '<circle cx="360" cy="738" r="27" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>'
    + '<path d="M 344 742 q 6 6 12 0 M 358 748 q 6 6 12 0" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>'
    // legs + shoes
    + '<line x1="452" y1="800" x2="446" y2="912" stroke="' + HOOD2 + '" stroke-width="30" stroke-linecap="round"/>'
    + '<line x1="572" y1="800" x2="578" y2="912" stroke="' + HOOD2 + '" stroke-width="30" stroke-linecap="round"/>'
    + '<ellipse cx="428" cy="932" rx="48" ry="22" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>'
    + '<ellipse cx="596" cy="932" rx="48" ry="22" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>'
    // hoodie torso (gradient)
    + '<path d="M 388 560 C 388 516, 636 516, 636 560 L 660 762 C 664 816, 360 816, 364 762 Z" fill="url(#hood)" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    // hoodie hood (behind head)
    + '<path d="M 400 470 C 380 500, 386 548, 400 560 L 396 470 Z" fill="url(#hood)" stroke="' + INK + '" stroke-width="7"/>'
    + '<path d="M 624 470 C 644 500, 638 548, 624 560 L 628 470 Z" fill="url(#hood)" stroke="' + INK + '" stroke-width="7"/>'
    // zipper + pocket
    + '<line x1="512" y1="566" x2="512" y2="790" stroke="' + INK + '" stroke-width="5"/>'
    + '<rect x="452" y="668" width="120" height="46" rx="20" fill="none" stroke="' + INK + '" stroke-width="5"/>'
    + '<circle cx="512" cy="596" r="6" fill="' + INK + '"/>'
    // star badge on chest
    + '<path d="M 512 616 l 5 12 l 13 1 l -10 8 l 3 13 l -11 -7 l -11 7 l 3 -13 l -10 -8 l 13 -1 Z" fill="#ffd76a" stroke="' + INK + '" stroke-width="3"/>'
    // head (fluffy cheeks)
    + '<path d="M 388 352 C 388 258, 636 258, 636 352 C 636 430, 606 478, 512 478 C 418 478, 388 430, 388 352 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8"/>'
    // fur tufts on top
    + '<path d="M 470 252 l -6 -22 l 16 12 l 4 -20 l 14 14 l 12 -18 l 8 20 l 18 -8 l -2 24 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>'
    // ears
    + '<path d="M 428 290 C 410 220, 396 150, 356 160 C 340 172, 356 240, 390 300 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    + '<path d="M 596 290 C 614 220, 628 150, 668 160 C 684 172, 668 240, 634 300 Z" fill="' + FUR + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    // inner ears
    + '<path d="M 400 240 C 392 196, 388 182, 384 184 C 378 190, 392 236, 410 270 Z" fill="' + EAR + '"/>'
    + '<path d="M 624 240 C 632 196, 636 182, 640 184 C 646 190, 632 236, 614 270 Z" fill="' + EAR + '"/>'
    // eyes (big, expressive)
    + '<ellipse cx="452" cy="356" rx="24" ry="34" fill="' + INK + '"/>'
    + '<ellipse cx="572" cy="356" rx="24" ry="34" fill="' + INK + '"/>'
    + '<circle cx="445" cy="344" r="8" fill="#fff"/>'
    + '<circle cx="462" cy="370" r="5" fill="#fff" opacity="0.7"/>'
    + '<circle cx="565" cy="344" r="8" fill="#fff"/>'
    + '<circle cx="582" cy="370" r="5" fill="#fff" opacity="0.7"/>'
    // eyebrows
    + '<path d="M 428 314 q 22 -12 46 -4 M 574 314 q 22 -12 46 -4" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>'
    // muzzle
    + '<ellipse cx="512" cy="420" rx="66" ry="48" fill="' + MUZZLE + '" stroke="' + INK + '" stroke-width="6"/>'
    // nose
    + '<path d="M 500 400 L 524 400 L 512 416 Z" fill="' + INK + '"/>'
    // mouth (open smile with tongue)
    + '<path d="M 490 428 Q 512 452 534 428" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>'
    + '<path d="M 500 436 Q 512 454 524 436 Q 512 470 500 436 Z" fill="#e77" stroke="' + INK + '" stroke-width="4"/>'
    // whiskers
    + '<path d="M 436 414 l -30 -8 M 436 426 l -32 2 M 436 438 l -28 14" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" opacity="0.8"/>'
    + '<path d="M 588 414 l 30 -8 M 588 426 l 32 2 M 588 438 l 28 14" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" opacity="0.8"/>'
    // blush
    + '<path d="M 420 404 q 10 -10 20 0 M 584 404 q 10 -10 20 0" fill="none" stroke="' + CHEEK + '" stroke-width="7" stroke-linecap="round" opacity="0.9"/>'
    // right arm (waving)
    + '<path d="M ' + SX + ' ' + SY + ' C ' + (SX + 34) + ' ' + (SY - 22) + ', ' + midX + ' ' + midY + ', ' + hx + ' ' + hy + '" fill="none" stroke="' + HOOD2 + '" stroke-width="30" stroke-linecap="round"/>'
    + '<path d="M ' + SX + ' ' + SY + ' C ' + (SX + 34) + ' ' + (SY - 22) + ', ' + midX + ' ' + midY + ', ' + hx + ' ' + hy + '" fill="none" stroke="' + INK + '" stroke-width="34" stroke-linecap="round" opacity="0.15"/>'
    + '<circle cx="' + hx + '" cy="' + hy + '" r="27" fill="' + FUR + '" stroke="' + INK + '" stroke-width="7"/>'
    + '<path d="M ' + (hx - 16) + ' ' + (hy + 4) + ' q 6 6 12 0 M ' + (hx - 2) + ' ' + (hy + 10) + ' q 6 6 12 0" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>'
    + waveLines
    + '</svg>';
}

for (let i = 0; i < 9; i++) {
  await sharp(Buffer.from(wolfSvg(i))).webp({ quality: 90 }).toFile(path.join(OUT, (i + 1) + '.webp'));
  console.log('frame ' + (i + 1));
}
console.log('REFINED WOLF DONE');
