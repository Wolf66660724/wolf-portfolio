import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'D:/git/Blog/tools/wolf-test';
const OUT = 'D:/git/Blog/portfolio-itom/docs/wolf-avatar/trace';
fs.mkdirSync(OUT, { recursive: true });

const S = 1024, TH = 12;
const frames = [];
for (let i = 1; i <= 9; i++) {
  const { data } = await sharp(`${SRC}/${i}.webp`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  frames.push(data);
}
const N = S * S;

// 9 帧都有的像素 = 静止的身体；只在一部分帧里有 = 挥动的手臂
const body = Buffer.alloc(N * 4);
const arms = Buffer.alloc(N * 4);

for (let p = 0; p < N; p++) {
  let all = true, any = false;
  for (const f of frames) {
    const a = f[p * 4 + 3];
    if (a > TH) any = true; else all = false;
  }
  // 身体：浅灰，半透明，方便描
  if (all) {
    body[p * 4] = 150; body[p * 4 + 1] = 150; body[p * 4 + 2] = 150; body[p * 4 + 3] = 110;
  }
  // 手臂：只在变化区（any 且非 all）
  if (any && !all) {
    arms[p * 4] = 90; arms[p * 4 + 1] = 150; arms[p * 4 + 2] = 230; arms[p * 4 + 3] = 130;
  }
}

await sharp(body, { raw: { width: S, height: S, channels: 4 } }).png().toFile(`${OUT}/guide-body.png`);
await sharp(arms, { raw: { width: S, height: S, channels: 4 } }).png().toFile(`${OUT}/guide-arm-swing.png`);

// 每帧一张浅灰底稿
for (let i = 1; i <= 9; i++) {
  const f = frames[i - 1];
  const buf = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    if (f[p * 4 + 3] > TH) {
      buf[p * 4] = 170; buf[p * 4 + 1] = 170; buf[p * 4 + 2] = 170; buf[p * 4 + 3] = 95;
    }
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 4 } }).png().toFile(`${OUT}/guide-frame-0${i}.png`);
}

// 身体+手臂叠一起的合成参考图，方便一眼看懂
const combo = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  if (body[p * 4 + 3] > 0) { combo[p * 4] = 150; combo[p * 4 + 1] = 150; combo[p * 4 + 2] = 150; combo[p * 4 + 3] = 110; }
  if (arms[p * 4 + 3] > 0) { combo[p * 4] = 90; combo[p * 4 + 1] = 150; combo[p * 4 + 2] = 230; combo[p * 4 + 3] = 120; }
}
await sharp(combo, { raw: { width: S, height: S, channels: 4 } }).png().toFile(`${OUT}/guide-overview.png`);

console.log('底稿包已生成到 docs/wolf-avatar/trace/');
fs.readdirSync(OUT).sort().forEach(f => console.log('  ' + f));
