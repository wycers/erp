## Why

当前系统的原料（material_sku）和成品（finished_product）缺少单位字段。用户无法区分物品的计量单位（如"米"、"个"、"件"、"箱"等），导致在采购、生产、销售等环节可能产生计量混淆。添加单位字段可以提高数据的完整性和业务准确性。

## What Changes

- 为 `material_sku` 表添加 `unit` 字段（可选，文本类型）
- 为 `finished_product` 表添加 `unit` 字段（可选，文本类型）
- 更新原料管理页面，增加单位输入框
- 更新成品管理页面，增加单位输入框
- 更新相关后端服务函数以支持单位字段的创建和更新
- 在库存列表和相关展示页面显示单位信息

## Capabilities

### New Capabilities
- `item-unit-field`: 为原料和成品添加单位字段，支持用户输入自定义计量单位

### Modified Capabilities
（无需修改现有规格）

## Impact

- **数据库**: 需要迁移脚本为 `material_sku` 和 `finished_product` 表添加 `unit` 列
- **后端服务**: `item-master.ts` 中的 `createMaterial`、`updateMaterial`、`createProduct`、`updateProduct` 函数需要支持 unit 参数
- **前端页面**: 
  - `src/routes/erp/materials/+page.svelte` - 添加单位输入
  - `src/routes/erp/products/+page.svelte` - 添加单位输入
  - `src/routes/erp/inventory/+page.svelte` - 显示单位
- **API**: 表单提交需要处理新的 unit 字段
