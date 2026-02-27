export interface DomainEvent {
	readonly eventId: string
	readonly occurredAt: Date
	readonly eventType: string
}

export abstract class BaseDomainEvent implements DomainEvent {
	readonly eventId: string
	readonly occurredAt: Date
	abstract readonly eventType: string

	constructor() {
		this.eventId = crypto.randomUUID()
		this.occurredAt = new Date()
	}
}
