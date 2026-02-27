<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import { Plus, Search, ShoppingCart, Clock, CheckCircle, Truck, XCircle } from '@lucide/svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let searchValue = $state(data.searchTerm ?? '')

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
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Orders</h1>
			<p class="text-muted-foreground">Manage customer orders</p>
		</div>
		<Button href="/orders/new">
			<Plus class="mr-2 size-4" />
			New Order
		</Button>
	</div>

	<div class="grid gap-4 md:grid-cols-4">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Orders</Card.Title>
				<ShoppingCart class="text-muted-foreground size-4" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{data.orders.total}</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Pending</Card.Title>
				<Clock class="size-4 text-yellow-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{data.orders.orders.filter((o) => o.status === 'pending').length}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Processing</Card.Title>
				<Truck class="size-4 text-blue-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{data.orders.orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Completed</Card.Title>
				<CheckCircle class="size-4 text-green-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">
					{data.orders.orders.filter((o) => o.status === 'delivered').length}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<div class="flex flex-wrap items-center gap-4">
				<form method="GET" class="flex flex-1 gap-2">
					<div class="relative flex-1">
						<Search class="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
						<Input
							name="q"
							placeholder="Search by order number or customer..."
							class="pl-8"
							bind:value={searchValue}
						/>
					</div>
					<Button type="submit" variant="secondary">Search</Button>
				</form>
				<div class="flex gap-2">
					<Button
						href="/orders"
						variant={!data.status ? 'default' : 'outline'}
						size="sm"
					>
						All
					</Button>
					<Button
						href="/orders?status=pending"
						variant={data.status === 'pending' ? 'default' : 'outline'}
						size="sm"
					>
						Pending
					</Button>
					<Button
						href="/orders?status=processing"
						variant={data.status === 'processing' ? 'default' : 'outline'}
						size="sm"
					>
						Processing
					</Button>
					<Button
						href="/orders?status=delivered"
						variant={data.status === 'delivered' ? 'default' : 'outline'}
						size="sm"
					>
						Delivered
					</Button>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			{#if data.orders.orders.length === 0}
				<div class="text-muted-foreground py-8 text-center">
					<ShoppingCart class="mx-auto mb-4 size-12 opacity-50" />
					<p>No orders found</p>
					<Button href="/orders/new" variant="link" class="mt-2">Create your first order</Button>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="text-muted-foreground border-b text-left text-sm">
								<th class="pb-3 font-medium">Order #</th>
								<th class="pb-3 font-medium">Customer</th>
								<th class="pb-3 font-medium">Items</th>
								<th class="pb-3 font-medium">Total</th>
								<th class="pb-3 font-medium">Status</th>
								<th class="pb-3 font-medium">Date</th>
								<th class="pb-3 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each data.orders.orders as order}
								<tr class="border-b">
									<td class="py-3 font-mono text-sm">{order.orderNumber}</td>
									<td class="py-3">{order.customerName}</td>
									<td class="py-3">{order.itemCount}</td>
									<td class="py-3">
										{order.totalAmount.toLocaleString('zh-CN', {
											style: 'currency',
											currency: order.currency
										})}
									</td>
									<td class="py-3">
										<span class="rounded-full px-2 py-1 text-xs font-medium {statusColors[order.status]}">
											{statusLabels[order.status]}
										</span>
									</td>
									<td class="py-3 text-sm">
										{new Date(order.createdAt).toLocaleDateString('zh-CN')}
									</td>
									<td class="py-3">
										<Button href="/orders/{order.id}" variant="ghost" size="sm">
											View
										</Button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				{#if data.orders.total > data.orders.limit}
					<div class="mt-4 flex justify-center gap-2">
						{#if data.page > 1}
							<Button href="/orders?page={data.page - 1}" variant="outline" size="sm">
								Previous
							</Button>
						{/if}
						<span class="text-muted-foreground flex items-center text-sm">
							Page {data.page} of {Math.ceil(data.orders.total / data.orders.limit)}
						</span>
						{#if data.page * data.orders.limit < data.orders.total}
							<Button href="/orders?page={data.page + 1}" variant="outline" size="sm">
								Next
							</Button>
						{/if}
					</div>
				{/if}
			{/if}
		</Card.Content>
	</Card.Root>
</div>
