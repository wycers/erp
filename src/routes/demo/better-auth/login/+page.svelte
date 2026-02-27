<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import { Zap, Mail, Lock, User, ArrowRight, Check } from '@lucide/svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex min-h-screen bg-background">
	<!-- Left brand panel — hidden on mobile -->
	<div class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-blue-800 p-12 lg:flex lg:w-[45%]">
		<!-- Decorative background elements -->
		<div class="pointer-events-none absolute inset-0">
			<div class="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
			<div class="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl"></div>
			<div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
		</div>

		<!-- Brand logo -->
		<div class="relative flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
				<Zap class="h-5 w-5 text-white" />
			</div>
			<span class="text-xl font-bold text-white">ERP Pro</span>
		</div>

		<!-- Hero copy -->
		<div class="relative">
			<h1 class="text-4xl font-extrabold leading-tight text-white">
				智能管理，<br />驱动增长
			</h1>
			<p class="mt-4 text-lg text-white/70">
				一站式企业管理平台，助力您的团队高效协作与决策。
			</p>

			<!-- Feature bullets -->
			<ul class="mt-8 space-y-4">
				{#each ['实时库存与订单追踪', '智能财务报表分析', '360° 客户关系管理', '99.9% 系统可靠性'] as item}
					<li class="flex items-center gap-3 text-white/80">
						<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
							<Check class="h-3 w-3 text-white" />
						</div>
						<span class="text-sm">{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Footer quote -->
		<div class="relative">
			<blockquote class="border-l-2 border-white/30 pl-4 text-sm text-white/60 italic">
				"ERP Pro 让我们的运营效率提升了 60%，是最好的投资决策。"
			</blockquote>
			<p class="mt-2 pl-4 text-xs text-white/40">— 某科技公司 CEO</p>
		</div>
	</div>

	<!-- Right form panel -->
	<div class="flex flex-1 items-center justify-center px-6 py-12">
		<div class="w-full max-w-[400px]">
			<!-- Mobile logo -->
			<div class="mb-8 flex items-center gap-3 lg:hidden">
				<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
					<Zap class="h-4 w-4 text-white" />
				</div>
				<span class="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
					ERP Pro
				</span>
			</div>

			<div class="mb-8">
				<h2 class="text-2xl font-bold tracking-tight text-foreground">欢迎回来</h2>
				<p class="mt-2 text-sm text-muted-foreground">登录您的账户，或注册新账户开始使用</p>
			</div>

			<form method="post" action="?/signInEmail" use:enhance class="space-y-5">
				<div class="space-y-2">
					<label for="email" class="text-sm font-medium text-foreground">邮箱地址</label>
					<div class="relative">
						<Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="you@company.com"
							class="pl-10 rounded-xl border-border/60 bg-muted/30 focus:border-blue-500/60 focus:ring-blue-500/20"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="password" class="text-sm font-medium text-foreground">密码</label>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="password"
							id="password"
							name="password"
							placeholder="••••••••"
							class="pl-10 rounded-xl border-border/60 bg-muted/30 focus:border-blue-500/60 focus:ring-blue-500/20"
						/>
					</div>
				</div>

				<div class="space-y-2">
					<label for="name" class="text-sm font-medium text-muted-foreground">
						姓名 <span class="text-xs opacity-60">（注册时填写）</span>
					</label>
					<div class="relative">
						<User class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="name"
							name="name"
							placeholder="您的姓名"
							class="pl-10 rounded-xl border-border/60 bg-muted/30 focus:border-blue-500/60 focus:ring-blue-500/20"
						/>
					</div>
				</div>

				{#if form?.message}
					<div class="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{form.message}
					</div>
				{/if}

				<div class="space-y-3 pt-1">
					<Button
						type="submit"
						class="w-full gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] transition-all duration-200"
					>
						登录
						<ArrowRight class="h-4 w-4" />
					</Button>
					<Button
						type="submit"
						formaction="?/signUpEmail"
						variant="outline"
						class="w-full rounded-xl border-border/60 hover:border-blue-500/30 hover:bg-blue-500/5"
					>
						注册新账户
					</Button>
				</div>
			</form>

			<p class="mt-8 text-center text-xs text-muted-foreground/50">
				继续即表示您同意我们的
				<a href="/terms" class="underline underline-offset-2 hover:text-muted-foreground">服务条款</a>
				和
				<a href="/privacy" class="underline underline-offset-2 hover:text-muted-foreground">隐私政策</a>
			</p>
		</div>
	</div>
</div>
