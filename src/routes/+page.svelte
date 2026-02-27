<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<main class="mx-auto max-w-3xl space-y-4 p-6">
	<h1 class="text-2xl font-bold text-gray-900">ERP Demo</h1>
	<p class="text-gray-700">这个项目已包含进货、库存、生产、销售与利润的基础流程。</p>
	<div class="flex flex-wrap gap-3">
		<a class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" href={resolve('/erp')}
			>进入 ERP 工作台</a
		>
		<a
			class="rounded border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-100"
			href={resolve('/demo/better-auth')}>认证示例</a
		>
	</div>
</main>
