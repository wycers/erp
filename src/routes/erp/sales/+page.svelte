<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { createSalesDraftFormSchema } from '$lib/application/erp/schemas';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Alert } from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';
	import SalesLineInput from './SalesLineInput.svelte';
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
		validators: zod4Client(createSalesDraftFormSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('created')) {
				invalidateAll();
			}
		}
	});

	type PostFormLike = {
		data: {
			salesShipmentId: number;
		};
		errors?: {
			salesShipmentId?: string[];
			_errors?: string[];
		};
		message?: string;
	};

	const getTargetPostForm = (shipmentId: number): PostFormLike | undefined => {
		const action = actionForm as
			| (ActionData & {
					action?: string;
					targetSalesShipmentId?: number;
					postForm?: PostFormLike;
			  })
			| undefined;

		if (!action || action.action !== 'post' || action.targetSalesShipmentId !== shipmentId) {
			return undefined;
		}

		return action.postForm;
	};

	const getPostFormError = (shipmentId: number): string | undefined => {
		const form = getTargetPostForm(shipmentId);
		return form?.errors?._errors?.[0] ?? form?.errors?.salesShipmentId?.[0];
	};

	const showPostSuccess = (): boolean => {
		const action = actionForm as
			| (ActionData & { action?: string; message?: string; postForm?: unknown })
			| undefined;
		return Boolean(action?.action === 'post' && action.message && !action.postForm);
	};
</script>

<section class="space-y-6">
	<h2 class="text-xl font-semibold">销售单</h2>

	<Card.Root class="gap-3 py-4">
		<Card.Content class="px-4">
			<form method="post" action="?/createDraft" use:createDraftEnhance class="space-y-3">
				<h3 class="font-medium">新增销售草稿</h3>
				<div class="grid gap-3">
					<label class="text-sm text-muted-foreground">
						销售单号
						<Input
							class="mt-1"
							name="shipmentNumber"
							bind:value={$createDraftData.shipmentNumber}
							aria-invalid={$createDraftErrors.shipmentNumber ? 'true' : undefined}
							required
						/>
						{#if $createDraftErrors.shipmentNumber}
							<p class="mt-1 text-xs text-destructive">{$createDraftErrors.shipmentNumber}</p>
						{/if}
					</label>
					<div class="text-sm text-muted-foreground">
						<span class="mb-1 block">明细行</span>
						<SalesLineInput products={data.products} name="lines" value={$createDraftData.lines} />
						{#if $createDraftErrors.lines}
							<p class="mt-2 text-xs text-destructive">{$createDraftErrors.lines}</p>
						{/if}
					</div>
				</div>
				<Button type="submit" disabled={$createDraftDelayed}>
					{#if $createDraftDelayed}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					保存销售草稿
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
		{#if data.shipments.length === 0}
			<p class="text-sm text-muted-foreground">暂无销售单。</p>
		{/if}
		{#each data.shipments as shipment (shipment.id)}
			<Card.Root class="gap-2 py-4">
				<Card.Content class="space-y-2 px-4">
					<header class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<h3 class="font-semibold">{shipment.shipmentNumber}</h3>
							<p class="text-sm text-muted-foreground">
								状态：{getDocumentStatusLabel(shipment.status as DocumentStatus)} | 创建：{shipment.createdAt}
							</p>
						</div>
						{#if shipment.status === 'DRAFT'}
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
								<input type="hidden" name="salesShipmentId" value={shipment.id} />
								<Button type="submit" variant="secondary" size="sm">过账</Button>
							</form>
						{/if}
					</header>
					{#if getPostFormError(shipment.id)}
						<p class="text-xs text-destructive">{getPostFormError(shipment.id)}</p>
					{/if}

					<div class="overflow-x-auto">
						<table class="w-full min-w-[980px] border-collapse text-sm">
							<thead>
								<tr class="border-b text-left text-muted-foreground">
									<th class="py-1 whitespace-nowrap">行</th>
									<th class="py-1 whitespace-nowrap">成品</th>
									<th class="py-1 whitespace-nowrap">数量</th>
									<th class="py-1 whitespace-nowrap">售价</th>
									<th class="py-1 whitespace-nowrap">收入</th>
									<th class="py-1 whitespace-nowrap">单位成本</th>
									<th class="py-1 whitespace-nowrap">成本</th>
									<th class="py-1 whitespace-nowrap">毛利</th>
									<th class="py-1 whitespace-nowrap">毛利率</th>
								</tr>
							</thead>
							<tbody>
								{#each shipment.lines as line (line.id)}
									<tr class="border-b border-border/50">
										<td class="py-1 whitespace-nowrap">{line.lineNo}</td>
										<td class="py-1 whitespace-nowrap">
											#{line.productId}
											{line.productCode} - {line.productName}
										</td>
										<td class="py-1 whitespace-nowrap">{line.quantity}</td>
										<td class="py-1 whitespace-nowrap">{line.sellingUnitPrice}</td>
										<td class="py-1 whitespace-nowrap">{line.revenue}</td>
										<td class="py-1 whitespace-nowrap">{line.cogsUnitCost}</td>
										<td class="py-1 whitespace-nowrap">{line.cogsTotal}</td>
										<td class="py-1 whitespace-nowrap">{line.grossProfit}</td>
										<td class="py-1 whitespace-nowrap">{line.grossMargin}</td>
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
