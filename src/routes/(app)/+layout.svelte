<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Package, ShoppingCart, LayoutDashboard, LogOut } from '@lucide/svelte';
	import { MobileNav, type NavItem } from '$lib/components/ui/mobile-nav';

	interface Props {
		data: { user: { name: string; email: string } };
		children: Snippet;
	}

	let { data, children }: Props = $props();

	const navItems: NavItem[] = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard, matchPaths: ['/'] },
		{ href: '/inventory', label: 'Inventory', icon: Package },
		{ href: '/orders', label: 'Orders', icon: ShoppingCart }
	];
</script>

<div class="flex min-h-screen">
	<aside class="bg-muted/40 hidden w-64 border-r p-4 md:block">
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

	<main class="flex-1 p-4 pb-20 md:p-8 md:pb-8">
		<div class="mb-4 md:hidden">
			<h1 class="text-xl font-bold">ERP System</h1>
			<p class="text-muted-foreground text-sm">{data.user?.email}</p>
		</div>
		{@render children()}
	</main>
</div>

<MobileNav class="md:hidden" items={navItems} basePath="" />
