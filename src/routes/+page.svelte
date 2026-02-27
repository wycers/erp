<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<main class="mx-auto max-w-3xl space-y-4 p-6">
	<h1 class="text-2xl font-bold">ERP Demo</h1>
	<p class="text-muted-foreground">这个项目已包含进货、库存、生产、销售与利润的基础流程。</p>
	<div class="flex flex-wrap gap-3">
		<Button href={resolve('/erp')}>进入 ERP 工作台</Button>
		<Button variant="outline" href={resolve('/demo/better-auth')}>认证示例</Button>
	</div>
</main>
