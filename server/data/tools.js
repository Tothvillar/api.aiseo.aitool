// ===== 工具数据（模拟数据库）=====
// 在实际项目中可替换为真实数据库连接

const tools = [
  {
    id: 1,
    name: 'Claude',
    category: 'writing',
    categoryName: 'AI 写作',
    score: 9.5,
    stars: 5,
    icon: '✍️',
    tags: ['AI 写作', '免费可用'],
    price: '免费版可用 / Pro $20/月',
    description: '长文写作能力最强，中文表达流畅自然，200K 超长上下文适合深度写作和研究。Artifacts 功能可实时预览代码和文档。',
    link: '/articles/claude-review.html',
    rank: '写作类 TOP 1'
  },
  {
    id: 2,
    name: 'ChatGPT',
    category: 'writing',
    categoryName: 'AI 写作',
    score: 9.3,
    stars: 5,
    icon: '💬',
    tags: ['AI 写作', '免费可用'],
    price: '免费版可用 / Plus $20/月',
    description: '生态最完善，GPTs 商店和插件系统让功能无限扩展。GPT-4o 多模态能力强，支持图片理解、数据分析。',
    link: '/articles/chatgpt-review.html',
    rank: '写作类 TOP 2'
  },
  {
    id: 3,
    name: 'Midjourney',
    category: 'image',
    categoryName: 'AI 绘画',
    score: 9.6,
    stars: 5,
    icon: '🎨',
    tags: ['AI 绘画'],
    price: '$10/月起',
    description: '艺术风格最丰富，V7 版本画质大幅提升。角色一致性、场景编辑等新功能让创作更自由。',
    link: '/articles/midjourney-review.html',
    rank: '绘画类 TOP 1'
  },
  {
    id: 4,
    name: 'Stable Diffusion',
    category: 'image',
    categoryName: 'AI 绘画',
    score: 9.0,
    stars: 4,
    icon: '🖼️',
    tags: ['AI 绘画', '免费开源'],
    price: '免费开源',
    description: '完全开源免费，生态最丰富（ControlNet、LoRA 等）。本地部署不受限制，适合深度玩家。',
    link: '/articles/stable-diffusion-review.html',
    rank: '绘画类 TOP 2'
  },
  {
    id: 5,
    name: 'Cursor',
    category: 'coding',
    categoryName: 'AI 编程',
    score: 9.4,
    stars: 5,
    icon: '💻',
    tags: ['AI 编程', '免费可用'],
    price: '免费版可用 / Pro $20/月',
    description: 'AI 原生 IDE，Composer 功能可一次性修改多个文件，上下文理解能力强，是目前最强的 AI 编程工具。',
    link: '/articles/cursor-review.html',
    rank: '编程类 TOP 1'
  },
  {
    id: 6,
    name: 'GitHub Copilot',
    category: 'coding',
    categoryName: 'AI 编程',
    score: 8.8,
    stars: 4,
    icon: '🤖',
    tags: ['AI 编程', '免费可用'],
    price: '个人免费 / Business $19/月',
    description: '最成熟的 AI 编程助手，深度集成 VS Code/JetBrains。2026 年新增 Agent 模式，可自主完成复杂任务。',
    link: '/articles/copilot-review.html',
    rank: '编程类 TOP 2'
  },
  {
    id: 7,
    name: 'Runway Gen-4',
    category: 'video',
    categoryName: 'AI 视频',
    score: 8.9,
    stars: 4,
    icon: '🎬',
    tags: ['AI 视频'],
    price: '免费额度 / $15/月起',
    description: '视频生成质量最高，Gen-4 模型物体一致性好，运动自然。支持文生视频、图生视频、视频编辑。',
    link: '/articles/runway-review.html',
    rank: '视频类 TOP 1'
  },
  {
    id: 8,
    name: 'Gamma',
    category: 'office',
    categoryName: 'AI 办公',
    score: 9.2,
    stars: 5,
    icon: '📊',
    tags: ['AI 办公', '免费可用'],
    price: '免费版可用 / Plus $10/月',
    description: '一键生成专业 PPT 和文档，设计感出众。AI 辅助排版、配图、图表，演示文稿制作效率提升 10 倍。',
    link: '/articles/gamma-review.html',
    rank: '办公类 TOP 1'
  }
];

// 留言数据（内存存储，重启清空；实际项目可用数据库）
const messages = [];

module.exports = { tools, messages };
