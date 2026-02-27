export class ErpValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ErpValidationError';
	}
}

export class InventoryInsufficientError extends ErpValidationError {
	constructor(message: string) {
		super(message);
		this.name = 'InventoryInsufficientError';
	}
}
