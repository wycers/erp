<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createMaterialFormSchema } from '$lib/application/erp/schemas';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Alert } from '$lib/components/ui/alert';
	import { ImageUploader } from '$lib/components/ui/image-uploader';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from '@lucide/svelte';

	let { data, form: actionForm }: { data: PageData; form: ActionData } = $props();

	const {
		form: createFormData,
		errors: createErrors,
		enhance: createEnhance,
		delayed: createDelayed,
		message: createMessage
	} = superForm(data.createForm, {
		validators: zod4Client(createMaterialFormSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('created')) {
				invalidateAll();
			}
		}
	});

	let createImageUrl = $state('');
	let createNote = $state('');

	$effect(() => {
		if ($createFormData.imageUrl !== undefined) {
			createImageUrl = ($createFormData.imageUrl as string) ?? '';
		}
	});

	$effect(() => {
		$createFormData.imageUrl = createImageUrl || undefined;
	});

	$effect(() => {
		if (typeof $createFormData.note === 'string') {
			createNote = $createFormData.note;
		}
	});

	$effect(() => {
		$createFormData.note = createNote || undefined;
	});

	type Material = PageData['materials'][number];
	type UpdateFormLike = {
		data: {
			id: number;
			code: string;
			name: string;
			unit: string;
			imageUrl?: string;
			note?: string;
			isActive: boolean;
		};
		errors?: {
			code?: string[];
			name?: string[];
			unit?: string[];
			imageUrl?: string[];
			note?: string[];
			isActive?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	const updateFormsByMaterialId = $derived(
		new Map(data.updateForms.map((updateForm) => [updateForm.data.id, updateForm]))
	);

	const getTargetUpdateForm = (materialId: number): UpdateFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetMaterialId?: number;
					updateForm?: UpdateFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'update' || action.targetMaterialId !== materialId) {
			return undefined;
		}

		return action.updateForm;
	};

	const getUpdateForm = (materialId: number): UpdateFormLike | undefined =>
		getTargetUpdateForm(materialId) ??
		(updateFormsByMaterialId.get(materialId) as UpdateFormLike | undefined);

	const getUpdateFieldValue = (
		material: Material,
		field: 'code' | 'name' | 'unit' | 'imageUrl' | 'note'
	): string => {
		const submitted = getUpdateForm(material.id)?.data[field];
		if (typeof submitted === 'string') {
			return submitted;
		}

		const value = material[field];
		return typeof value === 'string' ? value : '';
	};

	const getUpdateFieldError = (
		materialId: number,
		field: 'code' | 'name' | 'unit' | 'imageUrl' | 'note' | 'isActive'
	): string | undefined => getTargetUpdateForm(materialId)?.errors?.[field]?.[0];

	const getUpdateFormError = (materialId: number): string | undefined =>
		getTargetUpdateForm(materialId)?.errors?._errors?.[0];

	const getUpdateActive = (material: Material): boolean => {
		const submitted = getUpdateForm(material.id)?.data.isActive;
		return typeof submitted === 'boolean' ? submitted : material.isActive;
	};

	const showUpdateSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; updateForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'update' && action.message && !action.updateForm);
	};
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">原料 SKU</h2>
	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/create" use:createEnhance class="space-y-3">
				<h3 class="font-medium">新增原料</h3>
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
					<label class="text-sm text-muted-foreground">
						单位
						<Input
							class="mt-1"
							name="unit"
							bind:value={$createFormData.unit}
							aria-invalid={$createErrors.unit ? 'true' : undefined}
							placeholder="如：米、个、件"
						/>
						{#if $createErrors.unit}
							<p class="mt-1 text-xs text-destructive">{$createErrors.unit}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground">
						图片
						<ImageUploader class="mt-1" name="imageUrl" bind:value={createImageUrl} />
					</label>
					<label class="text-sm text-muted-foreground sm:col-span-2">
						备注
						<Textarea
							class="mt-1"
							name="note"
							bind:value={createNote}
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
					保存原料
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

	<div class="space-y-3">
		<h3 class="font-medium">已建原料</h3>
		{#if data.materials.length === 0}
			<p class="text-sm text-muted-foreground">暂无原料，请先新增。</p>
		{/if}
		{#each data.materials as material (material.id)}
			<Card.Root class="gap-2 py-3">
				<Card.Content class="px-3">
					<form
						method="post"
						action="?/update"
						use:enhance={() => {
							return async ({ update }) => {
								await update({ reset: false });
							};
						}}
						class="space-y-2"
					>
						<input type="hidden" name="id" value={material.id} />
						{#if getUpdateFormError(material.id)}
							<p class="text-xs text-destructive">{getUpdateFormError(material.id)}</p>
						{/if}
						<div class="grid gap-3 sm:grid-cols-2">
							<label class="text-sm text-muted-foreground">
								编码
								<Input
									class="mt-1"
									name="code"
									value={getUpdateFieldValue(material, 'code')}
									aria-invalid={getUpdateFieldError(material.id, 'code') ? 'true' : undefined}
									required
								/>
								{#if getUpdateFieldError(material.id, 'code')}
									<p class="mt-1 text-xs text-destructive">
										{getUpdateFieldError(material.id, 'code')}
									</p>
								{/if}
							</label>
							<label class="text-sm text-muted-foreground">
								名称
								<Input
									class="mt-1"
									name="name"
									value={getUpdateFieldValue(material, 'name')}
									aria-invalid={getUpdateFieldError(material.id, 'name') ? 'true' : undefined}
									required
								/>
								{#if getUpdateFieldError(material.id, 'name')}
									<p class="mt-1 text-xs text-destructive">
										{getUpdateFieldError(material.id, 'name')}
									</p>
								{/if}
							</label>
							<label class="text-sm text-muted-foreground">
								单位
								<Input
									class="mt-1"
									name="unit"
									value={getUpdateFieldValue(material, 'unit')}
									aria-invalid={getUpdateFieldError(material.id, 'unit') ? 'true' : undefined}
									placeholder="如：米、个、件"
								/>
								{#if getUpdateFieldError(material.id, 'unit')}
									<p class="mt-1 text-xs text-destructive">
										{getUpdateFieldError(material.id, 'unit')}
									</p>
								{/if}
							</label>
							<label class="text-sm text-muted-foreground">
								图片
								<ImageUploader
									class="mt-1"
									name="imageUrl"
									value={getUpdateFieldValue(material, 'imageUrl')}
								/>
							</label>
							<label class="text-sm text-muted-foreground sm:col-span-2">
								备注
								<Textarea
									class="mt-1"
									name="note"
									value={getUpdateFieldValue(material, 'note')}
									aria-invalid={getUpdateFieldError(material.id, 'note') ? 'true' : undefined}
								/>
								{#if getUpdateFieldError(material.id, 'note')}
									<p class="mt-1 text-xs text-destructive">
										{getUpdateFieldError(material.id, 'note')}
									</p>
								{/if}
							</label>
						</div>
						<label class="inline-flex items-center gap-2 text-sm text-muted-foreground">
							<input
								type="checkbox"
								name="isActive"
								checked={getUpdateActive(material)}
								aria-invalid={getUpdateFieldError(material.id, 'isActive') ? 'true' : undefined}
							/>
							启用
						</label>
						{#if getUpdateFieldError(material.id, 'isActive')}
							<p class="text-xs text-destructive">{getUpdateFieldError(material.id, 'isActive')}</p>
						{/if}
						<div>
							<Button type="submit" variant="secondary" size="sm">更新</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
