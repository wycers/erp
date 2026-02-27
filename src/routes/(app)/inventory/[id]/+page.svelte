<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { updateProductSchema, adjustStockSchema } from '$lib/application/inventory/schemas'
	import { invalidateAll } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import { Separator } from '$lib/components/ui/separator'
	import { ArrowLeft, Package, Plus, Minus, Edit, Trash2, Loader2 } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let isEditing = $state(false)
	let showAdjustStock = $state(false)

	const {
		form: updateFormData,
		errors: updateErrors,
		enhance: updateEnhance,
		delayed: updateDelayed,
		message: updateMessage
	} = superForm(data.updateForm, {
		validators: zodClient(updateProductSchema),
		resetForm: false,
		onUpdated: ({ form }) => {
			if (form.valid && form.message) {
				isEditing = false
				invalidateAll()
			}
		}
	})

	const {
		form: stockFormData,
		errors: stockErrors,
		enhance: stockEnhance,
		delayed: stockDelayed,
		message: stockMessage
	} = superForm(data.stockForm, {
		validators: zodClient(adjustStockSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message) {
				showAdjustStock = false
				invalidateAll()
			}
		}
	})

	function startAdjustStock(type: 'add' | 'subtract') {
		$stockFormData.adjustmentType = type
		$stockFormData.reason = type === 'add' ? 'receipt' : 'shipment'
		showAdjustStock = true
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button href="/inventory" variant="ghost" size="icon">
				<ArrowLeft class="size-4" />
			</Button>
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-3xl font-bold">{data.product.name}</h1>
					{#if data.product.stockQuantity === 0}
						<Badge variant="destructive">Out of Stock</Badge>
					{:else if data.product.isLowStock}
						<Badge variant="outline" class="border-yellow-500 text-yellow-600">Low Stock</Badge>
					{:else}
						<Badge variant="secondary">In Stock</Badge>
					{/if}
				</div>
				<p class="text-muted-foreground font-mono">{data.product.sku}</p>
			</div>
		</div>

		<div class="flex gap-2">
			<Button variant="outline" onclick={() => (isEditing = !isEditing)}>
				<Edit class="mr-2 size-4" />
				{isEditing ? 'Cancel' : 'Edit'}
			</Button>
			<form method="POST" action="?/delete">
				<Button type="submit" variant="destructive">
					<Trash2 class="mr-2 size-4" />
					Delete
				</Button>
			</form>
		</div>
	</div>

	{#if $updateMessage && !$updateMessage.includes('successfully')}
		<div class="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
			{$updateMessage}
		</div>
	{/if}

	{#if $updateMessage?.includes('successfully') || $stockMessage?.includes('adjusted')}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{$updateMessage || $stockMessage}
		</div>
	{/if}

	<div class="grid gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Package class="size-5" />
					Product Details
				</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if isEditing}
					<form method="POST" action="?/update" use:updateEnhance class="space-y-4">
						<div class="space-y-2">
							<label for="name" class="text-sm font-medium">Name</label>
							<Input
								id="name"
								name="name"
								bind:value={$updateFormData.name}
								aria-invalid={$updateErrors.name ? 'true' : undefined}
							/>
							{#if $updateErrors.name}
								<p class="text-destructive text-xs">{$updateErrors.name}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="description" class="text-sm font-medium">Description</label>
							<textarea
								id="description"
								name="description"
								class="border-input bg-background flex min-h-20 w-full rounded-md border px-3 py-2 text-sm"
								bind:value={$updateFormData.description}
							></textarea>
						</div>

						<div class="space-y-2">
							<label for="unitPrice" class="text-sm font-medium">Unit Price</label>
							<Input
								id="unitPrice"
								name="unitPrice"
								type="number"
								step="0.01"
								bind:value={$updateFormData.unitPrice}
								aria-invalid={$updateErrors.unitPrice ? 'true' : undefined}
							/>
							{#if $updateErrors.unitPrice}
								<p class="text-destructive text-xs">{$updateErrors.unitPrice}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="reorderPoint" class="text-sm font-medium">Reorder Point</label>
							<Input
								id="reorderPoint"
								name="reorderPoint"
								type="number"
								bind:value={$updateFormData.reorderPoint}
								aria-invalid={$updateErrors.reorderPoint ? 'true' : undefined}
							/>
							{#if $updateErrors.reorderPoint}
								<p class="text-destructive text-xs">{$updateErrors.reorderPoint}</p>
							{/if}
						</div>

						<Button type="submit" class="w-full" disabled={$updateDelayed}>
							{#if $updateDelayed}
								<Loader2 class="mr-2 size-4 animate-spin" />
							{/if}
							Save Changes
						</Button>
					</form>
				{:else}
					<dl class="space-y-4">
						<div>
							<dt class="text-muted-foreground text-sm">Description</dt>
							<dd class="mt-1">{data.product.description || 'No description'}</dd>
						</div>
						<Separator />
						<div class="grid grid-cols-2 gap-4">
							<div>
								<dt class="text-muted-foreground text-sm">Unit Price</dt>
								<dd class="mt-1 text-lg font-semibold">
									{data.product.unitPrice.toLocaleString('zh-CN', {
										style: 'currency',
										currency: data.product.currency
									})}
								</dd>
							</div>
							<div>
								<dt class="text-muted-foreground text-sm">Currency</dt>
								<dd class="mt-1">{data.product.currency}</dd>
							</div>
						</div>
						<Separator />
						<div class="grid grid-cols-2 gap-4">
							<div>
								<dt class="text-muted-foreground text-sm">Created</dt>
								<dd class="mt-1 text-sm">
									{new Date(data.product.createdAt).toLocaleDateString('zh-CN')}
								</dd>
							</div>
							<div>
								<dt class="text-muted-foreground text-sm">Updated</dt>
								<dd class="mt-1 text-sm">
									{new Date(data.product.updatedAt).toLocaleDateString('zh-CN')}
								</dd>
							</div>
						</div>
					</dl>
				{/if}
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Stock Management</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="bg-muted/50 rounded-lg p-4 text-center">
						<div class="text-muted-foreground text-sm">Current Stock</div>
						<div class="text-3xl font-bold">{data.product.stockQuantity}</div>
					</div>
					<div class="bg-muted/50 rounded-lg p-4 text-center">
						<div class="text-muted-foreground text-sm">Reorder Point</div>
						<div class="text-3xl font-bold">{data.product.reorderPoint}</div>
					</div>
				</div>

				<div class="flex gap-2">
					<Button class="flex-1" variant="outline" onclick={() => startAdjustStock('add')}>
						<Plus class="mr-2 size-4" />
						Add Stock
					</Button>
					<Button class="flex-1" variant="outline" onclick={() => startAdjustStock('subtract')}>
						<Minus class="mr-2 size-4" />
						Remove Stock
					</Button>
				</div>

				{#if showAdjustStock}
					<form
						method="POST"
						action="?/adjustStock"
						use:stockEnhance
						class="bg-muted/30 space-y-3 rounded-lg p-4"
					>
						<div class="flex items-center justify-between">
							<h4 class="font-medium">
								{$stockFormData.adjustmentType === 'add' ? 'Add Stock' : 'Remove Stock'}
							</h4>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onclick={() => (showAdjustStock = false)}
							>
								Cancel
							</Button>
						</div>

						<input type="hidden" name="adjustmentType" value={$stockFormData.adjustmentType} />

						<div class="space-y-2">
							<label for="quantity" class="text-sm font-medium">Quantity</label>
							<Input
								id="quantity"
								name="quantity"
								type="number"
								min="1"
								bind:value={$stockFormData.quantity}
								aria-invalid={$stockErrors.quantity ? 'true' : undefined}
							/>
							{#if $stockErrors.quantity}
								<p class="text-destructive text-xs">{$stockErrors.quantity}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<label for="reason" class="text-sm font-medium">Reason</label>
							<select
								id="reason"
								name="reason"
								class="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
								bind:value={$stockFormData.reason}
							>
								{#if $stockFormData.adjustmentType === 'add'}
									<option value="receipt">Receipt / Purchase</option>
									<option value="return">Customer Return</option>
									<option value="adjustment">Inventory Adjustment</option>
								{:else}
									<option value="shipment">Shipment / Sale</option>
									<option value="damage">Damaged / Lost</option>
									<option value="adjustment">Inventory Adjustment</option>
								{/if}
							</select>
						</div>

						<div class="space-y-2">
							<label for="reference" class="text-sm font-medium">Reference (Optional)</label>
							<Input
								id="reference"
								name="reference"
								placeholder="Order #, PO #, etc."
								bind:value={$stockFormData.reference}
							/>
						</div>

						<Button type="submit" class="w-full" disabled={$stockDelayed}>
							{#if $stockDelayed}
								<Loader2 class="mr-2 size-4 animate-spin" />
							{/if}
							{$stockFormData.adjustmentType === 'add' ? 'Add' : 'Remove'} Stock
						</Button>
					</form>
				{/if}

				{#if $stockMessage && !$stockMessage.includes('adjusted')}
					<div class="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
						{$stockMessage}
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
