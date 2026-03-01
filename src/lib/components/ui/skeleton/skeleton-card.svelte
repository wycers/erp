<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type SkeletonCardProps = HTMLAttributes<HTMLDivElement> & {
		lines?: number;
		showHeader?: boolean;
	};
</script>

<script lang="ts">
	import Skeleton from './skeleton.svelte';

	let {
		class: className,
		lines = 3,
		showHeader = true,
		...restProps
	}: SkeletonCardProps = $props();
</script>

<div
	class={cn('bg-card border-border space-y-3 rounded-lg border p-4', className)}
	aria-hidden="true"
	{...restProps}
>
	{#if showHeader}
		<div class="flex items-center gap-3">
			<Skeleton class="size-10 rounded-full" />
			<div class="flex-1 space-y-2">
				<Skeleton class="h-4 w-1/3" />
				<Skeleton class="h-3 w-1/4" />
			</div>
		</div>
	{/if}
	{#each Array(lines) as _, i}
		<Skeleton class="h-4" style="width: {90 - i * 10}%" />
	{/each}
</div>
