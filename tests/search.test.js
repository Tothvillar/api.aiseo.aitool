// ===== 搜索 API 单元测试 =====
const request = require('supertest');
const app = require('../server/app');

describe('搜索 API - GET /api/search', () => {
  test('搜索 "Claude" 应返回结果', async () => {
    const res = await request(app).get('/api/search?q=Claude');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0].name).toBe('Claude');
  });

  test('搜索 "写作" 应返回写作类工具', async () => {
    const res = await request(app).get('/api/search?q=写作');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    res.body.data.forEach(tool => {
      const matches = tool.name.includes('写作') ||
        tool.description.includes('写作') ||
        tool.categoryName.includes('写作') ||
        tool.tags.some(t => t.includes('写作'));
      expect(matches).toBe(true);
    });
  });

  test('搜索 "AI" 应返回多条结果', async () => {
    const res = await request(app).get('/api/search?q=AI');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(3);
  });

  test('搜索不存在的关键词应返回空', async () => {
    const res = await request(app).get('/api/search?q=zzz不存在zzz');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toHaveLength(0);
  });

  test('空关键词应返回400', async () => {
    const res = await request(app).get('/api/search?q=');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('缺少q参数应返回400', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('搜索应忽略大小写', async () => {
    const res = await request(app).get('/api/search?q=claude');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.data[0].name).toBe('Claude');
  });

  test('搜索标签内容', async () => {
    const res = await request(app).get('/api/search?q=免费');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });
});
