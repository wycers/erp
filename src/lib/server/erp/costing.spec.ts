import { describe, expect, it } from 'vitest';
import {
	calculateGrossMargin,
	calculateInboundAverage,
	calculateOutboundIssue,
	computePurchaseLineCosts
} from './costing';

describe('costing', () => {
	it('allocates freight by line amount and pushes rounding residual to last line', () => {
		const lines = computePurchaseLineCosts(
			[
				{ quantity: 3, lineAmount: 10 },
				{ quantity: 7, lineAmount: 20 }
			],
			1
		);

		expect(lines[0]?.allocatedFreight).toBe(0.33);
		expect(lines[1]?.allocatedFreight).toBe(0.67);
		expect(lines[0]?.unitPrice).toBe(3.33);
		expect(lines[1]?.unitPrice).toBe(2.86);
		expect(lines[0]?.landedUnitCost).toBe(3.44);
		expect(lines[1]?.landedUnitCost).toBe(2.95);
	});

	it('maintains moving weighted average on inbound and issues outbound at current average', () => {
		const firstInbound = calculateInboundAverage(0, 0, 10, 10);
		expect(firstInbound).toEqual({ quantity: 10, averageCost: 10 });

		const secondInbound = calculateInboundAverage(
			firstInbound.quantity,
			firstInbound.averageCost,
			5,
			14
		);
		expect(secondInbound).toEqual({ quantity: 15, averageCost: 11.33 });

		const outbound = calculateOutboundIssue(secondInbound.quantity, secondInbound.averageCost, 4);
		expect(outbound.issueUnitCost).toBe(11.33);
		expect(outbound.issueTotalCost).toBe(45.32);
		expect(outbound.quantity).toBe(11);
		expect(outbound.averageCost).toBe(11.33);
	});

	it('rejects outbound movement when quantity is insufficient', () => {
		expect(() => calculateOutboundIssue(1, 10, 2)).toThrow('Insufficient inventory quantity');
	});

	it('computes purchase -> production -> sales profitability workflow math', () => {
		const purchaseLine = computePurchaseLineCosts([{ quantity: 10, lineAmount: 100 }], 20)[0];
		expect(purchaseLine).toEqual({
			quantity: 10,
			lineAmount: 100,
			allocatedFreight: 20,
			unitPrice: 10,
			landedUnitCost: 12
		});

		const materialInventory = calculateInboundAverage(
			0,
			0,
			purchaseLine.quantity,
			purchaseLine.landedUnitCost
		);
		expect(materialInventory).toEqual({ quantity: 10, averageCost: 12 });

		const materialIssue = calculateOutboundIssue(
			materialInventory.quantity,
			materialInventory.averageCost,
			6
		);
		expect(materialIssue.issueTotalCost).toBe(72);

		const finishedUnitCost = Number((materialIssue.issueTotalCost / 2).toFixed(2));
		expect(finishedUnitCost).toBe(36);

		const finishedInventory = calculateInboundAverage(0, 0, 2, finishedUnitCost);
		expect(finishedInventory).toEqual({ quantity: 2, averageCost: 36 });

		const finishedIssue = calculateOutboundIssue(
			finishedInventory.quantity,
			finishedInventory.averageCost,
			1
		);
		const revenue = 50;
		const grossProfit = Number((revenue - finishedIssue.issueTotalCost).toFixed(2));
		const grossMargin = calculateGrossMargin(revenue, grossProfit);

		expect(finishedIssue.issueTotalCost).toBe(36);
		expect(grossProfit).toBe(14);
		expect(grossMargin).toBe(0.28);
	});
});
