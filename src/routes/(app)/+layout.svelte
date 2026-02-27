<script lang="ts">
	import type { Snippet } from 'svelte'
	import { Button } from '$lib/components/ui/button'
	import { Package, ShoppingCart, LayoutDashboard, LogOut } from '@lucide/svelte'

	interface Props {
		data: { user: { name: string; email: string } }
		children: Snippet
	}

	let { data, children }: Props = $props()
</script>

<div class="flex min-h-screen">
	<aside class="bg-muted/40 w-64 border-r p-4">
		<div class="mb-8">
			<h1 class="text-xl font-bold">ERP System</h1>
			<p class="text-muted-foreground text-sm">{data.user?.email}</p>
		</div>

		<nav class="space-y-2">
			<Button href="/" variant="ghost" class="w-full justify-start">
				<LayoutDashboard class="mr-2 size-4" />
				Dashboard
			</Button>
			<Button href="/inventory" variant="ghost" class="w-full justify-start">
				<Package class="mr-2 size-4" />
				Inventory
			</Button>
			<Button href="/orders" variant="ghost" class="w-full justify-start">
				<ShoppingCart class="mr-2 size-4" />
				Orders
			</Button>
		</nav>

		<div class="absolute bottom-4">
			<form method="POST" action="/demo/better-auth?/signOut">
				<Button type="submit" variant="ghost" class="w-full justify-start">
					<LogOut class="mr-2 size-4" />
					Sign Out
				</Button>
			</form>
		</div>
	</aside>

	<main class="flex-1 p-8">
		{@render children()}
	</main>
</div>
