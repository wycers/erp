## 1. 创建状态标签映射

- [x] 1.1 创建 `src/lib/utils/status-labels.ts`，定义文档状态映射（DRAFT→草稿、POSTED→已过账）
- [x] 1.2 添加订单状态映射（draft→草稿、pending→待处理、confirmed→已确认、processing→处理中、shipped→已发货、delivered→已送达、cancelled→已取消）

## 2. 更新 ERP 模块

- [x] 2.1 更新 `src/routes/erp/purchases/+page.svelte`，使用状态标签映射
- [x] 2.2 更新 `src/routes/erp/sales/+page.svelte`，使用状态标签映射
- [x] 2.3 更新 `src/routes/erp/production/+page.svelte`，使用状态标签映射

## 3. 更新订单模块

- [x] 3.1 更新 `src/routes/(app)/orders/+page.svelte`，使用统一的状态标签映射替换本地定义
- [x] 3.2 更新 `src/routes/(app)/orders/[id]/+page.svelte`，使用统一的状态标签映射替换本地定义
