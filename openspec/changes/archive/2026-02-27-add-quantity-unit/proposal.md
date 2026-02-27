## Why

当前系统中，BOM配方、销售单、采购单等行项输入组件只显示数字（如"2.5"），用户无法直观看到计量单位（如"2.5 米"）。这导致用户在录入和查看时容易产生混淆，需要额外记忆每种物料的单位。同时，数据库中 unit 字段当前是可选的，应改为必填以确保数据完整性。

## What Changes

- **BREAKING**: 数据库 `material_sku.unit` 和 `finished_product.unit` 字段改为 NOT NULL
- BomLineInput 组件在"用量"输入框旁显示所选原料的单位
- SalesLineInput 组件在"数量"输入框旁显示所选成品的单位
- PurchaseLineInput 组件在"数量"输入框旁显示所选原料的单位
- Material 和 Product 类型定义中 unit 为必填字段
- 数据传入时必须携带 unit 信息

## Capabilities

### New Capabilities
- `quantity-unit-display`: 在数量/用量输入框旁动态显示所选物品的计量单位

### Modified Capabilities
- `item-unit-field`: unit 字段从可选改为必填

## Impact

- `src/lib/server/db/erp.schema.ts` - unit 字段添加 .notNull()
- 需要数据库迁移，现有数据的空 unit 需填充默认值
- `src/routes/erp/products/BomLineInput.svelte` - 需要修改类型定义和 UI
- `src/routes/erp/sales/SalesLineInput.svelte` - 需要修改类型定义和 UI
- `src/routes/erp/purchases/PurchaseLineInput.svelte` - 需要修改类型定义和 UI
- 调用这些组件的父组件需要传入带 unit 字段的数据
