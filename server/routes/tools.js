// ===== 工具列表 API =====
const express = require('express');
const router = express.Router();
const { tools } = require('../data/tools');

// 获取全部工具
// GET /api/tools
// 可选参数: category=writing, sort=score, free=true
router.get('/', (req, res) => {
  let result = [...tools];

  // 按分类筛选
  if (req.query.category && req.query.category !== 'all') {
    const cat = req.query.category;
    if (cat === 'free') {
      result = result.filter(t => t.tags.includes('免费可用') || t.tags.includes('免费开源'));
    } else {
      result = result.filter(t => t.category === cat);
    }
  }

  // 排序
  if (req.query.sort === 'score') {
    result.sort((a, b) => b.score - a.score);
  } else if (req.query.sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

// 获取单个工具详情
// GET /api/tools/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ success: false, error: '无效的工具ID' });
  }

  const tool = tools.find(t => t.id === id);
  if (!tool) {
    return res.status(404).json({ success: false, error: '工具不存在' });
  }

  res.json({ success: true, data: tool });
});

// 获取所有分类
// GET /api/tools/categories/all
router.get('/categories/all', (req, res) => {
  const categories = [
    { key: 'all', name: '全部' },
    { key: 'writing', name: 'AI 写作' },
    { key: 'image', name: 'AI 绘画' },
    { key: 'coding', name: 'AI 编程' },
    { key: 'video', name: 'AI 视频' },
    { key: 'office', name: 'AI 办公' },
    { key: 'free', name: '免费工具' }
  ];
  res.json({ success: true, data: categories });
});

module.exports = router;
