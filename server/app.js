// ===== AI工具库 后端 API 服务 =====
// Express 服务器：提供工具数据 API、搜索 API、留言 API
// 前端静态文件由 GitHub Pages 托管，API 由本服务提供

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// === 中间件 ===
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 限流：防止恶意请求
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100,
  message: { success: false, error: '请求过于频繁，请稍后再试' }
});
app.use('/api/', apiLimiter);

// === 静态文件（生产环境同时托管前端）===
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// === 路由 ===
const toolsRouter = require('./routes/tools');
const searchRouter = require('./routes/search');
const contactRouter = require('./routes/contact');
const healthRouter = require('./routes/health');

app.use('/api/tools', toolsRouter);
app.use('/api/search', searchRouter);
app.use('/api/contact', contactRouter);
app.use('/api/health', healthRouter);

// === 根路径 ===
app.get('/api', (req, res) => {
  res.json({
    name: 'AI工具库 API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      search: '/api/search?q=关键词',
      contact: '/api/contact (POST)',
      health: '/api/health'
    }
  });
});

// === 404 ===
app.use((req, res) => {
  res.status(404).json({ success: false, error: '接口不存在' });
});

// === 错误处理 ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: '服务器内部错误' });
});

// === 启动 ===
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 AI工具库 API 服务启动: http://localhost:${PORT}`);
    console.log(`📋 API 文档: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
