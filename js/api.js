// ===== 前端 API 对接模块 =====
// 在浏览器中调用后端 API
// 引入方式: <script src="/js/api.js"></script>

const AISEO_API = (function() {
  // API 地址：生产环境用同域名，开发环境用 localhost
  const BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : '/api';

  /**
   * 获取工具列表
   * @param {Object} params - { category, sort }
   */
  async function getTools(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE}/tools${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error(`API错误: ${res.status}`);
    return res.json();
  }

  /**
   * 获取单个工具详情
   */
  async function getToolById(id) {
    const res = await fetch(`${BASE}/tools/${id}`);
    if (!res.ok) throw new Error(`API错误: ${res.status}`);
    return res.json();
  }

  /**
   * 搜索工具
   */
  async function searchTools(keyword) {
    const res = await fetch(`${BASE}/search?q=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error(`API错误: ${res.status}`);
    return res.json();
  }

  /**
   * 提交留言
   */
  async function submitContact(name, email, message) {
    const res = await fetch(`${BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '提交失败');
    return data;
  }

  /**
   * 健康检查
   */
  async function healthCheck() {
    const res = await fetch(`${BASE}/health`);
    return res.json();
  }

  return { getTools, getToolById, searchTools, submitContact, healthCheck, BASE };
})();

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AISEO_API;
}
