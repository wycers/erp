<script lang="ts">
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';

	let { data }: { data: PageServerData } = $props();
</script>

<section class="space-y-4">
	<h2 class="text-xl font-semibold">业务总览</h2>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
		<Card.Root class="gap-1 py-3">
			<Card.Content class="px-3">
				<p class="text-muted-foreground text-xs">原料 SKU</p>
				<p class="text-lg font-semibold">{data.materialCount}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root class="gap-1 py-3">
			<Card.Content class="px-3">
				<p class="text-muted-foreground text-xs">成品</p>
				<p class="text-lg font-semibold">{data.productCount}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root class="gap-1 py-3">
			<Card.Content class="px-3">
				<p class="text-muted-foreground text-xs">待过账进货单</p>
				<p class="text-lg font-semibold">{data.purchaseDraftCount}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root class="gap-1 py-3">
			<Card.Content class="px-3">
				<p class="text-muted-foreground text-xs">待过账生产单</p>
				<p class="text-lg font-semibold">{data.productionDraftCount}</p>
			</Card.Content>
		</Card.Root>
		<Card.Root class="gap-1 py-3">
			<Card.Content class="px-3">
				<p class="text-muted-foreground text-xs">待过账销售单</p>
				<p class="text-lg font-semibold">{data.salesDraftCount}</p>
			</Card.Content>
		</Card.Root>
	</div>
</section>
