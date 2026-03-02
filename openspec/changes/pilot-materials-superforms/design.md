## Context

`src/routes/erp/materials/+page.svelte` 当前同时包含两类交互：
- 顶部单条“新增原料”表单
- 列表中按行渲染的“更新原料”表单

服务端在 `src/routes/erp/materials/+page.server.ts` 通过手写 `request.formData()` + `getText()` 解析字段，并统一通过 `toErpActionFailure` 返回 message。该模式可用，但存在以下约束：
- 缺少字段级校验输出，用户主要依赖全局错误提示
- 字段解析逻辑在页面间重复
- 与 `(app)` 区域已采用的 `superforms + zod` 方案不一致

本次改造仅作为 ERP 页面试点，目标是验证迁移模式，不扩散到其他路由。

## Goals / Non-Goals

**Goals:**
- 为 `materials` 的 create/update action 建立统一 schema 校验入口（`superforms + zod`）。
- 在提交失败时提供字段级错误，并保留用户本次输入。
- 保持现有 UI 结构（新增区 + 列表行编辑）、现有领域服务与 DB 逻辑不变。
- 保留现有业务错误语义（如重复键、领域校验异常）的用户提示。

**Non-Goals:**
- 不改造 `products/purchases/sales/production` 页面。
- 不修改 `item-master` 领域服务接口或数据库 schema。
- 不引入新的 API 端点或新的状态管理框架。
- 不重构 `ImageUploader` 组件协议。

## Decisions

- Decision: 在应用层新增材料表单 schema，并通过 `superValidate(..., zod(schema))` 作为 create/update 的唯一输入入口。
  - Rationale: 将类型转换、必填校验、字符串规范化集中管理，减少重复 `FormData` 解析代码。
  - Alternative considered: 保持当前手写解析 + 在 action 内追加零散校验。
  - Why not alternative: 校验规则分散，后续复用和测试成本高。

- Decision: 对“新增表单”和“更新表单”分别定义 form 上下文，更新场景采用“目标行错误映射”。
  - Rationale: 页面存在多条更新表单；一次提交只影响一行，需要把错误和回填值绑定到触发提交的那一行。
  - Alternative considered: 将所有行改造成单一可编辑表单或弹窗编辑。
  - Why not alternative: 会扩大交互重构范围，不符合最小试点目标。

- Decision: 领域异常与数据库异常继续复用 `toErpActionFailure` 的错误语义，但在可归因字段场景优先走 schema 错误。
  - Rationale: 保持现有业务提示兼容，避免一次改动重写异常映射策略。
  - Alternative considered: 全量切到 `superforms` message/error 体系，移除 `toErpActionFailure`。
  - Why not alternative: 影响面过大，且不利于与现有 ERP 页面保持一致。

- Decision: 试点阶段不调整页面视觉布局，只补充必要的字段错误渲染位。
  - Rationale: 本变更验证的是“表单引擎与验证链路”，不是视觉重构。
  - Alternative considered: 同步优化页面信息架构与样式。
  - Why not alternative: 混入 UI 改版会稀释试点结论。

## Risks / Trade-offs

- [Risk] 多行更新表单的错误映射实现复杂，可能出现错误显示到错误行。 -> Mitigation: 在 action 返回中携带提交行标识，并在页面按标识精确渲染错误与回填值。
- [Risk] `checkbox`、可选图片字段等在 schema 解析中易出现空值/布尔值歧义。 -> Mitigation: 在 schema 中显式定义默认值与转换规则，并增加针对性测试。
- [Trade-off] 保留当前页面结构会带来部分模板条件分支。 -> Mitigation: 仅在目标行渲染错误，避免全页状态耦合。

## Migration Plan

1. 新增材料 create/update 的 zod schema（包含字符串清洗、必填规则、布尔字段处理）。
2. 改造 `+page.server.ts`：
   - `load` 返回 create/update 初始表单数据。
   - `actions.create` 与 `actions.update` 使用 `superValidate` 处理输入并返回可消费的表单状态。
3. 改造 `+page.svelte`：
   - 新增表单接入 `superForm` store 与字段错误渲染。
   - 更新表单增加目标行错误显示与提交值回填。
4. 执行类型检查与相关测试，确保成功/失败路径都可用。
5. 记录试点结论（收益、复杂度、可复制点）供后续页面迁移参考。

Rollback strategy:
- 仅涉及 `materials` 路由与新增 schema 文件；如需回滚，可恢复到原有 `FormData` 解析实现，不影响 DB 和领域逻辑。

## Open Questions

- 更新失败时是否只在目标行显示字段错误，还是同时保留顶部全局提示（当前提案默认同时保留）。
- 试点验收是否需要补充自动化 E2E（当前至少要求 `check` + 关键 action 测试）。
