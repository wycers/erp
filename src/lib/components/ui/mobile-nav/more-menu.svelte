<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { resolve } from '$app/paths';
	import type { NavItem } from './mobile-nav.svelte';

	interface Props {
		moreItems: NavItem[];
		basePath: string;
		onClose: () => void;
		isActiveCheck: (item: NavItem) => boolean;
	}

	let { moreItems, basePath, onClose, isActiveCheck }: Props = $props();
</script>

<div
	class="bg-popover absolute bottom-full left-0 right-0 mb-0 rounded-t-xl border-t p-3 shadow-lg"
>
	<div class="mb-2 flex items-center justify-between">
		<span class="text-muted-foreground text-xs font-medium">更多功能</span>
		<button
			type="button"
			onclick={onClose}
			class="text-muted-foreground hover:text-foreground text-xs"
		>
			收起
		</button>
	</div>
	<div class="grid grid-cols-3 gap-2">
		{#each moreItems as item}
			{@const active = isActiveCheck(item)}
			<a
				href={resolve(basePath + item.href)}
				onclick={onClose}
				class={cn(
					'flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors',
					active
						? 'bg-primary/10 text-primary'
						: 'hover:bg-muted text-muted-foreground hover:text-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				<item.icon class="size-6" />
				<span class="text-xs">{item.label}</span>
			</a>
		{/each}
	</div>
</div>
