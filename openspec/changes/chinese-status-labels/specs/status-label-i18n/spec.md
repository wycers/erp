## ADDED Requirements

### Requirement: 文档状态显示中文标签

系统 SHALL 将文档状态（DRAFT、POSTED）显示为中文标签：
- DRAFT → 草稿
- POSTED → 已过账

#### Scenario: 采购订单显示中文状态
- **WHEN** 用户查看采购订单列表
- **THEN** 状态列显示「草稿」或「已过账」而非英文

#### Scenario: 销售出货单显示中文状态
- **WHEN** 用户查看销售出货单列表
- **THEN** 状态列显示「草稿」或「已过账」而非英文

#### Scenario: 生产工单显示中文状态
- **WHEN** 用户查看生产工单列表
- **THEN** 状态列显示「草稿」或「已过账」而非英文

### Requirement: 订单状态显示中文标签

系统 SHALL 将订单状态显示为中文标签：
- draft → 草稿
- pending → 待处理
- confirmed → 已确认
- processing → 处理中
- shipped → 已发货
- delivered → 已送达
- cancelled → 已取消

#### Scenario: 订单列表显示中文状态
- **WHEN** 用户查看订单列表页面
- **THEN** 状态徽章显示中文标签（如「待处理」、「处理中」）

#### Scenario: 订单详情显示中文状态
- **WHEN** 用户查看订单详情页面
- **THEN** 状态徽章显示中文标签

#### Scenario: 状态更新成功提示使用中文
- **WHEN** 用户成功更新订单状态
- **THEN** 成功提示信息使用中文状态标签（如「订单状态已更新为：已确认」）

### Requirement: 状态标签集中管理

系统 SHALL 在 `src/lib/utils/status-labels.ts` 中集中定义所有状态标签映射，各组件 MUST 使用此映射而非本地定义。

#### Scenario: 组件使用统一映射
- **WHEN** 任意组件需要显示状态标签
- **THEN** 该组件从 `status-labels.ts` 导入映射函数
