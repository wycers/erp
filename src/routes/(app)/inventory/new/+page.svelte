<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Separator } from '$lib/components/ui/separator'
	import * as Card from '$lib/components/ui/card'
	import { ImageUploader } from '$lib/components/ui/image-uploader'
	import { ArrowLeft, Loader2 } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const { form, errors, enhance, delayed, message } = superForm(data.form, {
		resetForm: false
	})

	let imageUrl = $state('')

	$effect(() => {
		if ($form.imageUrl !== undefined) {
			imageUrl = $form.imageUrl as string
		}
	})

	$effect(() => {
		$form.imageUrl = imageUrl || undefined
	})
</script>

<div class="mx-auto max-w-4xl space-y-6">
	<div class="flex items-center gap-4">
		<Button href="/inventory" variant="ghost" size="icon">
			<ArrowLeft class="size-4" />
		</Button>
		<div>
			<h1 class="text-3xl font-bold">Add Product</h1>
			<p class="text-muted-foreground">Create a new product in your inventory</p>
		</div>
	</div>

	{#if $message}
		<div class="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
			{$message}
		</div>
	{/if}

	<Card.Root>
		<Card.Content class="pt-6">
			<form method="POST" use:enhance>
				<div class="grid gap-6 md:grid-cols-3">
					<div class="md:col-span-1">
						<div class="space-y-2">
							<span class="text-sm font-medium">Product Image</span>
							<ImageUploader
								name="imageUrl"
								aspectRatio="square"
								bind:value={imageUrl}
							/>
							<p class="text-muted-foreground text-xs">
								Upload a square image for best display
							</p>
						</div>
					</div>

					<div class="space-y-6 md:col-span-2">
						<div class="space-y-4">
							<h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Basic Information
							</h3>
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<label for="sku" class="text-sm font-medium">SKU *</label>
									<Input
										id="sku"
										name="sku"
										placeholder="e.g., PROD-001"
										bind:value={$form.sku}
										aria-invalid={$errors.sku ? 'true' : undefined}
									/>
									{#if $errors.sku}
										<p class="text-destructive text-xs">{$errors.sku}</p>
									{/if}
									<p class="text-muted-foreground text-xs">
										Format: XXX-XXX (uppercase letters and numbers)
									</p>
								</div>

								<div class="space-y-2">
									<label for="name" class="text-sm font-medium">Name *</label>
									<Input
										id="name"
										name="name"
										placeholder="Product name"
										bind:value={$form.name}
										aria-invalid={$errors.name ? 'true' : undefined}
									/>
									{#if $errors.name}
										<p class="text-destructive text-xs">{$errors.name}</p>
									{/if}
								</div>
							</div>

							<div class="space-y-2">
								<label for="description" class="text-sm font-medium">Description</label>
								<textarea
									id="description"
									name="description"
									placeholder="Optional product description"
									class="border-input bg-background flex min-h-20 w-full rounded-md border px-3 py-2 text-sm"
									bind:value={$form.description}
									aria-invalid={$errors.description ? 'true' : undefined}
								></textarea>
								{#if $errors.description}
									<p class="text-destructive text-xs">{$errors.description}</p>
								{/if}
							</div>
						</div>

						<Separator />

						<div class="space-y-4">
							<h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Pricing
							</h3>
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<label for="unitPrice" class="text-sm font-medium">Unit Price *</label>
									<Input
										id="unitPrice"
										name="unitPrice"
										type="number"
										step="0.01"
										min="0"
										placeholder="0.00"
										bind:value={$form.unitPrice}
										aria-invalid={$errors.unitPrice ? 'true' : undefined}
									/>
									{#if $errors.unitPrice}
										<p class="text-destructive text-xs">{$errors.unitPrice}</p>
									{/if}
								</div>

								<div class="space-y-2">
									<label for="currency" class="text-sm font-medium">Currency</label>
									<select
										id="currency"
										name="currency"
										class="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm"
										bind:value={$form.currency}
									>
										<option value="CNY">CNY (¥)</option>
										<option value="USD">USD ($)</option>
										<option value="EUR">EUR (€)</option>
										<option value="JPY">JPY (¥)</option>
									</select>
								</div>
							</div>
						</div>

						<Separator />

						<div class="space-y-4">
							<h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Inventory
							</h3>
							<div class="grid gap-4 sm:grid-cols-2">
								<div class="space-y-2">
									<label for="initialStock" class="text-sm font-medium">Initial Stock</label>
									<Input
										id="initialStock"
										name="initialStock"
										type="number"
										min="0"
										placeholder="0"
										bind:value={$form.initialStock}
										aria-invalid={$errors.initialStock ? 'true' : undefined}
									/>
									{#if $errors.initialStock}
										<p class="text-destructive text-xs">{$errors.initialStock}</p>
									{/if}
								</div>

								<div class="space-y-2">
									<label for="reorderPoint" class="text-sm font-medium">Reorder Point</label>
									<Input
										id="reorderPoint"
										name="reorderPoint"
										type="number"
										min="0"
										placeholder="10"
										bind:value={$form.reorderPoint}
										aria-invalid={$errors.reorderPoint ? 'true' : undefined}
									/>
									{#if $errors.reorderPoint}
										<p class="text-destructive text-xs">{$errors.reorderPoint}</p>
									{/if}
									<p class="text-muted-foreground text-xs">
										Alert when stock falls below this level
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-2 border-t pt-6">
					<Button href="/inventory" variant="outline">Cancel</Button>
					<Button type="submit" disabled={$delayed}>
						{#if $delayed}
							<Loader2 class="mr-2 size-4 animate-spin" />
						{/if}
						Create Product
					</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
