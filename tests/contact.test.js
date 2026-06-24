// ===== 联系/留言 API 单元测试 =====
const request = require('supertest');
const app = require('../server/app');

describe('留言 API - POST /api/contact', () => {
  test('正常提交留言', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: '张三',
        email: 'zhangsan@example.com',
        message: '这个网站做得不错！'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
  });

  test('姓名为空', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '', email: 'test@test.com', message: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('姓名');
  });

  test('邮箱为空', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '李四', email: '', message: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('邮箱');
  });

  test('邮箱格式错误', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '李四', email: 'not-an-email', message: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('邮箱格式');
  });

  test('留言为空', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '李四', email: 'test@test.com', message: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('留言');
  });

  test('留言超长（>1000字）', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: '李四',
        email: 'test@test.com',
        message: 'a'.repeat(1001)
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('1000');
  });

  test('缺少整个name字段', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ email: 'test@test.com', message: 'hello' });
    expect(res.status).toBe(400);
  });
});

describe('留言查询 API - GET /api/contact', () => {
  test('返回留言列表', async () => {
    const res = await request(app).get('/api/contact');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
