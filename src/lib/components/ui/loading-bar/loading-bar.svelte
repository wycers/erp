<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type LoadingBarProps = HTMLAttributes<HTMLDivElement> & {
		loading?: boolean;
		minDuration?: number;
	};
</script>

<script lang="ts">
	import { navigating } from '$app/stores';

	let {
		class: className,
		loading = undefined,
		minDuration = 200,
		...restProps
	}: LoadingBarProps = $props();

	let isNavigating = $state(false);
	let showBar = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout> | null = null;
	let showTime = 0;

	const externalLoading = $derived(loading);
	const shouldShow = $derived(externalLoading ?? isNavigating);

	$effect(() => {
		isNavigating = !!$navigating;
	});

	$effect(() => {
		if (shouldShow) {
			if (hideTimeout) {
				clearTimeout(hideTimeout);
				hideTimeout = null;
			}
			showBar = true;
			showTime = Date.now();
		} else if (showBar) {
			const elapsed = Date.now() - showTime;
			const remaining = Math.max(0, minDuration - elapsed);

			hideTimeout = setTimeout(() => {
				showBar = false;
				hideTimeout = null;
			}, remaining);
		}
	});
</script>

{#if showBar}
	<div
		class={cn(
			'fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden bg-primary/20',
			className
		)}
		role="progressbar"
		aria-label="页面加载中"
		{...restProps}
	>
		<div class="loading-bar-indicator bg-primary h-full w-full origin-left"></div>
	</div>
{/if}

<style>
	.loading-bar-indicator {
		animation: loading-bar-progress 2s ease-in-out infinite;
	}

	@keyframes loading-bar-progress {
		0% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loading-bar-indicator {
			animation: none;
			transform: translateX(0);
			opacity: 0.7;
		}
	}
</style>
