<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type SkeletonProps = HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	let { class: className, ...restProps }: SkeletonProps = $props();
</script>

<div
	class={cn('bg-muted skeleton-pulse rounded-md', className)}
	aria-hidden="true"
	{...restProps}
/>

<style>
	.skeleton-pulse {
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	@keyframes skeleton-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-pulse {
			animation: none;
			opacity: 0.7;
		}
	}
</style>
