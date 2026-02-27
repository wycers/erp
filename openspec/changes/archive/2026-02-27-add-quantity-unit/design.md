## Context

当前系统中，BomLineInput、SalesLineInput、PurchaseLineInput 组件接收的物料/成品数据只包含 id、code、name 字段，不包含 unit（单位）字段。用户选择物料后，只能看到数量数字，无法直观了解计量单位。

现有 `item-unit-field` spec 已定义原料和成品需支持 unit 字段，库存页面也已显示单位列。数据库中 `material_sku.unit` 和 `finished_product.unit` 当前是可选字段，需改为必填。

## Goals / Non-Goals

**Goals:**
- 将数据库中 unit 字段改为 NOT NULL，确保数据完整性
- 在选择物料/成品后，在数量输入框旁显示对应的单位
- 保持 UI 简洁，单位显示不影响输入操作

**Non-Goals:**
- 不在此变更中实现单位的创建或编辑
- 不实现单位转换功能

## Decisions

### Decision 1: 数据库迁移策略
先将现有空 unit 数据填充默认值"-"，再添加 NOT NULL 约束。

**理由**: 避免迁移失败，同时"-"作为占位符表示"未指定单位"。

**Alternatives considered**:
- 不填充默认值：迁移会失败
- 使用"个"作为默认值：可能不适用于所有物料

### Decision 2: 单位显示位置
在数量输入框右侧显示单位文本，而非放在输入框内部。

**理由**: 放在输入框内部会干扰数字输入和显示，放在右侧更清晰。

**Alternatives considered**:
- 输入框 suffix：会压缩输入区域，且需要修改 Input 组件
- 单独一列显示：占用过多空间

### Decision 3: 类型定义
在各组件的 Material/Product 类型中 unit 为必填的 `unit: string` 字段。

**理由**: 数据库已是 NOT NULL，类型定义应与数据库一致。

## Risks / Trade-offs

- **[Risk] 现有数据迁移** → 使用默认值"-"填充空数据，确保迁移成功
- **[Risk] 破坏性变更** → 明确在 proposal 中标记 BREAKING，通知相关方
