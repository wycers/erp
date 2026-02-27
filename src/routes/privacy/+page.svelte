<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Zap, ArrowLeft } from '@lucide/svelte';
</script>

<div class="min-h-screen bg-background">
	<!-- Navigation -->
	<nav class="border-b border-border/40 bg-background/80 backdrop-blur-lg">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<a href="/" class="flex items-center gap-2">
				<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Zap class="h-5 w-5" />
				</div>
				<span class="text-xl font-bold">ERP Pro</span>
			</a>
			<Button variant="ghost" size="sm" href="/">
				<ArrowLeft class="mr-2 h-4 w-4" />
				返回首页
			</Button>
		</div>
	</nav>

	<!-- Content -->
	<main class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
		<h1 class="text-4xl font-bold tracking-tight">隐私政策</h1>
		<p class="mt-4 text-muted-foreground">最后更新：2026 年 2 月</p>

		<Separator class="my-8" />

		<div class="prose prose-neutral dark:prose-invert max-w-none space-y-8">
			<section>
				<h2 class="text-2xl font-semibold">1. 信息收集</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们收集您在使用 ERP Pro 服务时提供的信息，包括但不限于：
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
					<li>账户注册信息（姓名、邮箱、公司名称）</li>
					<li>业务数据（库存、订单、财务信息）</li>
					<li>使用日志和设备信息</li>
					<li>通过客服渠道提供的信息</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">2. 信息使用</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们使用收集的信息来：
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
					<li>提供、维护和改进我们的服务</li>
					<li>处理交易和发送相关通知</li>
					<li>提供客户支持</li>
					<li>发送产品更新和营销信息（可选择退出）</li>
					<li>检测和防止欺诈行为</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">3. 信息共享</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们不会出售您的个人信息。我们仅在以下情况下共享信息：
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
					<li>经您明确同意</li>
					<li>与服务提供商合作以运营我们的服务</li>
					<li>遵守法律要求或保护权利</li>
					<li>业务转让或合并时</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">4. 数据安全</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们采取行业标准的安全措施保护您的数据，包括数据加密、访问控制和定期安全审计。
					但请注意，没有任何互联网传输或存储方式是 100% 安全的。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">5. 您的权利</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					您有权访问、更正或删除您的个人信息。如需行使这些权利，请通过联系页面与我们联系。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">6. 政策更新</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，重大变更时我们会通过邮件通知您。
				</p>
			</section>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-border bg-muted/20">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-muted-foreground">
					© {new Date().getFullYear()} ERP Pro. All rights reserved.
				</p>
				<div class="flex items-center gap-6 text-sm text-muted-foreground">
					<a href="/privacy" class="text-foreground font-medium">隐私政策</a>
					<a href="/terms" class="transition-colors hover:text-foreground">服务条款</a>
					<a href="/contact" class="transition-colors hover:text-foreground">联系我们</a>
				</div>
			</div>
		</div>
	</footer>
</div>
