import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { ListProductsQuery } from '$lib/application/inventory/queries/list-products.query'
import { GetStockSummaryQuery } from '$lib/application/inventory/queries/get-stock-summary.query'
import { DeleteProductCommand } from '$lib/application/inventory/commands/delete-product.command'
import { DrizzleProductRepository } from '$lib/server/repositories/inventory/drizzle-product.repository'

export const load: PageServerLoad = async ({ url }) => {
	const repo = new DrizzleProductRepository()

	const page = parseInt(url.searchParams.get('page') ?? '1')
	const limit = 20
	const offset = (page - 1) * limit
	const searchTerm = url.searchParams.get('q') ?? undefined
	const lowStockOnly = url.searchParams.get('lowStock') === 'true'

	const listQuery = new ListProductsQuery(repo)
	const summaryQuery = new GetStockSummaryQuery(repo)

	const [productsResult, summaryResult] = await Promise.all([
		listQuery.execute({ limit, offset, searchTerm, lowStockOnly }),
		summaryQuery.execute()
	])

	return {
		products: productsResult.ok ? productsResult.value : { products: [], total: 0, limit, offset },
		summary: summaryResult.ok ? summaryResult.value : null,
		page,
		searchTerm,
		lowStockOnly
	}
}

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData()
		const id = formData.get('id') as string

		if (!id) {
			return fail(400, { error: 'Product ID is required' })
		}

		const repo = new DrizzleProductRepository()
		const command = new DeleteProductCommand(repo)
		const result = await command.execute({ id })

		if (!result.ok) {
			return fail(400, { error: result.error })
		}

		return { success: true }
	}
}
