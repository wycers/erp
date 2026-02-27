import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { ListOrdersQuery } from '$lib/application/orders/queries/list-orders.query'
import { UpdateOrderStatusCommand } from '$lib/application/orders/commands/update-order-status.command'
import { DrizzleOrderRepository } from '$lib/server/repositories/orders/drizzle-order.repository'
import type { OrderStatusValue } from '$lib/domain/orders/value-objects/order-status'

export const load: PageServerLoad = async ({ url }) => {
	const repo = new DrizzleOrderRepository()

	const page = parseInt(url.searchParams.get('page') ?? '1')
	const limit = 20
	const offset = (page - 1) * limit
	const searchTerm = url.searchParams.get('q') ?? undefined
	const status = (url.searchParams.get('status') as OrderStatusValue) ?? undefined

	const query = new ListOrdersQuery(repo)
	const result = await query.execute({ limit, offset, searchTerm, status })

	return {
		orders: result.ok ? result.value : { orders: [], total: 0, limit, offset },
		page,
		searchTerm,
		status
	}
}

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData()
		const orderId = formData.get('orderId') as string
		const action = formData.get('action') as 'confirm' | 'process' | 'ship' | 'deliver' | 'cancel'

		if (!orderId || !action) {
			return fail(400, { error: 'Order ID and action are required' })
		}

		const repo = new DrizzleOrderRepository()
		const command = new UpdateOrderStatusCommand(repo)
		const result = await command.execute({ orderId, action })

		if (!result.ok) {
			return fail(400, { error: result.error })
		}

		return { success: true, newStatus: result.value }
	}
}
