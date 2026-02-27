export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

export function ok<T>(value: T): Result<T, never> {
	return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
	return { ok: false, error }
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
	return result.ok
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
	return !result.ok
}

export function unwrap<T, E>(result: Result<T, E>): T {
	if (result.ok) {
		return result.value
	}
	throw result.error
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
	if (result.ok) {
		return result.value
	}
	return defaultValue
}

export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
	if (result.ok) {
		return ok(fn(result.value))
	}
	return result
}

export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
	if (!result.ok) {
		return err(fn(result.error))
	}
	return result
}

export async function fromPromise<T, E = Error>(
	promise: Promise<T>,
	errorMapper?: (error: unknown) => E
): Promise<Result<T, E>> {
	try {
		const value = await promise
		return ok(value)
	} catch (error) {
		if (errorMapper) {
			return err(errorMapper(error))
		}
		return err(error as E)
	}
}
