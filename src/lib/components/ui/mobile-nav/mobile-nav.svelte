<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type NavItem = {
		href: string;
		label: string;
		icon: typeof import('@lucide/svelte').Home;
		matchPaths?: string[];
	};

	export type MobileNavProps = HTMLAttributes<HTMLElement> & {
		items: NavItem[];
		moreItems?: NavItem[];
		basePath?: string;
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { Ellipsis } from '@lucide/svelte';
	import MoreMenu from './more-menu.svelte';

	let {
		class: className,
		items,
		moreItems = [],
		basePath = '',
		...restProps
	}: MobileNavProps = $props();

	let showMore = $state(false);

	function isActive(item: NavItem): boolean {
		const currentPath = $page.url.pathname;
		const itemPath = basePath + item.href;

		if (item.matchPaths) {
			return item.matchPaths.some((p) => currentPath.startsWith(basePath + p));
		}

		if (itemPath === basePath || itemPath === basePath + '/') {
			return currentPath === basePath || currentPath === basePath + '/';
		}

		return currentPath.startsWith(itemPath);
	}

	function isMoreActive(): boolean {
		return moreItems.some((item) => isActive(item));
	}

	function handleMoreClick() {
		showMore = !showMore;
	}

	function closeMore() {
		showMore = false;
	}
</script>

<nav
	class={cn(
		'bg-background/95 fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-sm',
		'pb-[env(safe-area-inset-bottom)]',
		className
	)}
	{...restProps}
>
	<div class="flex h-14 items-stretch justify-around">
		{#each items as item}
			{@const active = isActive(item)}
			<a
				href={resolve(basePath + item.href)}
				class={cn(
					'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors',
					active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
				)}
				aria-current={active ? 'page' : undefined}
			>
				<item.icon class="size-5" />
				<span>{item.label}</span>
			</a>
		{/each}

		{#if moreItems.length > 0}
			{@const moreActive = isMoreActive()}
			<button
				type="button"
				onclick={handleMoreClick}
				class={cn(
					'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors',
					moreActive || showMore
						? 'text-primary'
						: 'text-muted-foreground hover:text-foreground'
				)}
				aria-expanded={showMore}
				aria-haspopup="true"
			>
				<Ellipsis class="size-5" />
				<span>更多</span>
			</button>
		{/if}
	</div>

	{#if showMore && moreItems.length > 0}
		<MoreMenu {moreItems} {basePath} onClose={closeMore} isActiveCheck={isActive} />
	{/if}
</nav>

{#if showMore}
	<button
		type="button"
		class="fixed inset-0 z-30 bg-black/20"
		onclick={closeMore}
		aria-label="关闭菜单"
	></button>
{/if}
