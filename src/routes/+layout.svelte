<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if (dev || !('serviceWorker' in navigator)) return;

		void navigator.serviceWorker.register(resolve('/service-worker.js')).catch((error) => {
			console.error('Service worker registration failed', error);
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href={resolve('/manifest.webmanifest')} />
	<link rel="apple-touch-icon" href={resolve('/icons/pwa-192.png')} />
	<meta name="theme-color" content="#2563eb" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="ERP 工作台" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
</svelte:head>
{@render children()}
