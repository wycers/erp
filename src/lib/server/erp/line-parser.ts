import { ErpValidationError } from './errors';
import { toNumber } from './math';

const splitRow = (row: string): string[] => row.split(',').map((part) => part.trim());

export const parseBomLinesInput = (
	input: string
): {
	materialSkuId: number;
	quantityPerUnit: number;
}[] => {
	const rows = input
		.split('\n')
		.map((row) => row.trim())
		.filter(Boolean);

	if (rows.length === 0) {
		throw new ErpValidationError('Please provide at least one BOM line');
	}

	return rows.map((row, index) => {
		const [materialSkuIdText, quantityText] = splitRow(row);
		if (!materialSkuIdText || !quantityText) {
			throw new ErpValidationError(
				`Invalid BOM line ${index + 1}. Use: materialSkuId,quantityPerUnit`
			);
		}

		return {
			materialSkuId: Math.trunc(toNumber(materialSkuIdText)),
			quantityPerUnit: toNumber(quantityText)
		};
	});
};

export const parsePurchaseLinesInput = (
	input: string
): {
	materialSkuId: number;
	quantity: number;
	lineAmount: number;
}[] => {
	const rows = input
		.split('\n')
		.map((row) => row.trim())
		.filter(Boolean);

	if (rows.length === 0) {
		throw new ErpValidationError('Please provide at least one purchase line');
	}

	return rows.map((row, index) => {
		const [materialSkuIdText, quantityText, lineAmountText] = splitRow(row);
		if (!materialSkuIdText || !quantityText || !lineAmountText) {
			throw new ErpValidationError(
				`Invalid purchase line ${index + 1}. Use: materialSkuId,quantity,lineAmount`
			);
		}

		return {
			materialSkuId: Math.trunc(toNumber(materialSkuIdText)),
			quantity: toNumber(quantityText),
			lineAmount: toNumber(lineAmountText)
		};
	});
};

export const parseSalesLinesInput = (
	input: string
): {
	productId: number;
	quantity: number;
	sellingUnitPrice: number;
}[] => {
	const rows = input
		.split('\n')
		.map((row) => row.trim())
		.filter(Boolean);

	if (rows.length === 0) {
		throw new ErpValidationError('Please provide at least one sales line');
	}

	return rows.map((row, index) => {
		const [productIdText, quantityText, priceText] = splitRow(row);
		if (!productIdText || !quantityText || !priceText) {
			throw new ErpValidationError(
				`Invalid sales line ${index + 1}. Use: productId,quantity,sellingUnitPrice`
			);
		}

		return {
			productId: Math.trunc(toNumber(productIdText)),
			quantity: toNumber(quantityText),
			sellingUnitPrice: toNumber(priceText)
		};
	});
};
