<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Package,
		ShoppingCart,
		BarChart3,
		Users,
		Moon,
		Sun,
		Zap,
		Shield,
		Clock,
		ArrowRight,
		Check,
		TrendingUp,
		Globe,
		Sparkles
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	let isDark = $state(false);

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			isDark = true;
			document.documentElement.classList.add('dark');
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	const features = [
		{
			icon: Package,
			title: '库存管理',
			description: '实时追踪库存水平，智能补货提醒，多仓库协同管理',
			badge: '核心',
			gradient: 'from-blue-500 to-cyan-400',
			glow: 'shadow-blue-500/20'
		},
		{
			icon: ShoppingCart,
			title: '订单处理',
			description: '全流程订单跟踪，自动化工作流，多渠道订单整合',
			badge: '热门',
			gradient: 'from-violet-500 to-purple-400',
			glow: 'shadow-violet-500/20'
		},
		{
			icon: BarChart3,
			title: '财务报表',
			description: '实时财务仪表盘，自动对账，多维度数据分析',
			badge: '智能',
			gradient: 'from-emerald-500 to-teal-400',
			glow: 'shadow-emerald-500/20'
		},
		{
			icon: Users,
			title: '客户管理',
			description: '360° 客户视图，智能客户分群，生命周期管理',
			badge: '增长',
			gradient: 'from-orange-500 to-amber-400',
			glow: 'shadow-orange-500/20'
		}
	];

	const stats = [
		{ value: '99.9%', label: '系统可靠性', icon: Shield, color: 'text-blue-400' },
		{ value: '10K+', label: '企业用户', icon: Users, color: 'text-violet-400' },
		{ value: '24/7', label: '全天候支持', icon: Clock, color: 'text-emerald-400' },
		{ value: '50%', label: '效率提升', icon: TrendingUp, color: 'text-amber-400' }
	];

	const trustedBy = ['Acme Corp', 'TechFlow', 'InnovateCo', 'DataPrime', 'CloudBase', 'NexGen'];
</script>

<div class="min-h-screen bg-background">
	<!-- Navigation -->
	<nav
		class="fixed top-0 z-50 w-full border-b border-white/8 bg-background/70 backdrop-blur-xl"
	>
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30"
				>
					<Zap class="h-5 w-5 text-white" />
				</div>
				<span class="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
					ERP Pro
				</span>
			</div>

			<div class="hidden items-center gap-8 md:flex">
				<a href="#features" class="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground">功能</a>
				<a href="#stats" class="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground">数据</a>
				<a href="/demo/better-auth" class="text-sm text-muted-foreground transition-all duration-200 hover:text-foreground">演示</a>
			</div>

			<div class="flex items-center gap-3">
				<Button variant="ghost" size="icon" onclick={toggleTheme} class="rounded-xl">
					{#if isDark}
						<Sun class="h-4 w-4" />
					{:else}
						<Moon class="h-4 w-4" />
					{/if}
				</Button>
				<Button variant="outline" size="sm" href="/demo/better-auth/login" class="rounded-xl border-border/60">登录</Button>
				<Button
					size="sm"
					href="/demo/better-auth"
					class="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30"
				>
					开始使用
				</Button>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative overflow-hidden pt-16">
		<!-- Animated background orbs -->
		<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
			<div
				class="absolute -top-32 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/25 via-violet-500/15 to-transparent blur-3xl"
			></div>
			<div
				class="absolute right-[-10%] top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-violet-500/20 to-transparent blur-3xl"
			></div>
			<div
				class="absolute left-[-5%] top-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-cyan-500/15 to-transparent blur-3xl"
			></div>
			<!-- Grid lines -->
			<div
				class="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:32px_32px]"
			></div>
		</div>

		<div class="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44">
			<div class="text-center">
				<Badge
					variant="secondary"
					class="mb-6 border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-blue-400"
				>
					<Sparkles class="mr-1.5 h-3.5 w-3.5" />
					新一代企业管理平台
				</Badge>

				<h1
					class="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
				>
					<span class="text-foreground">重新定义</span>
					<br />
					<span
						class="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent"
					>
						企业资源管理
					</span>
				</h1>

				<p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
					一站式 ERP 解决方案，整合库存、订单、财务与客户管理。
					<br class="hidden sm:block" />
					让您的企业运营更智能、更高效。
				</p>

				<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button
						size="lg"
						class="w-full gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-8 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02] sm:w-auto"
						href="/demo/better-auth"
					>
						免费开始
						<ArrowRight class="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="w-full rounded-xl border-border/60 hover:border-blue-500/40 hover:bg-blue-500/5 sm:w-auto"
						href="#features"
					>
						了解更多
					</Button>
				</div>

				<div class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
					<span class="flex items-center gap-2">
						<Check class="h-4 w-4 text-blue-400" />
						无需信用卡
					</span>
					<span class="flex items-center gap-2">
						<Check class="h-4 w-4 text-blue-400" />
						14 天免费试用
					</span>
					<span class="flex items-center gap-2">
						<Check class="h-4 w-4 text-blue-400" />
						随时取消
					</span>
				</div>

				<!-- Trusted by -->
				<div class="mt-16">
					<p class="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
						受到全球领先企业信赖
					</p>
					<div class="flex flex-wrap items-center justify-center gap-6">
						{#each trustedBy as name}
							<span class="rounded-lg border border-border/40 bg-muted/30 px-4 py-1.5 text-sm font-medium text-muted-foreground/70">
								{name}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-28 sm:py-36">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<Badge variant="outline" class="mb-4 border-blue-500/30 text-blue-400">功能特性</Badge>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
					全方位企业管理能力
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-muted-foreground">
					从库存到财务，从订单到客户，一个平台满足所有需求
				</p>
			</div>

			<div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{#each features as feature}
					<Card.Root
						class="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-border hover:shadow-2xl {feature.glow}"
					>
						<!-- Hover gradient overlay -->
						<div
							class="absolute inset-0 bg-gradient-to-br {feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5"
						></div>
						<!-- Top gradient border accent -->
						<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r {feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

						<Card.Header class="p-6">
							<div class="flex items-start justify-between">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br {feature.gradient} shadow-lg text-white transition-all duration-300 group-hover:scale-110"
								>
									<feature.icon class="h-6 w-6" />
								</div>
								<Badge variant="secondary" class="text-xs">{feature.badge}</Badge>
							</div>
							<Card.Title class="mt-4 text-base">{feature.title}</Card.Title>
							<Card.Description class="text-sm leading-relaxed">{feature.description}</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>

			<!-- Bottom CTA row for features -->
			<div class="mt-12 flex justify-center">
				<a
					href="/demo/better-auth"
					class="flex items-center gap-2 text-sm font-medium text-blue-400 transition-all duration-200 hover:text-blue-300 hover:gap-3"
				>
					查看所有功能 <ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section id="stats" class="relative overflow-hidden py-28 sm:py-36">
		<!-- Background gradient band -->
		<div class="absolute inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-violet-500/5 to-transparent"></div>
			<div class="absolute inset-0 border-y border-border/30"></div>
		</div>

		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<Badge variant="outline" class="mb-4 border-violet-500/30 text-violet-400">值得信赖</Badge>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">数据说明一切</h2>
				<p class="mx-auto mt-4 max-w-xl text-muted-foreground">
					每一个数字背后，都是客户对我们的信任
				</p>
			</div>

			<div class="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
				{#each stats as stat}
					<div class="group text-center">
						<div
							class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/80 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-500/10"
						>
							<stat.icon class="h-7 w-7 {stat.color}" />
						</div>
						<div class="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
							{stat.value}
						</div>
						<div class="mt-2 text-sm text-muted-foreground">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing/CTA Section -->
	<section class="relative overflow-hidden py-28 sm:py-36">
		<!-- Multi-layer glow background -->
		<div class="pointer-events-none absolute inset-0 -z-10">
			<div class="absolute inset-0 bg-gradient-to-br from-blue-600/12 via-violet-600/8 to-cyan-500/6"></div>
			<div class="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent blur-3xl"></div>
		</div>

		<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
			<Badge variant="secondary" class="mb-6 border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-blue-400">
				<Globe class="mr-1.5 h-3.5 w-3.5" />
				开始您的旅程
			</Badge>
			<h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
				<span class="text-foreground">准备好提升</span>
				<br />
				<span class="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
					您的企业效率了吗？
				</span>
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
				立即开始免费试用，体验新一代 ERP 系统带来的改变
			</p>

			<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button
					size="lg"
					class="w-full gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-10 text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] sm:w-auto"
					href="/demo/better-auth"
				>
					立即开始 — 免费
					<ArrowRight class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="lg"
					class="w-full rounded-xl border-border/60 hover:border-violet-500/40 hover:bg-violet-500/5 sm:w-auto"
				>
					预约演示
				</Button>
			</div>

			<p class="mt-6 text-xs text-muted-foreground/60">无需信用卡 · 14 天免费 · 随时取消</p>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border/40 bg-muted/10">
		<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
				<div class="flex items-center gap-3">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600"
					>
						<Zap class="h-4 w-4 text-white" />
					</div>
					<span class="font-semibold">ERP Pro</span>
				</div>

				<div class="flex items-center gap-6 text-sm text-muted-foreground">
					<a href="/privacy" class="transition-colors hover:text-foreground">隐私政策</a>
					<a href="/terms" class="transition-colors hover:text-foreground">服务条款</a>
					<a href="/contact" class="transition-colors hover:text-foreground">联系我们</a>
				</div>

				<p class="text-sm text-muted-foreground/60">
					© {new Date().getFullYear()} ERP Pro. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</div>
