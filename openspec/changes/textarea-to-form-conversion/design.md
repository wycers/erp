## Context

当前 ERP 系统有两个页面使用 `Textarea` 输入结构化明细数据：

1. **销售页面** (`src/routes/erp/sales/+page.svelte`)
   - 输入格式：`productId,quantity,sellingUnitPrice`（每行一条）
   - 数据来源：`data.products` 列表

2. **成品页面** (`src/routes/erp/products/+page.svelte`)
   - 输入格式：`materialSkuId,quantityPerUnit`（每行一条）
   - 数据来源：`data.materials` 列表

采购页面已有 `PurchaseLineInput.svelte` 组件作为参考实现，使用了：
- `$lib/components/ui/combobox` - 带搜索的下拉选择器
- `$state` 和 `$derived` - Svelte 5 响应式状态管理
- hidden input + 序列化值 - 与后端现有文本解析兼容

## Goals / Non-Goals

**Goals:**
- 将销售明细和 BOM 配方输入从文本改为结构化表单行
- 选择器支持搜索/联想（按编码、名称过滤）
- 支持动态添加/删除明细行
- 保持后端 action 接口不变（继续使用相同的文本格式）
- 销售明细显示实时收入预览（数量 × 售价）

**Non-Goals:**
- 不修改后端业务逻辑或数据库结构
- 不重构生产页面（已使用 `<select>`）
- 不重构采购页面（有独立变更处理）
- 不改动备注字段（自由文本保留 Textarea）

## Decisions

- Decision: 复用 `PurchaseLineInput` 的设计模式创建新组件
  - Rationale: 保持 UI/UX 一致性，减少重复代码
  - Alternative considered: 创建通用 LineInput 组件
  - Why not alternative: 各页面字段差异较大，通用化会增加复杂度

- Decision: 组件放置在各自路由目录下而非 lib
  - Rationale: 这些组件仅供单一页面使用，不需要共享
  - Alternative considered: 放在 `$lib/components/`
  - Why not alternative: 业务组件与页面耦合紧密，放 lib 过度抽象

- Decision: 表单提交时将结构化数据序列化为现有文本格式
  - Rationale: 保持后端解析逻辑不变，降低改动范围
  - Alternative considered: 修改后端接收 JSON 数组
  - Why not alternative: 改动范围更大，需要修改 action 和 line-parser

- Decision: 使用 Svelte 5 `$state` 管理明细行数组
  - Rationale: 利用响应式特性实现动态行管理和计算预览
  - Alternative considered: 使用 store
  - Why not alternative: 页面级状态用 `$state` 更简洁直接

## Risks / Trade-offs

- [Risk] 成品/原料数量增长后前端过滤性能下降 -> Mitigation: 当前规模下可接受，未来可改服务端搜索
- [Risk] 多行输入时 DOM 性能（如 50+ 行）-> Mitigation: ERP 场景单次录入行数通常有限
- [Trade-off] 组件代码有一定重复 vs 通用化复杂度 -> 选择简单实现，未来可重构

## Migration Plan

1. 创建 `SalesLineInput.svelte` 组件
   - 管理明细行数组状态
   - 每行：Combobox（成品）、Input（数量）、Input（售价）、删除按钮
   - 显示收入预览（数量 × 售价）
   - 支持添加行按钮

2. 创建 `BomLineInput.svelte` 组件
   - 管理配方行数组状态
   - 每行：Combobox（原料）、Input（用量）、删除按钮
   - 支持添加行按钮
   - 支持初始值回显（编辑现有 BOM）

3. 在 `sales/+page.svelte` 中替换 Textarea
   - 引入 `SalesLineInput` 组件
   - 传递 `data.products`
   - 移除录入格式说明卡片

4. 在 `products/+page.svelte` 中替换 BOM Textarea
   - 引入 `BomLineInput` 组件
   - 传递 `data.materials` 和当前 BOM 数据
   - 移除原料 ID 速查卡片

5. 测试验证各页面功能正常

Rollback strategy:
- 保留原有 `Textarea` 输入方式的代码（注释），如需回滚可快速恢复
- 后端无改动，回滚仅涉及前端

## Open Questions

- 销售明细是否需要显示成品的当前库存数量作为参考？
- BOM 编辑时是否需要警告「原料已在其他成品中使用」？
