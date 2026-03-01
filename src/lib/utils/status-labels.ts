export type DocumentStatus = 'DRAFT' | 'POSTED';
export type OrderStatus =
	| 'draft'
	| 'pending'
	| 'confirmed'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'cancelled';

const documentStatusLabels: Record<DocumentStatus, string> = {
	DRAFT: '草稿',
	POSTED: '已过账'
};

const orderStatusLabels: Record<OrderStatus, string> = {
	draft: '草稿',
	pending: '待处理',
	confirmed: '已确认',
	processing: '处理中',
	shipped: '已发货',
	delivered: '已送达',
	cancelled: '已取消'
};

export function getDocumentStatusLabel(status: DocumentStatus): string {
	return documentStatusLabels[status] ?? status;
}

export function getOrderStatusLabel(status: OrderStatus): string {
	return orderStatusLabels[status] ?? status;
}

export { orderStatusLabels };
