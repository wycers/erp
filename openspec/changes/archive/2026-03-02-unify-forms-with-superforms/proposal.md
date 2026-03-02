## Why

当前 ERP 表单实现同时存在 `request.formData()` 手写解析和 `superforms + zod` 两种模式，导致校验行为、错误反馈形态、回填能力和维护方式不一致。基于 materials 试点经验，现阶段需要把 ERP 主流程表单统一到 Superforms，以降低重复实现成本并减少回归风险。

## What Changes

- 为 ERP 核心表单建立统一的 `superforms + zod` 实现基线（load 初始化、action 校验、失败回填、字段错误展示）。
- 将 `/erp/products`、`/erp/purchases`、`/erp/sales`、`/erp/production` 的创建/更新/过账类表单迁移到统一模式。
- 统一 action 返回约定：校验失败返回 `form`，业务异常保留可读 message，并维持现有成功路径语义。
- 抽取或复用共享 schema/adapter 工具，减少页面内重复 `FormData` 解析逻辑。
- 补充针对迁移页面的测试与验收清单，确保行为与当前业务规则等价。

## Capabilities

### New Capabilities
- `erp-superforms-standardization`: ERP 页面中的核心业务表单必须使用 Superforms 驱动校验、错误反馈和提交状态管理，并遵循统一的服务端返回契约。

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `src/routes/erp/products/+page.server.ts`
  - `src/routes/erp/products/+page.svelte`
  - `src/routes/erp/purchases/+page.server.ts`
  - `src/routes/erp/purchases/+page.svelte`
  - `src/routes/erp/sales/+page.server.ts`
  - `src/routes/erp/sales/+page.svelte`
  - `src/routes/erp/production/+page.server.ts`
  - `src/routes/erp/production/+page.svelte`
  - `src/lib/application/erp/schemas/`（新增或扩展表单 schema）
  - 相关 action 单测与页面交互测试
- Dependencies/systems:
  - 复用现有依赖：`sveltekit-superforms`、`zod`
  - 不涉及数据库 schema 变更，不新增外部 API
