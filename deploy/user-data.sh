#!/bin/bash
# Wolf Portfolio - EC2 首次启动初始化脚本
# 用法：启动实例时粘贴到「高级详细信息 → 用户数据」，或 SSH 后手动执行
set -e

# 1. 安装 Nginx
apt-get update -y
apt-get install -y nginx

# 2. 创建网站目录
mkdir -p /var/www/portfolio-itom

# 3. 放一个占位页
echo "部署目录已就绪 - 请上传 dist/ 内容到 /var/www/portfolio-itom" > /var/www/portfolio-itom/index.html

# 4. 默认欢迎页先不删，等上传后再套用配置
echo "初始化完成"
