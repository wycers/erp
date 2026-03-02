<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createProductFormSchema } from '$lib/application/erp/schemas';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import BomLineInput from './BomLineInput.svelte';
	import { Loader2 } from '@lucide/svelte';

	let { data, form: actionForm }: { data: PageData; form: ActionData } = $props();

	const {
		form: createFormData,
		errors: createErrors,
		enhance: createEnhance,
		delayed: createDelayed,
		message: createMessage
	} = superForm(data.createForm, {
		validators: zod4Client(createProductFormSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('created')) {
				invalidateAll();
			}
		}
	});

	type Product = PageData['products'][number];
	type UpdateFormLike = {
		data: {
			id: number;
			code: string;
			name: string;
			unit: string;
			note?: string;
			isActive: boolean;
		};
		errors?: {
			code?: string[];
			name?: string[];
			unit?: string[];
			note?: string[];
			isActive?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	type BomFormLike = {
		data: {
			productId: number;
			lines: string;
		};
		errors?: {
			lines?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	const updateFormsByProductId = $derived(
		new Map(data.updateForms.map((updateForm) => [updateForm.data.id, updateForm]))
	);
	const bomFormsByProductId = $derived(
		new Map(data.bomForms.map((bomForm) => [bomForm.data.productId, bomForm]))
	);

	const getTargetUpdateForm = (productId: number): UpdateFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetProductId?: number;
					updateForm?: UpdateFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'update' || action.targetProductId !== productId) {
			return undefined;
		}

		return action.updateForm;
	};

	const getUpdateForm = (productId: number): UpdateFormLike | undefined =>
		getTargetUpdateForm(productId) ??
		(updateFormsByProductId.get(productId) as UpdateFormLike | undefined);

	const getTargetBomForm = (productId: number): BomFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetProductId?: number;
					bomForm?: BomFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'saveBom' || action.targetProductId !== productId) {
			return undefined;
		}

		return action.bomForm;
	};

	const getBomForm = (productId: number): BomFormLike | undefined =>
		getTargetBomForm(productId) ?? (bomFormsByProductId.get(productId) as BomFormLike | undefined);

	const getUpdateFieldValue = (
		product: Product,
		field: 'code' | 'name' | 'unit' | 'note'
	): string => {
		const submitted = getUpdateForm(product.id)?.data[field];
		if (typeof submitted === 'string') {
			return submitted;
		}

		const value = product[field];
		return typeof value === 'string' ? value : '';
	};

	const getUpdateFieldError = (
		productId: number,
		field: 'code' | 'name' | 'unit' | 'note' | 'isActive'
	): string | undefined => getTargetUpdateForm(productId)?.errors?.[field]?.[0];

	const getUpdateFormError = (productId: number): string | undefined =>
		getTargetUpdateForm(productId)?.errors?._errors?.[0];

	const getUpdateActive = (product: Product): boolean => {
		const submitted = getUpdateForm(product.id)?.data.isActive;
		return typeof submitted === 'boolean' ? submitted : product.isActive;
	};

	const serializeBomLines = (lines: Product['bomLines']): string =>
		lines.map((line) => `${line.materialSkuId},${line.quantityPerUnit}`).join('\n');

	const getBomLinesValue = (product: Product): string => {
		const submitted = getBomForm(product.id)?.data.lines;
		if (typeof submitted === 'string') {
			return submitted;
		}
		return serializeBomLines(product.bomLines);
	};

	const getBomLinesError = (productId: number): string | undefined =>
		getTargetBomForm(productId)?.errors?.lines?.[0];

	const getBomFormError = (productId: number): string | undefined =>
		getTargetBomForm(productId)?.errors?._errors?.[0];

	const showUpdateSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; updateForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'update' && action.message && !action.updateForm);
	};

	const showBomSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; bomForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'saveBom' && action.message && !action.bomForm);
	};
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">成品与固定配方</h2>
	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/create" use:createEnhance class="space-y-3">
				<h3 class="font-medium">新增成品</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-sm text-muted-foreground">
						编码
						<Input
							class="mt-1"
							name="code"
							bind:value={$createFormData.code}
							aria-invalid={$createErrors.code ? 'true' : undefined}
							required
						/>
						{#if $createErrors.code}
							<p class="mt-1 text-xs text-destructive">{$createErrors.code}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground">
						名称
						<Input
							class="mt-1"
							name="name"
							bind:value={$createFormData.name}
							aria-invalid={$createErrors.name ? 'true' : undefined}
							required
						/>
						{#if $createErrors.name}
							<p class="mt-1 text-xs text-destructive">{$createErrors.name}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground sm:col-span-2">
						单位
						<Input
							class="mt-1"
							name="unit"
							bind:value={$createFormData.unit}
							aria-invalid={$createErrors.unit ? 'true' : undefined}
							placeholder="如：个、件、箱"
						/>
						{#if $createErrors.unit}
							<p class="mt-1 text-xs text-destructive">{$createErrors.unit}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground sm:col-span-2">
						备注
						<Textarea
							class="mt-1"
							name="note"
							bind:value={$createFormData.note}
							aria-invalid={$createErrors.note ? 'true' : undefined}
						/>
						{#if $createErrors.note}
							<p class="mt-1 text-xs text-destructive">{$createErrors.note}</p>
						{/if}
					</label>
				</div>
				<Button type="submit" disabled={$createDelayed}>
					{#if $createDelayed}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					保存成品
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if $createMessage}
		<Alert variant="warning">{$createMessage}</Alert>
	{/if}

	{#if showUpdateSuccess()}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{(actionForm as ActionData & { message?: string }).message}
		</div>
	{/if}

	{#if showBomSuccess()}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{(actionForm as ActionData & { message?: string }).message}
		</div>
	{/if}

	<div class="space-y-4">
		{#if data.products.length === 0}
			<p class="text-sm text-muted-foreground">暂无成品，请先新增。</p>
		{/if}

		{#each data.products as product (product.id)}
			<Card.Root class="gap-3 py-4">
				<Card.Content class="space-y-3 px-4">
					<header>
						<p class="text-sm text-muted-foreground">成品 ID #{product.id}</p>
						<h3 class="font-semibold">{product.code} - {product.name}</h3>
					</header>

					<form
						method="post"
						action="?/update"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update({ reset: false });
								if (result.type === 'success') {
									await invalidateAll();
								}
							};
						}}
						class="grid gap-3 sm:grid-cols-2"
					>
						<input type="hidden" name="id" value={product.id} />
						{#if getUpdateFormError(product.id)}
							<p class="text-xs text-destructive sm:col-span-2">{getUpdateFormError(product.id)}</p>
						{/if}
						<label class="text-sm text-muted-foreground">
							编码
							<Input
								class="mt-1"
								name="code"
								value={getUpdateFieldValue(product, 'code')}
								aria-invalid={getUpdateFieldError(product.id, 'code') ? 'true' : undefined}
								required
							/>
							{#if getUpdateFieldError(product.id, 'code')}
								<p class="mt-1 text-xs text-destructive">
									{getUpdateFieldError(product.id, 'code')}
								</p>
							{/if}
						</label>
						<label class="text-sm text-muted-foreground">
							名称
							<Input
								class="mt-1"
								name="name"
								value={getUpdateFieldValue(product, 'name')}
								aria-invalid={getUpdateFieldError(product.id, 'name') ? 'true' : undefined}
								required
							/>
							{#if getUpdateFieldError(product.id, 'name')}
								<p class="mt-1 text-xs text-destructive">
									{getUpdateFieldError(product.id, 'name')}
								</p>
							{/if}
						</label>
						<label class="text-sm text-muted-foreground sm:col-span-2">
							单位
							<Input
								class="mt-1"
								name="unit"
								value={getUpdateFieldValue(product, 'unit')}
								aria-invalid={getUpdateFieldError(product.id, 'unit') ? 'true' : undefined}
								placeholder="如：个、件、箱"
							/>
							{#if getUpdateFieldError(product.id, 'unit')}
								<p class="mt-1 text-xs text-destructive">
									{getUpdateFieldError(product.id, 'unit')}
								</p>
							{/if}
						</label>
						<label class="text-sm text-muted-foreground sm:col-span-2">
							备注
							<Textarea
								class="mt-1"
								name="note"
								value={getUpdateFieldValue(product, 'note')}
								aria-invalid={getUpdateFieldError(product.id, 'note') ? 'true' : undefined}
							/>
							{#if getUpdateFieldError(product.id, 'note')}
								<p class="mt-1 text-xs text-destructive">
									{getUpdateFieldError(product.id, 'note')}
								</p>
							{/if}
						</label>
						<label class="inline-flex items-center gap-2 text-sm text-muted-foreground">
							<input
								type="checkbox"
								name="isActive"
								checked={getUpdateActive(product)}
								aria-invalid={getUpdateFieldError(product.id, 'isActive') ? 'true' : undefined}
							/>
							启用
						</label>
						{#if getUpdateFieldError(product.id, 'isActive')}
							<p class="text-xs text-destructive sm:col-span-2">
								{getUpdateFieldError(product.id, 'isActive')}
							</p>
						{/if}
						<div class="sm:col-span-2">
							<Button type="submit" variant="secondary" size="sm">更新成品</Button>
						</div>
					</form>

					<form
						method="post"
						action="?/saveBom"
						use:enhance={() => {
							return async ({ result, update }) => {
								await update({ reset: false });
								if (result.type === 'success') {
									await invalidateAll();
								}
							};
						}}
						class="space-y-2"
					>
						<input type="hidden" name="productId" value={product.id} />
						<div class="text-sm text-muted-foreground">
							<span class="mb-1 block">固定 BOM</span>
							<BomLineInput
								materials={data.materials}
								name="lines"
								value={getBomLinesValue(product)}
								initialLines={product.bomLines}
							/>
						</div>
						{#if getBomLinesError(product.id)}
							<p class="text-xs text-destructive">{getBomLinesError(product.id)}</p>
						{/if}
						{#if getBomFormError(product.id)}
							<p class="text-xs text-destructive">{getBomFormError(product.id)}</p>
						{/if}
						<Button type="submit" variant="secondary" size="sm">保存固定 BOM</Button>
					</form>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
