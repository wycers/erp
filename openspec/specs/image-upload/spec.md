# Image Upload

图片上传功能，支持图片文件上传、预览和管理。

## Requirements

### Requirement: 图片上传 API

系统 SHALL 提供 `/api/upload/image` POST endpoint，接受图片文件上传并返回图片 URL。

#### Scenario: 成功上传图片
- **WHEN** 用户上传有效的图片文件（JPEG、PNG、GIF、WebP）
- **THEN** 系统保存文件并返回 JSON `{ "url": "/uploads/{uuid}.{ext}" }`

#### Scenario: 拒绝非图片文件
- **WHEN** 用户上传非图片文件（如 .exe、.pdf）
- **THEN** 系统返回 400 错误和错误信息

#### Scenario: 拒绝超大文件
- **WHEN** 用户上传超过 5MB 的文件
- **THEN** 系统返回 400 错误和错误信息

### Requirement: 图片上传组件

系统 SHALL 提供 `ImageUploader` Svelte 组件，支持选择和上传图片。

#### Scenario: 点击选择图片
- **WHEN** 用户点击上传区域
- **THEN** 系统打开文件选择器，只显示图片类型文件

#### Scenario: 拖拽上传图片
- **WHEN** 用户将图片文件拖拽到上传区域
- **THEN** 系统接受文件并开始上传

#### Scenario: 显示上传进度
- **WHEN** 图片上传中
- **THEN** 组件显示加载状态指示器

#### Scenario: 上传成功后预览
- **WHEN** 图片上传成功
- **THEN** 组件显示图片缩略图预览

### Requirement: 图片预览与删除

系统 SHALL 支持在 `ImageUploader` 组件中预览和删除已上传的图片。

#### Scenario: 显示已有图片
- **WHEN** 组件初始化时传入已有的图片 URL
- **THEN** 组件显示该图片的缩略图预览

#### Scenario: 删除图片
- **WHEN** 用户点击删除按钮
- **THEN** 组件清除图片 URL 并显示空的上传区域

#### Scenario: 替换图片
- **WHEN** 已有图片时用户上传新图片
- **THEN** 新图片替换旧图片，组件显示新图片预览

### Requirement: 材料表单集成

材料管理页面 SHALL 使用 `ImageUploader` 组件替代原有的图片 URL 文本输入框。

#### Scenario: 新增材料时上传图片
- **WHEN** 用户在新增材料表单中上传图片
- **THEN** 图片 URL 随表单一起提交保存

#### Scenario: 编辑材料时修改图片
- **WHEN** 用户编辑已有材料并更换图片
- **THEN** 新图片 URL 更新到材料记录

#### Scenario: 查看已有材料图片
- **WHEN** 打开已有图片的材料编辑表单
- **THEN** 显示当前图片的缩略图预览
