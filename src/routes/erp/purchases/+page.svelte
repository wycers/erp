<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import PurchaseLineInput from './PurchaseLineInput.svelte';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">进货单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:enhance class="space-y-4">
				<h3 class="font-medium">新增进货草稿</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-muted-foreground text-sm">
						进货单号
						<Input class="mt-1" name="orderNumber" required />
					</label>
					<label class="text-muted-foreground text-sm">
						运费总额
						<Input class="mt-1" name="freightAmount" value="0" required />
					</label>
				</div>
				<div>
					<p class="text-muted-foreground mb-2 text-sm">明细行</p>
					<PurchaseLineInput materials={data.materials} name="lines" />
				</div>
				<Button type="submit">保存进货草稿</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if form?.message}
		<Alert variant="warning">{form.message}</Alert>
	{/if}

	<div class="space-y-4">
		{#if data.orders.length === 0}
			<p class="text-muted-foreground text-sm">暂无进货单。</p>
		{/if}

		{#each data.orders as order (order.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{order.orderNumber}</h3>
							<p class="text-muted-foreground text-sm break-words">
								状态：{order.status} | 运费：{order.freightAmount} | 创建：{order.createdAt}
							</p>
						</div>
						{#if order.status === 'DRAFT'}
							<form method="post" action="?/post" use:enhance>
								<input type="hidden" name="purchaseOrderId" value={order.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>
					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px] border-collapse text-sm">
							<thead>
								<tr class="text-muted-foreground border-b text-left">
									<th class="py-1 whitespace-nowrap">行</th>
									<th class="py-1 whitespace-nowrap">原料</th>
									<th class="py-1 whitespace-nowrap">数量</th>
									<th class="py-1 whitespace-nowrap">金额</th>
									<th class="py-1 whitespace-nowrap">单价</th>
									<th class="py-1 whitespace-nowrap">分摊运费</th>
									<th class="py-1 whitespace-nowrap">到岸单价</th>
								</tr>
							</thead>
							<tbody>
								{#each order.lines as line (line.id)}
									<tr class="border-b border-border/50">
										<td class="py-1 whitespace-nowrap">{line.lineNo}</td>
										<td class="py-1 whitespace-nowrap">
											#{line.materialSkuId}
											{line.materialCode} - {line.materialName}
										</td>
										<td class="py-1 whitespace-nowrap">{line.quantity}</td>
										<td class="py-1 whitespace-nowrap">{line.lineAmount}</td>
										<td class="py-1 whitespace-nowrap">{line.unitPrice}</td>
										<td class="py-1 whitespace-nowrap">{line.allocatedFreight}</td>
										<td class="py-1 whitespace-nowrap">{line.landedUnitCost}</td>
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
