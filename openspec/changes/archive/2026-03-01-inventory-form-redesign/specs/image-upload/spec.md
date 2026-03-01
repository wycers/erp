# Image Upload

图片上传功能增强，支持正方形裁剪预览模式。

## MODIFIED Requirements

### Requirement: 图片上传组件

系统 SHALL 提供 `ImageUploader` Svelte 组件，支持选择和上传图片，并支持配置图片显示比例。

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

#### Scenario: 正方形比例模式

- **WHEN** 组件配置 `aspectRatio="square"` 属性
- **THEN** 上传区域和预览区域均显示为正方形 (1:1 比例)

#### Scenario: 默认比例模式

- **WHEN** 组件未配置 `aspectRatio` 属性
- **THEN** 组件保持原有的默认比例行为

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

#### Scenario: 正方形模式下的图片裁剪预览

- **WHEN** 组件配置正方形比例且显示已有图片
- **THEN** 图片使用 object-cover 模式填充正方形区域，居中显示
