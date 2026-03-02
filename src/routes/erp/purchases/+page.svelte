<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createPurchaseDraftFormSchema } from '$lib/application/erp/schemas';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import PurchaseLineInput from './PurchaseLineInput.svelte';
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
		validators: zod4Client(createPurchaseDraftFormSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('created')) {
				invalidateAll();
			}
		}
	});

	type PostFormLike = {
		data: {
			purchaseOrderId: number;
		};
		errors?: {
			purchaseOrderId?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	const getTargetPostForm = (orderId: number): PostFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetPurchaseOrderId?: number;
					postForm?: PostFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'post' || action.targetPurchaseOrderId !== orderId) {
			return undefined;
		}

		return action.postForm;
	};

	const getPostFormError = (orderId: number): string | undefined => {
		const form = getTargetPostForm(orderId);
		return form?.errors?._errors?.[0] ?? form?.errors?.purchaseOrderId?.[0];
	};

	const showPostSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; postForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'post' && action.message && !action.postForm);
	};
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">进货单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:createDraftEnhance class="space-y-4">
				<h3 class="font-medium">新增进货草稿</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="text-sm text-muted-foreground">
						进货单号
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
						运费总额
						<Input
							class="mt-1"
							name="freightAmount"
							type="number"
							step="0.01"
							min="0"
							bind:value={$createDraftData.freightAmount}
							aria-invalid={$createDraftErrors.freightAmount ? 'true' : undefined}
							required
						/>
						{#if $createDraftErrors.freightAmount}
							<p class="mt-1 text-xs text-destructive">{$createDraftErrors.freightAmount}</p>
						{/if}
					</label>
				</div>
				<div>
					<p class="mb-2 text-sm text-muted-foreground">明细行</p>
					<PurchaseLineInput
						materials={data.materials}
						name="lines"
						value={$createDraftData.lines}
					/>
					{#if $createDraftErrors.lines}
						<p class="mt-2 text-xs text-destructive">{$createDraftErrors.lines}</p>
					{/if}
				</div>
				<Button type="submit" disabled={$createDraftDelayed}>
					{#if $createDraftDelayed}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					保存进货草稿
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
			<p class="text-sm text-muted-foreground">暂无进货单。</p>
		{/if}

		{#each data.orders as order (order.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{order.orderNumber}</h3>
							<p class="text-sm break-words text-muted-foreground">
								状态：{getDocumentStatusLabel(order.status as DocumentStatus)} | 运费：{order.freightAmount}
								| 创建：{order.createdAt}
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
								<input type="hidden" name="purchaseOrderId" value={order.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>
					{#if getPostFormError(order.id)}
						<p class="text-xs text-destructive">{getPostFormError(order.id)}</p>
					{/if}
					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px] border-collapse text-sm">
							<thead>
								<tr class="border-b text-left text-muted-foreground">
									<th class="py-1 whitespace-nowrap">行</th>
									<th class="py-1 whitespace-nowrap">原料</th>
									<th class="py-1 whitespace-nowrap">数量</th>
									<th class="py-1 whitespace-nowrap">金额</th>
									<th class="py-1 whitespace-nowrap">单价</th>
									<th class="py-1 whitespace-nowrap">分摊运费</th>
									<th class="py-1 whitespace-nowrap">到岸单价</th>
								</tr>
							</thead>
							<tbody>
								{#each order.lines as line (line.id)}
									<tr class="border-b border-border/50">
										<td class="py-1 whitespace-nowrap">{line.lineNo}</td>
										<td class="py-1 whitespace-nowrap">
											#{line.materialSkuId}
											{line.materialCode} - {line.materialName}
										</td>
										<td class="py-1 whitespace-nowrap">{line.quantity}</td>
										<td class="py-1 whitespace-nowrap">{line.lineAmount}</td>
										<td class="py-1 whitespace-nowrap">{line.unitPrice}</td>
										<td class="py-1 whitespace-nowrap">{line.allocatedFreight}</td>
										<td class="py-1 whitespace-nowrap">{line.landedUnitCost}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
