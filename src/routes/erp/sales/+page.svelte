<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold text-gray-900">销售单</h2>

	<div class="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
		<p class="font-medium text-gray-900">录入格式</p>
		<p class="mt-1">每行：`productId,quantity,sellingUnitPrice`</p>
		<ul class="mt-2 grid gap-1 sm:grid-cols-2">
			{#each data.products as product (product.id)}
				<li>#{product.id} - {product.code} - {product.name}</li>
			{/each}
		</ul>
	</div>

	<form
		method="post"
		action="?/createDraft"
		use:enhance
		class="space-y-3 rounded border border-gray-200 p-4"
	>
		<h3 class="font-medium text-gray-900">新增销售草稿</h3>
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="text-sm text-gray-700"
				>销售单号
				<input
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="shipmentNumber"
					required
				/>
			</label>
			<label class="text-sm text-gray-700 sm:col-span-2"
				>明细行
				<textarea
					class="mt-1 min-h-28 w-full rounded border border-gray-300 px-3 py-2 font-mono text-xs"
					name="lines"
					placeholder="1,2.00,500.00"
					required
				></textarea>
			</label>
		</div>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存销售草稿</button>
	</form>

	{#if form?.message}
		<p class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
			{form.message}
		</p>
	{/if}

	<div class="space-y-4">
		{#if data.shipments.length === 0}
			<p class="text-sm text-gray-500">暂无销售单。</p>
		{/if}
		{#each data.shipments as shipment (shipment.id)}
			<article class="space-y-2 rounded border border-gray-200 p-4">
				<header class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<h3 class="font-semibold text-gray-900">{shipment.shipmentNumber}</h3>
						<p class="text-sm text-gray-500">
							状态：{shipment.status} | 创建：{shipment.createdAt}
						</p>
					</div>
					{#if shipment.status === 'DRAFT'}
						<form method="post" action="?/post" use:enhance>
							<input type="hidden" name="salesShipmentId" value={shipment.id} />
							<button class="rounded bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800">
								过账
							</button>
						</form>
					{/if}
				</header>

				<div class="overflow-x-auto">
					<table class="w-full min-w-[980px] border-collapse text-sm">
						<thead>
							<tr class="border-b border-gray-200 text-left text-gray-600">
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
								<tr class="border-b border-gray-100">
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
			</article>
		{/each}
	</div>
</section>
