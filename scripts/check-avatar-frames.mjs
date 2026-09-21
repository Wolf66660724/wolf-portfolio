#!/usr/bin/env node
/**
 * wolf 人偶帧自检
 *
 * 用法：
 *   node scripts/check-avatar-frames.mjs <文件夹路径>
 *
 * 会检查：尺寸是否一致 / 是否透明 / 每帧内容范围 / 身体是否固定 / 帧之间有没有真差异
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('用法: node scripts/check-avatar-frames.mjs <文件夹路径>');
  process.exit(1);
}
if (!fs.existsSync(dir)) {
  console.error('文件夹不存在: ' + dir);
  process.exit(1);
}

const EXTS = /\.(png|webp|jpg|jpeg|tif|tiff)$/i;
const files = fs.readdirSync(dir)
  .filter(f => EXTS.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) {
  console.error('文件夹里没有图片（支持 png / webp / jpg / tiff）');
  process.exit(1);
}

const problems = [];
const warnings = [];
const ok = [];

const ALPHA_MIN = 12;      // 低于这个 alpha 视为透明
const DIFF_TOL = 24;       // 像素差多少算“变了”

async function load(p) {
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, c: info.channels };
}

function bbox(f) {
  let x0 = f.w, y0 = f.h, x1 = -1, y1 = -1, n = 0;
  for (let y = 0; y < f.h; y++) {
    for (let x = 0; x < f.w; x++) {
      if (f.data[(y * f.w + x) * f.c + 3] > ALPHA_MIN) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
        n++;
      }
    }
  }
  return { x0, y0, x1, y1, n };
}

console.log('');
console.log('文件夹: ' + path.resolve(dir));
console.log('找到 ' + files.length + ' 个图片文件');
console.log('');

const frames = [];
for (const f of files) {
  const p = path.join(dir, f);
  const img = await load(p);
  const opaque = await sharp(p).stats().then(s => s.isOpaque);
  frames.push({ name: f, ...img, opaque, size: fs.statSync(p).size });
}

/* ---------- 1. 尺寸 ---------- */
const sizes = [...new Set(frames.map(f => f.w + 'x' + f.h))];
console.log('=== 尺寸 ===');
console.log('  ' + sizes.join(' / '));
if (sizes.length > 1) {
  problems.push('每帧尺寸不一致（' + sizes.join(' / ') + '）。请在导出时锁定画布尺寸，并关掉自动裁切。');
} else {
  const [w, h] = sizes[0].split('x').map(Number);
  if (w !== h) warnings.push('画布不是正方形（' + sizes[0] + '）。能用，但代码是按 1:1 设计的，建议改方。');
  if (w !== 1024) warnings.push('画布不是 1024x1024（当前 ' + sizes[0] + '）。能用，我会等比缩放，但建议直接用 1024。');
  ok.push('所有帧尺寸一致：' + sizes[0]);
}

/* ---------- 2. 透明背景 ---------- */
console.log('');
console.log('=== 透明背景 ===');
const opaqueOnes = frames.filter(f => f.opaque).map(f => f.name);
if (opaqueOnes.length) {
  problems.push('这些帧没有透明通道（背景是实底）：' + opaqueOnes.join(', ') +
    '。实底贴到 3D 场景里会显示成一块方块，必须导出透明背景。');
} else {
  ok.push('全部 ' + frames.length + ' 帧都有透明通道');
}

/* ---------- 3. 每帧内容范围 ---------- */
console.log('');
console.log('=== 每帧内容范围（去掉透明边）===');
console.log('  帧'.padEnd(20) + 'x 范围'.padEnd(22) + 'y 范围'.padEnd(22) + '宽 x 高');
const boxes = frames.map(f => {
  const b = bbox(f);
  return { ...b, name: f.name, w: f.w, h: f.h };
});
boxes.forEach(b => {
  console.log('  ' + b.name.padEnd(18) + (b.x0 + '~' + b.x1).padEnd(20) + (b.y0 + '~' + b.y1).padEnd(20) + (b.x1 - b.x0 + 1) + ' x ' + (b.y1 - b.y0 + 1));
});
const u = {
  x0: Math.min(...boxes.map(b => b.x0)), x1: Math.max(...boxes.map(b => b.x1)),
  y0: Math.min(...boxes.map(b => b.y0)), y1: Math.max(...boxes.map(b => b.y1)),
  W: frames[0].w, H: frames[0].h
};
console.log('');
console.log('  并集: x ' + u.x0 + '~' + u.x1 + ' (宽 ' + (u.x1 - u.x0 + 1) + ')   y ' + u.y0 + '~' + u.y1 + ' (高 ' + (u.y1 - u.y0 + 1) + ')');
console.log('  四周留白: 左 ' + u.x0 + '  右 ' + (u.W - 1 - u.x1) + '  上 ' + u.y0 + '  下 ' + (u.H - 1 - u.y1));
console.log('  占画布: 高 ' + ((u.y1 - u.y0 + 1) / u.H * 100).toFixed(0) + '%   宽 ' + ((u.x1 - u.x0 + 1) / u.W * 100).toFixed(0) + '%');

/* ---------- 4. 身体是否固定 ---------- */
console.log('');
console.log('=== 身体是否固定（只看左边缘）===');
const lefts = boxes.map(b => b.x0);
const lmin = Math.min(...lefts), lmax = Math.max(...lefts);
console.log('  左边缘: ' + lefts.join(', ') + '    波动 ' + (lmax - lmin) + ' px');
if (lmax - lmin <= 4) {
  ok.push('左边缘稳定（波动 ' + (lmax - lmin) + ' px），身体没在晃');
} else if (lmax - lmin <= 12) {
  warnings.push('左边缘波动 ' + (lmax - lmin) + ' px，轻微，一般看不出来');
} else {
  warnings.push('左边缘波动 ' + (lmax - lmin) + ' px。如果动的只是手臂可以忽略；如果是整个身体在挪，播放时会抖。');
}

const rights = boxes.map(b => b.x1);
console.log('  右边缘: ' + rights.join(', ') + '    波动 ' + (Math.max(...rights) - Math.min(...rights)) + ' px');

/* ---------- 5. 帧之间有没有差异 ---------- */
console.log('');
console.log('=== 相邻帧差异（判断是不是真动画）===');
let anyDiff = false;
for (let i = 1; i < frames.length; i++) {
  const a = frames[i - 1], b = frames[i];
  if (a.data.length !== b.data.length) { console.log('  尺寸不同，跳过'); break; }
  let d = 0;
  for (let k = 0; k < a.data.length; k += 4) {
    if (Math.abs(a.data[k] - b.data[k]) > DIFF_TOL) d++;
  }
  const pct = d / (a.data.length / 4) * 100;
  if (pct > 0.1) anyDiff = true;
  console.log('  ' + (i) + '→' + (i + 1) + ': ' + pct.toFixed(2) + '%' + (pct <= 0.1 ? '   ← 这两帧几乎一样' : ''));
}
if (!anyDiff) {
  problems.push('所有帧内容几乎完全相同，播起来不会动。请确认导出时每一帧都是不同的画面。');
} else {
  ok.push('帧之间有实际差异，是真动画');
}

/* ---------- 结论 ---------- */
console.log('');
console.log('=== 结论 ===');
ok.forEach(s => console.log('  ✓ ' + s));
warnings.forEach(s => console.log('  ! ' + s));
problems.forEach(s => console.log('  ✗ ' + s));
console.log('');

if (problems.length) {
  console.log('有问题 ' + problems.length + ' 项，先按上面的提示改一改再给我。');
  process.exit(1);
}
console.log('没有致命问题，可以直接给我了。');
if (warnings.length) console.log('（带 ! 的是提醒，不影响使用）');
