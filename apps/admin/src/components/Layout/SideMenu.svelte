<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import clsx from 'clsx';
	import { fetchContentTypes } from '../../api/content-types';
	import { isAuthenticated, logout } from '../../auth';

	export let open = false;

	const toggle = () => (open = !open);

	const contentTypesQuery = createQuery({
		queryKey: ['content-types'],
		queryFn: fetchContentTypes
	});

	let overlayClass: string;
	$: overlayClass = clsx('inset-0 z-10 bg-black/20', {
		hidden: !open,
		'fixed sm:hidden': open
	});

	$: itemClass = clsx(
		'rounded-box flex w-full p-2 font-bold transition',
		'hover:bg-base-200 active:bg-base-200'
	);

	let sideMenuClass: string;
	$: sideMenuClass = clsx(
		'bg-base-100 z-10 min-h-[100dvh] w-2/3 flex-col border-r p-4 sm:w-56',
		'fixed sm:static',
		{
			'hidden sm:flex': !open,
			flex: open
		}
	);
</script>

<div class={overlayClass} aria-hidden on:click={toggle} />
<div class={sideMenuClass}>
	<nav aria-label="Main Nav" class="flex flex-col mt-2 space-y-1">
		<a href="/" class={itemClass}>Home</a>
		<details class="group [&_summary::-webkit-details-marker]:hidden">
			<summary class={clsx(itemClass, 'flex cursor-pointer')}>Contents</summary>
			<nav class="flex flex-col gap-1 ml-4">
				{#if $contentTypesQuery.isLoading}
					<div class={itemClass}>Loading</div>
				{:else if $contentTypesQuery.data}
					{#each $contentTypesQuery.data as contentType}
						<a href="/" class={itemClass}>{contentType.name}</a>
					{/each}
				{/if}
			</nav>
		</details>
	</nav>
	<div class="flex-1" />
	<div class="flex">
		{#if $isAuthenticated}
			<button class={itemClass} on:click={logout}>Logout</button>
		{:else}
			<a href="/login" class={itemClass}>Login</a>
		{/if}
	</div>
</div>
