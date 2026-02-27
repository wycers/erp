import { randomUUID } from 'crypto'

export class EntityId {
	private constructor(private readonly _value: string) {
		if (!_value || _value.trim() === '') {
			throw new Error('EntityId cannot be empty')
		}
	}

	static create(value: string): EntityId {
		return new EntityId(value)
	}

	static generate(): EntityId {
		return new EntityId(randomUUID())
	}

	get value(): string {
		return this._value
	}

	equals(other: EntityId): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}
}
