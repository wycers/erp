<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">原料 SKU</h2>
	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/create" use:enhance class="space-y-3">
				<h3 class="font-medium">新增原料</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-muted-foreground text-sm">
						编码
						<Input class="mt-1" name="code" required />
					</label>
					<label class="text-muted-foreground text-sm">
						名称
						<Input class="mt-1" name="name" required />
					</label>
					<label class="text-muted-foreground text-sm">
						单位
						<Input class="mt-1" name="unit" placeholder="如：米、个、件" />
					</label>
					<label class="text-muted-foreground text-sm">
						图片 URL
						<Input class="mt-1" name="imageUrl" />
					</label>
					<label class="text-muted-foreground text-sm sm:col-span-2">
						备注
						<Textarea class="mt-1" name="note" />
					</label>
				</div>
				<Button type="submit">保存原料</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if form?.message}
		<Alert variant="warning">{form.message}</Alert>
	{/if}

	<div class="space-y-3">
		<h3 class="font-medium">已建原料</h3>
		{#if data.materials.length === 0}
			<p class="text-muted-foreground text-sm">暂无原料，请先新增。</p>
		{/if}
		{#each data.materials as material (material.id)}
			<Card.Root class="gap-2 py-3">
				<Card.Content class="px-3">
					<form method="post" action="?/update" use:enhance class="space-y-2">
						<input type="hidden" name="id" value={material.id} />
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="text-muted-foreground text-sm">
								编码
								<Input class="mt-1" name="code" value={material.code} required />
							</label>
							<label class="text-muted-foreground text-sm">
								名称
								<Input class="mt-1" name="name" value={material.name} required />
							</label>
							<label class="text-muted-foreground text-sm">
								单位
								<Input class="mt-1" name="unit" value={material.unit ?? ''} placeholder="如：米、个、件" />
							</label>
							<label class="text-muted-foreground text-sm">
								图片 URL
								<Input class="mt-1" name="imageUrl" value={material.imageUrl ?? ''} />
							</label>
							<label class="text-muted-foreground text-sm sm:col-span-2">
								备注
								<Textarea class="mt-1" name="note">{material.note ?? ''}</Textarea>
							</label>
						</div>
						<label class="text-muted-foreground inline-flex items-center gap-2 text-sm">
							<input type="checkbox" name="isActive" checked={material.isActive} />
							启用
						</label>
						<div>
							<Button type="submit" variant="secondary" size="sm">更新</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
