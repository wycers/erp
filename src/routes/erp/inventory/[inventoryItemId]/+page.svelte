<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<section class="space-y-4">
	<p><a class="text-blue-700 underline" href={resolve('/erp/inventory')}>返回库存总览</a></p>
	<h2 class="text-xl font-semibold break-words text-gray-900">
		库存明细：{data.item.code} - {data.item.name}
	</h2>
	<p class="text-sm break-words text-gray-600">
		类型：{data.item.kind} | 在库：{data.item.quantity.toFixed(2)} | 平均成本：{data.item.averageCost.toFixed(
			2
		)}
	</p>

	<div class="overflow-x-auto">
		<table class="w-full min-w-[920px] border-collapse text-sm">
			<thead>
				<tr class="border-b border-gray-200 text-left text-gray-600">
					<th class="py-1 whitespace-nowrap">时间</th>
					<th class="py-1 whitespace-nowrap">方向</th>
					<th class="py-1 whitespace-nowrap">来源</th>
					<th class="py-1 whitespace-nowrap">数量</th>
					<th class="py-1 whitespace-nowrap">单位成本</th>
					<th class="py-1 whitespace-nowrap">金额</th>
					<th class="py-1 whitespace-nowrap">余额数量</th>
					<th class="py-1 whitespace-nowrap">余额均价</th>
				</tr>
			</thead>
			<tbody>
				{#each data.movements as movement (movement.id)}
					<tr class="border-b border-gray-100">
						<td class="py-1 whitespace-nowrap">{movement.createdAt}</td>
						<td class="py-1 whitespace-nowrap">{movement.direction}</td>
						<td class="py-1 whitespace-nowrap">{movement.sourceType} #{movement.sourceNumber}</td>
						<td class="py-1 whitespace-nowrap">{movement.quantity.toFixed(2)}</td>
						<td class="py-1 whitespace-nowrap">{movement.unitCost.toFixed(2)}</td>
						<td class="py-1 whitespace-nowrap">{movement.totalCost.toFixed(2)}</td>
						<td class="py-1 whitespace-nowrap">{movement.balanceQuantity.toFixed(2)}</td>
						<td class="py-1 whitespace-nowrap">{movement.balanceAverageCost.toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
