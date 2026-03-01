## 1. 后端：图片上传 API

- [x] 1.1 创建 `static/uploads/` 目录并添加到 `.gitignore`
- [x] 1.2 创建 `src/routes/api/upload/image/+server.ts` 上传 endpoint
- [x] 1.3 实现文件类型验证（只允许 JPEG、PNG、GIF、WebP）
- [x] 1.4 实现文件大小限制（最大 5MB）
- [x] 1.5 实现 UUID 文件命名和保存逻辑

## 2. 前端：ImageUploader 组件

- [x] 2.1 创建 `src/lib/components/ui/image-uploader/image-uploader.svelte` 组件
- [x] 2.2 实现点击选择文件功能
- [x] 2.3 实现拖拽上传功能
- [x] 2.4 实现上传状态和进度显示
- [x] 2.5 实现图片预览显示
- [x] 2.6 实现删除图片功能
- [x] 2.7 创建 `src/lib/components/ui/image-uploader/index.ts` 导出文件

## 3. 集成：材料管理页面

- [x] 3.1 在 `src/routes/erp/materials/+page.svelte` 中导入 ImageUploader 组件
- [x] 3.2 替换新增材料表单的图片 URL 输入框为 ImageUploader
- [x] 3.3 替换编辑材料表单的图片 URL 输入框为 ImageUploader
- [x] 3.4 确保图片 URL 正确提交到表单
