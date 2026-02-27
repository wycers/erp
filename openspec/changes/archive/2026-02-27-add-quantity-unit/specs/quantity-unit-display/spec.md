## ADDED Requirements

### Requirement: BOM行项显示原料单位
BomLineInput 组件 SHALL 在用量输入框旁显示所选原料的计量单位。

#### Scenario: 选择原料后显示单位
- **WHEN** 用户在 BOM 配方中选择一个单位为"米"的原料
- **THEN** 系统 SHALL 在用量输入框右侧显示"米"

#### Scenario: 切换原料时更新单位
- **WHEN** 用户将原料从"布料（米）"切换为"纽扣（个）"
- **THEN** 系统 SHALL 将显示的单位从"米"更新为"个"

### Requirement: 销售单行项显示成品单位
SalesLineInput 组件 SHALL 在数量输入框旁显示所选成品的计量单位。

#### Scenario: 选择成品后显示单位
- **WHEN** 用户在销售单中选择一个单位为"件"的成品
- **THEN** 系统 SHALL 在数量输入框右侧显示"件"

#### Scenario: 切换成品时更新单位
- **WHEN** 用户将成品从"T恤（件）"切换为"布料（米）"
- **THEN** 系统 SHALL 将显示的单位从"件"更新为"米"

### Requirement: 采购单行项显示原料单位
PurchaseLineInput 组件 SHALL 在数量输入框旁显示所选原料的计量单位。

#### Scenario: 选择原料后显示单位
- **WHEN** 用户在采购单中选择一个单位为"kg"的原料
- **THEN** 系统 SHALL 在数量输入框右侧显示"kg"

#### Scenario: 切换原料时更新单位
- **WHEN** 用户将原料从"棉花（kg）"切换为"拉链（条）"
- **THEN** 系统 SHALL 将显示的单位从"kg"更新为"条"
