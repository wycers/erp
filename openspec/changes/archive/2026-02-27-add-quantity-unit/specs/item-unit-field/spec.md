## MODIFIED Requirements

### Requirement: Material unit field
原料（material_sku）表 SHALL 包含一个必填的 `unit` 字段，用于存储计量单位（如"米"、"个"、"件"等）。

#### Scenario: Create material with unit
- **WHEN** 用户创建新原料并填写单位为"米"
- **THEN** 系统保存原料时 SHALL 同时保存单位信息

#### Scenario: Create material without unit
- **WHEN** 用户创建新原料但未填写单位
- **THEN** 系统 SHALL 拒绝保存，提示单位为必填字段

#### Scenario: Update material unit
- **WHEN** 用户编辑现有原料并修改单位
- **THEN** 系统 SHALL 更新单位字段

### Requirement: Product unit field
成品（finished_product）表 SHALL 包含一个必填的 `unit` 字段，用于存储计量单位。

#### Scenario: Create product with unit
- **WHEN** 用户创建新成品并填写单位为"个"
- **THEN** 系统保存成品时 SHALL 同时保存单位信息

#### Scenario: Create product without unit
- **WHEN** 用户创建新成品但未填写单位
- **THEN** 系统 SHALL 拒绝保存，提示单位为必填字段

#### Scenario: Update product unit
- **WHEN** 用户编辑现有成品并修改单位
- **THEN** 系统 SHALL 更新单位字段

### Requirement: Unit display in materials list
原料管理页面 SHALL 显示每个原料的单位信息。

#### Scenario: Display material with unit
- **WHEN** 原料有单位信息
- **THEN** 页面 SHALL 在原料卡片中显示单位

### Requirement: Unit display in products list
成品管理页面 SHALL 显示每个成品的单位信息。

#### Scenario: Display product with unit
- **WHEN** 成品有单位信息
- **THEN** 页面 SHALL 在成品卡片中显示单位

### Requirement: Unit input in forms
原料和成品的创建/编辑表单 SHALL 包含必填的单位输入框。

#### Scenario: Material form unit input
- **WHEN** 用户在原料创建表单中
- **THEN** 表单 SHALL 显示必填的单位输入框，允许用户输入自定义单位文本

#### Scenario: Product form unit input
- **WHEN** 用户在成品创建表单中
- **THEN** 表单 SHALL 显示必填的单位输入框，允许用户输入自定义单位文本

### Requirement: Unit in inventory display
库存页面 SHALL 显示物品的单位信息。

#### Scenario: Inventory list shows unit
- **WHEN** 用户查看库存列表
- **THEN** 每个库存项 SHALL 显示其关联的单位信息
