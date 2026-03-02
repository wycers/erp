## 1. Schema 与服务端输入收敛

- [x] 1.1 新增材料 create/update 的 zod schema（覆盖必填项、字符串清洗、可选图片字段、`isActive` 布尔解析）
- [x] 1.2 在服务端路由中引入 schema 与 `superValidate`，替换 `getText` 手工解析路径
- [x] 1.3 在 `load` 中准备 create/update 初始表单状态，确保页面可消费

## 2. Action 迁移（依赖 1）

- [x] 2.1 将 `create` action 改为 `superforms` 返回格式（校验失败返回 form，成功返回兼容提示）
- [x] 2.2 将 `update` action 改为 `superforms` 返回格式，并携带目标行标识用于错误映射
- [x] 2.3 保留领域/数据库异常映射语义（复用 `toErpActionFailure` 或等价行为）

## 3. 页面接入与交互（依赖 2）

- [x] 3.1 新增表单接入 `superForm`，渲染字段级错误并保持提交失败回填
- [x] 3.2 更新表单实现目标行错误渲染与目标行回填（可与 3.1 并行）
- [x] 3.3 保持现有布局、图片上传与成功提示行为不回退（可与 3.2 并行）

## 4. 验证与回归

- [x] 4.1 增加/更新材料表单相关测试（至少覆盖 create/update 的无效输入与成功路径）
- [x] 4.2 验证重复编码与领域异常路径仍返回可理解错误
- [x] 4.3 运行 `npm run check` 并修复本次变更引入的问题
- [ ] 4.4 手动验证 `/erp/materials`：新增、更新、图片字段、启用开关、错误回填
      阻塞说明：`/erp/materials` 依赖登录，当前注册流程在本地返回 `Unexpected error`，无法进入 ERP 页面进行真实手动流验证。
