# AISEO AI工具库 — 后端服务 + CI/CD 完整方案

> 项目域名：[aiseo.one](https://aiseo.one)
> 仓库：api.aiseo.aitool
> 技术栈：HTML/CSS/JS（前端）+ Node.js Express（后端 API）+ GitHub Actions（CI/CD）

---

## 📁 项目结构

```
api.aiseo.aitool/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # CI/CD 完整流水线
├── server/
│   ├── app.js                     # Express 主应用（入口）
│   ├── data/
│   │   └── tools.js               # 工具数据 + 留言存储
│   └── routes/
│       ├── tools.js               # 工具列表/详情/分类 API
│       ├── search.js              # 搜索 API
│       ├── contact.js             # 留言提交 API
│       └── health.js              # 健康检查 API
├── scripts/
│   └── build.js                   # 构建脚本（压缩 HTML/CSS/JS）
├── tests/
│   ├── tools.test.js              # 工具 API 单元测试
│   ├── search.test.js             # 搜索 API 单元测试
│   ├── contact.test.js            # 留言 API 单元测试
│   ├── health.test.js             # 健康检查 + 根路径单元测试
│   └── e2e/
│       └── api.spec.js            # Playwright E2E 功能测试
├── js/
│   └── api.js                     # 前端 API 对接模块
├── package.json
├── jest.config.js                 # Jest 配置
├── playwright.config.js           # Playwright 配置
├── .gitignore
└── README.md                      # 本文件
```

---

## 🔧 本地开发

### 安装依赖

```bash
npm install
```

### 启动后端服务

```bash
npm start
# 或开发模式
npm run dev
```

服务启动后访问：
- API 文档：http://localhost:3000/api
- 工具列表：http://localhost:3000/api/tools
- 健康检查：http://localhost:3000/api/health

### 运行测试

```bash
# 单元测试（含覆盖率报告）
npm test

# E2E 功能测试（需先安装浏览器）
npx playwright install --with-deps chromium
npm run test:e2e
```

### 构建打包

```bash
npm run build
```

构建产物输出到 `dist/` 目录，包含压缩后的前端资源和服务端代码。

---

## 📡 API 接口一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api` | API 信息 |
| GET | `/api/tools` | 工具列表（支持 `?category=` 和 `?sort=`） |
| GET | `/api/tools/:id` | 工具详情 |
| GET | `/api/tools/categories/all` | 分类列表 |
| GET | `/api/search?q=关键词` | 搜索工具 |
| POST | `/api/contact` | 提交留言 |
| GET | `/api/contact` | 获取留言列表 |
| GET | `/api/health` | 健康检查 |

---

## 🚀 CI/CD 流水线

### 流水线阶段

```
push / PR → 单元测试 → E2E测试 → 构建打包 → 部署 → 邮件通知
```

| 阶段 | 触发条件 | 说明 |
|------|----------|------|
| 🧪 单元测试 | 所有 push/PR | Jest 32 个用例，覆盖率 100% |
| 🎭 功能测试 | 单元测试通过后 | Playwright API 级 E2E 测试 |
| 🔨 构建打包 | E2E 通过后 | 压缩 HTML/CSS/JS，输出到 dist/ |
| 🚀 部署 | main 分支 | 部署前端到 GitHub Pages (aiseo.one) |
| 📧 通知 | 全部完成后 | 邮件通知组员构建结果 |

### 触发条件

- **push 到 main/develop**：完整流水线
- **PR 到 main**：测试 + 构建不部署

---

## 🔑 GitHub Secrets 配置

在仓库 `Settings → Secrets and variables → Actions` 中添加以下 Secrets：

| Secret 名称 | 说明 | 示例 |
|--------------|------|------|
| `MAIL_USERNAME` | 发件邮箱（QQ邮箱） | `your_email@qq.com` |
| `MAIL_PASSWORD` | 邮箱授权码（非登录密码） | `abcdefghijklmnop` |
| `NOTIFY_EMAILS` | 收件人邮箱（多个用逗号分隔） | `a@example.com,b@example.com` |

### 获取 QQ 邮箱授权码

1. 登录 [QQ邮箱](https://mail.qq.com)
2. 设置 → 账户 → POP3/SMTP 服务 → 开启
3. 按提示用手机发短信获取授权码
4. 将授权码填入 `MAIL_PASSWORD` Secret

> `GITHUB_TOKEN` 不需要手动配置，GitHub Actions 自动提供。

---

## 📊 测试覆盖

- **单元测试**：32 个用例，覆盖率 100%
  - tools API：列表、筛选、排序、详情、错误处理
  - search API：搜索、大小写、标签、空关键词
  - contact API：正常提交、参数校验、邮箱格式
  - health API：状态、uptime、404 处理

- **E2E 测试**：API 级功能测试
  - 工具列表全流程
  - 搜索全流程
  - 留言提交全流程
  - 健康检查

---

## 🌐 部署架构

```
GitHub Actions (main push)
  ├── 构建前端 (压缩 HTML/CSS/JS)
  ├── 部署前端 → GitHub Pages (aiseo.one)
  └── 邮件通知组员
```

前端（静态资源）部署在 GitHub Pages，通过 CNAME 绑定 `aiseo.one` 域名。
后端 API 可部署到任意 Node.js 服务（如 Render、Railway、Vercel Functions 等）。

---

## 📝 版本历史

- v1.0.0：后端 API 服务 + CI/CD 完整流水线
