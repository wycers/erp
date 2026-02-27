import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createProductSchema } from '$lib/application/inventory/schemas'
import { CreateProductCommand } from '$lib/application/inventory/commands/create-product.command'
import { DrizzleProductRepository } from '$lib/server/repositories/inventory/drizzle-product.repository'

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(createProductSchema))
	return { form }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(createProductSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const repo = new DrizzleProductRepository()
		const command = new CreateProductCommand(repo)
		const result = await command.execute({
			sku: form.data.sku,
			name: form.data.name,
			description: form.data.description,
			unitPrice: form.data.unitPrice,
			currency: form.data.currency,
			initialStock: form.data.initialStock,
			reorderPoint: form.data.reorderPoint
		})

		if (!result.ok) {
			return message(form, result.error, { status: 400 })
		}

		redirect(303, `/inventory/${result.value}`)
	}
}
