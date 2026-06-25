// ===== 搜索 API =====
const express = require('express');
const router = express.Router();
const { tools } = require('../data/tools');

// 搜索工具
// GET /api/search?q=关键词
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();

  if (!q) {
    return res.status(400).json({
      success: false,
      error: '请提供搜索关键词（参数 q）'
    });
  }

  // 搜索范围：名称、描述、分类、标签
  const results = tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.categoryName.includes(q) ||
      tool.category.includes(q) ||
      tool.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  res.json({
    success: true,
    keyword: req.query.q,
    count: results.length,
    data: results
  });
});

module.exports = router;
