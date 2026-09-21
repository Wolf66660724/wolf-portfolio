import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = 'public';
const OUTDIR = 'docs/wolf-avatar';
fs.mkdirSync(OUTDIR, { recursive: true });

const fontB64 = fs.readFileSync(path.join(PUBLIC, 'fonts/HuawenHupo.ttf')).toString('base64');

// 作者原版量出来的关键坐标
const ANCHOR_X = 387;   // 身体左边缘（9 帧里恒定不动）
const REACH_X  = 879;   // 手臂伸到最远时的右边缘
const S = 1024;

const svg = `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
<style>
  @font-face{font-family:'HW';src:url(data:font/ttf;base64,${fontB64}) format('truetype');}
  .lb{font-family:'HW';font-size:30px;fill:#5aa9e6;}
  .lb2{font-family:'HW';font-size:26px;fill:#e0483d;}
  .lb3{font-family:'HW';font-size:24px;fill:#8a6d3b;}
</style>

<defs>
  <pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse">
    <path d="M0 16 L16 0" stroke="rgba(224,72,61,0.10)" stroke-width="2"/>
  </pattern>
</defs>

<!-- 左侧留白区（作者原版一直是空的） -->
<rect x="0" y="0" width="${ANCHOR_X}" height="${S}" fill="url(#hatch)"/>

<!-- 动作区：身体锚点 -> 手臂最远 -->
<rect x="${ANCHOR_X}" y="0" width="${REACH_X - ANCHOR_X}" height="${S}" fill="rgba(90,169,230,0.07)"/>

<!-- 画布边框 -->
<rect x="1.5" y="1.5" width="${S - 3}" height="${S - 3}" fill="none"
      stroke="rgba(90,169,230,0.55)" stroke-width="3" stroke-dasharray="16 10"/>

<!-- 顶部 / 底部满高提示 -->
<line x1="0" y1="4" x2="${S}" y2="4" stroke="rgba(90,169,230,0.45)" stroke-width="3" stroke-dasharray="16 10"/>
<line x1="0" y1="${S - 4}" x2="${S}" y2="${S - 4}" stroke="rgba(90,169,230,0.45)" stroke-width="3" stroke-dasharray="16 10"/>

<!-- 身体左边缘锚点 -->
<line x1="${ANCHOR_X}" y1="0" x2="${ANCHOR_X}" y2="${S}" stroke="rgba(224,72,61,0.7)" stroke-width="3" stroke-dasharray="14 9"/>

<!-- 手臂最远边缘 -->
<line x1="${REACH_X}" y1="0" x2="${REACH_X}" y2="${S}" stroke="rgba(90,169,230,0.7)" stroke-width="3" stroke-dasharray="14 9"/>

<!-- 标注 -->
<text class="lb" x="${ANCHOR_X + 16}" y="60">动作区（手臂在这边摆）</text>
<text class="lb" x="${REACH_X + 14}" y="60">手臂最远 x=879</text>
<text class="lb2" x="16" y="60">左边留白（作者原版一直空着）</text>
<text class="lb2" x="${ANCHOR_X + 14}" y="120">身体左边缘锚在这里 x=387，9 帧都不许动</text>
<text class="lb3" x="16" y="${S - 30}">画布 1024 x 1024 · 人物上下顶满（y 0~1023）· 背景必须透明</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(path.join(OUTDIR, 'template-guides.png'));

// 一张完全透明的空画布，方便直接铺在底层
await sharp({
  create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
}).png().toFile(path.join(OUTDIR, 'template-blank.png'));

console.log('已生成:');
console.log('  ' + OUTDIR + '/template-guides.png   带参考线');
console.log('  ' + OUTDIR + '/template-blank.png    纯透明空画布');
console.log('  尺寸 ' + S + 'x' + S);
