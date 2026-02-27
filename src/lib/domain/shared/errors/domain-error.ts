export abstract class DomainError extends Error {
	abstract readonly code: string

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}

export class ValidationError extends DomainError {
	readonly code = 'VALIDATION_ERROR'

	constructor(
		message: string,
		public readonly field?: string
	) {
		super(message)
	}
}

export class NotFoundError extends DomainError {
	readonly code = 'NOT_FOUND'

	constructor(
		public readonly entityName: string,
		public readonly identifier: string
	) {
		super(`${entityName} with identifier "${identifier}" not found`)
	}
}

export class ConflictError extends DomainError {
	readonly code = 'CONFLICT'

	constructor(message: string) {
		super(message)
	}
}

export class InvariantViolationError extends DomainError {
	readonly code = 'INVARIANT_VIOLATION'

	constructor(message: string) {
		super(message)
	}
}
