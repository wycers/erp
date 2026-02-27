import { ErpValidationError } from './errors';

export const roundTo = (value: number, scale: number): number => {
	const factor = 10 ** scale;
	return Math.round((value + Number.EPSILON) * factor) / factor;
};

export const round2 = (value: number): number => roundTo(value, 2);
export const round4 = (value: number): number => roundTo(value, 4);

export const toNumber = (value: string | number | null | undefined): number => {
	if (value === null || value === undefined) {
		return 0;
	}

	if (typeof value === 'number') {
		return value;
	}

	const parsed = Number(value);
	if (!Number.isFinite(parsed)) {
		throw new ErpValidationError(`Invalid numeric value: ${value}`);
	}
	return parsed;
};

export const toDbNumeric = (value: number, scale = 2): string =>
	roundTo(value, scale).toFixed(scale);

export const assertPositive = (name: string, value: number): void => {
	if (!Number.isFinite(value) || value <= 0) {
		throw new ErpValidationError(`${name} must be greater than 0`);
	}
};

export const assertNonNegative = (name: string, value: number): void => {
	if (!Number.isFinite(value) || value < 0) {
		throw new ErpValidationError(`${name} must be greater than or equal to 0`);
	}
};
