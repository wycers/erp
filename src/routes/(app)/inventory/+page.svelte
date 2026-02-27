<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import { Plus, Search, Package, AlertTriangle, PackageX } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let searchValue = $state(data.searchTerm ?? '')
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Inventory</h1>
			<p class="text-muted-foreground">Manage your product inventory</p>
		</div>
		<Button href="/inventory/new">
			<Plus class="mr-2 size-4" />
			Add Product
		</Button>
	</div>

	{#if data.summary}
		<div class="grid gap-4 md:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Products</Card.Title>
					<Package class="text-muted-foreground size-4" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.summary.totalProducts}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Low Stock</Card.Title>
					<AlertTriangle class="size-4 text-yellow-500" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.summary.lowStockProducts}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Out of Stock</Card.Title>
					<PackageX class="size-4 text-red-500" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.summary.outOfStockProducts}</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Value</Card.Title>
					<span class="text-muted-foreground text-xs">CNY</span>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{data.summary.totalStockValue.toLocaleString('zh-CN', {
							minimumFractionDigits: 2
						})}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}

	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-4">
				<form method="GET" class="flex flex-1 gap-2">
					<div class="relative flex-1">
						<Search class="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
						<Input
							name="q"
							placeholder="Search by SKU or name..."
							class="pl-8"
							bind:value={searchValue}
						/>
					</div>
					<Button type="submit" variant="secondary">Search</Button>
				</form>
				<Button
					href={data.lowStockOnly ? '/inventory' : '/inventory?lowStock=true'}
					variant={data.lowStockOnly ? 'default' : 'outline'}
				>
					<AlertTriangle class="mr-2 size-4" />
					Low Stock Only
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			{#if data.products.products.length === 0}
				<div class="text-muted-foreground py-8 text-center">
					<Package class="mx-auto mb-4 size-12 opacity-50" />
					<p>No products found</p>
					<Button href="/inventory/new" variant="link" class="mt-2">Add your first product</Button>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="text-muted-foreground border-b text-left text-sm">
								<th class="pb-3 font-medium">SKU</th>
								<th class="pb-3 font-medium">Name</th>
								<th class="pb-3 font-medium">Price</th>
								<th class="pb-3 font-medium">Stock</th>
								<th class="pb-3 font-medium">Status</th>
								<th class="pb-3 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each data.products.products as product}
								<tr class="border-b">
									<td class="py-3 font-mono text-sm">{product.sku}</td>
									<td class="py-3">{product.name}</td>
									<td class="py-3">
										{product.unitPrice.toLocaleString('zh-CN', {
											style: 'currency',
											currency: product.currency
										})}
									</td>
									<td class="py-3">{product.stockQuantity}</td>
									<td class="py-3">
										{#if product.stockQuantity === 0}
											<Badge variant="destructive">Out of Stock</Badge>
										{:else if product.isLowStock}
											<Badge variant="outline" class="border-yellow-500 text-yellow-600">
												Low Stock
											</Badge>
										{:else}
											<Badge variant="secondary">In Stock</Badge>
										{/if}
									</td>
									<td class="py-3">
										<div class="flex gap-2">
											<Button href="/inventory/{product.id}" variant="ghost" size="sm">
												View
											</Button>
											<form method="POST" action="?/delete">
												<input type="hidden" name="id" value={product.id} />
												<Button type="submit" variant="ghost" size="sm" class="text-red-500">
													Delete
												</Button>
											</form>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if data.products.total > data.products.limit}
					<div class="mt-4 flex justify-center gap-2">
						{#if data.page > 1}
							<Button href="/inventory?page={data.page - 1}" variant="outline" size="sm">
								Previous
							</Button>
						{/if}
						<span class="text-muted-foreground flex items-center text-sm">
							Page {data.page} of {Math.ceil(data.products.total / data.products.limit)}
						</span>
						{#if data.page * data.products.limit < data.products.total}
							<Button href="/inventory?page={data.page + 1}" variant="outline" size="sm">
								Next
							</Button>
						{/if}
					</div>
				{/if}
			{/if}
		</Card.Content>
	</Card.Root>
</div>
