<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<section class="space-y-4">
	<h2 class="text-xl font-semibold text-gray-900">库存总览</h2>
	<div class="overflow-x-auto">
		<table class="w-full min-w-[680px] border-collapse text-sm">
			<thead>
				<tr class="border-b border-gray-200 text-left text-gray-600">
					<th class="py-2 whitespace-nowrap">类型</th>
					<th class="py-2 whitespace-nowrap">编码</th>
					<th class="py-2 whitespace-nowrap">名称</th>
					<th class="py-2 whitespace-nowrap">库存数量</th>
					<th class="py-2 whitespace-nowrap">平均成本</th>
					<th class="py-2 whitespace-nowrap">查看</th>
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row (row.inventoryItemId)}
					<tr class="border-b border-gray-100">
						<td class="py-2 whitespace-nowrap">{row.kind}</td>
						<td class="py-2 whitespace-nowrap">{row.code}</td>
						<td class="py-2 whitespace-nowrap">{row.name}</td>
						<td class="py-2 whitespace-nowrap">{row.quantity.toFixed(2)}</td>
						<td class="py-2 whitespace-nowrap">{row.averageCost.toFixed(2)}</td>
						<td class="py-2 whitespace-nowrap">
							<a
								class="text-blue-700 underline"
								href={resolve('/erp/inventory/[inventoryItemId]', {
									inventoryItemId: String(row.inventoryItemId)
								})}>明细</a
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
