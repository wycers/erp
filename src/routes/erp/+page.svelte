<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<section class="space-y-4">
	<h2 class="text-xl font-semibold text-gray-900">业务总览</h2>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded border border-gray-200 p-3">
			<p class="text-xs text-gray-500">原料 SKU</p>
			<p class="text-lg font-semibold text-gray-900">{data.materialCount}</p>
		</div>
		<div class="rounded border border-gray-200 p-3">
			<p class="text-xs text-gray-500">成品</p>
			<p class="text-lg font-semibold text-gray-900">{data.productCount}</p>
		</div>
		<div class="rounded border border-gray-200 p-3">
			<p class="text-xs text-gray-500">待过账进货单</p>
			<p class="text-lg font-semibold text-gray-900">{data.purchaseDraftCount}</p>
		</div>
		<div class="rounded border border-gray-200 p-3">
			<p class="text-xs text-gray-500">待过账生产单</p>
			<p class="text-lg font-semibold text-gray-900">{data.productionDraftCount}</p>
		</div>
		<div class="rounded border border-gray-200 p-3">
			<p class="text-xs text-gray-500">待过账销售单</p>
			<p class="text-lg font-semibold text-gray-900">{data.salesDraftCount}</p>
		</div>
	</div>
</section>
