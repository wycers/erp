<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createProductionDraftFormSchema } from '$lib/application/erp/schemas';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from '@lucide/svelte';
	import { getDocumentStatusLabel, type DocumentStatus } from '$lib/utils/status-labels';

	let { data, form: actionForm }: { data: PageData; form: ActionData } = $props();

	const {
		form: createDraftData,
		errors: createDraftErrors,
		enhance: createDraftEnhance,
		delayed: createDraftDelayed,
		message: createDraftMessage
	} = superForm(data.createDraftForm, {
		validators: zod4Client(createProductionDraftFormSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('created')) {
				invalidateAll();
			}
		}
	});

	type PostFormLike = {
		data: {
			productionOrderId: number;
		};
		errors?: {
			productionOrderId?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	const getTargetPostForm = (orderId: number): PostFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetProductionOrderId?: number;
					postForm?: PostFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'post' || action.targetProductionOrderId !== orderId) {
			return undefined;
		}

		return action.postForm;
	};

	const getPostFormError = (orderId: number): string | undefined => {
		const form = getTargetPostForm(orderId);
		return form?.errors?._errors?.[0] ?? form?.errors?.productionOrderId?.[0];
	};

	const showPostSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; postForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'post' && action.message && !action.postForm);
	};
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">生产单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:createDraftEnhance class="space-y-3">
				<h3 class="font-medium">新增生产草稿</h3>
				<div class="grid gap-3 sm:grid-cols-3">
					<label class="text-sm text-muted-foreground">
						生产单号
						<Input
							class="mt-1"
							name="orderNumber"
							bind:value={$createDraftData.orderNumber}
							aria-invalid={$createDraftErrors.orderNumber ? 'true' : undefined}
							required
						/>
						{#if $createDraftErrors.orderNumber}
							<p class="mt-1 text-xs text-destructive">{$createDraftErrors.orderNumber}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground">
						成品
						<select
							class="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
							name="productId"
							bind:value={$createDraftData.productId}
							aria-invalid={$createDraftErrors.productId ? 'true' : undefined}
							required
						>
							<option value={0}>请选择成品</option>
							{#each data.products as product (product.id)}
								<option value={product.id}>#{product.id} {product.code} - {product.name}</option>
							{/each}
						</select>
						{#if $createDraftErrors.productId}
							<p class="mt-1 text-xs text-destructive">{$createDraftErrors.productId}</p>
						{/if}
					</label>
					<label class="text-sm text-muted-foreground">
						产出数量
						<Input
							class="mt-1"
							name="outputQuantity"
							type="number"
							step="0.01"
							min="0"
							bind:value={$createDraftData.outputQuantity}
							aria-invalid={$createDraftErrors.outputQuantity ? 'true' : undefined}
							required
						/>
						{#if $createDraftErrors.outputQuantity}
							<p class="mt-1 text-xs text-destructive">{$createDraftErrors.outputQuantity}</p>
						{/if}
					</label>
				</div>
				<Button type="submit" disabled={$createDraftDelayed}>
					{#if $createDraftDelayed}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					保存生产草稿
				</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if $createDraftMessage}
		<Alert variant="warning">{$createDraftMessage}</Alert>
	{/if}

	{#if showPostSuccess()}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{(actionForm as ActionData & { message?: string }).message}
		</div>
	{/if}

	<div class="space-y-4">
		{#if data.orders.length === 0}
			<p class="text-sm text-muted-foreground">暂无生产单。</p>
		{/if}
		{#each data.orders as order (order.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{order.orderNumber}</h3>
							<p class="mt-1 text-sm text-muted-foreground">
								<span class="block break-words">
									成品：#{order.productId}
									{order.productCode} - {order.productName} | 数量：{order.outputQuantity} | 状态：{getDocumentStatusLabel(
										order.status as DocumentStatus
									)}
								</span>
								<span class="block"
									>单位成本：{order.unitCost} | 总耗材成本：{order.totalConsumedCost}</span
								>
							</p>
						</div>
						{#if order.status === 'DRAFT'}
							<form
								method="post"
								action="?/post"
								use:enhance={() => {
									return async ({ result, update }) => {
										await update({ reset: false });
										if (result.type === 'success') {
											await invalidateAll();
										}
									};
								}}
							>
								<input type="hidden" name="productionOrderId" value={order.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>
					{#if getPostFormError(order.id)}
						<p class="text-xs text-destructive">{getPostFormError(order.id)}</p>
					{/if}

					{#if order.components.length > 0}
						<div class="overflow-x-auto">
							<table class="w-full min-w-[700px] border-collapse text-sm">
								<thead>
									<tr class="border-b text-left text-muted-foreground">
										<th class="py-1 whitespace-nowrap">行</th>
										<th class="py-1 whitespace-nowrap">原料</th>
										<th class="py-1 whitespace-nowrap">耗用数量</th>
										<th class="py-1 whitespace-nowrap">成本单价</th>
										<th class="py-1 whitespace-nowrap">成本金额</th>
									</tr>
								</thead>
								<tbody>
									{#each order.components as component (component.materialSkuId)}
										<tr class="border-b border-border/50">
											<td class="py-1 whitespace-nowrap">{component.lineNo}</td>
											<td class="py-1 whitespace-nowrap">
												#{component.materialSkuId}
												{component.materialCode} - {component.materialName}
											</td>
											<td class="py-1 whitespace-nowrap">{component.requiredQuantity}</td>
											<td class="py-1 whitespace-nowrap">{component.unitCost}</td>
											<td class="py-1 whitespace-nowrap">{component.totalCost}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
