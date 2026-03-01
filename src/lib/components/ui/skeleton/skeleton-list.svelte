<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type SkeletonListProps = HTMLAttributes<HTMLDivElement> & {
		rows?: number;
		showIcon?: boolean;
	};
</script>

<script lang="ts">
	import Skeleton from './skeleton.svelte';

	let {
		class: className,
		rows = 5,
		showIcon = true,
		...restProps
	}: SkeletonListProps = $props();
</script>

<div class={cn('space-y-3', className)} aria-hidden="true" {...restProps}>
	{#each Array(rows) as _, i}
		<div class="flex items-center gap-3">
			{#if showIcon}
				<Skeleton class="size-8 shrink-0 rounded" />
			{/if}
			<div class="flex-1 space-y-2">
				<Skeleton class="h-4" style="width: {75 + (i % 3) * 8}%" />
				<Skeleton class="h-3 w-1/2" />
			</div>
		</div>
	{/each}
</div>
