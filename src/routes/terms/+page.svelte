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
		<h1 class="text-4xl font-bold tracking-tight">服务条款</h1>
		<p class="mt-4 text-muted-foreground">最后更新：2026 年 2 月</p>

		<Separator class="my-8" />

		<div class="prose prose-neutral dark:prose-invert max-w-none space-y-8">
			<section>
				<h2 class="text-2xl font-semibold">1. 服务说明</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					ERP Pro 是一个企业资源计划（ERP）软件即服务（SaaS）平台，为企业提供库存管理、
					订单处理、财务报表和客户管理等功能。使用我们的服务即表示您同意遵守本条款。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">2. 账户责任</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					您有责任：
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
					<li>维护账户凭证的安全性</li>
					<li>确保账户下所有活动符合本条款</li>
					<li>及时通知我们任何未授权的使用</li>
					<li>提供准确、完整的注册信息</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">3. 可接受的使用</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					您同意不会：
				</p>
				<ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
					<li>违反任何适用法律或法规</li>
					<li>侵犯他人的知识产权或隐私权</li>
					<li>上传恶意软件或有害代码</li>
					<li>尝试未授权访问系统或其他用户数据</li>
					<li>干扰或破坏服务的正常运行</li>
				</ul>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">4. 付款条款</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					付费订阅将按照所选计划周期自动续费。您可以随时取消订阅，取消将在当前计费周期结束时生效。
					退款政策详见我们的定价页面。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">5. 数据所有权</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					您保留对上传到 ERP Pro 的所有业务数据的所有权。我们仅在提供服务所必需的范围内使用您的数据。
					您可以随时导出或删除您的数据。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">6. 服务可用性</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们努力提供 99.9% 的服务可用性，但不保证服务不会中断。我们会提前通知计划内的维护。
					对于超出我们控制范围的中断，我们不承担责任。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">7. 责任限制</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					在法律允许的最大范围内，ERP Pro 对任何间接、附带、特殊或后果性损害不承担责任。
					我们的总责任不超过您在过去 12 个月内支付的服务费用。
				</p>
			</section>

			<section>
				<h2 class="text-2xl font-semibold">8. 条款变更</h2>
				<p class="mt-4 leading-relaxed text-muted-foreground">
					我们保留随时修改本条款的权利。重大变更将提前 30 天通知。继续使用服务即表示接受修改后的条款。
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
					<a href="/privacy" class="transition-colors hover:text-foreground">隐私政策</a>
					<a href="/terms" class="text-foreground font-medium">服务条款</a>
					<a href="/contact" class="transition-colors hover:text-foreground">联系我们</a>
				</div>
			</div>
		</div>
	</footer>
</div>
