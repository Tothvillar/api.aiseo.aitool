# AI工具库 (aitool.aiseo.one)

AI工具评测站 — GitHub Pages 静态网站

## 📁 文件结构

```
aitool-site/
├── index.html          # 首页（工具排行 + 最新文章）
├── about.html          # 关于我们
├── contact.html        # 联系我们（含留言表单）
├── privacy.html        # 隐私政策（AdSense必需）
├── robots.txt          # SEO robots配置
├── sitemap.xml         # 网站地图
├── CNAME               # 自定义域名 aitool.aiseo.one
├── css/style.css       # 全站样式
├── js/main.js          # 交互脚本
└── articles/
    └── template.html   # 文章模板（复制此文件写新文章）
```

## 🚀 部署到 GitHub Pages

### 1. 在 GitHub 创建仓库
- 仓库名随意，如 `aitool-site`
- 设为 **Public**（免费版必需）

### 2. 推送代码

```bash
cd aitool-site
git remote add origin https://github.com/你的用户名/aitool-site.git
git branch -M main
git commit -m "feat: AI工具评测站初始版本"
git push -u origin main
```

### 3. 配置 GitHub Pages
- 仓库 → Settings → Pages
- Source: `Deploy from a branch`
- Branch: `main` → `/ (root)`
- Custom domain: 填写 `aitool.aiseo.one`（CNAME文件已包含）
- ✅ Enforce HTTPS

### 4. 配置 DNS（在域名服务商处）
- 添加 CNAME 记录：`aitool` → `你的用户名.github.io`
- 等待 DNS 生效（几分钟到几小时）

完成后访问：`https://aitool.aiseo.one`

## ✍️ 写新文章

1. 复制 `articles/template.html` 为 `articles/你的文章slug.html`
2. 修改 title、meta description、keywords
3. 修改 canonical URL 和 OG 标签中的 URL
4. 替换正文内容
5. 更新 `index.html` 中的"最新文章"列表
6. 更新 `sitemap.xml` 添加新URL

## 💰 AdSense 配置

已将 AdSense 代码放入 `index.html` 的 `<head>` 中。
申请通过后将 `ca-pub-XXXXXXXXXXXXXXXX` 替换为你的实际发布商ID。

### AdSense 申请前 Checklist
- [ ] 至少 20-30 篇原创文章
- [ ] 隐私政策页面完成 ✅
- [ ] 关于我们页面完成 ✅
- [ ] 联系我们页面完成 ✅
- [ ] 网站内容非纯AI生成（需人工加工）
- [ ] 域名注册 > 6个月（非强制但建议）
- [ ] 无违规内容

## 📊 SEO 已配置项
- ✅ Meta description & keywords
- ✅ Canonical URL
- ✅ Open Graph 标签
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ 面包屑导航
- ✅ Article结构化数据 (JSON-LD)
- ✅ 响应式设计（移动端友好）
- ✅ 语义化HTML标签
