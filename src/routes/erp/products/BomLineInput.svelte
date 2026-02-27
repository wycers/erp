<script lang="ts">
	import { Combobox, type ComboboxItem } from '$lib/components/ui/combobox';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	type Material = {
		id: number;
		code: string;
		name: string;
	};

	type LineItem = {
		id: string;
		materialSkuId: string;
		quantityPerUnit: string;
	};

	type InitialLine = {
		materialSkuId: number;
		quantityPerUnit: number;
	};

	type Props = {
		materials: Material[];
		name?: string;
		initialLines?: InitialLine[];
	};

	let { materials, name = 'lines', initialLines = [] }: Props = $props();

	function createEmptyLine(): LineItem {
		return {
			id: crypto.randomUUID(),
			materialSkuId: '',
			quantityPerUnit: ''
		};
	}

	function initializeLines(): LineItem[] {
		if (initialLines.length > 0) {
			return initialLines.map((line) => ({
				id: crypto.randomUUID(),
				materialSkuId: String(line.materialSkuId),
				quantityPerUnit: line.quantityPerUnit.toFixed(2)
			}));
		}
		return [createEmptyLine()];
	}

	let lines = $state<LineItem[]>(initializeLines());

	function addLine() {
		lines = [...lines, createEmptyLine()];
	}

	function removeLine(id: string) {
		if (lines.length > 1) {
			lines = lines.filter((l) => l.id !== id);
		}
	}

	const materialOptions: ComboboxItem[] = $derived(
		materials.map((m) => ({
			value: String(m.id),
			label: `#${m.id} - ${m.code} - ${m.name}`
		}))
	);

	const serializedValue = $derived(
		lines
			.filter((l) => l.materialSkuId && l.quantityPerUnit)
			.map((l) => `${l.materialSkuId},${l.quantityPerUnit}`)
			.join('\n')
	);
</script>

<div class="space-y-3">
	<input type="hidden" {name} value={serializedValue} />

	<div class="space-y-2">
		{#each lines as line, index (line.id)}
			<div class="bg-muted/30 flex flex-wrap items-end gap-2 rounded-md border p-2">
				<div class="min-w-[200px] flex-1">
					<span class="text-muted-foreground mb-1 block text-xs">原料</span>
					<Combobox
						items={materialOptions}
						bind:value={line.materialSkuId}
						placeholder="搜索原料..."
						class="w-full"
					/>
				</div>

				<label class="w-28">
					<span class="text-muted-foreground mb-1 block text-xs">用量</span>
					<Input
						type="number"
						step="0.01"
						min="0"
						bind:value={line.quantityPerUnit}
						placeholder="0.00"
					/>
				</label>

				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onclick={() => removeLine(line.id)}
					disabled={lines.length <= 1}
					class="text-muted-foreground hover:text-destructive shrink-0"
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
						<path d="M3 6h18" />
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					</svg>
				</Button>
			</div>
		{/each}
	</div>

	<Button type="button" variant="outline" size="sm" onclick={addLine}>
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
			class="mr-1"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
		添加行
	</Button>
</div>
