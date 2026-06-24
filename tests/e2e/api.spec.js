// ===== E2E 功能测试：API 核心流程 =====
const { test, expect } = require('@playwright/test');

test.describe('工具列表 API 功能测试', () => {
  test('GET /api/tools 返回全部工具', async ({ request }) => {
    const res = await request.get('/api/tools');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.count).toBe(8);
    expect(body.data).toHaveLength(8);
  });

  test('GET /api/tools?category=writing 筛选写作工具', async ({ request }) => {
    const res = await request.get('/api/tools?category=writing');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(2);
    body.data.forEach(tool => {
      expect(tool.category).toBe('writing');
    });
  });

  test('GET /api/tools?sort=score 按评分排序', async ({ request }) => {
    const res = await request.get('/api/tools?sort=score');
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (let i = 1; i < body.data.length; i++) {
      expect(body.data[i - 1].score).toBeGreaterThanOrEqual(body.data[i].score);
    }
  });
});

test.describe('工具详情 API 功能测试', () => {
  test('GET /api/tools/1 返回Claude详情', async ({ request }) => {
    const res = await request.get('/api/tools/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.name).toBe('Claude');
    expect(body.data.score).toBe(9.5);
  });

  test('GET /api/tools/999 返回404', async ({ request }) => {
    const res = await request.get('/api/tools/999');
    expect(res.status()).toBe(404);
  });
});

test.describe('搜索 API 功能测试', () => {
  test('搜索 "Claude" 返回正确结果', async ({ request }) => {
    const res = await request.get('/api/search?q=Claude');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBeGreaterThan(0);
    expect(body.data[0].name).toBe('Claude');
  });

  test('搜索不存在的内容返回空', async ({ request }) => {
    const res = await request.get('/api/search?q=zzznotexist');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(0);
  });

  test('空搜索关键词返回400', async ({ request }) => {
    const res = await request.get('/api/search?q=');
    expect(res.status()).toBe(400);
  });
});

test.describe('留言 API 功能测试', () => {
  test('正常提交留言成功', async ({ request }) => {
    const res = await request.post('/api/contact', {
      data: {
        name: '测试用户',
        email: 'test@example.com',
        message: '这是一条E2E测试留言'
      }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.id).toBeDefined();
  });

  test('提交留言缺少姓名失败', async ({ request }) => {
    const res = await request.post('/api/contact', {
      data: {
        name: '',
        email: 'test@example.com',
        message: '测试'
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('提交留言邮箱格式错误失败', async ({ request }) => {
    const res = await request.post('/api/contact', {
      data: {
        name: '测试',
        email: 'bad-email',
        message: '测试'
      }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});

test.describe('健康检查 API 功能测试', () => {
  test('GET /api/health 返回健康状态', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.uptime).toBeGreaterThanOrEqual(0);
  });
});

test.describe('API 根路径功能测试', () => {
  test('GET /api 返回API文档信息', async ({ request }) => {
    const res = await request.get('/api');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toContain('AI工具库');
    expect(body.endpoints.tools).toBeDefined();
    expect(body.endpoints.search).toBeDefined();
  });
});
