import type { PageServerLoad, Actions } from './$types'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { updateProductSchema, adjustStockSchema } from '$lib/application/inventory/schemas'
import { GetProductQuery } from '$lib/application/inventory/queries/get-product.query'
import { UpdateProductCommand } from '$lib/application/inventory/commands/update-product.command'
import { AdjustStockCommand } from '$lib/application/inventory/commands/adjust-stock.command'
import { DeleteProductCommand } from '$lib/application/inventory/commands/delete-product.command'
import { DrizzleProductRepository } from '$lib/server/repositories/inventory/drizzle-product.repository'
import type { StockAdjustmentReason } from '$lib/domain/inventory/events/stock-adjusted.event'

export const load: PageServerLoad = async ({ params }) => {
	const repo = new DrizzleProductRepository()
	const query = new GetProductQuery(repo)
	const result = await query.execute({ id: params.id })

	if (!result.ok) {
		error(404, result.error)
	}

	const product = result.value

	const updateForm = await superValidate(
		{
			name: product.name,
			description: product.description ?? '',
			unitPrice: product.unitPrice,
			reorderPoint: product.reorderPoint
		},
		zod(updateProductSchema)
	)

	const stockForm = await superValidate(
		{ quantity: 1, adjustmentType: 'add' as const, reason: 'receipt' as const },
		zod(adjustStockSchema)
	)

	return {
		product,
		updateForm,
		stockForm
	}
}

export const actions: Actions = {
	update: async ({ params, request }) => {
		const form = await superValidate(request, zod(updateProductSchema))

		if (!form.valid) {
			return fail(400, { form, action: 'update' })
		}

		const repo = new DrizzleProductRepository()
		const command = new UpdateProductCommand(repo)
		const result = await command.execute({
			id: params.id,
			name: form.data.name,
			description: form.data.description,
			unitPrice: form.data.unitPrice,
			reorderPoint: form.data.reorderPoint
		})

		if (!result.ok) {
			return message(form, result.error, { status: 400 })
		}

		return message(form, 'Product updated successfully')
	},

	adjustStock: async ({ params, request }) => {
		const form = await superValidate(request, zod(adjustStockSchema))

		if (!form.valid) {
			return fail(400, { form, action: 'adjustStock' })
		}

		const delta =
			form.data.adjustmentType === 'add' ? form.data.quantity : -form.data.quantity

		const repo = new DrizzleProductRepository()
		const command = new AdjustStockCommand(repo)
		const result = await command.execute({
			productId: params.id,
			delta,
			reason: form.data.reason as StockAdjustmentReason,
			reference: form.data.reference
		})

		if (!result.ok) {
			return message(form, result.error, { status: 400 })
		}

		return message(form, `Stock adjusted. New quantity: ${result.value}`)
	},

	delete: async ({ params }) => {
		const repo = new DrizzleProductRepository()
		const command = new DeleteProductCommand(repo)
		const result = await command.execute({ id: params.id })

		if (!result.ok) {
			return fail(400, { error: result.error })
		}

		redirect(303, '/inventory')
	}
}
