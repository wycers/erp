export class AuditInfo {
	private constructor(
		private readonly _createdAt: Date,
		private readonly _updatedAt: Date,
		private readonly _createdBy?: string,
		private readonly _updatedBy?: string
	) {}

	static create(props?: { createdBy?: string }): AuditInfo {
		const now = new Date()
		return new AuditInfo(now, now, props?.createdBy, props?.createdBy)
	}

	static reconstitute(props: {
		createdAt: Date
		updatedAt: Date
		createdBy?: string
		updatedBy?: string
	}): AuditInfo {
		return new AuditInfo(props.createdAt, props.updatedAt, props.createdBy, props.updatedBy)
	}

	markUpdated(updatedBy?: string): AuditInfo {
		return new AuditInfo(this._createdAt, new Date(), this._createdBy, updatedBy)
	}

	get createdAt(): Date {
		return this._createdAt
	}

	get updatedAt(): Date {
		return this._updatedAt
	}

	get createdBy(): string | undefined {
		return this._createdBy
	}

	get updatedBy(): string | undefined {
		return this._updatedBy
	}
}
