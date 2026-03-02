## Why

`/erp/materials` 目前仍采用手写 `request.formData()` 解析与统一字符串报错，字段级校验反馈和表单状态回填能力较弱，同时与已在 `(app)` 区域使用的 `superforms + zod` 模式不一致。需要先在一个高频但风险可控的页面做最小试点，验证该模式在 ERP 页面的收益与改造成本。

## What Changes

- 将 `src/routes/erp/materials` 的 `create` 与 `update` 表单流程改为 `superforms + zod`。
- 为材料新增/编辑引入显式 schema（必填项、字符串清洗、布尔字段解析等），统一服务端解析逻辑。
- 在页面上提供字段级错误展示，并在提交失败后保留用户输入。
- 保持现有页面布局、图片上传流程、领域服务与数据库结构不变。
- 以该页面作为迁移样板，为后续 `products/purchases/sales/production` 是否扩展提供决策依据。

## Capabilities

### New Capabilities
- `materials-form-validation`: `/erp/materials` 页面支持基于 schema 的服务端表单校验、字段级错误反馈和可回填的表单状态。

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `src/routes/erp/materials/+page.server.ts`
  - `src/routes/erp/materials/+page.svelte`
  - `src/lib/application/erp/schemas/`（新增材料表单 schema，目录名以实现时实际结构为准）
  - 可能新增/调整与表单相关的测试文件
- Affected behavior:
  - 材料新增/编辑失败时从全局 message 为主，升级为字段级错误 + 全局错误并存
  - 成功提示与原有业务动作保持一致
- Dependencies/systems:
  - 复用现有依赖：`sveltekit-superforms`、`zod`
  - 不涉及数据库迁移、外部 API 变化
