<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: "relative w-full rounded-md border px-3 py-2 text-sm [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3 [&>svg+div]:pl-7",
		variants: {
			variant: {
				default: "border-border bg-background text-foreground",
				warning:
					"border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
				destructive:
					"border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/50",
				success:
					"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type AlertVariant = VariantProps<typeof alertVariants>["variant"];

	export type AlertProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: AlertVariant;
	};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		ref = $bindable(null),
		children,
		...restProps
	}: AlertProps = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	class={cn(alertVariants({ variant }), className)}
	role="alert"
	{...restProps}
>
	{@render children?.()}
</div>
