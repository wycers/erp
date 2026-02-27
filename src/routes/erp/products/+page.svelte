<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	const formatBomLines = (
		lines: {
			materialSkuId: number;
			quantityPerUnit: number;
		}[]
	): string =>
		lines.map((line) => `${line.materialSkuId},${line.quantityPerUnit.toFixed(2)}`).join('\n');
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold text-gray-900">成品与固定配方</h2>
	<form
		method="post"
		action="?/create"
		use:enhance
		class="space-y-3 rounded border border-gray-200 p-4"
	>
		<h3 class="font-medium text-gray-900">新增成品</h3>
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="text-sm text-gray-700"
				>编码
				<input class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="code" required />
			</label>
			<label class="text-sm text-gray-700"
				>名称
				<input class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="name" required />
			</label>
			<label class="text-sm text-gray-700 sm:col-span-2"
				>备注
				<textarea class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="note"
				></textarea>
			</label>
		</div>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存成品</button>
	</form>

	<div class="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
		<p class="font-medium text-gray-900">原料 ID 速查</p>
		<p class="mt-1">BOM 输入格式：`materialSkuId,quantityPerUnit`（每行一条）</p>
		<ul class="mt-2 grid gap-1 sm:grid-cols-2">
			{#each data.materials as material (material.id)}
				<li>#{material.id} - {material.code} - {material.name}</li>
			{/each}
		</ul>
	</div>

	{#if form?.message}
		<p class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
			{form.message}
		</p>
	{/if}

	<div class="space-y-4">
		{#if data.products.length === 0}
			<p class="text-sm text-gray-500">暂无成品，请先新增。</p>
		{/if}

		{#each data.products as product (product.id)}
			<article class="space-y-3 rounded border border-gray-200 p-4">
				<header>
					<p class="text-sm text-gray-500">成品 ID #{product.id}</p>
					<h3 class="font-semibold text-gray-900">{product.code} - {product.name}</h3>
				</header>

				<form method="post" action="?/update" use:enhance class="grid gap-3 sm:grid-cols-2">
					<input type="hidden" name="id" value={product.id} />
					<label class="text-sm text-gray-700"
						>编码
						<input
							class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
							name="code"
							value={product.code}
							required
						/>
					</label>
					<label class="text-sm text-gray-700"
						>名称
						<input
							class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
							name="name"
							value={product.name}
							required
						/>
					</label>
					<label class="text-sm text-gray-700 sm:col-span-2"
						>备注
						<textarea class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="note"
							>{product.note ?? ''}</textarea
						>
					</label>
					<label class="inline-flex items-center gap-2 text-sm text-gray-700">
						<input type="checkbox" name="isActive" checked={product.isActive} />
						启用
					</label>
					<div class="sm:col-span-2">
						<button class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black"
							>更新成品</button
						>
					</div>
				</form>

				<form method="post" action="?/saveBom" use:enhance class="space-y-2">
					<input type="hidden" name="productId" value={product.id} />
					<label class="block text-sm text-gray-700"
						>固定 BOM（materialSkuId,quantityPerUnit）
						<textarea
							class="mt-1 min-h-28 w-full rounded border border-gray-300 px-3 py-2 font-mono text-xs"
							name="lines"
							required>{formatBomLines(product.bomLines)}</textarea
						>
					</label>
					<button class="rounded bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800">
						保存固定 BOM
					</button>
				</form>
			</article>
		{/each}
	</div>
</section>
