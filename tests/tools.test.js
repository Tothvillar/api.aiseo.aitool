// ===== 工具列表 API 单元测试 =====
const request = require('supertest');
const app = require('../server/app');

describe('工具列表 API - GET /api/tools', () => {
  test('返回全部工具', async () => {
    const res = await request(app).get('/api/tools');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(8);
    expect(res.body.data).toHaveLength(8);
  });

  test('按分类筛选 - writing', async () => {
    const res = await request(app).get('/api/tools?category=writing');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    res.body.data.forEach(tool => {
      expect(tool.category).toBe('writing');
    });
  });

  test('按分类筛选 - image', async () => {
    const res = await request(app).get('/api/tools?category=image');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  test('按分类筛选 - free（免费工具）', async () => {
    const res = await request(app).get('/api/tools?category=free');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    res.body.data.forEach(tool => {
      const isFree = tool.tags.includes('免费可用') || tool.tags.includes('免费开源');
      expect(isFree).toBe(true);
    });
  });

  test('按评分排序', async () => {
    const res = await request(app).get('/api/tools?sort=score');
    expect(res.status).toBe(200);
    for (let i = 1; i < res.body.data.length; i++) {
      expect(res.body.data[i - 1].score).toBeGreaterThanOrEqual(res.body.data[i].score);
    }
  });

  test('按名称排序', async () => {
    const res = await request(app).get('/api/tools?sort=name');
    expect(res.status).toBe(200);
    for (let i = 1; i < res.body.data.length; i++) {
      expect(res.body.data[i - 1].name.localeCompare(res.body.data[i].name, 'zh-CN')).toBeLessThanOrEqual(0);
    }
  });
});

describe('工具详情 API - GET /api/tools/:id', () => {
  test('获取存在的工具', async () => {
    const res = await request(app).get('/api/tools/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
    expect(res.body.data.name).toBe('Claude');
  });

  test('获取不存在的工具', async () => {
    const res = await request(app).get('/api/tools/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('无效ID参数', async () => {
    const res = await request(app).get('/api/tools/abc');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('ID为0', async () => {
    const res = await request(app).get('/api/tools/0');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('负数ID', async () => {
    const res = await request(app).get('/api/tools/-1');
    expect(res.status).toBe(400);
  });
});

describe('分类列表 API - GET /api/tools/categories/all', () => {
  test('返回分类列表', async () => {
    const res = await request(app).get('/api/tools/categories/all');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(5);
    expect(res.body.data[0].key).toBe('all');
  });
});
