<script lang="ts">
	import { Combobox, type ComboboxItem } from '$lib/components/ui/combobox';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	type Material = {
		id: number;
		code: string;
		name: string;
		unit: string;
	};

	type LineItem = {
		id: string;
		materialSkuId: string;
		quantity: string;
		lineAmount: string;
	};

	type Props = {
		materials: Material[];
		name?: string;
		value?: string;
	};

	let { materials, name = 'lines', value }: Props = $props();

	function createEmptyLine(): LineItem {
		return {
			id: crypto.randomUUID(),
			materialSkuId: '',
			quantity: '',
			lineAmount: ''
		};
	}

	function parseSerializedLines(serialized: string): LineItem[] {
		const rows = serialized
			.split('\n')
			.map((row) => row.trim())
			.filter(Boolean);

		if (rows.length === 0) {
			return [createEmptyLine()];
		}

		return rows.map((row) => {
			const [materialSkuId = '', quantity = '', lineAmount = ''] = row
				.split(',')
				.map((part) => part.trim());
			return {
				id: crypto.randomUUID(),
				materialSkuId,
				quantity,
				lineAmount
			};
		});
	}

	let lines = $state<LineItem[]>(
		typeof value === 'string' ? parseSerializedLines(value) : [createEmptyLine()]
	);
	let lastHydratedValue = $state<string | undefined>(value);

	$effect(() => {
		if (typeof value === 'string' && value !== lastHydratedValue) {
			lines = parseSerializedLines(value);
			lastHydratedValue = value;
		}
	});

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

	function getMaterialUnit(materialSkuId: string): string {
		const material = materials.find((m) => String(m.id) === materialSkuId);
		return material?.unit ?? '';
	}

	function calculateUnitPrice(quantity: string, lineAmount: string): string {
		const qty = parseFloat(quantity);
		const amount = parseFloat(lineAmount);
		if (!qty || !amount || qty === 0) return '-';
		return (amount / qty).toFixed(4);
	}

	const serializedValue = $derived(
		lines
			.filter((l) => l.materialSkuId && l.quantity && l.lineAmount)
			.map((l) => `${l.materialSkuId},${l.quantity},${l.lineAmount}`)
			.join('\n')
	);
</script>

<div class="space-y-3">
	<input type="hidden" {name} value={serializedValue} />

	<div class="space-y-2">
		{#each lines as line, index (line.id)}
			<div class="flex flex-wrap items-end gap-2 rounded-md border bg-muted/30 p-2">
				<div class="min-w-[200px] flex-1">
					<span class="mb-1 block text-xs text-muted-foreground">原料</span>
					<Combobox
						items={materialOptions}
						bind:value={line.materialSkuId}
						placeholder="搜索原料..."
						class="w-full"
					/>
				</div>

				<div class="flex items-end gap-1">
					<label class="w-20">
						<span class="mb-1 block text-xs text-muted-foreground">数量</span>
						<Input
							type="number"
							step="0.01"
							min="0"
							bind:value={line.quantity}
							placeholder="0.00"
						/>
					</label>
					{#if line.materialSkuId}
						<span class="pb-2 text-sm text-muted-foreground"
							>{getMaterialUnit(line.materialSkuId)}</span
						>
					{/if}
				</div>

				<label class="w-28">
					<span class="mb-1 block text-xs text-muted-foreground">金额</span>
					<Input
						type="number"
						step="0.01"
						min="0"
						bind:value={line.lineAmount}
						placeholder="0.00"
					/>
				</label>

				<div class="w-20">
					<span class="mb-1 block text-xs text-muted-foreground">单价</span>
					<div class="flex h-9 items-center rounded-md bg-muted px-2 text-sm text-muted-foreground">
						{calculateUnitPrice(line.quantity, line.lineAmount)}
					</div>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onclick={() => removeLine(line.id)}
					disabled={lines.length <= 1}
					class="shrink-0 text-muted-foreground hover:text-destructive"
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
