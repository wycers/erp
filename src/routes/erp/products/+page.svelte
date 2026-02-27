<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import BomLineInput from './BomLineInput.svelte';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">成品与固定配方</h2>
	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/create" use:enhance class="space-y-3">
				<h3 class="font-medium">新增成品</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-muted-foreground text-sm">
						编码
						<Input class="mt-1" name="code" required />
					</label>
					<label class="text-muted-foreground text-sm">
						名称
						<Input class="mt-1" name="name" required />
					</label>
					<label class="text-muted-foreground text-sm sm:col-span-2">
						单位
						<Input class="mt-1" name="unit" placeholder="如：个、件、箱" />
					</label>
					<label class="text-muted-foreground text-sm sm:col-span-2">
						备注
						<Textarea class="mt-1" name="note" />
					</label>
				</div>
				<Button type="submit">保存成品</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if form?.message}
		<Alert variant="warning">{form.message}</Alert>
	{/if}

	<div class="space-y-4">
		{#if data.products.length === 0}
			<p class="text-muted-foreground text-sm">暂无成品，请先新增。</p>
		{/if}

		{#each data.products as product (product.id)}
			<Card.Root class="gap-3 py-4">
				<Card.Content class="space-y-3 px-4">
					<header>
						<p class="text-muted-foreground text-sm">成品 ID #{product.id}</p>
						<h3 class="font-semibold">{product.code} - {product.name}</h3>
					</header>

					<form method="post" action="?/update" use:enhance class="grid gap-3 sm:grid-cols-2">
						<input type="hidden" name="id" value={product.id} />
						<label class="text-muted-foreground text-sm">
							编码
							<Input class="mt-1" name="code" value={product.code} required />
						</label>
						<label class="text-muted-foreground text-sm">
							名称
							<Input class="mt-1" name="name" value={product.name} required />
						</label>
						<label class="text-muted-foreground text-sm sm:col-span-2">
							单位
							<Input class="mt-1" name="unit" value={product.unit ?? ''} placeholder="如：个、件、箱" />
						</label>
						<label class="text-muted-foreground text-sm sm:col-span-2">
							备注
							<Textarea class="mt-1" name="note">{product.note ?? ''}</Textarea>
						</label>
						<label class="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<input type="checkbox" name="isActive" checked={product.isActive} />
							启用
						</label>
						<div class="sm:col-span-2">
							<Button type="submit" variant="secondary" size="sm">更新成品</Button>
						</div>
					</form>

					<form method="post" action="?/saveBom" use:enhance class="space-y-2">
						<input type="hidden" name="productId" value={product.id} />
						<div class="text-muted-foreground text-sm">
							<span class="mb-1 block">固定 BOM</span>
							<BomLineInput
								materials={data.materials}
								name="lines"
								initialLines={product.bomLines}
							/>
						</div>
						<Button type="submit" variant="secondary" size="sm">保存固定 BOM</Button>
					</form>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
