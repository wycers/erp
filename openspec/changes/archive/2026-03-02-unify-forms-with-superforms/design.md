## Context

ERP 路由当前存在两套表单实现：
- 旧实现：`request.formData()` + route 内手工解析
- 新实现：`superforms + zod`（在 `(app)` 区域和 materials 试点中已验证）

这种混合状态使同类表单在校验、错误输出、失败回填和测试方式上不一致，增加了跨页面维护成本。此次改造涉及多个高频业务路由（products/purchases/sales/production），属于跨模块一致性变更，需要先明确统一模式再逐步落地。

## Goals / Non-Goals

**Goals:**
- 建立 ERP 表单统一技术基线：`superValidate + zod adapter + superForm`。
- 统一服务端 action 的失败与成功返回契约，保障字段级错误可渲染、输入可回填。
- 在不改变业务规则和数据库结构前提下，完成目标路由迁移。
- 提供可重复执行的测试与验收清单，防止迁移回归。

**Non-Goals:**
- 不重写领域服务接口，不调整数据库 schema。
- 不做页面视觉重构或交互范式重设计。
- 不一次性覆盖所有历史页面（优先 ERP 核心流程路由）。
- 不引入新的表单框架或状态管理库。

## Decisions

- Decision: 为每个迁移路由建立显式 zod schema，并由 action 仅通过 `superValidate` 读取输入。
  - Rationale: 将字段约束、类型转换与默认值集中定义，减少分散的 `FormData` 解析代码。
  - Alternative considered: 在现有 action 里保留手工解析，仅增加零散校验。
  - Why not alternative: 难以保证跨页面一致性，且测试面扩大。

- Decision: 统一 action 返回契约为“校验失败返回 `{ form, action }`，业务错误返回 `{ form?, message, action }`，成功返回 `message(form, text)` 或等价成功载荷”。
  - Rationale: 前端可以稳定消费状态并按 `action` 定位反馈区域。
  - Alternative considered: 每个页面保留自定义返回结构。
  - Why not alternative: 组件层无法复用处理逻辑，错误展示行为会持续分裂。

- Decision: 对列表内多实例表单采用“目标项标识 + 局部错误渲染”策略。
  - Rationale: 一次提交只应影响触发项，避免全列表同步污染。
  - Alternative considered: 提交失败后统一显示顶部全局错误而不做字段映射。
  - Why not alternative: 不能满足字段级可纠正体验，且回填困难。

- Decision: 采用分路由渐进迁移（products -> purchases -> sales -> production），每步保持可回滚。
  - Rationale: 降低一次性改动风险，便于在真实业务流中快速验证。
  - Alternative considered: 单次大批量迁移所有 ERP 表单。
  - Why not alternative: 回归定位困难，评审与测试成本过高。

- Decision: 在 `src/lib/application/erp/schemas/` 统一维护可复用表单 schema 与转换工具。
  - Rationale: 避免 route 私有 schema 过度分散，便于共享字段规则（金额、数量、日期、布尔）。
  - Alternative considered: 每个 route 自带独立 schema 文件。
  - Why not alternative: 规则重复和漂移风险更高。

## Risks / Trade-offs

- [Risk] 迁移期间新旧模式并存，短期内心智负担上升。 -> Mitigation: 明确迁移清单与完成定义，完成后禁止新增手工 `FormData` 解析路径。
- [Risk] 多 action 页面（如草稿/过账）在 action 标识绑定上容易错配。 -> Mitigation: 统一 `action` 字段命名规则，并在页面层按 action 精确绑定消息和错误。
- [Risk] 数值/布尔/可选字段在 schema 预处理时可能出现兼容性问题。 -> Mitigation: 为关键字段编写转换测试，覆盖空值、非法值和边界值。
- [Trade-off] 为保证一致性会增加初期样板代码（schema + form wiring）。 -> Mitigation: 提供共享 helper 和示例，降低后续迁移成本。

## Migration Plan

1. 建立统一基础：补充共享 schema 工具与 action 返回约定说明。
2. 分路由迁移：按 `products -> purchases -> sales -> production` 顺序改造 `+page.server.ts` 和 `+page.svelte`。
3. 每路由完成后执行：类型检查、相关 action 测试、关键手工流程验证。
4. 全部路由完成后，新增 guard 规则：ERP 新表单默认采用 Superforms。

Rollback strategy:
- 每个路由迁移独立提交；若出现问题可按路由粒度回退至原 action 实现。
- 因不涉及 DB/API 变更，回退不需要数据修复步骤。

## Open Questions

- 是否将 `(app)` 区域已存在的 Superforms 工具抽象提升为 ERP 与 `(app)` 共用模块？
- 对“业务错误”是否统一映射到 `form.message`，还是继续保留部分页面的顶部 alert 文案？
- 是否需要在 CI 增加静态检查，阻止新提交引入裸 `request.formData()` 解析到 ERP 路由？
