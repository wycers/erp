## 1. 销售明细行组件开发

- [x] 1.1 在 `src/routes/erp/sales/` 下创建 `SalesLineInput.svelte` 组件
- [x] 1.2 实现明细行状态管理：使用 `$state` 管理行数组，每行包含 `productId`、`quantity`、`sellingUnitPrice`
- [x] 1.3 实现成品 Combobox：显示 `#${id} - ${code} - ${name}`，支持按编码/名称搜索过滤
- [x] 1.4 实现数量和售价 Input，添加数值校验
- [x] 1.5 实现收入预览：使用 `$derived` 计算 `quantity × sellingUnitPrice`
- [x] 1.6 实现添加行按钮和删除行按钮
- [x] 1.7 实现 hidden input 序列化输出（格式：`productId,quantity,sellingUnitPrice`）

## 2. 销售页面集成

- [x] 2.1 在 `sales/+page.svelte` 中引入 `SalesLineInput` 组件替换 `Textarea`
- [x] 2.2 传递 `data.products` 到组件供 Combobox 使用
- [x] 2.3 移除录入格式说明卡片（不再需要手动格式说明）

## 3. BOM 配方行组件开发

- [x] 3.1 在 `src/routes/erp/products/` 下创建 `BomLineInput.svelte` 组件
- [x] 3.2 实现配方行状态管理：使用 `$state` 管理行数组，每行包含 `materialSkuId`、`quantityPerUnit`
- [x] 3.3 实现原料 Combobox：显示 `#${id} - ${code} - ${name}`，支持按编码/名称搜索过滤
- [x] 3.4 实现用量 Input，添加数值校验
- [x] 3.5 实现添加行按钮和删除行按钮
- [x] 3.6 实现 hidden input 序列化输出（格式：`materialSkuId,quantityPerUnit`）
- [x] 3.7 支持初始值回显：接收 `initialLines` prop 用于编辑现有 BOM

## 4. 成品页面集成

- [x] 4.1 在 `products/+page.svelte` 中引入 `BomLineInput` 组件替换 BOM Textarea
- [x] 4.2 传递 `data.materials` 到组件供 Combobox 使用
- [x] 4.3 传递 `product.bomLines` 作为初始值用于编辑
- [x] 4.4 移除原料 ID 速查卡片（不再需要手动 ID 查找）

## 5. 测试验证

- [x] 5.1 运行 `npm run check` 确保无类型错误
- [x] 5.2 手动测试销售页面：选择成品、输入数量售价、添加多行、删除行、提交创建
- [x] 5.3 手动测试成品页面：编辑 BOM、新增原料行、删除行、保存配方
- [x] 5.4 测试 Combobox 键盘导航和搜索过滤功能

验证说明：
- 确保表单序列化后的数据格式与后端解析逻辑兼容
- 验证现有功能（如过账）不受影响
