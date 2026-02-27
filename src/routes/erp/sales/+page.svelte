<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import SalesLineInput from './SalesLineInput.svelte';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">销售单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:enhance class="space-y-3">
				<h3 class="font-medium">新增销售草稿</h3>
				<div class="grid gap-3">
					<label class="text-muted-foreground text-sm">
						销售单号
						<Input class="mt-1" name="shipmentNumber" required />
					</label>
					<div class="text-muted-foreground text-sm">
						<span class="mb-1 block">明细行</span>
						<SalesLineInput products={data.products} name="lines" />
					</div>
				</div>
				<Button type="submit">保存销售草稿</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if form?.message}
		<Alert variant="warning">{form.message}</Alert>
	{/if}

	<div class="space-y-4">
		{#if data.shipments.length === 0}
			<p class="text-muted-foreground text-sm">暂无销售单。</p>
		{/if}
		{#each data.shipments as shipment (shipment.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{shipment.shipmentNumber}</h3>
							<p class="text-muted-foreground text-sm">
								状态：{shipment.status} | 创建：{shipment.createdAt}
							</p>
						</div>
						{#if shipment.status === 'DRAFT'}
							<form method="post" action="?/post" use:enhance>
								<input type="hidden" name="salesShipmentId" value={shipment.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>

					<div class="overflow-x-auto">
						<table class="w-full min-w-[980px] border-collapse text-sm">
							<thead>
								<tr class="text-muted-foreground border-b text-left">
									<th class="py-1 whitespace-nowrap">行</th>
									<th class="py-1 whitespace-nowrap">成品</th>
									<th class="py-1 whitespace-nowrap">数量</th>
									<th class="py-1 whitespace-nowrap">售价</th>
									<th class="py-1 whitespace-nowrap">收入</th>
									<th class="py-1 whitespace-nowrap">单位成本</th>
									<th class="py-1 whitespace-nowrap">成本</th>
									<th class="py-1 whitespace-nowrap">毛利</th>
									<th class="py-1 whitespace-nowrap">毛利率</th>
								</tr>
							</thead>
							<tbody>
								{#each shipment.lines as line (line.id)}
									<tr class="border-b border-border/50">
										<td class="py-1 whitespace-nowrap">{line.lineNo}</td>
										<td class="py-1 whitespace-nowrap">
											#{line.productId}
											{line.productCode} - {line.productName}
										</td>
										<td class="py-1 whitespace-nowrap">{line.quantity}</td>
										<td class="py-1 whitespace-nowrap">{line.sellingUnitPrice}</td>
										<td class="py-1 whitespace-nowrap">{line.revenue}</td>
										<td class="py-1 whitespace-nowrap">{line.cogsUnitCost}</td>
										<td class="py-1 whitespace-nowrap">{line.cogsTotal}</td>
										<td class="py-1 whitespace-nowrap">{line.grossProfit}</td>
										<td class="py-1 whitespace-nowrap">{line.grossMargin}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
