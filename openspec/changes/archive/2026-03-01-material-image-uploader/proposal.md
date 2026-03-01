## Why

目前材料管理页面使用文本输入框让用户手动输入图片 URL，这种方式用户体验差且容易出错。用户需要自行上传图片到外部服务并复制链接，操作繁琐。需要提供直接的图片上传和预览功能，简化工作流程。

## What Changes

- 将材料页面的"图片 URL"文本输入框替换为图片上传组件
- 新增图片预览功能，支持查看已上传的图片
- 实现服务端图片上传 API，处理文件存储
- 支持图片删除和替换操作
- 保持向后兼容：已有的 imageUrl 数据继续有效

## Capabilities

### New Capabilities

- `image-upload`: 图片上传、预览和管理功能，包括前端组件和后端 API

### Modified Capabilities

（无需修改现有 spec）

## Impact

- **前端**: `src/routes/erp/materials/+page.svelte` - 替换图片 URL 输入为上传组件
- **后端**: 新增图片上传 API endpoint
- **存储**: 需要确定图片存储方案（本地文件系统或对象存储）
- **数据库**: `imageUrl` 字段保持不变，存储上传后的图片路径
- **依赖**: 可能需要添加文件上传处理库
