import { ValidationError } from '../../shared/errors'

export class SKU {
	private static readonly PATTERN = /^[A-Z0-9]+-[A-Z0-9]+(-[A-Z0-9]+)*$/

	private constructor(private readonly _value: string) {}

	static create(value: string): SKU {
		const normalized = value.toUpperCase().trim()
		if (!normalized) {
			throw new ValidationError('SKU cannot be empty', 'sku')
		}
		if (!SKU.PATTERN.test(normalized)) {
			throw new ValidationError(
				'SKU must follow pattern: XXX-XXX (e.g., PROD-001, CAT-ITEM-001)',
				'sku'
			)
		}
		return new SKU(normalized)
	}

	static fromString(value: string): SKU {
		return new SKU(value)
	}

	get value(): string {
		return this._value
	}

	equals(other: SKU): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}
}
