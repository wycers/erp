<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	let { data, children }: { data: LayoutServerData; children: Snippet } = $props();
</script>

<div class="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
	<header class="space-y-3 border-b border-gray-200 pb-4 sm:pb-5">
		<h1 class="text-xl font-bold text-gray-900 sm:text-2xl">ERP 工作台</h1>
		<p class="text-xs break-all text-gray-600 sm:text-sm">登录用户：{data.user.email}</p>
		<nav
			class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 text-sm sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
		>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp')}>总览</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/materials')}>原料</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/products')}>成品</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/purchases')}>进货</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/production')}>生产</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/sales')}>销售</a
			>
			<a
				class="shrink-0 rounded border border-gray-300 px-3 py-1 whitespace-nowrap hover:bg-gray-100"
				href={resolve('/erp/inventory')}>库存</a
			>
		</nav>
	</header>

	{@render children()}
</div>
