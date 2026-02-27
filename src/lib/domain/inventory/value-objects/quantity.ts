import { ValidationError, InvariantViolationError } from '../../shared/errors'

export class Quantity {
	private constructor(private readonly _value: number) {}

	static create(value: number): Quantity {
		if (!Number.isFinite(value)) {
			throw new ValidationError('Quantity must be a finite number', 'quantity')
		}
		if (!Number.isInteger(value)) {
			throw new ValidationError('Quantity must be an integer', 'quantity')
		}
		if (value < 0) {
			throw new ValidationError('Quantity cannot be negative', 'quantity')
		}
		return new Quantity(value)
	}

	static zero(): Quantity {
		return new Quantity(0)
	}

	get value(): number {
		return this._value
	}

	add(delta: number): Quantity {
		const newValue = this._value + delta
		if (newValue < 0) {
			throw new InvariantViolationError(
				`Cannot reduce quantity below zero. Current: ${this._value}, Delta: ${delta}`
			)
		}
		return new Quantity(newValue)
	}

	subtract(amount: number): Quantity {
		return this.add(-amount)
	}

	isZero(): boolean {
		return this._value === 0
	}

	isBelow(other: Quantity): boolean {
		return this._value < other._value
	}

	isAbove(other: Quantity): boolean {
		return this._value > other._value
	}

	equals(other: Quantity): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value.toString()
	}
}
