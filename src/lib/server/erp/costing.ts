import { ErpValidationError } from './errors';
import { assertNonNegative, assertPositive, round2, round4 } from './math';

export type PurchaseDraftLineInput = {
	quantity: number;
	lineAmount: number;
};

export type PurchaseComputedLine = PurchaseDraftLineInput & {
	allocatedFreight: number;
	unitPrice: number;
	landedUnitCost: number;
};

export const allocateFreightByLineAmount = (
	lineAmounts: number[],
	totalFreight: number
): number[] => {
	if (lineAmounts.length === 0) {
		return [];
	}

	assertNonNegative('totalFreight', totalFreight);
	const totalLineAmount = round2(lineAmounts.reduce((sum, amount) => sum + amount, 0));

	if (totalFreight === 0) {
		return lineAmounts.map(() => 0);
	}

	if (totalLineAmount <= 0) {
		throw new ErpValidationError('Freight allocation requires total line amount greater than 0');
	}

	const allocations: number[] = [];
	let allocatedSoFar = 0;

	for (let index = 0; index < lineAmounts.length; index += 1) {
		if (index === lineAmounts.length - 1) {
			allocations.push(round2(totalFreight - allocatedSoFar));
			continue;
		}

		const amount = lineAmounts[index] ?? 0;
		const allocation = round2((amount / totalLineAmount) * totalFreight);
		allocations.push(allocation);
		allocatedSoFar = round2(allocatedSoFar + allocation);
	}

	return allocations;
};

export const computePurchaseLineCosts = (
	lines: PurchaseDraftLineInput[],
	freightAmount: number
): PurchaseComputedLine[] => {
	if (lines.length === 0) {
		throw new ErpValidationError('Purchase order requires at least one line');
	}

	const lineAmounts = lines.map((line) => {
		assertPositive('quantity', line.quantity);
		assertNonNegative('lineAmount', line.lineAmount);
		return round2(line.lineAmount);
	});

	const allocatedFreight = allocateFreightByLineAmount(lineAmounts, round2(freightAmount));

	return lines.map((line, index) => {
		const quantity = round2(line.quantity);
		const lineAmount = lineAmounts[index] ?? 0;
		const freight = allocatedFreight[index] ?? 0;
		const unitPrice = round2(lineAmount / quantity);
		const landedUnitCost = round2((lineAmount + freight) / quantity);

		return {
			quantity,
			lineAmount,
			allocatedFreight: freight,
			unitPrice,
			landedUnitCost
		};
	});
};

export const calculateInboundAverage = (
	currentQuantity: number,
	currentAverageCost: number,
	inboundQuantity: number,
	inboundUnitCost: number
): { quantity: number; averageCost: number } => {
	assertNonNegative('currentQuantity', currentQuantity);
	assertNonNegative('currentAverageCost', currentAverageCost);
	assertPositive('inboundQuantity', inboundQuantity);
	assertNonNegative('inboundUnitCost', inboundUnitCost);

	const newQuantity = round2(currentQuantity + inboundQuantity);
	const newTotalCost = round2(
		currentQuantity * currentAverageCost + inboundQuantity * inboundUnitCost
	);
	const newAverageCost = newQuantity === 0 ? 0 : round2(newTotalCost / newQuantity);

	return { quantity: newQuantity, averageCost: newAverageCost };
};

export const calculateOutboundIssue = (
	currentQuantity: number,
	currentAverageCost: number,
	outboundQuantity: number
): { quantity: number; averageCost: number; issueUnitCost: number; issueTotalCost: number } => {
	assertNonNegative('currentQuantity', currentQuantity);
	assertNonNegative('currentAverageCost', currentAverageCost);
	assertPositive('outboundQuantity', outboundQuantity);

	const nextQuantity = round2(currentQuantity - outboundQuantity);
	if (nextQuantity < 0) {
		throw new ErpValidationError('Insufficient inventory quantity');
	}

	const issueUnitCost = round2(currentAverageCost);
	const issueTotalCost = round2(outboundQuantity * issueUnitCost);
	const nextAverageCost = nextQuantity === 0 ? 0 : round2(currentAverageCost);

	return {
		quantity: nextQuantity,
		averageCost: nextAverageCost,
		issueUnitCost,
		issueTotalCost
	};
};

export const calculateGrossMargin = (revenue: number, grossProfit: number): number => {
	if (revenue <= 0) {
		return 0;
	}

	return round4(grossProfit / revenue);
};
