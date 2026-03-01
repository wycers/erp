## Why

当前库存表单功能完整但设计感不足，视觉层次较弱，布局简单。表单缺少产品图片展示区域，整体用户体验有提升空间。需要重新设计表单，增强视觉吸引力并改善用户操作流程。

## What Changes

- 重新设计库存产品表单布局，采用更现代的卡片式设计
- 添加正方形产品图片上传/展示区域，集成现有的 `ImageUploader` 组件
- 优化表单字段分组，建立清晰的视觉层次结构
- 改进表单交互状态（聚焦、验证错误、加载中）的视觉反馈
- 统一新建和编辑表单的设计语言

## Capabilities

### New Capabilities

- `inventory-form-layout`: 库存表单的新布局设计，包含正方形图片区域、字段分组和视觉层次结构

### Modified Capabilities

- `image-upload`: 需要支持正方形裁剪预览模式，以适配产品图片展示需求

## Impact

- `src/routes/(app)/inventory/new/+page.svelte` - 新建产品表单页面
- `src/routes/(app)/inventory/[id]/+page.svelte` - 产品详情/编辑页面
- `src/lib/components/ui/` - 可能需要新增表单相关的 UI 组件
- `$lib/application/inventory/schemas` - 需要在 schema 中添加 imageUrl 字段
