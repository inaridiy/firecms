<script lang="ts">
	import { isSideMenuOpen } from '$lib/misc';
	import { Menu } from 'lucide-svelte';
	export let href = '/';
	export let title: string;
	export let loading = false;
</script>

<header class="flex border-b px-4 items-center justify-between h-16">
	{#if loading}
		<div class="h-12 bg-base-200 w-full max-w-lg rounded-lg animate-pulse" />
	{:else}
		<a {href}> <h2 class="text-4xl font-bold">{title}</h2></a>
	{/if}

	<button
		class="h-12 w-12 flex items-center justify-center active:base-200 hover:base-200 sm:hidden"
		on:click={() => isSideMenuOpen.set(true)}
	>
		<Menu class="w-8 h-8" />
	</button>
</header>
