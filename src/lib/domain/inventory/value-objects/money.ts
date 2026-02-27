import { ValidationError, InvariantViolationError } from '../../shared/errors'

export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY'

export class Money {
	private constructor(
		private readonly _amount: number,
		private readonly _currency: Currency
	) {}

	static create(amount: number, currency: Currency = 'CNY'): Money {
		if (!Number.isFinite(amount)) {
			throw new ValidationError('Amount must be a finite number', 'amount')
		}
		if (amount < 0) {
			throw new ValidationError('Amount cannot be negative', 'amount')
		}
		const rounded = Math.round(amount * 100) / 100
		return new Money(rounded, currency)
	}

	static zero(currency: Currency = 'CNY'): Money {
		return new Money(0, currency)
	}

	get amount(): number {
		return this._amount
	}

	get currency(): Currency {
		return this._currency
	}

	add(other: Money): Money {
		this.ensureSameCurrency(other)
		return Money.create(this._amount + other._amount, this._currency)
	}

	subtract(other: Money): Money {
		this.ensureSameCurrency(other)
		const result = this._amount - other._amount
		if (result < 0) {
			throw new InvariantViolationError('Subtraction would result in negative amount')
		}
		return Money.create(result, this._currency)
	}

	multiply(factor: number): Money {
		if (factor < 0) {
			throw new ValidationError('Factor cannot be negative', 'factor')
		}
		return Money.create(this._amount * factor, this._currency)
	}

	private ensureSameCurrency(other: Money): void {
		if (this._currency !== other._currency) {
			throw new InvariantViolationError(
				`Currency mismatch: ${this._currency} vs ${other._currency}`
			)
		}
	}

	equals(other: Money): boolean {
		return this._amount === other._amount && this._currency === other._currency
	}

	toString(): string {
		return `${this._currency} ${this._amount.toFixed(2)}`
	}

	toJSON(): { amount: number; currency: Currency } {
		return { amount: this._amount, currency: this._currency }
	}
}
