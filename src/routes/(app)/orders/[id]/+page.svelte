<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { addOrderItemSchema } from '$lib/application/orders/schemas'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { Separator } from '$lib/components/ui/separator'
	import {
		ArrowLeft,
		ShoppingCart,
		MapPin,
		Plus,
		CheckCircle,
		Truck,
		Package,
		XCircle,
		Loader2
	} from '@lucide/svelte'
	import type { PageData, ActionData } from './$types'

	let { data, form: actionForm }: { data: PageData; form: ActionData } = $props()

	let showAddItem = $state(false)

	const {
		form: addItemFormData,
		errors: addItemErrors,
		enhance: addItemEnhance,
		delayed: addItemDelayed,
		message: addItemMessage
	} = superForm(data.addItemForm, {
		validators: zodClient(addOrderItemSchema),
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid && form.message?.includes('added')) {
				showAddItem = false
				invalidateAll()
			}
		}
	})

	const statusColors: Record<string, string> = {
		draft: 'bg-gray-100 text-gray-800',
		pending: 'bg-yellow-100 text-yellow-800',
		confirmed: 'bg-blue-100 text-blue-800',
		processing: 'bg-purple-100 text-purple-800',
		shipped: 'bg-indigo-100 text-indigo-800',
		delivered: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800'
	}

	const statusLabels: Record<string, string> = {
		draft: 'Draft',
		pending: 'Pending',
		confirmed: 'Confirmed',
		processing: 'Processing',
		shipped: 'Shipped',
		delivered: 'Delivered',
		cancelled: 'Cancelled'
	}

	function getNextActions(
		status: string
	): Array<{ action: string; label: string; variant: 'default' | 'outline' | 'destructive' }> {
		switch (status) {
			case 'pending':
				return [
					{ action: 'confirm', label: 'Confirm', variant: 'default' },
					{ action: 'cancel', label: 'Cancel', variant: 'destructive' }
				]
			case 'confirmed':
				return [
					{ action: 'process', label: 'Start Processing', variant: 'default' },
					{ action: 'cancel', label: 'Cancel', variant: 'destructive' }
				]
			case 'processing':
				return [
					{ action: 'ship', label: 'Mark as Shipped', variant: 'default' },
					{ action: 'cancel', label: 'Cancel', variant: 'destructive' }
				]
			case 'shipped':
				return [{ action: 'deliver', label: 'Mark as Delivered', variant: 'default' }]
			default:
				return []
		}
	}
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button href="/orders" variant="ghost" size="icon">
				<ArrowLeft class="size-4" />
			</Button>
			<div>
				<div class="flex items-center gap-2">
					<h1 class="text-3xl font-bold">{data.order.orderNumber}</h1>
					<span
						class="rounded-full px-2 py-1 text-xs font-medium {statusColors[data.order.status]}"
					>
						{statusLabels[data.order.status]}
					</span>
				</div>
				<p class="text-muted-foreground">{data.order.customerName}</p>
			</div>
		</div>

		{#if data.order.status === 'draft'}
			<form
				method="POST"
				action="?/placeOrder"
				use:enhance={() => {
					return async ({ result, update }) => {
						await invalidateAll()
						await update()
					}
				}}
			>
				<Button type="submit" disabled={data.order.items.length === 0}>
					<CheckCircle class="mr-2 size-4" />
					Place Order
				</Button>
			</form>
		{/if}
	</div>

	{#if actionForm?.error}
		<div class="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
			{actionForm.error}
		</div>
	{/if}

	{#if actionForm?.success}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{#if actionForm.action === 'placeOrder'}
				Order placed successfully: {actionForm.orderNumber}
			{:else if actionForm.action === 'updateStatus'}
				Order status updated to: {statusLabels[actionForm.newStatus ?? '']}
			{/if}
		</div>
	{/if}

	{#if $addItemMessage?.includes('added')}
		<div class="rounded-md bg-green-100 p-3 text-sm text-green-700">
			{$addItemMessage}
		</div>
	{/if}

	<div class="grid gap-6 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<ShoppingCart class="size-5" />
					Order Items
				</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if data.order.items.length === 0}
					<p class="text-muted-foreground py-4 text-center">No items in this order</p>
				{:else}
					<div class="space-y-3">
						{#each data.order.items as item}
							<div class="flex items-center justify-between rounded-lg border p-3">
								<div>
									<div class="font-medium">{item.productName}</div>
									<div class="text-muted-foreground text-sm">
										{item.productSku} × {item.quantity}
									</div>
								</div>
								<div class="text-right">
									<div class="font-medium">
										{item.lineTotal.toLocaleString('zh-CN', {
											style: 'currency',
											currency: item.currency
										})}
									</div>
									<div class="text-muted-foreground text-sm">
										@{item.unitPrice.toLocaleString('zh-CN', {
											style: 'currency',
											currency: item.currency
										})}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				<Separator class="my-4" />

				<div class="flex items-center justify-between text-lg font-semibold">
					<span>Total</span>
					<span>
						{data.order.totalAmount.toLocaleString('zh-CN', {
							style: 'currency',
							currency: data.order.currency
						})}
					</span>
				</div>

				{#if data.order.status === 'draft'}
					<Separator class="my-4" />

					{#if showAddItem}
						<form
							method="POST"
							action="?/addItem"
							use:addItemEnhance
							class="space-y-3"
						>
							<div class="space-y-2">
								<label for="productId" class="text-sm font-medium">Product</label>
								<select
									id="productId"
									name="productId"
									class="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
									bind:value={$addItemFormData.productId}
									aria-invalid={$addItemErrors.productId ? 'true' : undefined}
								>
									<option value="">Select a product...</option>
									{#each data.products as product}
										<option value={product.id}>
											{product.name} ({product.sku}) -
											{product.unitPrice.toLocaleString('zh-CN', {
												style: 'currency',
												currency: product.currency
											})}
										</option>
									{/each}
								</select>
								{#if $addItemErrors.productId}
									<p class="text-destructive text-xs">{$addItemErrors.productId}</p>
								{/if}
							</div>

							<div class="space-y-2">
								<label for="quantity" class="text-sm font-medium">Quantity</label>
								<Input
									id="quantity"
									name="quantity"
									type="number"
									min="1"
									bind:value={$addItemFormData.quantity}
									aria-invalid={$addItemErrors.quantity ? 'true' : undefined}
								/>
								{#if $addItemErrors.quantity}
									<p class="text-destructive text-xs">{$addItemErrors.quantity}</p>
								{/if}
							</div>

							{#if $addItemMessage && !$addItemMessage.includes('added')}
								<div class="bg-destructive/10 text-destructive rounded-md p-2 text-xs">
									{$addItemMessage}
								</div>
							{/if}

							<div class="flex gap-2">
								<Button type="button" variant="outline" onclick={() => (showAddItem = false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={$addItemDelayed}>
									{#if $addItemDelayed}
										<Loader2 class="mr-2 size-4 animate-spin" />
									{/if}
									Add Item
								</Button>
							</div>
						</form>
					{:else}
						<Button variant="outline" class="w-full" onclick={() => (showAddItem = true)}>
							<Plus class="mr-2 size-4" />
							Add Item
						</Button>
					{/if}
				{/if}
			</Card.Content>
		</Card.Root>

		<div class="space-y-6">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<MapPin class="size-5" />
						Shipping Address
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-1">
						{#if data.order.shippingAddress.contactName}
							<div class="font-medium">{data.order.shippingAddress.contactName}</div>
						{/if}
						{#if data.order.shippingAddress.contactPhone}
							<div class="text-muted-foreground text-sm">
								{data.order.shippingAddress.contactPhone}
							</div>
						{/if}
						<div>{data.order.shippingAddress.street}</div>
						<div>
							{data.order.shippingAddress.city}, {data.order.shippingAddress.province}
							{data.order.shippingAddress.postalCode}
						</div>
						<div>{data.order.shippingAddress.country}</div>
					</div>
				</Card.Content>
			</Card.Root>

			{#if data.order.notes}
				<Card.Root>
					<Card.Header>
						<Card.Title>Notes</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground">{data.order.notes}</p>
					</Card.Content>
				</Card.Root>
			{/if}

			{#if getNextActions(data.order.status).length > 0}
				<Card.Root>
					<Card.Header>
						<Card.Title>Actions</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2">
						{#each getNextActions(data.order.status) as { action, label, variant }}
							<form
								method="POST"
								action="?/updateStatus"
								use:enhance={() => {
									return async ({ result, update }) => {
										await invalidateAll()
										await update()
									}
								}}
							>
								<input type="hidden" name="action" value={action} />
								<Button type="submit" {variant} class="w-full">
									{#if action === 'confirm'}
										<CheckCircle class="mr-2 size-4" />
									{:else if action === 'process'}
										<Package class="mr-2 size-4" />
									{:else if action === 'ship'}
										<Truck class="mr-2 size-4" />
									{:else if action === 'deliver'}
										<CheckCircle class="mr-2 size-4" />
									{:else if action === 'cancel'}
										<XCircle class="mr-2 size-4" />
									{/if}
									{label}
								</Button>
							</form>
						{/each}
					</Card.Content>
				</Card.Root>
			{/if}

			<Card.Root>
				<Card.Header>
					<Card.Title>Order Details</Card.Title>
				</Card.Header>
				<Card.Content>
					<dl class="space-y-2 text-sm">
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Created</dt>
							<dd>{new Date(data.order.createdAt).toLocaleString('zh-CN')}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Updated</dt>
							<dd>{new Date(data.order.updatedAt).toLocaleString('zh-CN')}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Customer ID</dt>
							<dd class="font-mono text-xs">{data.order.customerId}</dd>
						</div>
					</dl>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
