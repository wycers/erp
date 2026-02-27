<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold text-gray-900">原料 SKU</h2>
	<form
		method="post"
		action="?/create"
		use:enhance
		class="space-y-3 rounded border border-gray-200 p-4"
	>
		<h3 class="font-medium text-gray-900">新增原料</h3>
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
				>图片 URL
				<input class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="imageUrl" />
			</label>
			<label class="text-sm text-gray-700 sm:col-span-2"
				>备注
				<textarea class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="note"
				></textarea>
			</label>
		</div>
		<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">保存原料</button>
	</form>

	{#if form?.message}
		<p class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
			{form.message}
		</p>
	{/if}

	<div class="space-y-3">
		<h3 class="font-medium text-gray-900">已建原料</h3>
		{#if data.materials.length === 0}
			<p class="text-sm text-gray-500">暂无原料，请先新增。</p>
		{/if}
		{#each data.materials as material (material.id)}
			<form
				method="post"
				action="?/update"
				use:enhance
				class="space-y-2 rounded border border-gray-200 p-3"
			>
				<input type="hidden" name="id" value={material.id} />
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-sm text-gray-700"
						>编码
						<input
							class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
							name="code"
							value={material.code}
							required
						/>
					</label>
					<label class="text-sm text-gray-700"
						>名称
						<input
							class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
							name="name"
							value={material.name}
							required
						/>
					</label>
					<label class="text-sm text-gray-700 sm:col-span-2"
						>图片 URL
						<input
							class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
							name="imageUrl"
							value={material.imageUrl ?? ''}
						/>
					</label>
					<label class="text-sm text-gray-700 sm:col-span-2"
						>备注
						<textarea class="mt-1 w-full rounded border border-gray-300 px-3 py-2" name="note"
							>{material.note ?? ''}</textarea
						>
					</label>
				</div>
				<label class="inline-flex items-center gap-2 text-sm text-gray-700">
					<input type="checkbox" name="isActive" checked={material.isActive} />
					启用
				</label>
				<div>
					<button class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black"
						>更新</button
					>
				</div>
			</form>
		{/each}
	</div>
</section>
