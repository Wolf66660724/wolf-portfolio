/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
    link: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '🔗',
        label: '友链',
        shape: 'monitor',
    },
};

// Sample content data - replace with real content later
const RAW_CONTENT_DATA = [
    {
        id: 'link-001',
        platform: 'link',
        title: '哔哩哔哩',
        description: '哔哩哔哩 (゜-゜)つロ 干杯~ - 国内领先的视频社区',
        thumbnail: null,
        url: 'https://www.bilibili.com/',
        date: '学习平台',
        views: '',
    },
    {
        id: 'link-002',
        platform: 'link',
        title: '知乎',
        description: '知乎 - 有问题，就会有答案',
        thumbnail: null,
        url: 'https://www.zhihu.com/',
        date: '学习平台',
        views: '',
    },
    {
        id: 'link-003',
        platform: 'link',
        title: 'ChatGPT',
        description: 'OpenAI 的 AI 对话助手',
        thumbnail: null,
        url: 'https://chat.openai.com/',
        date: 'AI 工具',
        views: '',
    },
    {
        id: 'link-004',
        platform: 'link',
        title: 'DeepSeek',
        description: 'DeepSeek - 探索未至之境，深度求索',
        thumbnail: null,
        url: 'https://chat.deepseek.com/',
        date: 'AI 工具',
        views: '',
    },
    {
        id: 'link-005',
        platform: 'link',
        title: 'GitHub',
        description: 'GitHub - 全球最大的代码托管平台',
        thumbnail: null,
        url: 'https://github.com/',
        date: '开发工具',
        views: '',
    },
    {
        id: 'link-006',
        platform: 'link',
        title: '菜鸟教程',
        description: '菜鸟教程 - 学的不仅是技术，更是梦想',
        thumbnail: null,
        url: 'https://www.runoob.com/',
        date: '开发工具',
        views: '',
    },
    {
        id: 'link-007',
        platform: 'link',
        title: 'ZoomEye',
        description: 'ZoomEye - 网络空间搜索引擎（安全）',
        thumbnail: null,
        url: 'https://www.zoomeye.org/',
        date: '安全工具',
        views: '',
    },
    {
        id: 'link-008',
        platform: 'link',
        title: 'FOFA',
        description: 'FOFA - 网络空间资产搜索引擎（安全）',
        thumbnail: null,
        url: 'https://fofa.info/',
        date: '安全工具',
        views: '',
    },
    {
        id: 'link-009',
        platform: 'link',
        title: 'Butterfly',
        description: 'Butterfly - 简洁优雅的 Hexo 博客主题',
        thumbnail: null,
        url: 'https://butterfly.js.org/',
        date: '博客主题',
        views: '',
    },
    {
        id: 'link-010',
        platform: 'link',
        title: '小红书',
        description: '小红书 - 标记我的生活',
        thumbnail: null,
        url: 'https://www.xiaohongshu.com/explore',
        date: '其他资源',
        views: '',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_wolfblog.webp'];
const linkTextures = ['/textures/studio/monitorfront_wolflinks.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_wolfblog_painted.webp'];
const linkPaintedTextures = ['/textures/studio/monitorfront_wolflinks_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0, linkIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0, linkPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    item.platform === 'link' ? linkTextures[linkIdx++ % linkTextures.length] :
                        ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    item.platform === 'link' ? linkPaintedTextures[linkPIdx++ % linkPaintedTextures.length] :
                        ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
