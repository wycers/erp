## Why

当前ERP系统在移动端使用时体验不佳：页面切换有明显的白屏等待，导航栏需要横向滚动操作不便，缺乏原生App般的流畅感。移动端用户（如仓库操作员）需要频繁在不同模块间切换，当前的体验影响工作效率。

## What Changes

- 添加移动端底部标签栏导航，替代当前的横向滚动导航
- 实现页面切换过渡动画，消除白屏等待感
- 添加全局加载状态指示器和骨架屏
- 优化触摸交互体验（滑动手势、触摸反馈）
- 实现响应式布局切换：桌面端保持侧边栏，移动端使用底部导航

## Capabilities

### New Capabilities
- `mobile-navigation`: 移动端底部标签栏导航组件，支持图标+文字、当前页面高亮、滑动手势切换
- `page-transitions`: 页面切换过渡动画系统，基于 View Transitions API，支持滑入滑出效果
- `loading-states`: 全局加载状态管理，包含顶部进度条、骨架屏组件、加载占位符

### Modified Capabilities

## Impact

- **布局文件**: `src/routes/erp/+layout.svelte`, `src/routes/(app)/+layout.svelte` 需要重构以支持响应式导航切换
- **组件库**: 新增 `$lib/components/ui/mobile-nav/`, `$lib/components/ui/skeleton/`, `$lib/components/ui/page-transition/`
- **全局样式**: 需要添加过渡动画相关的 CSS
- **SvelteKit 配置**: 可能需要调整预渲染和客户端导航设置
- **依赖**: 无新增外部依赖，使用浏览器原生 View Transitions API（带降级方案）
