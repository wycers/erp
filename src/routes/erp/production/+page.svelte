<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold text-gray-900">生产单</h2>

	<form
		method="post"
		action="?/createDraft"
		use:enhance
		class="space-y-3 rounded border border-gray-200 p-4"
	>
		<h3 class="font-medium text-gray-900">新增生产草稿</h3>
		<div class="grid gap-3 sm:grid-cols-3">
			<label class="text-sm text-gray-700"
				>生产单号
				<input
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="orderNumber"
					required
				/>
			</label>
			<label class="text-sm text-gray-700"
				>成品
				<select
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="productId"
					required
				>
					<option value="">请选择成品</option>
					{#each data.products as product (product.id)}
						<option value={product.id}>#{product.id} {product.code} - {product.name}</option>
					{/each}
				</select>
			</label>
			<label class="text-sm text-gray-700"
				>产出数量
				<input
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="outputQuantity"
					placeholder="1.00"
					required
				/>
			</label>
		</div>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存生产草稿</button>
	</form>

	{#if form?.message}
		<p class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
			{form.message}
		</p>
	{/if}

	<div class="space-y-4">
		{#if data.orders.length === 0}
			<p class="text-sm text-gray-500">暂无生产单。</p>
		{/if}
		{#each data.orders as order (order.id)}
			<article class="space-y-2 rounded border border-gray-200 p-4">
				<header class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<h3 class="font-semibold text-gray-900">{order.orderNumber}</h3>
						<p class="mt-1 text-sm text-gray-500">
							<span class="block break-words">
								成品：#{order.productId}
								{order.productCode} - {order.productName} | 数量：{order.outputQuantity} | 状态：
								{order.status}
							</span>
							<span class="block"
								>单位成本：{order.unitCost} | 总耗材成本：{order.totalConsumedCost}</span
							>
						</p>
					</div>
					{#if order.status === 'DRAFT'}
						<form method="post" action="?/post" use:enhance>
							<input type="hidden" name="productionOrderId" value={order.id} />
							<button class="rounded bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800">
								过账
							</button>
						</form>
					{/if}
				</header>

				{#if order.components.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full min-w-[700px] border-collapse text-sm">
							<thead>
								<tr class="border-b border-gray-200 text-left text-gray-600">
									<th class="py-1 whitespace-nowrap">行</th>
									<th class="py-1 whitespace-nowrap">原料</th>
									<th class="py-1 whitespace-nowrap">耗用数量</th>
									<th class="py-1 whitespace-nowrap">成本单价</th>
									<th class="py-1 whitespace-nowrap">成本金额</th>
								</tr>
							</thead>
							<tbody>
								{#each order.components as component (component.materialSkuId)}
									<tr class="border-b border-gray-100">
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
			</article>
		{/each}
	</div>
</section>
