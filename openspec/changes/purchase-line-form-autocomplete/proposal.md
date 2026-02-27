## Why

当前采购页面的明细行录入使用 `Textarea` 文本框，用户需要手动输入逗号分隔的格式（如 `materialSkuId,quantity,lineAmount`）。这种方式存在以下问题：

1. **易出错**：需要记忆原料 ID，手动输入格式容易遗漏或写错
2. **无验证**：输入时没有即时反馈，提交后才发现格式错误
3. **体验差**：缺少联想/自动补全，每次都要查看原料列表对照录入
4. **效率低**：无法快速选择原料，也不能动态增删行

## What Changes

- 将明细行输入从 `Textarea` 改为结构化的表单行组件
- 每行包含：原料选择器（带搜索/联想）、数量输入、金额输入
- 支持动态添加/删除明细行
- 原料选择器支持按编码、名称模糊搜索
- 输入时实时计算单价预览

## Capabilities

### New Capabilities
- `purchase-line-form`: 结构化的采购明细行表单输入，支持原料联想和动态行管理

### Modified Capabilities
- None.

## Impact

- Affected code:
  - `src/routes/erp/purchases/+page.svelte`：重构明细行输入区域
  - `src/lib/components/ui/`：可能新增 Combobox/Autocomplete 组件（如尚未存在）
- Affected behavior:
  - 采购单创建流程的用户交互方式改变
  - 表单提交的数据格式需要后端适配（从文本解析改为结构化数组）
- Dependencies/systems:
  - 需要确认后端 action 能接收结构化的明细行数据
  - 可能需要新增原料搜索 API（如果联想需要服务端过滤）
