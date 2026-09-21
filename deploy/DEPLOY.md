# 部署说明（腾讯云 + Docker Nginx）

> 站点：**https://portfolio.worldpeace.top**
> 服务器：腾讯云 43.153.19.168（和博客同一台，Docker 里跑 nginx）
> 上次更新：2026-09-21

---

## 一、当前架构

一台服务器上跑着博客、AI 渗透平台、中转站和这个 3D 简历站。nginx 跑在 Docker 里
（容器名 `blog-nginx`，占 80/443），按域名分流：

| 域名 | 内容 | 容器内目录 |
|------|------|-----------|
| worldpeace.top | 博客（Hexo 静态站） | /usr/share/nginx/html |
| **portfolio.worldpeace.top** | **3D 简历站** | **/usr/share/nginx/html-portfolio** |
| ai.worldpeace.top | AI 渗透平台 | 反代 ai-app:9137 |
| api.worldpeace.top | 中转站 | 反代 new-api:3000 |

HTTPS 用的是一张 Cloudflare Origin 证书（`*.worldpeace.top` 通配），
新增子域不用重新签发。

---

## 二、日常发布

在**博客仓库根目录**（D:\git\Blog）执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-portfolio.ps1
```

脚本会：构建 → 打包 → 上传 → 服务器备份 → 解包发布 → 重建 nginx → 自检。

只想用已有的 dist 重新上传、不重新构建：

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-portfolio.ps1 -SkipBuild
```

---

## 三、部署用到的文件

| 文件 | 作用 |
|------|------|
| `../deploy-portfolio.ps1` | 部署脚本（在博客仓库根目录） |
| `<博客仓库>/deploy/portfolio/nginx-blog.conf` | 完整的 nginx 站点配置（含 portfolio 子域） |
| `<博客仓库>/deploy/portfolio/compose.yaml.patched` | 给 nginx 容器加挂载、修健康检查后的 compose |
| `<博客仓库>/deploy/portfolio/remote-deploy.sh` | 服务器端发布脚本 |

服务器上对应位置：

- 站点文件：`/opt/security-platform/portfolio-public`
- nginx 配置：`/opt/security-platform/nginx/conf.d/blog.conf`
- compose：`/opt/security-platform/compose.yaml`
- 备份：`/opt/security-platform/backups/`

---

## 四、回滚

每次部署都会备份旧站点和两份配置：

```bash
# 看有哪些备份
ls -lt /opt/security-platform/backups/ | head

# 回滚站点（举例）
sudo rm -rf /opt/security-platform/portfolio-public/*
sudo tar -xzf /opt/security-platform/backups/portfolio-2026-09-21-143916.tar.gz \
     -C /opt/security-platform/portfolio-public
```

配置回滚同理，把 `blog.conf.bak-*` 用 `cat >` 盖回
`/opt/security-platform/nginx/conf.d/blog.conf`（**不要用 mv**，见下面的坑）。

---

## 五、手动改配置时注意（踩过的坑）

### 1. blog.conf 是按文件挂进容器的

```yaml
- /opt/security-platform/nginx/conf.d/blog.conf:/etc/nginx/conf.d/default.conf:ro
```

这是**单文件挂载**。用 `mv` 覆盖会换掉 inode，容器里读到的还是旧文件。
必须原地写：

```bash
sudo cat 新文件 > /opt/security-platform/nginx/conf.d/blog.conf
sudo docker exec blog-nginx nginx -t
sudo docker restart blog-nginx
```

### 2. 容器挂载目录不能放在 blog-public 里

博客的 `deploy.ps1` 发布时会清空 `blog-public` 下除 `.well-known` 以外的所有内容。
所以简历站必须单独一个目录 + 单独挂载，不能塞进 `blog-public` 下面。

### 3. 简历站只能用子域，不能挂子路径

源码里有大量绝对路径（`/textures/...`、`/fonts/...`、`/sounds/...`），
挂到 `worldpeace.top/portfolio/` 会全部 404。要挂子路径就得改 Vite `base`
并重写所有资源引用，不划算。

### 4. SPA 路由要回落

`/gallery`、`/about` 这些是前端虚拟路由，nginx 必须：

```nginx
location / { try_files $uri $uri/ /index.html; }
```

### 5. nginx 容器的健康检查

原来的检查写的是 `node -e ... 127.0.0.1:8360`，但 nginx 镜像里**没有 node**，
那条检查永远失败，容器一直显示 unhealthy。已改成：

```yaml
test: ["CMD-SHELL", "wget --spider -T 5 --no-check-certificate --header='Host: worldpeace.top' https://127.0.0.1/ || exit 1"]
```

---

## 六、素材与体积

- 部署产物约 **39 MB**（纹理 17 MB / 字体 10 MB / 音效 9 MB / JS 2.3 MB）
- `public/textures/*/backups/` 是纹理原始素材（约 70 MB），**不参与构建**，
  已移出 `public/` 放到项目根目录的 `texture-originals/`（已 gitignore）。
  只有重跑 `scripts/optimize_*.js` 时才需要它们。

---

## 七、历史记录

- 2026-08-11：曾部署在 AWS EC2（16.16.192.60，eu-north-1，t3.micro），**该实例已关闭**
- 2026-09-21：迁到腾讯云 43.153.19.168，与博客同机，走 portfolio.worldpeace.top
