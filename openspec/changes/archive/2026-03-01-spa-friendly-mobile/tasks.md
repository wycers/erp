## 1. 基础组件搭建

- [x] 1.1 创建 `$lib/components/ui/loading-bar/loading-bar.svelte` 顶部进度条组件
- [x] 1.2 创建 `$lib/components/ui/loading-bar/index.ts` 导出文件
- [x] 1.3 创建 `$lib/components/ui/skeleton/skeleton.svelte` 基础骨架组件
- [x] 1.4 创建 `$lib/components/ui/skeleton/skeleton-card.svelte` 卡片骨架组件
- [x] 1.5 创建 `$lib/components/ui/skeleton/skeleton-list.svelte` 列表骨架组件
- [x] 1.6 创建 `$lib/components/ui/skeleton/index.ts` 导出文件

## 2. 页面过渡动画

- [x] 2.1 在根布局添加 View Transitions API 集成代码 (onNavigate 钩子)
- [x] 2.2 添加页面过渡的 CSS 动画样式 (slide-in/slide-out)
- [x] 2.3 实现 prefers-reduced-motion 媒体查询支持
- [x] 2.4 测试浏览器兼容性降级方案

## 3. 加载状态集成

- [x] 3.1 在根布局集成 LoadingBar 组件，绑定 $navigating store
- [x] 3.2 添加加载条最小显示时间逻辑 (200ms)
- [x] 3.3 在材料页面添加骨架屏示例用法

## 4. 移动端导航组件

- [x] 4.1 创建 `$lib/components/ui/mobile-nav/mobile-nav.svelte` 底部导航栏组件
- [x] 4.2 创建 `$lib/components/ui/mobile-nav/more-menu.svelte` "更多"弹出菜单组件
- [x] 4.3 创建 `$lib/components/ui/mobile-nav/index.ts` 导出文件
- [x] 4.4 实现导航项高亮逻辑 (基于 $page.url.pathname)
- [x] 4.5 添加 iOS 安全区域适配 (env(safe-area-inset-bottom))

## 5. 布局集成

- [x] 5.1 修改 `src/routes/erp/+layout.svelte` 集成移动端导航和加载状态
- [x] 5.2 添加响应式 CSS：移动端隐藏顶部导航，显示底部导航
- [x] 5.3 添加页面底部 padding 避免内容被底部导航遮挡
- [x] 5.4 修改 `src/routes/(app)/+layout.svelte` 应用相同的移动端优化

## 6. 验收测试

- [x] 6.1 在移动端模拟器中测试底部导航功能
- [x] 6.2 测试页面切换过渡动画效果
- [x] 6.3 测试加载进度条显示和消失
- [x] 6.4 测试"更多"菜单展开和收起
- [x] 6.5 在真实移动设备上测试整体体验
