## ADDED Requirements

### Requirement: 材料新增表单必须执行 Schema 校验并返回字段级错误
`/erp/materials` 的新增原料动作 MUST 通过统一 schema 校验输入字段（至少包含 `code`、`name`、`unit`），并在校验失败时返回可渲染到字段级别的错误信息，而非仅全局报错。

#### Scenario: 新增时缺少必填字段
- **WHEN** 用户提交新增原料表单且 `unit` 为空
- **THEN** 系统 MUST 阻止创建请求
- **THEN** 系统 MUST 在 `unit` 字段提供可渲染的错误信息

#### Scenario: 新增输入合法
- **WHEN** 用户提交合法的 `code`、`name`、`unit` 和可选字段
- **THEN** 系统 MUST 创建原料记录
- **THEN** 系统 MUST 返回成功反馈并保持与现有业务文案兼容

### Requirement: 材料更新表单必须对目标行进行校验与回填
`/erp/materials` 的更新动作 MUST 对提交行执行 schema 校验，并将错误与提交值绑定到触发提交的目标行，避免影响其他行的编辑状态。

#### Scenario: 更新目标行校验失败
- **WHEN** 用户提交某一行更新表单且 `name` 为空
- **THEN** 系统 MUST 阻止该行更新
- **THEN** 系统 MUST 仅在该目标行显示字段错误与提交值回填

#### Scenario: 更新成功不影响其他行
- **WHEN** 用户提交某一行更新表单且输入合法
- **THEN** 系统 MUST 更新目标行数据
- **THEN** 系统 MUST 不改变其他未提交行的显示内容

### Requirement: 迁移不得改变既有业务错误语义与字段能力
该试点 MUST 保持 `item-unit-field` 与 `image-upload` 相关行为不退化，并继续暴露领域/数据库异常的可理解错误信息。

#### Scenario: 领域层校验异常
- **WHEN** 领域服务拒绝更新（例如目标原料不存在）
- **THEN** 系统 MUST 返回可理解的业务错误消息
- **THEN** 系统 MUST 不导致页面进入不可恢复状态

#### Scenario: 重复键冲突
- **WHEN** 用户提交重复编码导致数据库唯一键冲突
- **THEN** 系统 MUST 返回与现有流程一致的冲突提示
- **THEN** 系统 MUST 保留用户当前编辑上下文
