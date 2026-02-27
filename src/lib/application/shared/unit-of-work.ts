export interface UnitOfWork {
	begin(): Promise<void>
	commit(): Promise<void>
	rollback(): Promise<void>
}

export interface TransactionScope {
	runInTransaction<T>(fn: () => Promise<T>): Promise<T>
}
