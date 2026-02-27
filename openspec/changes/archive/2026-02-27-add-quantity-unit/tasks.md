## 1. 数据库迁移

- [x] 1.1 修改 erp.schema.ts，将 materialSku.unit 和 finishedProduct.unit 添加 .notNull()
- [x] 1.2 生成迁移文件：填充空 unit 为默认值"-"，然后添加 NOT NULL 约束
- [x] 1.3 执行迁移并验证

## 2. 类型定义更新

- [x] 2.1 在 BomLineInput.svelte 的 Material 类型中添加必填的 `unit: string` 字段
- [x] 2.2 在 SalesLineInput.svelte 的 Product 类型中添加必填的 `unit: string` 字段
- [x] 2.3 在 PurchaseLineInput.svelte 的 Material 类型中添加必填的 `unit: string` 字段

## 3. UI 显示更新

- [x] 3.1 在 BomLineInput.svelte 的用量输入框右侧添加单位显示，根据所选原料动态显示
- [x] 3.2 在 SalesLineInput.svelte 的数量输入框右侧添加单位显示，根据所选成品动态显示
- [x] 3.3 在 PurchaseLineInput.svelte 的数量输入框右侧添加单位显示，根据所选原料动态显示

## 4. 数据传入更新

- [x] 4.1 更新 BomLineInput 的父组件，确保传入的 materials 数据包含 unit 字段
- [x] 4.2 更新 SalesLineInput 的父组件，确保传入的 products 数据包含 unit 字段
- [x] 4.3 更新 PurchaseLineInput 的父组件，确保传入的 materials 数据包含 unit 字段
