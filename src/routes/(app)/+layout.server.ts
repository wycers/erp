import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		redirect(303, `/demo/better-auth/login?redirect=${encodeURIComponent(url.pathname)}`)
	}

	return {
		user: locals.user
	}
}
