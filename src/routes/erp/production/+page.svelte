<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { getDocumentStatusLabel, type DocumentStatus } from '$lib/utils/status-labels';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">生产单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:enhance class="space-y-3">
				<h3 class="font-medium">新增生产草稿</h3>
				<div class="grid gap-3 sm:grid-cols-3">
					<label class="text-muted-foreground text-sm">
						生产单号
						<Input class="mt-1" name="orderNumber" required />
					</label>
					<label class="text-muted-foreground text-sm">
						成品
						<select
							class="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 mt-1 flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
							name="productId"
							required
						>
							<option value="">请选择成品</option>
							{#each data.products as product (product.id)}
								<option value={product.id}>#{product.id} {product.code} - {product.name}</option>
							{/each}
						</select>
					</label>
					<label class="text-muted-foreground text-sm">
						产出数量
						<Input class="mt-1" name="outputQuantity" placeholder="1.00" required />
					</label>
				</div>
				<Button type="submit">保存生产草稿</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if form?.message}
		<Alert variant="warning">{form.message}</Alert>
	{/if}

	<div class="space-y-4">
		{#if data.orders.length === 0}
			<p class="text-muted-foreground text-sm">暂无生产单。</p>
		{/if}
		{#each data.orders as order (order.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{order.orderNumber}</h3>
							<p class="text-muted-foreground mt-1 text-sm">
								<span class="block break-words">
									成品：#{order.productId}
									{order.productCode} - {order.productName} | 数量：{order.outputQuantity} | 状态：{getDocumentStatusLabel(order.status as DocumentStatus)}
								</span>
								<span class="block">
									单位成本：{order.unitCost} | 总耗材成本：{order.totalConsumedCost}
								</span>
							</p>
						</div>
						{#if order.status === 'DRAFT'}
							<form method="post" action="?/post" use:enhance>
								<input type="hidden" name="productionOrderId" value={order.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>

					{#if order.components.length > 0}
						<div class="overflow-x-auto">
							<table class="w-full min-w-[700px] border-collapse text-sm">
								<thead>
									<tr class="text-muted-foreground border-b text-left">
										<th class="py-1 whitespace-nowrap">行</th>
										<th class="py-1 whitespace-nowrap">原料</th>
										<th class="py-1 whitespace-nowrap">耗用数量</th>
										<th class="py-1 whitespace-nowrap">成本单价</th>
										<th class="py-1 whitespace-nowrap">成本金额</th>
									</tr>
								</thead>
								<tbody>
									{#each order.components as component (component.materialSkuId)}
										<tr class="border-b border-border/50">
											<td class="py-1 whitespace-nowrap">{component.lineNo}</td>
											<td class="py-1 whitespace-nowrap">
												#{component.materialSkuId}
												{component.materialCode} - {component.materialName}
											</td>
											<td class="py-1 whitespace-nowrap">{component.requiredQuantity}</td>
											<td class="py-1 whitespace-nowrap">{component.unitCost}</td>
											<td class="py-1 whitespace-nowrap">{component.totalCost}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
