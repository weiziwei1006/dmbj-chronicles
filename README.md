# dmbj-chronicles

盗墓笔记 · 交互编年史 — 基于《盗墓笔记》世界观的交互式叙事网页应用。

## 技术栈

- **Vite** ≥ 5.0 — 构建工具
- **Astro** ≥ 4.0 — SSG 框架
- **Vue 3** ≥ 3.4 — 交互组件
- **GSAP** ≥ 3.12 — 动画引擎
- **Tailwind CSS** ≥ 3.4 — 样式方案
- **TypeScript** ≥ 5.0 — 类型安全

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── components/       # Vue 3 交互组件 + Astro 布局
├── data/             # JSON 数据层（只读）
├── layouts/          # Astro 布局组件
├── lib/              # 第三方库封装
├── pages/            # Astro 路由页面
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
└── utils/            # 工具函数
```

## 当前阶段（MVP）

- ✅ 吴邪视角 — 七星鲁王宫事件
- 🚧 张起灵、王胖子视角 — 即将开放
