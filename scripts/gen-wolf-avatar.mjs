import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(path.resolve(__dirname, '..'), 'public');
const OUT = path.join(PUBLIC, 'textures/corridor/avatar_anim');

const INK = '#2a2a2a';
const FILL = '#f5efe6';
const FILL2 = '#fdf9f0';
const ACCENT = '#e5484d';

// right arm shoulder
const SX = 645, SY = 505;
const ARM_LEN = 165;

function wolfSvg(i) {
  // wave angle: 20 + 62*sin(pi * i/8) degrees (i=0..8) -> arm goes up and back down
  const a = (20 + 62 * Math.sin(Math.PI * i / 8)) * Math.PI / 180;
  const hx = SX + Math.cos(a) * ARM_LEN;
  const hy = SY - Math.sin(a) * ARM_LEN; // up is -y in svg
  const midX = SX + Math.cos(a) * ARM_LEN * 0.55;
  const midY = SY - Math.sin(a) * ARM_LEN * 0.55;
  const waveLines = (i >= 3 && i <= 6) ? ('<path d="M ' + (hx + 34) + ' ' + (hy - 26) + ' q 12 -14 4 -30 M ' + (hx + 50) + ' ' + (hy - 14) + ' q 10 -12 6 -24" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" opacity="0.7"/>') : '';

  return '<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">'
    // ears
    + '<path d="M 425 268 L 386 142 L 486 230 Z" fill="' + FILL + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    + '<path d="M 599 268 L 638 142 L 538 230 Z" fill="' + FILL + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    + '<path d="M 415 240 L 400 175 L 458 220 Z" fill="none" stroke="' + ACCENT + '" stroke-width="6" stroke-linejoin="round"/>'
    + '<path d="M 609 240 L 624 175 L 566 220 Z" fill="none" stroke="' + ACCENT + '" stroke-width="6" stroke-linejoin="round"/>'
    // head
    + '<ellipse cx="512" cy="352" rx="138" ry="118" fill="' + FILL + '" stroke="' + INK + '" stroke-width="8"/>'
    // inner face
    + '<ellipse cx="512" cy="398" rx="66" ry="50" fill="' + FILL2 + '" stroke="' + INK + '" stroke-width="6"/>'
    // eyes
    + '<circle cx="456" cy="336" r="13" fill="' + INK + '"/>'
    + '<circle cx="568" cy="336" r="13" fill="' + INK + '"/>'
    + '<circle cx="460" cy="331" r="4" fill="#fff"/>'
    + '<circle cx="572" cy="331" r="4" fill="#fff"/>'
    // nose + smile
    + '<path d="M 505 388 L 519 388 L 512 400 Z" fill="' + INK + '"/>'
    + '<path d="M 488 410 Q 512 428 536 410" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>'
    // cheeks
    + '<path d="M 420 366 q 8 -8 16 0 M 588 366 q 8 -8 16 0" fill="none" stroke="' + ACCENT + '" stroke-width="5" stroke-linecap="round" opacity="0.7"/>'
    // body / hoodie
    + '<path d="M 376 470 C 376 470, 648 470, 648 470 L 668 660 C 672 790, 352 790, 356 660 Z" fill="' + FILL + '" stroke="' + INK + '" stroke-width="8" stroke-linejoin="round"/>'
    // hoodie zipper
    + '<line x1="512" y1="500" x2="512" y2="740" stroke="' + INK + '" stroke-width="6"/>'
    // hoodie pocket
    + '<path d="M 448 660 L 576 660" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>'
    // small W on chest
    + '<path d="M 482 545 L 492 585 L 502 558 L 512 585 L 522 545 L 532 585 L 542 558" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    // legs + feet
    + '<line x1="448" y1="770" x2="448" y2="888" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/>'
    + '<line x1="576" y1="770" x2="576" y2="888" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/>'
    + '<ellipse cx="430" cy="906" rx="42" ry="18" fill="' + FILL + '" stroke="' + INK + '" stroke-width="7"/>'
    + '<ellipse cx="594" cy="906" rx="42" ry="18" fill="' + FILL + '" stroke="' + INK + '" stroke-width="7"/>'
    // left arm (static, at side)
    + '<path d="M 388 512 C 360 580, 352 640, 356 688" fill="none" stroke="' + INK + '" stroke-width="24" stroke-linecap="round"/>'
    + '<circle cx="356" cy="706" r="22" fill="' + FILL + '" stroke="' + INK + '" stroke-width="7"/>'
    // right arm (waving, varies by frame)
    + '<path d="M ' + SX + ' ' + SY + ' C ' + (SX + 30) + ' ' + (SY - 20) + ', ' + midX + ' ' + midY + ', ' + hx + ' ' + hy + '" fill="none" stroke="' + INK + '" stroke-width="24" stroke-linecap="round"/>'
    + '<circle cx="' + hx + '" cy="' + hy + '" r="23" fill="' + FILL + '" stroke="' + INK + '" stroke-width="7"/>'
    + waveLines
    + '</svg>';
}

for (let i = 0; i < 9; i++) {
  const svg = wolfSvg(i);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(OUT, (i + 1) + '.webp'));
  console.log('wrote frame ' + (i + 1));
}
console.log('WOLF AVATAR DONE');
