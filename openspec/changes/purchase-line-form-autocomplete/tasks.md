## 1. UI 组件准备

- [x] 1.1 确认 bits-ui 的 Combobox API 用法（通过 Svelte MCP 获取文档）
- [x] 1.2 创建 `src/lib/components/ui/combobox` 组件封装，包含搜索输入、下拉列表、选项样式
- [x] 1.3 导出 Combobox 组件并添加 TypeScript 类型定义

## 2. 明细行组件开发

- [x] 2.1 在 `src/routes/erp/purchases` 下创建 `PurchaseLineInput.svelte` 组件
- [x] 2.2 实现明细行状态管理：使用 `$state` 管理行数组，每行包含 `materialSkuId`、`quantity`、`lineAmount`
- [x] 2.3 实现原料 Combobox：显示 `#{id} - {code} - {name}`，支持按编码/名称搜索过滤
- [x] 2.4 实现数量和金额 Input，添加数值校验
- [x] 2.5 实现单价预览：使用 `$derived` 计算 `lineAmount / quantity`
- [x] 2.6 实现添加行按钮和删除行按钮

## 3. 页面集成

- [x] 3.1 在 `+page.svelte` 中引入 `PurchaseLineInput` 组件替换 `Textarea`
- [x] 3.2 实现表单提交时的序列化：将结构化数据转为逗号分隔文本格式
- [x] 3.3 传递 `data.materials` 到组件供 Combobox 使用
- [x] 3.4 移除或简化录入格式说明卡片（不再需要手动格式说明）

## 4. 测试验证

- [x] 4.1 运行 `npm run check` 确保无类型错误
- [ ] 4.2 手动测试：选择原料、输入数量金额、添加多行、删除行
- [ ] 4.3 手动测试：提交表单创建采购草稿，验证数据正确入库
- [ ] 4.4 测试 Combobox 键盘导航和无障碍支持

验证说明：
- `npm run check` 在新增代码部分无类型错误
- 预存在的错误（`src/routes/(app)/**` 的 Zod/superforms 类型问题）与本次改动无关
