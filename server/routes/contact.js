// ===== 联系/留言 API =====
const express = require('express');
const router = express.Router();
const { messages } = require('../data/tools');

// 提交留言
// POST /api/contact
// body: { name, email, message }
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // 参数校验
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: '姓名不能为空' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: '邮箱不能为空' });
  }
  // 邮箱格式校验
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: '邮箱格式不正确' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: '留言内容不能为空' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ success: false, error: '留言内容不能超过1000字' });
  }

  // 保存留言
  const entry = {
    id: messages.length + 1,
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };
  messages.push(entry);

  res.status(201).json({
    success: true,
    message: '留言提交成功，我们会尽快回复！',
    data: { id: entry.id, createdAt: entry.createdAt }
  });
});

// 获取所有留言（管理接口）
// GET /api/contact
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: messages.length,
    data: messages
  });
});

module.exports = router;
