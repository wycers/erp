<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold text-gray-900">进货单</h2>

	<div class="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
		<p class="font-medium text-gray-900">录入格式</p>
		<p class="mt-1">每行：`materialSkuId,quantity,lineAmount`</p>
		<ul class="mt-2 grid gap-1 sm:grid-cols-2">
			{#each data.materials as material (material.id)}
				<li>#{material.id} - {material.code} - {material.name}</li>
			{/each}
		</ul>
	</div>

	<form
		method="post"
		action="?/createDraft"
		use:enhance
		class="space-y-3 rounded border border-gray-200 p-4"
	>
		<h3 class="font-medium text-gray-900">新增进货草稿</h3>
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="text-sm text-gray-700"
				>进货单号
				<input
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="orderNumber"
					required
				/>
			</label>
			<label class="text-sm text-gray-700"
				>运费总额
				<input
					class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
					name="freightAmount"
					value="0"
					required
				/>
			</label>
			<label class="text-sm text-gray-700 sm:col-span-2"
				>明细行
				<textarea
					class="mt-1 min-h-28 w-full rounded border border-gray-300 px-3 py-2 font-mono text-xs"
					name="lines"
					placeholder="1,10.5,100.00&#10;2,3.00,50.00"
					required
				></textarea>
			</label>
		</div>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存进货草稿</button>
	</form>

	{#if form?.message}
		<p class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
			{form.message}
		</p>
	{/if}

	<div class="space-y-4">
		{#if data.orders.length === 0}
			<p class="text-sm text-gray-500">暂无进货单。</p>
		{/if}

		{#each data.orders as order (order.id)}
			<article class="space-y-2 rounded border border-gray-200 p-4">
				<header class="flex flex-wrap items-center justify-between gap-2">
					<div>
						<h3 class="font-semibold text-gray-900">{order.orderNumber}</h3>
						<p class="text-sm break-words text-gray-500">
							状态：{order.status} | 运费：{order.freightAmount} | 创建：{order.createdAt}
						</p>
					</div>
					{#if order.status === 'DRAFT'}
						<form method="post" action="?/post" use:enhance>
							<input type="hidden" name="purchaseOrderId" value={order.id} />
							<button class="rounded bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800">
								过账
							</button>
						</form>
					{/if}
				</header>
				<div class="overflow-x-auto">
					<table class="w-full min-w-[760px] border-collapse text-sm">
						<thead>
							<tr class="border-b border-gray-200 text-left text-gray-600">
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
								<tr class="border-b border-gray-100">
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
			</article>
		{/each}
	</div>
</section>
