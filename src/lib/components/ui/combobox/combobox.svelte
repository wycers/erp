<script lang="ts" module>
	import { cn } from '$lib/utils.js';

	export type ComboboxItem = {
		value: string;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts" generics="T extends ComboboxItem">
	import { Combobox } from 'bits-ui';

	type Props = {
		items: T[];
		value?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		name?: string;
	};

	let {
		items,
		value = $bindable(''),
		onValueChange,
		placeholder = '',
		disabled = false,
		class: className,
		name
	}: Props = $props();

	let searchValue = $state('');
	let open = $state(false);

	const filteredItems = $derived(
		searchValue === ''
			? items
			: items.filter(
					(item) =>
						item.label.toLowerCase().includes(searchValue.toLowerCase()) ||
						item.value.toLowerCase().includes(searchValue.toLowerCase())
				)
	);

	const selectedItem = $derived(items.find((item) => item.value === value));

	function handleOpenChange(newOpen: boolean) {
		open = newOpen;
		if (!newOpen) {
			searchValue = '';
		}
	}

	function handleValueChange(newValue: string) {
		value = newValue;
		onValueChange?.(newValue);
	}
</script>

<Combobox.Root
	type="single"
	{name}
	{disabled}
	bind:open
	onOpenChange={handleOpenChange}
	bind:value
	onValueChange={handleValueChange}
>
	<div class="relative">
		<Combobox.Input
			oninput={(e) => (searchValue = e.currentTarget.value)}
			class={cn(
				'border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 pr-8 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				className
			)}
			{placeholder}
			defaultValue={selectedItem?.label}
		/>
		<Combobox.Trigger
			class="text-muted-foreground hover:text-foreground absolute end-2 top-1/2 -translate-y-1/2 transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m7 15 5 5 5-5" />
				<path d="m7 9 5-5 5 5" />
			</svg>
		</Combobox.Trigger>
	</div>
	<Combobox.Portal>
		<Combobox.Content
			class={cn(
				'border-border bg-popover text-popover-foreground z-50 max-h-60 w-[var(--bits-combobox-anchor-width)] overflow-hidden rounded-md border shadow-md',
				'data-[state=open]:animate-in data-[state=closed]:animate-out',
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
				'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
				'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
			)}
			sideOffset={4}
		>
			<Combobox.Viewport class="p-1">
				{#each filteredItems as item (item.value)}
					<Combobox.Item
						class={cn(
							'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
							'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
							'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
						)}
						value={item.value}
						label={item.label}
						disabled={item.disabled}
					>
						{#snippet children({ selected })}
							{#if selected}
								<span class="absolute left-2 flex size-4 items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M20 6 9 17l-5-5" />
									</svg>
								</span>
							{/if}
							{item.label}
						{/snippet}
					</Combobox.Item>
				{:else}
					<div class="text-muted-foreground py-6 text-center text-sm">无匹配结果</div>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
