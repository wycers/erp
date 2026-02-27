<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { createOrderSchema } from '$lib/application/orders/schemas'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { ArrowLeft, Loader2 } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		validators: zodClient(createOrderSchema),
		resetForm: false
	})
</script>

<div class="mx-auto max-w-2xl space-y-6">
	<div class="flex items-center gap-4">
		<Button href="/orders" variant="ghost" size="icon">
			<ArrowLeft class="size-4" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold">New Order</h1>
			<p class="text-muted-foreground">Create a new customer order</p>
		</div>
	</div>

	<Card.Root>
		<Card.Content class="pt-6">
			{#if $message}
				<div class="bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm">
					{$message}
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-6">
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Customer Information</h3>
					<div class="space-y-2">
						<label for="customerName" class="text-sm font-medium">Customer Name *</label>
						<Input
							id="customerName"
							name="customerName"
							placeholder="Customer or company name"
							bind:value={$form.customerName}
							aria-invalid={$errors.customerName ? 'true' : undefined}
						/>
						{#if $errors.customerName}
							<p class="text-destructive text-xs">{$errors.customerName}</p>
						{/if}
					</div>
				</div>

				<div class="space-y-4">
					<h3 class="text-lg font-medium">Shipping Address</h3>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<label for="contactName" class="text-sm font-medium">Contact Name</label>
							<Input
								id="contactName"
								name="contactName"
								placeholder="Recipient name"
								bind:value={$form.contactName}
							/>
						</div>
						<div class="space-y-2">
							<label for="contactPhone" class="text-sm font-medium">Contact Phone</label>
							<Input
								id="contactPhone"
								name="contactPhone"
								placeholder="Phone number"
								bind:value={$form.contactPhone}
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label for="street" class="text-sm font-medium">Street Address *</label>
						<Input
							id="street"
							name="street"
							placeholder="Street address"
							bind:value={$form.street}
							aria-invalid={$errors.street ? 'true' : undefined}
						/>
						{#if $errors.street}
							<p class="text-destructive text-xs">{$errors.street}</p>
						{/if}
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<label for="city" class="text-sm font-medium">City *</label>
							<Input
								id="city"
								name="city"
								placeholder="City"
								bind:value={$form.city}
								aria-invalid={$errors.city ? 'true' : undefined}
							/>
							{#if $errors.city}
								<p class="text-destructive text-xs">{$errors.city}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<label for="province" class="text-sm font-medium">Province/State *</label>
							<Input
								id="province"
								name="province"
								placeholder="Province or State"
								bind:value={$form.province}
								aria-invalid={$errors.province ? 'true' : undefined}
							/>
							{#if $errors.province}
								<p class="text-destructive text-xs">{$errors.province}</p>
							{/if}
						</div>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<label for="postalCode" class="text-sm font-medium">Postal Code *</label>
							<Input
								id="postalCode"
								name="postalCode"
								placeholder="Postal code"
								bind:value={$form.postalCode}
								aria-invalid={$errors.postalCode ? 'true' : undefined}
							/>
							{#if $errors.postalCode}
								<p class="text-destructive text-xs">{$errors.postalCode}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<label for="country" class="text-sm font-medium">Country *</label>
							<Input
								id="country"
								name="country"
								placeholder="Country"
								bind:value={$form.country}
								aria-invalid={$errors.country ? 'true' : undefined}
							/>
							{#if $errors.country}
								<p class="text-destructive text-xs">{$errors.country}</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="space-y-2">
					<label for="notes" class="text-sm font-medium">Notes</label>
					<textarea
						id="notes"
						name="notes"
						placeholder="Optional order notes"
						class="border-input bg-background flex min-h-20 w-full rounded-md border px-3 py-2 text-sm"
						bind:value={$form.notes}
					></textarea>
				</div>

				<div class="flex justify-end gap-2 pt-4">
					<Button href="/orders" variant="outline">Cancel</Button>
					<Button type="submit" disabled={$delayed}>
						{#if $delayed}
							<Loader2 class="mr-2 size-4 animate-spin" />
						{/if}
						Create Order
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
