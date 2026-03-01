## Context

当前 ERP 系统基于 SvelteKit 构建，使用服务端渲染 (SSR) 和表单增强 (`use:enhance`)。路由结构：
- `/erp/*` - 中文 ERP 工作台，顶部横向导航
- `/(app)/*` - 英文界面，侧边栏导航

SvelteKit 默认已支持客户端导航，但缺乏：
1. 移动端友好的导航组件
2. 页面切换的视觉过渡效果
3. 加载状态的统一管理

目标用户：仓库操作员、采购人员，主要使用移动设备（手机/平板）进行日常操作。

## Goals / Non-Goals

**Goals:**
- 移动端导航体验达到原生 App 水平（底部标签栏、流畅切换）
- 页面切换有清晰的视觉反馈（过渡动画、加载指示）
- 保持桌面端现有布局不变，通过响应式切换
- 零外部依赖，使用浏览器原生 API

**Non-Goals:**
- 不实现离线功能/PWA（后续迭代考虑）
- 不改变数据加载方式（保持 SSR + 增强表单）
- 不实现手势返回/前进（浏览器原生支持）
- 不支持不兼容 View Transitions API 的旧浏览器动画（静默降级）

## Decisions

### 1. 导航方案：底部标签栏 + 响应式切换

**选择**: 移动端使用固定底部标签栏，桌面端保持现有布局

**理由**:
- 底部标签栏是移动端最符合人体工程学的导航模式（拇指热区）
- 保持与现有桌面布局的兼容性
- 使用 CSS 媒体查询实现响应式切换，无需 JS 检测

**备选方案**:
- 汉堡菜单 + 抽屉：需要两次点击，效率低
- 顶部标签栏：移动端难以单手操作
- 完全重构为统一布局：改动范围过大

**实现**:
```
+layout.svelte
├── <MobileNav /> (hidden on md+)
└── <DesktopNav /> (hidden on mobile)
```

### 2. 页面过渡：View Transitions API + 降级方案

**选择**: 使用浏览器原生 View Transitions API，不支持的浏览器静默降级

**理由**:
- 原生 API 性能最优，由浏览器优化
- SvelteKit 内置 `onNavigate` 钩子支持
- 无需额外依赖，符合项目简洁原则

**备选方案**:
- Svelte transitions (in/out)：无法跨页面，只能组件级
- FLIP 动画库：增加依赖，手动管理复杂
- CSS-only 方案：无法实现真正的跨页面过渡

**实现**:
```svelte
// +layout.svelte
import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
```

### 3. 加载状态：SvelteKit 导航事件 + 骨架屏

**选择**: 使用 `navigating` store 显示加载状态，配合骨架屏组件

**理由**:
- `navigating` store 是 SvelteKit 内置方案
- 骨架屏比 spinner 提供更好的感知性能
- 可复用于各页面的不同数据区域

**备选方案**:
- NProgress 进度条：额外依赖，视觉效果单一
- 全屏 loading：阻断用户操作，体验差
- 无加载状态：用户无法感知系统响应

**实现**:
- 顶部细进度条（导航中显示）
- 内容区骨架屏组件（各页面按需使用）

### 4. 文件组织

```
src/lib/components/ui/
├── mobile-nav/
│   ├── mobile-nav.svelte      # 底部标签栏主组件
│   └── index.ts
├── page-transition/
│   ├── transition-provider.svelte  # 过渡动画容器
│   └── index.ts
├── skeleton/
│   ├── skeleton.svelte        # 基础骨架元素
│   ├── skeleton-card.svelte   # 卡片骨架
│   ├── skeleton-list.svelte   # 列表骨架
│   └── index.ts
└── loading-bar/
    ├── loading-bar.svelte     # 顶部进度条
    └── index.ts
```

## Risks / Trade-offs

**[View Transitions 兼容性]** → Safari 支持有限（2024 年开始支持），旧版浏览器无过渡效果但功能正常

**[底部导航遮挡内容]** → 页面底部添加 padding，确保内容不被遮挡

**[导航项数量限制]** → 底部导航限制 5 个图标，当前 7 个模块需要整合或使用"更多"菜单

**[SSR 与客户端状态]** → 保持 SSR 不变，View Transitions 仅在客户端水合后生效
