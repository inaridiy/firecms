<script lang="ts">
	import { fetchContentTypes } from '$lib/api/contents';
	import { isSideMenuOpen } from '$lib/misc';
	import { createQuery } from '@tanstack/svelte-query';
	import clsx from 'clsx';
	import { ChevronDown, Home, List } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { isAuthenticated, logout, userStore } from '../../auth';

	let contentsMenu = false;

	const contentTypesQuery = createQuery({
		queryKey: ['content-types'],
		queryFn: fetchContentTypes
	});

	let overlayClass: string;
	$: overlayClass = clsx('inset-0 z-10 bg-black/20', {
		hidden: !$isSideMenuOpen,
		'fixed sm:hidden': $isSideMenuOpen
	});

	$: itemClass = clsx(
		'rounded-box flex w-full items-center gap-2 p-2 font-bold transition',
		'hover:bg-base-200 active:bg-base-200'
	);

	let sideMenuClass: string;
	$: sideMenuClass = clsx(
		'bg-base-100 z-10 min-h-screen w-2/3 flex-col border-r sm:w-56',
		'fixed sm:static',
		{
			'hidden sm:flex': !$isSideMenuOpen,
			flex: $isAuthenticated
		}
	);
</script>

<div class={overlayClass} aria-hidden on:click={() => ($isSideMenuOpen = !$isSideMenuOpen)} />
<div class={sideMenuClass}>
	<div class="h-16 border-b flex items-center px-6 gap-2">
		<img
			alt=""
			class="h-10 w-10 rounded-full"
			src="https://pbs.twimg.com/profile_images/1534222359271723009/h-OK92Rp_400x400.jpg"
		/>
		<di class="text-lg font-bold">
			{$userStore?.name}
		</di>
	</div>
	<nav aria-label="Main Nav" class="flex flex-col space-y-1 p-4">
		<a href="/" class={itemClass}><Home />Home</a>
		<div class="group [&_summary::-webkit-details-marker]:hidden">
			<button
				class={clsx(itemClass, 'cursor-pointer')}
				on:click={() => (contentsMenu = !contentsMenu)}
			>
				<span class="flex-1 flex gap-2">
					<List />
					Contents
				</span>
				<ChevronDown class={clsx(' transition', contentsMenu && 'rotate-180')} />
			</button>
			{#if contentsMenu}
				<nav transition:slide={{ duration: 150 }} class="flex flex-col gap-1 ml-6">
					{#if $contentTypesQuery.isLoading}
						{#each [1, 2, 3] as _}
							<div class={clsx(itemClass, 'bg-base-200 h-8 animate-pulse')} />
						{/each}
					{:else if $contentTypesQuery.data}
						{#each $contentTypesQuery.data as contentType}
							<a href={`/contents/${contentType.tableName}`} class={itemClass}>
								{contentType.name}
							</a>
						{/each}
					{/if}
				</nav>
			{/if}
		</div>
	</nav>
	<div class="flex-1" />
	<div class="flex p-4">
		{#if $isAuthenticated}
			<button class={itemClass} on:click={logout}>Logout</button>
		{:else}
			<a href="/login" class={itemClass}>Login</a>
		{/if}
	</div>
</div>
