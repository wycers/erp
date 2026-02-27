/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

const CACHE_NAME = `erp-cache-${version}`;
const PRECACHE_ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(PRECACHE_ASSETS);
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET') return;

	const url = new URL(request.url);

	if (url.origin !== self.location.origin) return;

	if (PRECACHE_ASSETS.includes(url.pathname)) {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE_NAME);
				const cached = await cache.match(url.pathname);
				if (cached) return cached;

				const response = await fetch(request);
				if (response.ok) {
					await cache.put(url.pathname, response.clone());
				}

				return response;
			})()
		);
		return;
	}

	if (request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE_NAME);

				try {
					const response = await fetch(request);
					if (response.ok) {
						await cache.put(request, response.clone());
					}
					return response;
				} catch {
					const cached = await cache.match(request);
					if (cached) return cached;
					throw new Error('Offline and no cached navigation response found.');
				}
			})()
		);
	}
});
