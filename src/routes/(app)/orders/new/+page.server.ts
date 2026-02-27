import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createOrderSchema } from '$lib/application/orders/schemas'
import { CreateOrderCommand } from '$lib/application/orders/commands/create-order.command'
import { DrizzleOrderRepository } from '$lib/server/repositories/orders/drizzle-order.repository'

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(
		{ country: 'China' },
		zod(createOrderSchema)
	)
	return { form, user: locals.user }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(createOrderSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const repo = new DrizzleOrderRepository()
		const command = new CreateOrderCommand(repo)
		const result = await command.execute({
			customerId: locals.user?.id ?? 'anonymous',
			customerName: form.data.customerName,
			shippingAddress: {
				street: form.data.street,
				city: form.data.city,
				province: form.data.province,
				postalCode: form.data.postalCode,
				country: form.data.country,
				contactName: form.data.contactName,
				contactPhone: form.data.contactPhone
			},
			notes: form.data.notes
		})

		if (!result.ok) {
			return message(form, result.error, { status: 400 })
		}

		redirect(303, `/orders/${result.value}`)
	}
}
