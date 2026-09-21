# 🐺 Wolf Portfolio — 3D 交互式简历网站

基于开源项目 [ITomPoland/portfolio-itom](https://github.com/ITomPoland/portfolio-itom)（MIT 协议）定制改造的个人 3D 简历网站。
原项目是一个 React 19 + Three.js (React Three Fiber) + GSAP + Vite 的沉浸式 WebGL 作品集（走廊 → 画廊 / 创作室 / 关于我 / 联系我 四个房间）。

> 🌐 **线上地址：** https://portfolio.worldpeace.top
>
> ⚠️ 本项目仅用于本地学习与演示。原作者的**个人素材（照片、头像、纹理、音效、证书图等）版权归原作者所有**，如需公开部署，请替换 `public/` 下与你个人相关的图片素材，并补充你自己的照片/证书。

---

## 🚀 本地运行

要求 Node.js v20.19+ / v22.12+（本机验证 v26 可用）。

```bash
cd portfolio-itom
npm install          # 安装依赖
npm run dev          # 开发模式，访问 http://localhost:5173
```

生产构建与预览：

```bash
npm run build        # 构建到 dist/
npm run preview      # 预览生产构建，访问 http://localhost:4173
```

## 📝 已定制内容（相对原模板）

| 模块 | 说明 |
|------|------|
| 站点身份 | Wolf (茶狼) · 全栈开发 · 渗透测试 · 安全服务，SEO/OG/Twitter 元数据、canonical 指向 worldpeace.top |
| 走廊大字 | ITOM → **WOLF**，副标语 `< full-stack security />` |
| 画廊 | 4 个项目：AI 渗透平台、个人博客、渗透工具箱、嵌入式开发（卡片封面为程序生成的同风格手绘纹理） |
| 创作室 | 显示器内容替换为你的博客文章（安全从业一个月记录 / 一个人瞎折腾 / 小红帽 / 记录生活的开始 / 欢迎来到我的博客世界） |
| 关于我 | 里程碑改为 WOLF / Highlights / Journey / Skills；天空标语改为「Regret is the norm, moving forward is the answer」；奖项区改为「Featured Projects + Personal Strengths」卡片 |
| 联系我 | 四个木桶：GitHub / 博客 / 邮箱(mailto) / AI 渗透平台 |
| 数据源 | **已禁用 Sanity CMS**，全部改用本地静态数据（src/hooks/useSanityData.js 中 isSanityConfigured=false），不依赖原作者后端，可离线运行 |
| 纹理 | 新生成画廊封面×8、创作室显示器画面×2、关于页高亮卡片×16、SOTY/SOTD/SOTM 大卡×6、技能气球×20、地图×5、头像窗口、招牌、岛屿（scripts/gen-textures.mjs 与 scripts/gen-wolf-assets.mjs 可重新生成） |
| 性能 | 加速开门动画（对齐 1.0s→0.25s、开门 0.7s→0.3s、飞行 1.5s→0.7s、加载超时 8s→3s），入口大门同步提速 |
| 门名/内容 | 四扇门按博客板块命名：**博客项目**（画廊：AI渗透平台/安全从业记录/渗透工具箱/安全笔记）、**生活随笔**（创作室：一个人瞎折腾/记录生活的开始/欢迎来到我的博客世界/小红帽）、**关于我**、**联系我**；门牌字体为柳建毛笔草书（嘻哈涂鸦风） |
| 门名/内容 | 四扇门按博客板块命名：**博客项目**（画廊：AI渗透平台/安全从业记录/WOLF BLOG/渗透工具箱）、**友链**（创作室：哔哩哔哩/知乎/ChatGPT/DeepSeek/GitHub/菜鸟教程/ZoomEye/FOFA/Butterfly/小红书）、**留言板**（联系室：留言纸+联系方式）、**自我介绍**（关于室：自述/简历/技能） |
| 中文门 | 四扇门标签改为中文：画廊 / 创作室 / 关于我 / 联系我，字体用「华文琥珀」（嘻哈街头风，public/fonts/HuawenHupo.ttf）；门面板与地图同步重绘为中文版本 |
| 个人素材 | 技能气球换成你的技能（渗透测试/网络安全/全栈/Linux/Python/嵌入式/数据库/AI安全/网络/博客）；地图、入口头像（窗口内为博客首页背景图）、招牌、旅程岛屿均重新生成 |

## 🔧 常用修改入口

- **个人信息 / 项目**：`src/components/canvas/rooms/Gallery/GalleryRoom.jsx`（FALLBACK_PROJECTS）
- **博客内容**：`src/components/canvas/rooms/Studio/contentData.js`
- **联系链接**：`src/components/canvas/rooms/Contact/ContactRoom.jsx`
- **关于页里程碑 / 亮点**：`src/components/canvas/rooms/About/AboutRoom.jsx`、`About/InfiniteSkyManager.jsx`
- **走廊大字**：`src/components/canvas/corridor/HeroText.jsx`
- **SEO / 页面标题**：`index.html`、`src/hooks/useDocumentMeta.js`、`seo-plugin.js`
- **联系表单**：`src/components/canvas/rooms/Contact/MessagePaper.jsx`（需要配置 `VITE_WEB3FORMS_KEY` 才能真正发送邮件；未配置时表单仅演示）

## 🗂️ 素材与体积

- 部署产物约 **39 MB**：纹理 17 MB / 字体 10 MB / 音效 9 MB / JS 2.3 MB
- `public/textures/*/backups/` 是纹理原始素材（约 70 MB），**不参与构建**，
  已挪到项目根目录的 `texture-originals/`（已 gitignore），只在重跑
  `scripts/optimize_*.js` 时才需要
- 部署方式见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)

## 📦 技术栈

React 19 · React Three Fiber · Three.js · GSAP · Vite 7 · Sass

## 📄 许可

代码基于原项目 MIT 许可；原项目作者的个人素材版权归 Tomasz Szmajda 所有，公开部署前请自行替换。
