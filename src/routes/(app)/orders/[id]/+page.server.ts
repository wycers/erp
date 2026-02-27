import type { PageServerLoad, Actions } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { addOrderItemSchema } from '$lib/application/orders/schemas'
import { GetOrderQuery } from '$lib/application/orders/queries/get-order.query'
import { AddOrderItemCommand } from '$lib/application/orders/commands/add-order-item.command'
import { PlaceOrderCommand } from '$lib/application/orders/commands/place-order.command'
import { UpdateOrderStatusCommand } from '$lib/application/orders/commands/update-order-status.command'
import { ListProductsQuery } from '$lib/application/inventory/queries/list-products.query'
import { DrizzleOrderRepository } from '$lib/server/repositories/orders/drizzle-order.repository'
import { DrizzleProductRepository } from '$lib/server/repositories/inventory/drizzle-product.repository'

export const load: PageServerLoad = async ({ params }) => {
	const orderRepo = new DrizzleOrderRepository()
	const productRepo = new DrizzleProductRepository()

	const orderQuery = new GetOrderQuery(orderRepo)
	const productsQuery = new ListProductsQuery(productRepo)

	const [orderResult, productsResult] = await Promise.all([
		orderQuery.execute({ id: params.id }),
		productsQuery.execute({ limit: 100 })
	])

	if (!orderResult.ok) {
		error(404, orderResult.error)
	}

	const addItemForm = await superValidate(
		{ quantity: 1 },
		zod(addOrderItemSchema)
	)

	return {
		order: orderResult.value,
		products: productsResult.ok ? productsResult.value.products : [],
		addItemForm
	}
}

export const actions: Actions = {
	addItem: async ({ params, request }) => {
		const form = await superValidate(request, zod(addOrderItemSchema))

		if (!form.valid) {
			return fail(400, { form, action: 'addItem' })
		}

		const orderRepo = new DrizzleOrderRepository()
		const productRepo = new DrizzleProductRepository()
		const command = new AddOrderItemCommand(orderRepo, productRepo)

		const result = await command.execute({
			orderId: params.id,
			productId: form.data.productId,
			quantity: form.data.quantity
		})

		if (!result.ok) {
			return message(form, result.error, { status: 400 })
		}

		return message(form, 'Item added to order')
	},

	placeOrder: async ({ params }) => {
		const repo = new DrizzleOrderRepository()
		const command = new PlaceOrderCommand(repo)

		const result = await command.execute({ orderId: params.id })

		if (!result.ok) {
			return fail(400, { error: result.error, action: 'placeOrder' })
		}

		return { success: true, action: 'placeOrder', orderNumber: result.value }
	},

	updateStatus: async ({ params, request }) => {
		const formData = await request.formData()
		const action = formData.get('action') as
			| 'confirm'
			| 'process'
			| 'ship'
			| 'deliver'
			| 'cancel'

		const repo = new DrizzleOrderRepository()
		const command = new UpdateOrderStatusCommand(repo)

		const result = await command.execute({
			orderId: params.id,
			action
		})

		if (!result.ok) {
			return fail(400, { error: result.error, action: 'updateStatus' })
		}

		if (action === 'cancel') {
			redirect(303, '/orders')
		}

		return { success: true, action: 'updateStatus', newStatus: result.value }
	}
}
