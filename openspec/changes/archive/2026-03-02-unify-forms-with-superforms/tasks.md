## 1. 统一基线与共享能力

- [x] 1.1 盘点 `/erp/products`、`/erp/purchases`、`/erp/sales`、`/erp/production` 的现有 action 与表单字段，输出迁移矩阵（action -> schema -> UI 表单）
- [x] 1.2 在 `src/lib/application/erp/schemas/` 新增或整理共享字段转换工具（数值、布尔、可选文本）
- [x] 1.3 定义并落地统一 action 返回约定（`form`、`action`、message）并在目标路由复用

## 2. Products 路由迁移（先行样板）

- [x] 2.1 为 `products` 路由的 create/update/BOM 相关输入建立 zod schema
- [x] 2.2 改造 `src/routes/erp/products/+page.server.ts`：使用 `superValidate` 替代手工 `FormData` 解析
- [x] 2.3 改造 `src/routes/erp/products/+page.svelte`：接入 `superForm`、字段级错误渲染与失败回填
- [x] 2.4 验证 `products` 成功/失败路径与既有业务语义保持一致

## 3. Purchases/Sales/Production 路由迁移

- [x] 3.1 为 `purchases` 路由（createDraft/post 等 action）建立 schema 并完成 server/client 接入
- [x] 3.2 为 `sales` 路由（createDraft/post 等 action）建立 schema 并完成 server/client 接入
- [x] 3.3 为 `production` 路由（createDraft/post 等 action）建立 schema 并完成 server/client 接入
- [x] 3.4 统一多 action 页面与多实例表单的 `action` 标识映射，确保错误只绑定触发表单

## 4. 测试、验收与防回归

- [x] 4.1 为迁移路由补充/更新 action 单测，覆盖无效输入、边界输入和成功路径
- [x] 4.2 运行 `npm run check` 与相关测试命令，修复本次迁移引入的问题
- [ ] 4.3 执行手工验收：字段错误、输入回填、业务错误提示、成功流程一致性
      阻塞说明：`/erp/**` 路由受登录态保护，本地当前未完成可用登录会话，无法在本次会话中完成真实页面手工流验收。
- [x] 4.4 增加团队约束（文档或 lint 规则），禁止在 ERP 新表单中新增裸 `request.formData()` 解析主路径
