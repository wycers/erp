## 1. 数据库 Schema 变更

- [x] 1.1 在 `erp.schema.ts` 的 `materialSku` 表中添加 `unit` 字段（text 类型，可空）
- [x] 1.2 在 `erp.schema.ts` 的 `finishedProduct` 表中添加 `unit` 字段（text 类型，可空）
- [x] 1.3 生成并运行数据库迁移脚本

## 2. 后端服务更新

- [x] 2.1 更新 `item-master.ts` 中 `createMaterial` 函数，添加 `unit` 参数支持
- [x] 2.2 更新 `item-master.ts` 中 `updateMaterial` 函数，添加 `unit` 参数支持
- [x] 2.3 更新 `item-master.ts` 中 `createProduct` 函数，添加 `unit` 参数支持
- [x] 2.4 更新 `item-master.ts` 中 `updateProduct` 函数，添加 `unit` 参数支持

## 3. 前端页面 - 原料管理

- [x] 3.1 更新 `materials/+page.server.ts`，处理表单中的 `unit` 字段
- [x] 3.2 更新 `materials/+page.svelte`，在创建表单中添加单位输入框
- [x] 3.3 更新 `materials/+page.svelte`，在编辑表单中添加单位输入框并显示现有值

## 4. 前端页面 - 成品管理

- [x] 4.1 更新 `products/+page.server.ts`，处理表单中的 `unit` 字段
- [x] 4.2 更新 `products/+page.svelte`，在创建表单中添加单位输入框
- [x] 4.3 更新 `products/+page.svelte`，在编辑表单中添加单位输入框并显示现有值

## 5. 库存页面显示

- [x] 5.1 更新 `inventory/+page.svelte`，在库存列表中显示单位信息
- [x] 5.2 更新库存详情页面显示单位信息（如适用）
