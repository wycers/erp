## Context

当前采购页面 (`src/routes/erp/purchases/+page.svelte`) 使用 `Textarea` 组件让用户输入逗号分隔的明细行文本。后端通过 `parsePurchaseLinesInput` 函数解析文本，提取 `materialSkuId`、`quantity`、`lineAmount` 三个字段。

现有 UI 组件库中没有 Combobox/Select/Autocomplete 组件，需要新增。

原料数据已在页面加载时通过 `data.materials` 传入前端。

## Goals / Non-Goals

**Goals:**
- 将明细行输入从文本改为结构化表单行
- 原料选择支持搜索/联想（按编码、名称过滤）
- 支持动态添加/删除明细行
- 保持后端 action 接口不变（继续使用相同的数据结构）
- 输入时显示实时单价预览（金额 ÷ 数量）

**Non-Goals:**
- 不修改后端业务逻辑或数据库结构
- 不添加服务端搜索 API（原料数量有限，前端过滤即可）
- 不重构其他页面（sales、production），本次仅针对 purchases

## Decisions

- Decision: 使用 bits-ui 的 Combobox 组件作为原料选择器
  - Rationale: 项目已依赖 bits-ui，其 Combobox 支持键盘导航和可访问性
  - Alternative considered: 使用原生 `<select>` 元素
  - Why not alternative: 无法支持搜索过滤，体验差

- Decision: 前端过滤原料列表，不新增服务端 API
  - Rationale: ERP 场景下原料 SKU 数量通常在几百以内，前端过滤性能足够
  - Alternative considered: 新增 `/api/materials/search` 接口做服务端模糊搜索
  - Why not alternative: 增加复杂度，当前场景不需要

- Decision: 表单提交时将结构化数据序列化为现有文本格式
  - Rationale: 保持后端 `parsePurchaseLinesInput` 不变，降低改动范围
  - Alternative considered: 修改后端接收 JSON 数组
  - Why not alternative: 改动范围更大，需要修改 action 和 line-parser

- Decision: 新增 `src/lib/components/ui/combobox` 组件封装
  - Rationale: 统一 UI 风格，未来其他页面可复用
  - Alternative considered: 直接在页面中使用 bits-ui 原始组件
  - Why not alternative: 重复样式代码，不符合项目 UI 规范

- Decision: 使用 Svelte 5 响应式状态管理明细行数组
  - Rationale: 利用 `$state` 和 `$derived` 实现动态行管理和单价计算
  - Alternative considered: 使用 store 或 class 封装
  - Why not alternative: 页面级状态用 `$state` 更简洁直接

## Risks / Trade-offs

- [Risk] bits-ui Combobox API 可能与预期不符 -> Mitigation: 先阅读 bits-ui 文档和 Svelte MCP 获取最新用法
- [Risk] 表单序列化到文本格式可能有精度问题 -> Mitigation: 使用固定小数位格式化数值
- [Risk] 多行输入时 DOM 性能（如 50+ 行）-> Mitigation: 暂时不优化，ERP 场景单次录入行数通常有限

## Migration Plan

1. 新增 `src/lib/components/ui/combobox` 组件（基于 bits-ui）
2. 在 purchases 页面创建 `PurchaseLineInput` 组件
   - 管理明细行数组状态
   - 每行包含：Combobox（原料）、Input（数量）、Input（金额）、删除按钮
   - 支持添加行按钮
3. 替换原有 `Textarea` 为 `PurchaseLineInput`
4. 表单提交前将结构化数据序列化为逗号分隔文本
5. 测试创建采购单流程

Rollback strategy:
- 保留原有 `Textarea` 输入方式的代码（注释），如需回滚可快速恢复
- 后端无改动，回滚仅涉及前端

## Open Questions

- 是否需要在明细行中显示原料的当前库存数量作为参考？
- 金额字段是否改为自动计算（单价 × 数量），还是继续由用户手动输入？
