<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { MobileNav, type NavItem } from '$lib/components/ui/mobile-nav';
	import { LayoutDashboard, Package, Box, ShoppingCart, Factory, TrendingUp, Warehouse } from '@lucide/svelte';

	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();

	const mainNavItems: NavItem[] = [
		{ href: '', label: '总览', icon: LayoutDashboard, matchPaths: [''] },
		{ href: '/materials', label: '原料', icon: Package },
		{ href: '/products', label: '成品', icon: Box },
		{ href: '/purchases', label: '进货', icon: ShoppingCart }
	];

	const moreNavItems: NavItem[] = [
		{ href: '/production', label: '生产', icon: Factory },
		{ href: '/sales', label: '销售', icon: TrendingUp },
		{ href: '/inventory', label: '库存', icon: Warehouse }
	];
</script>

<div class="mx-auto max-w-6xl space-y-6 p-4 pb-20 sm:p-6 md:pb-6">
	<header class="space-y-3 pb-4 sm:pb-5">
		<h1 class="text-xl font-bold sm:text-2xl">ERP 工作台</h1>
		<p class="text-muted-foreground text-xs break-all sm:text-sm">登录用户：{data.user.email}</p>
		<nav
			class="hidden gap-2 text-sm md:flex md:flex-wrap"
		>
			<Button variant="outline" size="sm" href={resolve('/erp')}>总览</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/materials')}>原料</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/products')}>成品</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/purchases')}>进货</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/production')}>生产</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/sales')}>销售</Button>
			<Button variant="outline" size="sm" href={resolve('/erp/inventory')}>库存</Button>
		</nav>
		<Separator class="hidden md:block" />
	</header>

	{@render children()}
</div>

<MobileNav
	class="md:hidden"
	items={mainNavItems}
	moreItems={moreNavItems}
	basePath="/erp"
/>
