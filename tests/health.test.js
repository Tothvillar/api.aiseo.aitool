// ===== 健康检查 + 根路径 单元测试 =====
const request = require('supertest');
const app = require('../server/app');

describe('健康检查 API - GET /api/health', () => {
  test('返回服务状态', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeDefined();
    expect(typeof res.body.uptime).toBe('number');
  });
});

describe('API 根路径 - GET /api', () => {
  test('返回API信息', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.name).toBeDefined();
    expect(res.body.version).toBeDefined();
    expect(res.body.endpoints).toBeDefined();
    expect(res.body.endpoints.tools).toBe('/api/tools');
    expect(res.body.endpoints.search).toContain('/api/search');
    expect(res.body.endpoints.contact).toContain('/api/contact');
    expect(res.body.endpoints.health).toBe('/api/health');
  });
});

describe('404 处理', () => {
  test('访问不存在的API路径', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('访问根路径（非API）', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(404);
  });
});
