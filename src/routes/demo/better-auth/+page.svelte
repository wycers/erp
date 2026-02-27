<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Zap, BarChart3, Package, Users, ArrowRight, LogOut } from '@lucide/svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-6 py-12">
	<!-- Background decoration -->
	<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
		<div class="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent blur-3xl"></div>
	</div>

	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="mb-8 flex flex-col items-center text-center">
			<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-500/30">
				<Zap class="h-7 w-7 text-white" />
			</div>
			<h1 class="text-2xl font-bold text-foreground">
				欢迎, <span class="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{data.user.name}</span>！
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">您已成功登录 ERP Pro 系统</p>
		</div>

		<!-- Quick stats cards -->
		<div class="mb-6 grid grid-cols-3 gap-3">
			{#each [
				{ icon: Package, label: '库存', value: '正常', color: 'text-blue-400' },
				{ icon: BarChart3, label: '财务', value: '健康', color: 'text-violet-400' },
				{ icon: Users, label: '客户', value: '活跃', color: 'text-emerald-400' },
			] as item}
				<div class="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 p-3 text-center">
					<item.icon class="h-5 w-5 {item.color}" />
					<span class="text-xs text-muted-foreground">{item.label}</span>
					<span class="text-xs font-semibold text-foreground">{item.value}</span>
				</div>
			{/each}
		</div>

		<p class="mb-6 text-center text-xs text-muted-foreground/60">
			用户 ID：<code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{data.user.id}</code>
		</p>

		<div class="space-y-3">
			<Button
				href="/"
				variant="outline"
				class="w-full gap-2 rounded-xl border-border/60 hover:border-blue-500/30 hover:bg-blue-500/5"
			>
				<ArrowRight class="h-4 w-4" />
				返回主页
			</Button>
			<form method="post" action="?/signOut" use:enhance>
				<Button
					type="submit"
					variant="ghost"
					class="w-full gap-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
				>
					<LogOut class="h-4 w-4" />
					退出登录
				</Button>
			</form>
		</div>
	</div>
</div>
