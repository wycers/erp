<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Props = {
		value?: string;
		name?: string;
		class?: string;
		disabled?: boolean;
		aspectRatio?: 'default' | 'square';
	};

	let {
		value = $bindable(''),
		name,
		class: className,
		disabled = false,
		aspectRatio = 'default'
	}: Props = $props();

	const isSquare = $derived(aspectRatio === 'square');

	let uploading = $state(false);
	let error = $state('');
	let dragover = $state(false);
	let fileInput: HTMLInputElement;

	async function uploadFile(file: File) {
		if (disabled) return;

		error = '';
		uploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('/api/upload/image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || '上传失败');
			}

			const data = await response.json();
			value = data.url;
		} catch (e) {
			error = e instanceof Error ? e.message : '上传失败';
		} finally {
			uploading = false;
		}
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			uploadFile(file);
		}
		input.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragover = false;
		const file = event.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			uploadFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragover = true;
	}

	function handleDragLeave() {
		dragover = false;
	}

	function handleClick() {
		if (!disabled && !uploading) {
			fileInput.click();
		}
	}

	function handleDelete(event: Event) {
		event.stopPropagation();
		value = '';
	}
</script>

<input type="hidden" {name} {value} />
<input
	bind:this={fileInput}
	type="file"
	accept="image/jpeg,image/png,image/gif,image/webp"
	class="hidden"
	onchange={handleFileSelect}
	{disabled}
/>

<div
	role="button"
	tabindex="0"
	class={cn(
		'border-input relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors',
		isSquare ? 'aspect-square' : 'min-h-[120px]',
		dragover && 'border-primary bg-primary/5',
		disabled && 'cursor-not-allowed opacity-50',
		error && 'border-destructive',
		className
	)}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
>
	{#if uploading}
		<div class="flex flex-col items-center gap-2">
			<svg
				class="text-muted-foreground h-8 w-8 animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<span class="text-muted-foreground text-sm">上传中...</span>
		</div>
	{:else if value}
		<div class="relative h-full w-full p-2">
			<img
				src={value}
				alt="已上传图片"
				class={cn(
					'rounded',
					isSquare ? 'h-full w-full object-cover' : 'mx-auto max-h-[100px] object-contain'
				)}
			/>
			<button
				type="button"
				aria-label="删除图片"
				class="bg-destructive text-destructive-foreground absolute top-1 right-1 rounded-full p-1 hover:opacity-80"
				onclick={handleDelete}
				{disabled}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-2 p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="text-muted-foreground h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<span class="text-muted-foreground text-sm">点击或拖拽上传图片</span>
			<span class="text-muted-foreground text-xs">支持 JPEG、PNG、GIF、WebP，最大 5MB</span>
		</div>
	{/if}

	{#if error}
		<p class="text-destructive absolute bottom-1 left-0 right-0 text-center text-xs">{error}</p>
	{/if}
</div>
