## Why

ERP 系统中多个页面使用 `Textarea` 组件让用户输入结构化的明细行数据（如销售明细、BOM 配方）。用户需要手动输入逗号分隔的格式，存在以下问题：

1. **易出错**：需要记忆 ID，手动输入格式容易遗漏或写错
2. **无验证**：输入时没有即时反馈，提交后才发现格式错误
3. **体验差**：缺少联想/自动补全，每次都要查看 ID 速查表对照录入
4. **效率低**：无法快速选择项目，也不能动态增删行

目前需要改造的页面：

| 页面 | 当前输入方式 | 数据格式 |
|------|-------------|---------|
| 销售单 (`/erp/sales`) | Textarea | `productId,quantity,sellingUnitPrice` |
| 成品 BOM (`/erp/products`) | Textarea | `materialSkuId,quantityPerUnit` |

注：采购页面已有独立变更 `purchase-line-form-autocomplete` 处理；备注字段为自由文本，保留 Textarea。

## What Changes

- 将销售明细行输入从 `Textarea` 改为结构化的表单行组件
- 将成品 BOM 配方输入从 `Textarea` 改为结构化的表单行组件
- 每行包含：下拉选择器（带搜索/联想）、数量输入、其他必要字段
- 支持动态添加/删除明细行
- 复用已有的 `Combobox` 组件和 `PurchaseLineInput` 设计模式

## Capabilities

### New Capabilities
- `sales-line-form`: 结构化的销售明细行表单输入，支持成品联想和动态行管理
- `bom-line-form`: 结构化的 BOM 配方表单输入，支持原料联想和动态行管理

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `src/routes/erp/sales/+page.svelte`：重构明细行输入区域
  - `src/routes/erp/products/+page.svelte`：重构 BOM 配方输入区域
  - 新增 `SalesLineInput.svelte` 和 `BomLineInput.svelte` 组件
- Affected behavior:
  - 销售单创建和成品 BOM 编辑的用户交互方式改变
  - 表单提交的数据格式保持与后端兼容（序列化为现有文本格式）
- Dependencies/systems:
  - 复用现有 `Combobox` 组件
  - 后端无需改动，继续使用现有的文本解析逻辑
