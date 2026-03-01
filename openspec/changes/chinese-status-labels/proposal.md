## Why

用户在界面上看到的状态标签都是英文（如 DRAFT、POSTED、Pending 等），中文用户难以理解。需要将所有状态标签翻译为中文，提升用户体验。

## What Changes

- 将 ERP 模块（采购、销售、生产）的状态标签从英文（DRAFT、POSTED）映射为中文
- 将订单模块的状态标签从英文（Draft、Pending、Confirmed 等）翻译为中文
- 创建统一的状态标签映射工具，避免重复定义

## Capabilities

### New Capabilities

- `status-label-i18n`: 提供状态值到中文显示文本的映射，支持 ERP 模块和订单模块的所有状态类型

### Modified Capabilities

## Impact

- 受影响文件：
  - `src/routes/erp/sales/+page.svelte`
  - `src/routes/erp/purchases/+page.svelte`
  - `src/routes/erp/production/+page.svelte`
  - `src/routes/(app)/orders/+page.svelte`
  - `src/routes/(app)/orders/[id]/+page.svelte`
- 需要新建状态标签映射文件
