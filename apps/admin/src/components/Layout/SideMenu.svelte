<script lang="ts">
	import clsx from 'clsx';
	import { createQuery } from '@tanstack/svelte-query';
	import { fetchContentTypes } from '../../api/content-types';

	export let open = false;

	const toggle = () => (open = !open);

	const contentTypesQuery = createQuery({
		queryKey: ['content-types'],
		queryFn: fetchContentTypes
	});

	let overlayClass: string;
	$: overlayClass = clsx('inset-0 bg-black/20 z-10', {
		hidden: !open,
		'fixed sm:hidden': open
	});

	$: itemClass = clsx('w-full rounded-box p-2 font-bold', 'hover:bg-base-200 active:bg-base-200');

	let sideMenuClass: string;
	$: sideMenuClass = clsx(
		'min-h-[100dvh] z-10 bg-base-100 flex-col p-4 border-r w-2/3 sm:w-56',
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
			<summary class={clsx(itemClass, 'cursor-pointer flex')}>Contents</summary>
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
	<div>
		<a href="/" class={itemClass}>Logout</a>
	</div>
</div>
