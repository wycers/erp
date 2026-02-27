<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Zap, ArrowLeft, Mail, MapPin, Phone, Send, MessageSquare } from '@lucide/svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let submitted = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isSubmitting = false;
		submitted = true;
		name = '';
		email = '';
		subject = '';
		message = '';
	}

	const contactMethods = [
		{
			icon: Mail,
			title: '邮箱',
			value: 'support@erppro.com',
			description: '工作日 24 小时内回复'
		},
		{
			icon: Phone,
			title: '电话',
			value: '400-888-8888',
			description: '工作日 9:00 - 18:00'
		},
		{
			icon: MapPin,
			title: '地址',
			value: '北京市朝阳区科技园区',
			description: 'A 座 1001 室'
		}
	];
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

	<!-- Hero Section -->
	<section class="relative overflow-hidden border-b border-border/40 bg-muted/30">
		<div
			class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
		></div>
		<div
			class="absolute left-1/2 top-0 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl"
		></div>

		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<Badge variant="secondary" class="mb-4">
					<MessageSquare class="mr-1.5 h-3.5 w-3.5" />
					联系我们
				</Badge>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
					有问题？我们随时为您服务
				</h1>
				<p class="mx-auto mt-4 max-w-xl text-muted-foreground">
					无论是产品咨询、技术支持还是合作洽谈，我们的团队都会尽快回复
				</p>
			</div>

			<!-- Contact Methods -->
			<div class="mt-12 grid gap-4 sm:grid-cols-3">
				{#each contactMethods as method}
					<div class="group rounded-xl border border-border/50 bg-background/80 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
						<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
							<method.icon class="h-5 w-5" />
						</div>
						<h3 class="font-medium">{method.title}</h3>
						<p class="mt-1 font-semibold text-foreground">{method.value}</p>
						<p class="mt-0.5 text-sm text-muted-foreground">{method.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Form Section -->
	<section class="py-16">
		<div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
			<Card.Root class="overflow-hidden border-border/50 shadow-xl shadow-primary/5">
				<Card.Header class="border-b border-border/40 bg-muted/30 text-center">
					<Card.Title class="text-xl">发送消息</Card.Title>
					<Card.Description>填写表单，我们会在 1-2 个工作日内回复</Card.Description>
				</Card.Header>
				<Card.Content class="p-6 sm:p-8">
					{#if submitted}
						<div class="py-8 text-center">
							<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Send class="h-8 w-8 text-primary" />
							</div>
							<h3 class="text-xl font-semibold">消息已发送</h3>
							<p class="mt-2 text-muted-foreground">感谢您的来信，我们会尽快与您联系</p>
							<Button class="mt-6" variant="outline" onclick={() => (submitted = false)}>
								发送新消息
							</Button>
						</div>
					{:else}
						<form onsubmit={handleSubmit} class="space-y-5">
							<div class="grid gap-5 sm:grid-cols-2">
								<div>
									<label for="name" class="mb-2 block text-sm font-medium">姓名 *</label>
									<Input id="name" type="text" placeholder="您的姓名" bind:value={name} required />
								</div>
								<div>
									<label for="email" class="mb-2 block text-sm font-medium">邮箱 *</label>
									<Input id="email" type="email" placeholder="your@email.com" bind:value={email} required />
								</div>
							</div>
							<div>
								<label for="subject" class="mb-2 block text-sm font-medium">主题</label>
								<Input id="subject" type="text" placeholder="咨询主题（可选）" bind:value={subject} />
							</div>
							<div>
								<label for="message" class="mb-2 block text-sm font-medium">消息内容 *</label>
								<textarea
									id="message"
									rows="5"
									placeholder="请详细描述您的问题或需求..."
									bind:value={message}
									required
									class="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								></textarea>
							</div>
							<Button type="submit" class="w-full" size="lg" disabled={isSubmitting}>
								{#if isSubmitting}
									<span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
									发送中...
								{:else}
									<Send class="mr-2 h-4 w-4" />
									发送消息
								{/if}
							</Button>
						</form>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border bg-muted/20">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-muted-foreground">
					© {new Date().getFullYear()} ERP Pro. All rights reserved.
				</p>
				<div class="flex items-center gap-6 text-sm text-muted-foreground">
					<a href="/privacy" class="transition-colors hover:text-foreground">隐私政策</a>
					<a href="/terms" class="transition-colors hover:text-foreground">服务条款</a>
					<a href="/contact" class="font-medium text-foreground">联系我们</a>
				</div>
			</div>
		</div>
	</footer>
</div>
