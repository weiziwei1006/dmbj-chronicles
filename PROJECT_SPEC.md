以下是完整的项目规范文档，可直接复制保存为 `PROJECT_SPEC.md`：

---

# dmbj-chronicles 项目开发规范

> 版本：1.0.0  
> 适用对象：所有参与本项目开发的 AI Agent 与人类开发者  
> 最后更新：2026-07-30


## 1. 项目概述

**dmbj-chronicles** 是一个基于《盗墓笔记》世界观的交互式叙事网页应用。核心功能包括：

- **门户首页**：展示所有可用人物视角，供用户选择进入
- **角色叙事线**：以选定人物为中心，按时间顺序展示其经历的所有事件
- **事件详情页**：展示特定事件的公共描述 + 所选人物的独家视角叙述，并配有沉浸式视觉场景
- **视角切换**：在事件详情页可一键跳转到同一事件的其他人物视角

项目为**纯前端静态应用**，所有数据以 JSON 文件形式存储于 `src/data/` 中，无需后端服务器即可运行。


## 2. 技术栈（唯一确定）

| 类型 | 技术 | 版本 | 用途 |
| :--- | :--- | :--- | :--- |
| **构建工具** | Vite | ≥ 5.0 | 开发服务器、模块打包、生产构建 |
| **核心框架** | Astro | ≥ 4.0 | 页面路由、布局、岛屿架构（SSG 输出） |
| **交互框架** | Vue 3 | ≥ 3.4 | 构建所有交互组件（时间线、视角切换、场景渲染） |
| **动画引擎** | GSAP | ≥ 3.12 | 滚动驱动动画、场景切换过渡、视差滚动效果 |
| **3D 渲染** | Three.js | ≥ 0.160 | 特定场景的 3D 元素（青铜神树、海底墓室等） |
| **音频管理** | Howler.js | ≥ 2.2 | 背景音乐、环境音效的加载与控制 |
| **样式方案** | Tailwind CSS | ≥ 3.4 | 所有样式通过原子类实现，配合自定义主题扩展 |
| **语言** | TypeScript | ≥ 5.0 | 所有代码必须使用 TypeScript（`.astro` 中启用类型检查） |
| **代码规范** | ESLint + Prettier | 最新 | 统一代码风格，必须配置并自动执行 |

> **关键约束**：
> - 所有交互组件必须使用 Vue 3 编写，通过 Astro 的 `client:load` 指令按需加载。
> - 禁止在 Astro 组件中使用任何客户端钩子（如 `onMounted`），所有客户端逻辑须封装在 `.vue` 文件中。


## 3. 项目目录结构（强制）

```
dmbj-chronicles/
├── public/                              # 静态资源（直接复制到构建目录）
│   ├── fonts/                           # 自定义字体（.woff2）
│   │   └── chinese-serif.woff2
│   ├── images/
│   │   ├── common/                      # 公共图片：logo、背景纹理、装饰图案
│   │   │   ├── logo.svg
│   │   │   └── bg-pattern.png
│   │   └── characters/                  # 按角色分组的图片
│   │       ├── wuxie/
│   │       │   ├── avatar.jpg
│   │       │   └── scene-bg.jpg
│   │       ├── zhangqiling/
│   │       │   ├── avatar.jpg
│   │       │   └── scene-bg.jpg
│   │       └── wangpangzi/
│   │           ├── avatar.jpg
│   │           └── scene-bg.jpg
│   └── audio/                           # 音频资源
│       ├── bgm/
│       │   ├── mysterious.mp3
│       │   └── intense.mp3
│       └── ambient/
│           ├── water-drip.mp3
│           └── wind.mp3
│
├── src/
│   ├── components/                      # 所有组件
│   │   ├── layout/                      # 布局组件（Astro）
│   │   │   ├── BaseLayout.astro        # 全局基础布局（head, header, footer）
│   │   │   └── NarrativeLayout.astro   # 叙事页专用布局（含侧边栏）
│   │   ├── ui/                          # 基础 UI 组件（Vue 3）
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Modal.vue
│   │   │   └── TimelineSlider.vue      # 时间线滑块
│   │   └── narrative/                   # 叙事专用组件（Vue 3）
│   │       ├── SceneRenderer.vue       # 场景渲染器（Three.js / CSS 背景）
│   │       ├── PerspectiveSwitch.vue   # 视角切换器
│   │       ├── EventCard.vue           # 事件卡片（时间线列表用）
│   │       └── NarrativeText.vue       # 叙事文本渲染器（含打字机效果）
│   │
│   ├── layouts/                         # Astro 布局组件
│   │   ├── BaseLayout.astro
│   │   └── NarrativeLayout.astro
│   │
│   ├── pages/                           # 路由页面（Astro 文件路由）
│   │   ├── index.astro                 # 门户首页（角色选择）
│   │   └── [character]/                # 动态路由段
│   │       ├── index.astro             # 角色主页（时间线总览）
│   │       └── [...slug].astro         # 事件详情页（/wuxie/event_001）
│   │
│   ├── data/                            # ⭐ 核心数据层（全部为 JSON，只读）
│   │   ├── common/                      # 公共数据（所有角色共享）
│   │   │   ├── timeline.json           # 全局事件列表（按时间排序）
│   │   │   ├── events/                 # 每个事件的基础信息
│   │   │   │   ├── event_001.json
│   │   │   │   ├── event_002.json
│   │   │   │   └── ...
│   │   │   └── world.json              # 世界观常量（家族、势力、物品）
│   │   ├── characters/                  # 角色独立数据
│   │   │   ├── wuxie/
│   │   │   │   ├── profile.json        # 角色元信息
│   │   │   │   └── perspectives/       # 该角色对每个事件的叙述
│   │   │   │       ├── event_001.json
│   │   │   │       └── ...
│   │   │   ├── zhangqiling/
│   │   │   │   ├── profile.json
│   │   │   │   └── perspectives/
│   │   │   └── wangpangzi/
│   │   │       ├── profile.json
│   │   │       └── perspectives/
│   │   └── config/                      # 项目配置
│   │       ├── theme.json              # 主题色、字体、默认角色
│   │       └── settings.json           # 音频开关、默认视角等
│   │
│   ├── styles/                          # 样式文件
│   │   ├── globals.css                 # 全局样式重置 + 基础
│   │   ├── variables.css               # CSS 自定义属性（颜色、字体、间距）
│   │   └── themes/                     # 角色主题覆盖
│   │       ├── wuxie.css
│   │       ├── zhangqiling.css
│   │       └── wangpangzi.css
│   │
│   ├── utils/                           # 工具函数（纯函数，TypeScript）
│   │   ├── dataLoader.ts               # 数据加载器：合并公共+角色数据
│   │   ├── timelineHelper.ts           # 时间线排序、筛选、查找
│   │   └── eventUtils.ts               # 事件 ID 解析、路由辅助
│   │
│   ├── lib/                             # 第三方库封装（初始化、配置）
│   │   ├── gsap.ts                     # GSAP 统一配置（注册 ScrollTrigger）
│   │   └── three.ts                    # Three.js 场景初始化器
│   │
│   └── types/                           # TypeScript 类型定义
│       ├── data.d.ts                   # 数据接口（Event, Perspective, Character）
│       └── global.d.ts
│
├── astro.config.mjs                     # Astro 配置文件
├── vite.config.ts                       # Vite 配置文件（Astro 内部继承）
├── tailwind.config.js                   # Tailwind CSS 配置
├── tsconfig.json                        # TypeScript 配置
├── .eslintrc.cjs                        # ESLint 配置
├── .prettierrc                          # Prettier 配置
├── package.json
├── pnpm-lock.yaml                       # 或 package-lock.json
└── README.md
```


## 4. JSON 数据规范

### 4.1 公共时间线：`common/timeline.json`

```json
[
  {
    "id": "event_001",
    "order": 1,
    "title": "七星鲁王宫",
    "timeLabel": "2003年2月",
    "location": "山东沂蒙山",
    "characterIds": ["wuxie", "zhangqiling", "wangpangzi"]
  }
]
```

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | string | ✅ | 唯一标识，格式 `event_` + 三位数字 |
| `order` | number | ✅ | 时间顺序，从小到大排列 |
| `title` | string | ✅ | 事件标题 |
| `timeLabel` | string | ✅ | 显示用时间标签 |
| `location` | string | ✅ | 地点 |
| `characterIds` | string[] | ✅ | 参与该事件的角色 ID 列表 |

### 4.2 事件基础信息：`common/events/event_001.json`

```json
{
  "id": "event_001",
  "summary": "吴邪跟随三叔下到战国墓，首次遭遇七星疑棺和血尸。",
  "publicDescription": "（可选）供所有角色共享的背景描述",
  "sceneVisuals": {
    "mainScene": "墓道入口",
    "visualCues": "阴暗、狭窄、墙壁有浮雕、空气潮湿",
    "colorPalette": ["#1a0f0a", "#2b1a10", "#4a6b3d"],
    "atmosphere": "阴森、压抑",
    "bgm": "/audio/bgm/mysterious.mp3",
    "ambient": "/audio/ambient/wind.mp3"
  },
  "relatedItems": ["战国帛书", "青铜铃"],
  "relatedCharacters": ["吴三省", "张起灵"]
}
```

### 4.3 角色档案：`characters/{角色}/profile.json`

```json
{
  "id": "wuxie",
  "name": "吴邪",
  "alias": "天真",
  "avatar": "/images/characters/wuxie/avatar.jpg",
  "themeColor": "#d4a373",
  "themeClass": "theme-wuxie",
  "bio": "《盗墓笔记》主角，出身盗墓世家，好奇心强，重情义。",
  "defaultBgm": "/audio/bgm/wuxie-theme.mp3"
}
```

### 4.4 角色视角：`characters/{角色}/perspectives/event_001.json`

```json
{
  "eventId": "event_001",
  "narrative": [
    {
      "paragraph": "我跟着三叔走进墓道，手电光只能照亮前方几米。墙壁上刻满了奇怪的图案，像是某种古老的祭祀场景。",
      "innerThought": "这是我第一次下墓，说不紧张是假的。"
    },
    {
      "paragraph": "突然，前方传来一声沉闷的响动，像是棺材盖被推开的声音。"
    }
  ],
  "keyQuotes": ["\"三叔，那是什么？\""],
  "emotion": "紧张、好奇"
}
```

> **重要约束**：
> - 每个事件必须为每个已定义的角色提供对应的 `perspectives/event_xxx.json`
> - 如果角色未参与该事件，`narrative` 应为空数组 `[]`
> - 所有 JSON 文件必须符合 TypeScript 类型定义（见 `src/types/data.d.ts`）


## 5. TypeScript 类型定义

`src/types/data.d.ts`：

```typescript
export interface TimelineEvent {
  id: string;
  order: number;
  title: string;
  timeLabel: string;
  location: string;
  characterIds: string[];
}

export interface EventCommon {
  id: string;
  summary: string;
  publicDescription?: string;
  sceneVisuals: {
    mainScene: string;
    visualCues: string;
    colorPalette: string[];
    atmosphere: string;
    bgm?: string;
    ambient?: string;
  };
  relatedItems: string[];
  relatedCharacters: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  alias: string;
  avatar: string;
  themeColor: string;
  themeClass: string;
  bio: string;
  defaultBgm?: string;
}

export interface Perspective {
  eventId: string;
  narrative: {
    paragraph: string;
    innerThought?: string;
  }[];
  keyQuotes: string[];
  emotion: string;
}

export interface EventDetail extends EventCommon {
  perspective: Perspective;
}

export interface EventWithPerspective extends EventCommon {
  perspective: Perspective;
}

export interface Character {
  profile: CharacterProfile;
  events: EventWithPerspective[];
}
```


## 6. 数据加载器规范

`src/utils/dataLoader.ts` 必须实现以下三个核心函数：

```typescript
import type { EventDetail, CharacterProfile, EventWithPerspective } from '../types/data';

/**
 * 加载指定角色的所有事件（合并公共信息 + 角色视角）
 */
export async function loadCharacterEvents(characterId: string): Promise<EventWithPerspective[]> {
  // 1. 加载 timeline.json
  // 2. 遍历每个事件，加载 common/events/ 和 characters/{id}/perspectives/
  // 3. 合并返回
}

/**
 * 加载单个事件的完整详情（公共信息 + 指定角色视角）
 */
export async function loadEventDetail(
  characterId: string, 
  eventId: string
): Promise<EventDetail> {
  // 1. 加载 common/events/{eventId}.json
  // 2. 加载 characters/{characterId}/perspectives/{eventId}.json
  // 3. 合并返回
}

/**
 * 获取所有角色列表（用于门户首页）
 */
export async function loadAllCharacters(): Promise<CharacterProfile[]> {
  // 1. 读取 characters/ 目录下所有子文件夹
  // 2. 加载每个角色的 profile.json
  // 3. 返回数组
}
```

**加载约束**：
- 所有 JSON 加载必须使用动态 `import()` —— `await import(`../data/common/events/${eventId}.json`)`
- 禁止在顶层使用 `import ... from` 导入 JSON（会导致打包时全部嵌入）
- 必须处理 `perspectives/` 文件缺失的情况（返回空叙述，不报错）


## 7. 组件开发规范

### 7.1 Astro 组件（`.astro`）

- 用于布局和纯展示内容
- 禁止使用 `client:*` 指令（由 Vue 组件负责交互）
- 通过 props 接收数据，传递给 Vue 组件

**示例**：

```astro
---
// pages/[character]/[...slug].astro
import NarrativeLayout from '../../layouts/NarrativeLayout.astro';
import SceneRenderer from '../../components/narrative/SceneRenderer.vue';
import NarrativeText from '../../components/narrative/NarrativeText.vue';
import PerspectiveSwitch from '../../components/narrative/PerspectiveSwitch.vue';
import { loadEventDetail } from '../../utils/dataLoader';

const { character, slug } = Astro.params;
const eventId = slug?.[0] || '';
const data = await loadEventDetail(character, eventId);
---

<NarrativeLayout character={character}>
  <SceneRenderer 
    client:load 
    visuals={data.sceneVisuals} 
    characterId={character}
  />
  <div class="narrative-container">
    <h1>{data.title}</h1>
    <NarrativeText client:load narrative={data.perspective.narrative} />
    <PerspectiveSwitch 
      client:load 
      eventId={data.id} 
      currentCharacter={character}
      availableCharacters={data.relatedCharacters}
    />
  </div>
</NarrativeLayout>
```

### 7.2 Vue 3 组件（`.vue`）

- 所有交互组件必须使用 Vue 3 编写
- 使用 Composition API + `<script setup>`
- 组件名采用 PascalCase，文件名与组件名一致

**示例**：

```vue
<!-- components/narrative/NarrativeText.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  narrative: { paragraph: string; innerThought?: string }[];
}>();

const displayedIndex = ref(0);

onMounted(() => {
  // 打字机效果实现
});
</script>

<template>
  <div class="narrative-text">
    <p 
      v-for="(item, index) in narrative" 
      v-show="index <= displayedIndex"
      class="paragraph"
    >
      {{ item.paragraph }}
      <span v-if="item.innerThought" class="inner-thought">
        （{{ item.innerThought }}）
      </span>
    </p>
  </div>
</template>
```

### 7.3 组件命名约定

| 类型 | 命名 | 示例 |
| :--- | :--- | :--- |
| 布局组件 | PascalCase + `Layout` | `BaseLayout`, `NarrativeLayout` |
| UI 基础组件 | PascalCase | `Button`, `Card`, `Modal` |
| 叙事组件 | PascalCase + 描述 | `SceneRenderer`, `PerspectiveSwitch` |
| 页面组件 | kebab-case 文件名 | `index.astro`, `[...slug].astro` |


## 8. 样式规范

### 8.1 Tailwind CSS 配置

`tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // 暗黑主题基础色
        'bg-primary': '#0a0605',
        'bg-secondary': '#14100e',
        'text-primary': '#e8ddd0',
        'text-secondary': '#a89580',
        'accent-bronze': '#7a6b5a',
        'accent-blood': '#5c1a1a',
        // 角色主题色（由 CSS 变量动态控制）
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/images/common/paper-texture.png')",
      },
    },
  },
  plugins: [],
};
```

### 8.2 CSS 自定义属性

`src/styles/variables.css`：

```css
:root {
  /* 基础色 */
  --color-bg: #0a0605;
  --color-bg-card: #14100e;
  --color-text: #e8ddd0;
  --color-text-muted: #a89580;
  --color-accent: #7a6b5a;
  --color-accent-glow: #5c1a1a;
  
  /* 字体 */
  --font-serif: 'Noto Serif SC', serif;
  --font-sans: 'Inter', sans-serif;
  
  /* 间距 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* 角色主题色（由各角色 CSS 覆盖） */
  --color-theme: #d4a373;
}

/* 各角色主题 */
.theme-wuxie {
  --color-theme: #d4a373;
}
.theme-zhangqiling {
  --color-theme: #4a7c8c;
}
.theme-wangpangzi {
  --color-theme: #8c6e4a;
}
```

### 8.3 响应式断点

| 断点 | 屏幕宽度 | Tailwind 类前缀 |
| :--- | :--- | :--- |
| 手机 | < 768px | 默认（无前缀） |
| 平板 | ≥ 768px | `md:` |
| 桌面 | ≥ 1024px | `lg:` |
| 宽屏 | ≥ 1280px | `xl:` |


## 9. 路由系统规范

Astro 文件路由结构：

| URL 路径 | 对应文件 | 渲染内容 |
| :--- | :--- | :--- |
| `/` | `pages/index.astro` | 门户首页（角色选择） |
| `/wuxie` | `pages/[character]/index.astro` | 吴邪的时间线总览 |
| `/wuxie/event_001` | `pages/[character]/[...slug].astro` | 事件详情页 |

**路由参数**：
- `character`：角色 ID（如 `wuxie`, `zhangqiling`）
- `slug`：事件 ID 数组（如 `['event_001']`）

**页面间跳转**：
- 使用 `<a>` 标签或 Astro 的 `<Link>` 组件
- 视角切换：`<a href={`/${targetCharacter}/${eventId}`}>`


## 10. 交互实现指南

### 10.1 时间线滚动

- 使用 GSAP + ScrollTrigger 实现滚动驱动的动画
- 滚动时高亮当前事件节点，更新 URL 锚点
- 提供“上一事件/下一事件”导航按钮

### 10.2 场景切换动效

- 事件详情页切换时使用 GSAP Timeline 实现：
  - 旧场景淡出（0.5s）
  - 场景过渡动画（0.3s）
  - 新场景淡入（0.5s）
- Three.js 场景在切换时执行 `dispose()` 并重新初始化

### 10.3 视角切换

- 使用 `PerspectiveSwitch.vue` 组件
- 在下拉菜单或按钮组中显示参与该事件的所有角色
- 点击后跳转至 `/[新角色]/event_{eventId}`
- 跳转时保留当前滚动位置（通过 `history.replaceState` 记录）

### 10.4 音频控制

- 使用 Howler.js 管理所有音频
- 背景音乐循环播放，切换场景时淡入淡出（过渡 2s）
- 提供全局静音按钮，状态存储于 `localStorage`
- 不同场景自动切换 BGM（由 `event_xxx.json` 的 `sceneVisuals.bgm` 指定）

### 10.5 Three.js 场景

- 仅在需要 3D 渲染的事件中使用（如青铜神树）
- 使用动态 `import()` 按需加载 —— `await import('three')`
- 场景容器由 `SceneRenderer.vue` 管理
- 必须实现 `initScene()`, `animate()`, `disposeScene()` 三个生命周期方法


## 11. 性能与打包约束

| 指标 | 目标值 | 检查方式 |
| :--- | :--- | :--- |
| 首屏加载时间 | < 2s (3G 网络) | Lighthouse |
| 首屏 JS 体积 | < 200KB (gzip) | `vite build --analyze` |
| 总构建体积 | < 5MB (不含图片/音频) | `du -sh dist/` |
| Lighthouse 性能分 | ≥ 90 | Chrome DevTools |
| 图片格式 | WebP 优先，备用 PNG | 手动检查 |

**优化措施**：
- 所有图片使用 `<picture>` 标签提供 WebP + 降级方案
- Three.js 场景仅在进入详情页时动态加载
- 音频文件使用 `preload="none"` 延迟加载
- 路由切换使用 Astro 的视图过渡（View Transitions）


## 12. 开发工作流

### 12.1 环境搭建

```bash
# 1. 克隆项目
git clone <repository-url>
cd dmbj-chronicles

# 2. 安装依赖（使用 pnpm 或 npm）
pnpm install

# 3. 启动开发服务器
pnpm run dev

# 4. 构建生产版本
pnpm run build

# 5. 预览生产构建
pnpm run preview
```

### 12.2 开发顺序（强制）

1. **数据先行**：先完善 `src/data/` 下的所有 JSON，确保数据结构完整
2. **类型定义**：根据 JSON 结构编写 `src/types/data.d.ts`
3. **工具函数**：实现 `dataLoader.ts` 及相关工具
4. **布局组件**：开发 `BaseLayout.astro` 和 `NarrativeLayout.astro`
5. **页面组件**：开发 `index.astro`、`[character]/index.astro`
6. **交互组件**：开发 Vue 3 组件（`SceneRenderer`, `PerspectiveSwitch` 等）
7. **细节打磨**：动画、音效、响应式适配

### 12.3 Git 提交规范

```bash
feat: 新增功能
fix: 修复问题
docs: 文档更新
style: 样式调整（不影响功能）
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链调整
```


## 13. 构建与部署

### 13.1 构建命令

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint . --ext .ts,.vue,.astro",
    "format": "prettier --write ."
  }
}
```

### 13.2 部署目标

- **推荐**：Vercel 或 Netlify（自动检测 Astro 项目）
- 输出目录：`dist/`
- 部署模式：静态 SSG（无需服务器）

### 13.3 环境变量

| 变量名 | 用途 | 默认值 |
| :--- | :--- | :--- |
| `PUBLIC_SITE_URL` | 站点 URL | `http://localhost:4321` |
| `PUBLIC_GA_ID` | Google Analytics ID（可选） | — |


## 14. 禁止事项

- ❌ 禁止将任何业务数据硬编码在组件中（必须从 JSON 加载）
- ❌ 禁止在 Astro 组件中使用 Vue 的 `onMounted` 等客户端钩子
- ❌ 禁止直接修改 `data/` 下的 JSON 文件（运行时只读）
- ❌ 禁止使用 `any` 类型（必须明确定义接口）
- ❌ 禁止在组件中直接使用 `localStorage`（应通过工具函数封装）
- ❌ 禁止使用 `!important`（通过提高选择器优先级解决）
- ❌ 禁止提交 `node_modules/` 和 `dist/` 到版本控制


## 15. 附则

- 所有新功能开发前需同步更新此文档
- 遇到规范未覆盖的情况，优先参考 [Astro 官方文档](https://docs.astro.build) 和 [Vue 3 官方文档](https://vuejs.org)
- 本规范最终解释权归项目负责人

---

**规范文档结束** — 所有操作须严格依照此规范生成代码，否则可能导致项目整合失败。